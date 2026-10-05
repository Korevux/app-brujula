// Configuración pública de la app.
// Para activar "Cuenta y sincronización" (misma cuenta en celular y laptop),
// pega aquí la URL del proyecto de Supabase y su clave pública "anon".
// La clave anon es pública por diseño: la seguridad la dan las reglas RLS
// de supabase/schema.sql (cada persona solo puede leer y escribir sus datos).
// Si se dejan vacías, la app funciona igual, solo en este dispositivo.
// También la usa netlify/functions/keep-supabase-alive.js (por eso funciona en el navegador y en Node).
(typeof window !== 'undefined' ? window : globalThis).BRUJULA_CONFIG = {
  supabaseUrl: 'https://rmjprvpqiscuxkjyuokb.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtanBydnBxaXNjdXhranl1b2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNTc0NzYsImV4cCI6MjEwNjczMzQ3Nn0.o7Hy67UJpQ9GB6atRLH86nEjSxHxRt75_gqXVPWpto8'
};
