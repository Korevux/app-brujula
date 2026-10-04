// Recibe desde index.html la suscripción push del dispositivo, su zona
// horaria, y la lista completa de recordatorios activos (uno por hábito
// con "Recordatorio activo" encendido y hora fijada, más los dos avisos
// diarios de "revisar mi rutina", que traen su propio mensaje). Reemplaza siempre
// la lista completa: más simple que ir sumando/restando y evita que
// queden recordatorios viejos huérfanos.
const { getStore } = require("@netlify/blobs");

const STORE_NAME = "brujula";
const BLOB_KEY = "schedule";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: "JSON inválido" };
  }

  if (!payload.subscription || !payload.subscription.endpoint) {
    return { statusCode: 400, body: "Falta la suscripción" };
  }

  const store = getStore(STORE_NAME);
  let all = (await store.get(BLOB_KEY, { type: "json" })) || { devices: [] };

  const endpoint = payload.subscription.endpoint;
  const incomingReminders = Array.isArray(payload.reminders) ? payload.reminders : [];

  const existing = all.devices.find((d) => d.subscription.endpoint === endpoint);

  // Conserva lastFiredDate de los recordatorios que ya existían (por
  // habitId), para no volver a disparar el mismo aviso el mismo día
  // solo porque el cliente volvió a mandar la lista completa.
  const prevByHabit = {};
  if (existing && Array.isArray(existing.reminders)) {
    existing.reminders.forEach((r) => {
      prevByHabit[r.habitId] = r.lastFiredDate || null;
    });
  }

  const reminders = incomingReminders.map((r) => ({
    habitId: r.habitId,
    nombre: r.nombre,
    mensaje: typeof r.mensaje === "string" ? r.mensaje : null,
    hora: r.hora,
    dias: Array.isArray(r.dias) ? r.dias : [0, 1, 2, 3, 4, 5, 6],
    lastFiredDate: prevByHabit[r.habitId] || null
  }));

  const deviceRecord = {
    subscription: payload.subscription,
    timezone: payload.timezone || "America/Caracas",
    reminders: reminders
  };

  if (existing) {
    all.devices = all.devices.map((d) =>
      d.subscription.endpoint === endpoint ? deviceRecord : d
    );
  } else {
    all.devices.push(deviceRecord);
  }

  await store.setJSON(BLOB_KEY, all);

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
