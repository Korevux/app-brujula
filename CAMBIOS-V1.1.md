# CAMBIOS-V1.X.md — Brújula Interior

Cambios solicitados sobre la V1.0 (ver SKILL.md / especificación maestra). Este documento se pega junto al `index.html` existente en Claude Code.

**Instrucción para Claude:** aplica estos tres cambios de forma localizada, sin reescribir la app completa. Sigue la Regla de No Regresión (sección 39 de la especificación maestra): antes de modificar código existente, entiende cómo funciona, identifica qué depende de él, aplica el cambio, y comprueba tanto las funciones relacionadas como las que no fueron tocadas. No elimines datos existentes ni cambies la filosofía del producto.

---

## Cambio 1 — Pantalla de progreso

Agrega a la app una pantalla de progreso que registre con fecha automática cada actividad y hábito completado o no completado.

Debe mostrar:

- **Racha de días consecutivos completados** — contador visible que crece día a día.
- **Resumen semanal** — hábitos cumplidos y A-1 realizadas en la semana.
- **Revisión mensual** — se abre automáticamente el día 1 de cada mes, con tres preguntas:
  - ¿Qué avancé?
  - ¿Qué se estancó?
  - ¿Qué voy a corregir?

Todos los datos de progreso se guardan en `localStorage` con su fecha correspondiente. No debe sobrescribir registros de días o meses anteriores.

---

## Cambio 2 — Sección "Verdades que rigen tu mente"

Agrega una sección llamada **"Verdades que rigen tu mente"** (no usar la palabra "leyes"), con contenido original inspirado en principios universales de desarrollo personal, sin atribuir a ningún autor contemporáneo específico dentro de la app.

**Las 8 verdades, en este orden:**

1. **Verdad de la acción** — Ninguna idea cambia tu vida hasta que la conviertes en un movimiento concreto.
   *Ninguna idea produce resultados por sí sola; el cambio real empieza cuando actúas, aunque sea en pequeño.*

2. **Verdad de causa y efecto** — Lo que siembras en pensamiento y acción hoy, lo cosechas en resultados mañana.
   *Cada resultado en tu vida tiene un origen identificable en algo que pensaste, decidiste o hiciste antes.*

3. **Verdad de la creencia** — Lo que aceptas como cierto sobre ti mismo se convierte en el techo o el impulso de lo que logras.
   *Tus creencias actúan como un filtro: determinan qué te atreves a intentar y qué ni siquiera consideras posible.*

4. **Verdad del control** — Sientes calma y fuerza en la medida en que sientes que diriges tu vida, no que la sigues.
   *La sensación de tener el mando de tus decisiones está ligada directamente a tu bienestar emocional.*

5. **Verdad de la expectativa** — Tu mente trabaja para confirmar lo que esperas, así que elige esperar cosas buenas.
   *Lo que anticipas con convicción influye en cómo interpretas y reaccionas a lo que sucede.*

6. **Verdad de la correspondencia** — Lo que ves afuera casi siempre es un reflejo de lo que sostienes adentro.
   *Tu mundo interior tiende a manifestarse en tus circunstancias, relaciones y resultados externos.*

7. **Verdad de la atracción** — Cuando le das claridad a tu mente sobre lo que quieres, empiezas a notar caminos que antes pasaban desapercibidos.
   *La claridad y el enfoque hacen que tu atención capte oportunidades relevantes que ya existían, pero que antes ignorabas.*

8. **Verdad de la repetición** — Lo que repites con intención, tarde o temprano se vuelve parte de quién eres.
   *La repetición constante es lo que convierte una acción consciente en hábito automático.*

**Dónde y cómo mostrarlas:**

- Dentro de la pantalla principal ("Hoy"), debajo de la cápsula del día.
- Se muestra **una verdad distinta por semana** (no por día), con el nombre en negrita y la frase debajo.
- Agregar una sección **"Ver todas"** donde el usuario pueda leer las 8 completas, cada una con su significado breve.
- Guardarlas en `localStorage` junto con la lista de cápsulas (misma lógica de datos, sin mezclarse con el historial diario de hábitos/progreso).

---

## Cambio 3 — Nota de fuentes en Ajustes / Acerca de

Agregar dentro de Ajustes (o una pantalla "Acerca de") una nota breve, no protagónica, con el siguiente texto:

> "Estas verdades están inspiradas en principios clásicos del desarrollo personal, presentes en la obra de pensadores como James Allen, Wallace Wattles, Ralph Waldo Emerson y Napoleon Hill, entre otros."

No mencionar a Brian Tracy ni a Margarita Pasos en ningún punto de la app.

---

## Resumen para Claude

1. Nueva pantalla/sección de Progreso (racha, resumen semanal, revisión mensual día 1) con persistencia en localStorage por fecha.
2. Nueva sección "Verdades que rigen tu mente" (8 verdades, rotación semanal, vista "Ver todas").
3. Nota de fuentes históricas en Ajustes/Acerca de.

Cuando estos cambios se validen como estables, se incorporan a la especificación maestra (SKILL.md) como parte permanente del producto, según la sección 42 (Cambios Futuros).
