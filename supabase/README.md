# Activar "Cuenta y sincronización" (Supabase)

Permite entrar con tu correo y tener los mismos datos en el celular y la laptop.
Sin esto la app funciona igual, pero cada aparato guarda sus propios datos.

## 1. Crear el proyecto (gratis)
1. Entra a https://supabase.com y crea una cuenta.
2. **New project**: ponle un nombre (ej. `brujula`), una contraseña de base de datos (guárdala) y la región más cercana.

## 2. Crear la tabla
1. En el proyecto: **SQL Editor → New query**.
2. Pega todo el contenido de `supabase/schema.sql` y pulsa **Run**.

## 3. Inicio de sesión con correo y contraseña
La app entra con correo y contraseña, así funciona igual dentro de la app instalada
(iPhone y Android). Supabase solo manda dos correos, y los dos usan sus plantillas
por defecto, así que no hace falta configurar un servidor de correo (SMTP):
- al crear la cuenta, un enlace para confirmar el correo;
- en "Olvidé mi contraseña", un enlace que abre la app y pide una contraseña nueva.

1. **Authentication → Sign In / Providers → Email**: déjalo activado.
2. **Authentication → URL Configuration**:
   - **Site URL**: la dirección de tu app (ej. `https://mibrujula.netlify.app`).
   - **Redirect URLs**: agrega también las otras direcciones donde la uses
     (ej. `https://deploy-preview-1--mibrujula.netlify.app` o la de Cloudflare).

## 4. Conectar la app
1. **Project Settings → API**: copia la **Project URL** y la clave **anon public**.
2. Pégalas en `config.js` (`supabaseUrl` y `supabaseAnonKey`) y publica.

La clave anon es pública por diseño; nunca uses ni compartas la clave `service_role`.

## 5. Que nunca se pause
El plan gratis de Supabase pausa el proyecto si pasa una semana sin actividad.
La función `netlify/functions/keep-supabase-alive.js` hace una consulta mínima
una vez al día (programada en `netlify.toml`), así que el proyecto queda activo
aunque nadie abra la app. Usa los mismos datos de `config.js`; no hay que
configurar nada más. Puedes ver que corre en Netlify → Functions →
keep-supabase-alive.

Nota: el plan gratuito de Supabase envía pocos correos por hora con su servidor
de correo de prueba; para más usuarios conviene configurar un SMTP propio en
**Authentication → Emails → SMTP Settings**.
