// Worker de Cloudflare para Brújula Interior.
//  - Sirve la app (archivos estáticos de la raíz del repositorio).
//  - GET /api/vapid-public-key: la clave pública de los avisos (no es secreta).
//  - POST /api/save-schedule: guarda la suscripción push del dispositivo,
//    su zona horaria y la lista completa de recordatorios.
//  - POST /api/test-push: manda ya un aviso de prueba a ese dispositivo,
//    para comprobar que los avisos llegan con la app cerrada.
//  - Cada minuto (cron): manda los avisos cuya hora local coincide.
//  - Una vez al día (cron): consulta mínima a Supabase para que el proyecto
//    gratis no se pause por inactividad.
import { sendPush } from "./webpush.js";

const SCHEDULE_KEY = "schedule";
const KEEPALIVE_CRON = "0 12 * * *";
const DOW_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

async function loadSchedule(env) {
  return (await env.SCHEDULE.get(SCHEDULE_KEY, { type: "json" })) || { devices: [] };
}

// Reemplaza siempre la lista completa de recordatorios del dispositivo:
// más simple que ir sumando o restando y no deja avisos huérfanos.
async function saveSchedule(request, env) {
  if (request.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return json({ error: "JSON inválido" }, 400);
  }
  const sub = payload && payload.subscription;
  if (!sub || !sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    return json({ error: "Falta la suscripción" }, 400);
  }

  const all = await loadSchedule(env);
  const existing = all.devices.find((d) => d.subscription.endpoint === sub.endpoint);

  // Conserva lastFiredDate para no repetir un aviso el mismo día solo
  // porque el cliente volvió a mandar la lista completa.
  const prevByHabit = {};
  if (existing && Array.isArray(existing.reminders)) {
    existing.reminders.forEach((r) => {
      prevByHabit[r.habitId] = r.lastFiredDate || null;
    });
  }

  const reminders = (Array.isArray(payload.reminders) ? payload.reminders : []).map((r) => ({
    habitId: String(r.habitId),
    nombre: typeof r.nombre === "string" ? r.nombre : "",
    mensaje: typeof r.mensaje === "string" ? r.mensaje : null,
    hora: typeof r.hora === "string" ? r.hora : "",
    dias: Array.isArray(r.dias) ? r.dias : [0, 1, 2, 3, 4, 5, 6],
    lastFiredDate: prevByHabit[String(r.habitId)] || null
  }));

  const device = {
    subscription: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } },
    timezone: typeof payload.timezone === "string" ? payload.timezone : "America/Caracas",
    estiloAviso: payload.estiloAviso === "alarma" ? "alarma" : "notificacion",
    reminders
  };

  all.devices = existing
    ? all.devices.map((d) => (d.subscription.endpoint === sub.endpoint ? device : d))
    : all.devices.concat([device]);

  await env.SCHEDULE.put(SCHEDULE_KEY, JSON.stringify(all));
  return json({ ok: true });
}

function vapidDe(env) {
  if (!env.VAPID_PRIVATE_KEY || !env.VAPID_PUBLIC_KEY) return null;
  return {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT || "mailto:korevuxdigital@gmail.com"
  };
}

// Solo puede escribirle a la suscripción que la propia app manda, así que
// nadie puede usarlo para avisar a otro dispositivo.
async function testPush(request, env) {
  if (request.method !== "POST") return json({ error: "Método no permitido" }, 405);
  const vapid = vapidDe(env);
  if (!vapid) return json({ error: "Avisos sin configurar" }, 503);
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return json({ error: "JSON inválido" }, 400);
  }
  const sub = payload && payload.subscription;
  if (!sub || !sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    return json({ error: "Falta la suscripción" }, 400);
  }
  const body = JSON.stringify({
    title: "Brújula Interior",
    body: "Prueba: así te llegarán tus recordatorios.",
    alarma: payload.estiloAviso === "alarma"
  });
  try {
    const status = await sendPush(sub, body, vapid);
    return json({ ok: status >= 200 && status < 300, status });
  } catch (err) {
    return json({ ok: false, error: err && err.message }, 502);
  }
}

// Hora, día de la semana y fecha LOCALES del dispositivo (según su zona horaria).
export function localTime(timezone, now = new Date()) {
  const opts = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };
  let fmt;
  try {
    fmt = new Intl.DateTimeFormat("en-US", { ...opts, timeZone: timezone });
  } catch (e) {
    fmt = new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" });
  }
  const p = {};
  fmt.formatToParts(now).forEach((x) => {
    p[x.type] = x.value;
  });
  const hour = p.hour === "24" ? "00" : p.hour;
  return { hhmm: hour + ":" + p.minute, dow: DOW_INDEX[p.weekday], dateKey: p.year + "-" + p.month + "-" + p.day };
}

async function checkAndPush(env, now = new Date()) {
  const vapid = vapidDe(env);
  if (!vapid) {
    console.error("Faltan VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY.");
    return { sent: 0 };
  }

  const all = await loadSchedule(env);
  if (!all.devices.length) return { sent: 0 };

  let changed = false;
  let sent = 0;
  const surviving = [];

  for (const device of all.devices) {
    const { hhmm, dow, dateKey } = localTime(device.timezone, now);
    let valid = true;

    for (const r of device.reminders || []) {
      if (!r.hora || r.hora !== hhmm) continue;
      if (!Array.isArray(r.dias) || r.dias.indexOf(dow) === -1) continue;
      if (r.lastFiredDate === dateKey) continue;

      const payload = JSON.stringify({
        title: "Brújula Interior",
        body: r.mensaje || (r.nombre || "Hábito") + " — es hora.",
        alarma: device.estiloAviso === "alarma"
      });
      try {
        const status = await sendPush(device.subscription, payload, vapid);
        if (status === 404 || status === 410) {
          valid = false;
          break;
        }
        if (status >= 200 && status < 300) sent++;
        else console.error("Servicio push respondió", status);
      } catch (err) {
        console.error("Error enviando push:", err && err.message);
      }
      r.lastFiredDate = dateKey;
      changed = true;
    }

    if (valid) surviving.push(device);
    else changed = true;
  }

  // Solo escribe cuando algo cambió: el plan gratis de KV permite 1.000 escrituras al día.
  if (changed) {
    all.devices = surviving;
    await env.SCHEDULE.put(SCHEDULE_KEY, JSON.stringify(all));
  }
  return { sent };
}

// No lee ni cambia datos de nadie: con la clave pública y las reglas RLS
// la respuesta es una lista vacía. Solo cuenta como actividad.
async function keepSupabaseAlive(env) {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY;
  if (!url || !key) return "Supabase no configurado";
  try {
    const res = await fetch(url.replace(/\/$/, "") + "/rest/v1/user_state?select=user_id&limit=1", {
      headers: { apikey: key, Authorization: "Bearer " + key }
    });
    console.log("Supabase keep-alive:", res.status);
    return "ok " + res.status;
  } catch (err) {
    console.error("Supabase keep-alive falló:", err && err.message);
    return "error";
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/save-schedule") return saveSchedule(request, env);
    if (url.pathname === "/api/test-push") return testPush(request, env);
    if (url.pathname === "/api/vapid-public-key") {
      if (!env.VAPID_PUBLIC_KEY) return json({ error: "Avisos sin configurar" }, 503);
      return json({ publicKey: env.VAPID_PUBLIC_KEY });
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(controller, env, ctx) {
    if (controller.cron === KEEPALIVE_CRON) {
      ctx.waitUntil(keepSupabaseAlive(env));
    } else {
      ctx.waitUntil(checkAndPush(env, new Date(controller.scheduledTime)));
    }
  }
};
