// Función programada (ver netlify.toml, una vez al día). El plan gratis de
// Supabase pausa el proyecto tras unos días sin actividad; esta consulta
// mínima a la base de datos lo mantiene activo aunque nadie abra la app
// (por ejemplo, durante unas vacaciones). No lee ni cambia datos de nadie:
// con la clave pública y las reglas RLS la respuesta es una lista vacía.
require("../../config.js");

exports.handler = async function () {
  const config = globalThis.BRUJULA_CONFIG || {};
  const url = process.env.SUPABASE_URL || config.supabaseUrl;
  const key = process.env.SUPABASE_ANON_KEY || config.supabaseAnonKey;

  if (!url || !key) {
    return { statusCode: 200, body: "Supabase no configurado; nada que hacer." };
  }

  try {
    const res = await fetch(url.replace(/\/$/, "") + "/rest/v1/user_state?select=user_id&limit=1", {
      headers: { apikey: key, Authorization: "Bearer " + key }
    });
    console.log("Supabase keep-alive:", res.status);
    return { statusCode: 200, body: "ok " + res.status };
  } catch (err) {
    console.error("Supabase keep-alive falló:", err && err.message);
    return { statusCode: 200, body: "error" };
  }
};
