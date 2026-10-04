// Service worker: además de existir para que el navegador considere la
// app "instalable" (criterio de Chrome/Edge), ahora también recibe las
// notificaciones push del servidor. Esto corre aunque la pestaña/app
// esté cerrada, porque lo entrega el sistema operativo directamente al
// navegador, no la página.
self.addEventListener("fetch", function () {});

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

  event.waitUntil(Promise.all([self.registration.showNotification(title, options), avisarApp]));
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
