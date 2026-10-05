// Función programada (ver netlify.toml, corre cada minuto). Por cada
// dispositivo suscrito, calcula la hora y el día de la semana LOCALES
// de ESE dispositivo (usando la zona horaria que mandó al suscribirse,
// no una fija en el servidor) y dispara el push de cualquier hábito
// cuyo recordatorio coincida con ese momento y no se haya disparado ya
// hoy.
const webpush = require("web-push");
const { getStore } = require("@netlify/blobs");

const STORE_NAME = "brujula";
const BLOB_KEY = "schedule";

const DOW_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function getLocalTime(timezone) {
  let formatter;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  } catch (e) {
    // Zona horaria inválida/desconocida: cae a UTC en vez de romper.
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  const parts = {};
  formatter.formatToParts(new Date()).forEach((p) => {
    parts[p.type] = p.value;
  });

  const hhmm = parts.hour + ":" + parts.minute;
  const dow = DOW_INDEX[parts.weekday];
  const dateKey = parts.year + "-" + parts.month + "-" + parts.day;

  return { hhmm, dow, dateKey };
}

exports.handler = async function () {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || "mailto:noel.duran.chile@gmail.com";

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error("Faltan las variables de entorno VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY.");
    return { statusCode: 200, body: "sin claves VAPID configuradas" };
  }

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const store = getStore(STORE_NAME);
  const all = await store.get(BLOB_KEY, { type: "json" });

  if (!all || !Array.isArray(all.devices) || !all.devices.length) {
    return { statusCode: 200, body: "sin dispositivos" };
  }

  let changed = false;
  const survivingDevices = [];

  for (const device of all.devices) {
    const { hhmm, dow, dateKey } = getLocalTime(device.timezone);
    const reminders = Array.isArray(device.reminders) ? device.reminders : [];
    let deviceStillValid = true;

    for (const reminder of reminders) {
      if (!reminder.hora || reminder.hora !== hhmm) continue;
      if (!Array.isArray(reminder.dias) || reminder.dias.indexOf(dow) === -1) continue;
      if (reminder.lastFiredDate === dateKey) continue;

      const payload = JSON.stringify({
        title: "Brújula Interior",
        body: reminder.mensaje || (reminder.nombre || "Hábito") + " — es hora.",
        alarma: device.estiloAviso === "alarma"
      });

      try {
        await webpush.sendNotification(device.subscription, payload);
      } catch (err) {
        const code = err && err.statusCode;
        if (code === 404 || code === 410) {
          deviceStillValid = false;
          break;
        }
        console.error("Error enviando push:", err && err.message);
      }

      reminder.lastFiredDate = dateKey;
      changed = true;
    }

    if (deviceStillValid) {
      survivingDevices.push(device);
    } else {
      changed = true;
    }
  }

  if (changed) {
    all.devices = survivingDevices;
    await store.setJSON(BLOB_KEY, all);
  }

  return { statusCode: 200, body: "ok" };
};
