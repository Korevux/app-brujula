// Service worker: además de existir para que el navegador considere la
// app "instalable" (criterio de Chrome/Edge), ahora también recibe las
// notificaciones push del servidor. Esto corre aunque la pestaña/app
// esté cerrada, porque lo entrega el sistema operativo directamente al
// navegador, no la página.
self.addEventListener("fetch", function () {});

// Una versión nueva del service worker toma el control enseguida, sin esperar
// a que se cierren todas las ventanas de la app.
self.addEventListener("install", function () {
  self.skipWaiting();
});
self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

// Registro de llegada: anota cada aviso que llega a este aparato, si la app
// estaba abierta en pantalla y si el aparato aceptó mostrarlo. La app lo lee
// después para saber con certeza dónde falla un aviso que no se vio.
const DIAG_CACHE = "brujula-diag";
const DIAG_URL = "/__diag/avisos";
function anotarLlegada(registro) {
  return caches.open(DIAG_CACHE).then(function (cache) {
    return cache.match(DIAG_URL).then(function (res) {
      return res ? res.json() : [];
    }).catch(function () {
      return [];
    }).then(function (lista) {
      lista.unshift(registro);
      return cache.put(DIAG_URL, new Response(JSON.stringify(lista.slice(0, 10)), { headers: { "Content-Type": "application/json" } }));
    });
  }).catch(function () {});
}

self.addEventListener("push", function (event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {}

  const title = data.title || "Brújula Interior";
  const body = data.body || "Tienes un recordatorio.";
  // "Notificación + alarma": queda fija hasta abrirla y vibra largo. Si la app
  // está abierta, además se le avisa para que haga sonar la alarma en pantalla.
  const alarma = !!data.alarma;
  const options = {
    body: body,
    tag: alarma ? "brujula-alarma" : "brujula-recordatorio",
    renotify: true,
    requireInteraction: alarma,
    vibrate: alarma ? [800, 300, 800, 300, 800, 300, 800, 300, 800] : [200, 100, 200]
  };

  const avisarApp = alarma
    ? self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
        clientList.forEach(function (client) {
          client.postMessage({ tipo: "alarma", title: title, body: body });
        });
      })
    : Promise.resolve();

  const llegada = Date.now();
  const enPantalla = self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (lista) {
    return lista.some(function (c) { return c.visibilityState === "visible"; });
  }).catch(function () { return null; });
  const mostrar = self.registration.showNotification(title, options).then(
    function () { return true; },
    function (err) { return String((err && err.message) || err); }
  );

  event.waitUntil(Promise.all([mostrar, enPantalla, avisarApp]).then(function (r) {
    return anotarLlegada({ t: llegada, appAbierta: r[1], mostrado: r[0] === true, error: r[0] === true ? null : r[0], prueba: /^Prueba/.test(body) });
  }));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow("./index.html");
      }
    })
  );
});
