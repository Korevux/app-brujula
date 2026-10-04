// Configuración pública de la app.
// Para activar "Cuenta y sincronización" (misma cuenta en celular y laptop),
// pega aquí la URL del proyecto de Supabase y su clave pública "anon".
// La clave anon es pública por diseño: la seguridad la dan las reglas RLS
// de supabase/schema.sql (cada persona solo puede leer y escribir sus datos).
// Si se dejan vacías, la app funciona igual, solo en este dispositivo.
window.BRUJULA_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
