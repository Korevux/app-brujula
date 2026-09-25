# INSTRUCCIONES-CLAUDE-CODE.md — Brújula Interior

Instrucción para pegar en Claude Code. Todavía **no existe ningún `index.html`** — esta es la primera construcción de la app, no una modificación. Todos los archivos de este proyecto están en la misma carpeta: `SKILL.md`, `CAPSULAS-2026.md`, `CAMBIOS-V1.1.md` y este archivo.

---

## Contexto

Voy a construir desde cero una app llamada "Brújula Interior". `SKILL.md`, en esta misma carpeta, es la especificación maestra completa (rol, concepto del producto, tono, diseño, estructura de navegación, todas las pantallas y reglas de calidad) — léelo primero y complétalo con las tres instrucciones de abajo, que son ajustes/decisiones tomadas después de escribir esa especificación.

---

## Paso 1 — Construir la app siguiendo SKILL.md

Crea `index.html` (y los archivos que hagan falta) implementando todo lo descrito en `SKILL.md`: pantallas Hoy, Metas, Rutina, Cápsula, Progreso, Ajustes; sistema ABCDE y A-1; hábitos configurables; identidad, gratitud, visualización; cierre nocturno; revisión semanal; localStorage; exportación/importación JSON; variable `N8N_WEBHOOK_URL` opcional. Sigue el diseño visual, el tono y las reglas de calidad tal como están descritas ahí.

**Desde el inicio, separa el contenido de las cápsulas en un archivo aparte `capsulas.json`**, cargado por el `index.html` (por ejemplo con `fetch('capsulas.json')`), en vez de escribirlo directamente en el código. El formato debe ser simple y fácil de editar a mano en el futuro: un arreglo de objetos, uno por cápsula, con sus campos (número de día, tema, frase, pregunta, acción práctica). Debe seguir funcionando offline: si `capsulas.json` no carga, la app no debe romperse.

---

## Paso 2 — Integrar el contenido de las 100 cápsulas

Usa el contenido del archivo `CAPSULAS-2026.md` (Día 001 a Día 100) para llenar `capsulas.json`. Cada cápsula del markdown debe convertirse en un objeto dentro del JSON, respetando el día, tema, frase, pregunta y acción práctica tal como están escritos ahí. No modifiques el texto de las frases, preguntas ni acciones.

---

## Paso 3 — Aplicar los cambios del archivo CAMBIOS-V1.1.md

Aplica los tres ajustes descritos en `CAMBIOS-V1.1.md` como parte de esta primera construcción (no como parche posterior):

1. Pantalla de progreso (racha, resumen semanal, revisión mensual día 1).
2. Sección "Verdades que rigen tu mente" (8 verdades, rotación semanal, vista "Ver todas").
3. Nota de fuentes históricas en Ajustes/Acerca de.

---

## Antes de terminar

Haz una auditoría funcional rápida antes de dar la versión por terminada (sección 38 de `SKILL.md`): que los botones funcionen, que los datos persistan en localStorage, que las cápsulas carguen correctamente desde `capsulas.json`, y que la app funcione bien en tamaños de pantalla de teléfono (320px–430px).

Al final, dime brevemente qué cambiaste y si algo quedó pendiente o necesita mi revisión.
