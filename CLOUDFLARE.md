# Publicar Brújula Interior en Cloudflare

Un solo Worker de Cloudflare hace todo lo que antes hacía Netlify:

- Sirve la app (los archivos de la raíz del repositorio).
- Guarda la suscripción de avisos de cada teléfono (`POST /api/save-schedule`) en un espacio KV llamado `SCHEDULE`.
- Cada minuto revisa los horarios y manda los avisos push (Cron Trigger `* * * * *`).
- Una vez al día, a las 12:00 UTC, hace una consulta mínima a Supabase para que el proyecto gratis no se pause (Cron Trigger `0 12 * * *`).

Las cuentas siguen en Supabase. Todo cabe en el plan gratis de Cloudflare: el Worker solo escribe en KV cuando algo cambia, y el límite es de 1.000 escrituras al día.

## Pasos (una sola vez)

1. **Crea la cuenta.** Entra a https://dash.cloudflare.com/sign-up. Es gratis.
2. **Conecta el repositorio.** En el panel ve a *Workers y Pages* → *Crear* → *Importar un repositorio*. Autoriza GitHub y elige `Korevux/app-brujula`.
   - Rama de producción: `main`.
   - Comando de compilación: déjalo vacío.
   - Comando de implementación: `npx wrangler deploy`.

   Pulsa *Guardar e implementar*. Cloudflare lee `wrangler.jsonc` y crea solo el Worker, los dos crons y el espacio KV.
3. **Copia la clave privada de los avisos.** Es la misma que usaba Netlify, así los teléfonos ya suscritos siguen funcionando.
   - En Netlify: *Site configuration* → *Environment variables* → `VAPID_PRIVATE_KEY` → copia el valor.
   - En Cloudflare: abre el Worker `brujula-interior` → *Configuración* → *Variables y secretos* → *Agregar*. Tipo **Secreto**, nombre `VAPID_PRIVATE_KEY`, pega el valor y guarda.

   No la pegues en el repositorio ni en el chat.
4. **Supabase despierto.** No hay que hacer nada: la URL y la clave pública de Supabase ya están en `wrangler.jsonc` (son las mismas de `config.js`).
5. **Abre la app** en la dirección que te da Cloudflare (`https://brujula-interior.<tu-subdominio>.workers.dev`).
   - Instálala de nuevo en la pantalla de inicio.
   - En Ajustes, activa los avisos otra vez para que el teléfono se registre en el nuevo servidor.
   - En Supabase, *Authentication* → *URL Configuration*: cambia *Site URL* a la dirección nueva de Cloudflare (o agrégala en *Redirect URLs*) para que los enlaces de confirmar cuenta y recuperar contraseña abran la app nueva.

## Si el paso 2 falla por el espacio KV

Hay versiones de Wrangler que no crean el KV solas. En ese caso:

1. Ve a *Almacenamiento y bases de datos* → *KV* → *Crear* y ponle de nombre `brujula-schedule`.
2. Copia su ID y agrégalo en `wrangler.jsonc`, así: `{ "binding": "SCHEDULE", "id": "<el id>" }`.

## Comprobar que funciona

- En el Worker, la pestaña *Registros* muestra cada ejecución del cron y los errores de envío.
- En *Configuración* → *Activadores* aparecen los dos crons.

## Probar en tu computador

```
npm install
npx wrangler dev --test-scheduled
```

`http://localhost:8787/__scheduled?cron=*+*+*+*+*` dispara una revisión de avisos. Para eso necesitas un archivo `.dev.vars` (no se sube al repositorio) con `VAPID_PRIVATE_KEY="..."`.
