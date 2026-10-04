# Activar "Cuenta y sincronización" (Supabase)

Permite entrar con tu correo y tener los mismos datos en el celular y la laptop.
Sin esto la app funciona igual, pero cada aparato guarda sus propios datos.

## 1. Crear el proyecto (gratis)
1. Entra a https://supabase.com y crea una cuenta.
2. **New project**: ponle un nombre (ej. `brujula`), una contraseña de base de datos (guárdala) y la región más cercana.

## 2. Crear la tabla
1. En el proyecto: **SQL Editor → New query**.
2. Pega todo el contenido de `supabase/schema.sql` y pulsa **Run**.

## 3. Inicio de sesión por código
La app pide un código de 6 dígitos que llega por correo (funciona también dentro de la app instalada en iPhone, donde los enlaces se abrirían en Safari).
1. **Authentication → Sign In / Providers → Email**: déjalo activado.
2. **Authentication → Emails → Templates**: en **Magic Link** y también en **Confirm signup** (el que recibe quien entra por primera vez), cambia el cuerpo para que muestre el código, por ejemplo:
   ```html
   <h2>Tu código para Brújula Interior</h2>
   <p>Escribe este código en la app: <b style="font-size:22px">{{ .Token }}</b></p>
   ```
3. **Authentication → URL Configuration → Site URL**: pon la dirección de tu app en Netlify (ej. `https://mibrujula.netlify.app`).

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
