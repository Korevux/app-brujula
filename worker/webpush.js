// Envío de notificaciones Web Push usando solo Web Crypto (lo que trae
// Cloudflare Workers), sin dependencias de Node. Implementa:
//  - VAPID (RFC 8292): firma ES256 que identifica a este servidor.
//  - Cifrado del contenido aes128gcm (RFC 8291 + RFC 8188).

const enc = new TextEncoder();

export function b64uToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function bytesToB64u(bytes) {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function concat(...parts) {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

async function hkdf(salt, ikm, info, length) {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, length * 8);
  return new Uint8Array(bits);
}

// Cabecera Authorization con el JWT de VAPID para el servicio push del endpoint.
export async function vapidAuthorization(endpoint, subject, publicKeyB64u, privateKeyB64u) {
  const header = bytesToB64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const claims = bytesToB64u(
    enc.encode(
      JSON.stringify({
        aud: new URL(endpoint).origin,
        exp: Math.floor(Date.now() / 1000) + 12 * 3600,
        sub: subject
      })
    )
  );
  const pub = b64uToBytes(publicKeyB64u); // 0x04 || x || y
  const key = await crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      x: bytesToB64u(pub.slice(1, 33)),
      y: bytesToB64u(pub.slice(33, 65)),
      d: privateKeyB64u,
      ext: true
    },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
  const unsigned = header + "." + claims;
  // Web Crypto devuelve la firma ya en formato r||s (64 bytes), el que pide JWT.
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(unsigned));
  return "vapid t=" + unsigned + "." + bytesToB64u(sig) + ", k=" + publicKeyB64u;
}

// Cifra el texto para la suscripción del navegador (claves p256dh y auth).
export async function encryptPayload(subscription, plaintext) {
  const uaPublic = b64uToBytes(subscription.keys.p256dh);
  const authSecret = b64uToBytes(subscription.keys.auth);

  const serverKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const serverPublic = new Uint8Array(await crypto.subtle.exportKey("raw", serverKeys.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPublic, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, serverKeys.privateKey, 256)
  );

  const ikm = await hkdf(authSecret, shared, concat(enc.encode("WebPush: info\0"), uaPublic, serverPublic), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, enc.encode("Content-Encoding: nonce\0"), 12);

  const aesKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const record = concat(enc.encode(plaintext), new Uint8Array([2])); // 0x02 = último registro
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, record));

  const rs = new Uint8Array([0, 0, 16, 0]); // tamaño de registro 4096
  return concat(salt, rs, new Uint8Array([serverPublic.length]), serverPublic, ciphertext);
}

// Envía un push. Devuelve el código HTTP del servicio push (201 = enviado;
// 404/410 = la suscripción ya no existe).
export async function sendPush(subscription, payload, vapid) {
  const body = await encryptPayload(subscription, payload);
  const res = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      TTL: "86400",
      Urgency: "high",
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      Authorization: await vapidAuthorization(subscription.endpoint, vapid.subject, vapid.publicKey, vapid.privateKey)
    },
    body
  });
  return res.status;
}
