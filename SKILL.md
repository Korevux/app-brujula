# DESPERTAR CONSCIENTE — Product Skill / Especificación Maestra — V1.0

## 1. ROL DE CLAUDE

Actúa como desarrollador principal, diseñador UX/UI y arquitecto funcional de la aplicación móvil web Brújula Interior.

Tu trabajo no consiste únicamente en generar una interfaz visualmente atractiva. Debes construir una aplicación funcional, estable, intuitiva, agradable de utilizar y preparada para evolucionar.

La prioridad es:

1. Funcionalidad real.
2. Experiencia de usuario.
3. Diseño visual profesional.
4. Persistencia correcta de los datos.
5. Facilidad de mantenimiento y evolución.
6. Ausencia de errores.

No consideres terminada una versión simplemente porque visualmente se vea bien.

## 2. CONCEPTO DEL PRODUCTO

Brújula Interior es una aplicación personal de crecimiento y desarrollo basada en principios generales relacionados con establecimiento de metas, disciplina, planificación, hábitos, acción, reflexión, visualización y responsabilidad personal.

La aplicación debe ayudar al usuario a: recordar sus metas; comenzar el día con claridad; definir una prioridad; convertir objetivos en acciones; desarrollar hábitos; recibir recordatorios; reflexionar; mantener continuidad; cerrar el día conscientemente.

No debe presentarse como una aplicación oficial de ningún autor externo. El contenido inspiracional debe ser original (ver notas de derechos de autor más abajo).

## 3. PRINCIPIO FUNDAMENTAL — ESTRUCTURA SIN RIGIDEZ

La aplicación recomienda una metodología, pero no impone una única forma de vivirla. Debe existir una diferencia clara entre RECOMENDACIÓN y CONFIGURACIÓN PERSONAL DEL USUARIO.

Ejemplo: la aplicación puede recomendar "Lectura: 20 minutos", pero el usuario puede establecer "Lectura: 15 minutos a las 9:30 PM".

La aplicación debe adaptarse a diferentes edades, profesiones, horarios, responsabilidades, niveles de energía, circunstancias familiares y rutinas. No debe asumir que todos se levantan a la misma hora ni que todos tienen el mismo estilo de vida.

## 4. TONO Y PERSONALIDAD

La aplicación debe sentirse: cálida, elegante, serena, positiva, motivadora, humana, profesional, aspiracional.

No debe sentirse: infantil, agresiva, militarizada, culpabilizadora, excesivamente corporativa, saturada de frases motivacionales.

La aplicación acompaña al usuario. No lo juzga. No debe utilizar lenguaje como "Fallaste", "No cumpliste", "Perdiste". En su lugar: "Puedes retomarlo", "Hoy puedes volver a empezar", "Continúa avanzando".

## 5. PLATAFORMA Y FORMATO INICIAL

La primera versión debe construirse como una aplicación web móvil en un único archivo `index.html` (HTML + CSS + JS). No utilizar dependencias externas innecesarias. Debe poder abrirse directamente en un navegador. Debe estar optimizada para teléfonos y poder utilizarse mediante "Agregar a pantalla de inicio". Las funciones principales deben funcionar sin conexión. Las funciones que requieran conexión (como el envío a un webhook) deben ser opcionales y no impedir el funcionamiento local de la aplicación.

**Nota de arquitectura (decidida durante el desarrollo, ver INSTRUCCIONES-CLAUDE-CODE.md):** el contenido de las cápsulas vive en un archivo aparte `capsulas.json`, cargado por el `index.html`, para no mezclar contenido con lógica de la app.

## 6. DISEÑO VISUAL

Nivel de producción visual alto. No debe parecer un formulario HTML; debe sentirse como una aplicación móvil moderna y premium.

**Estética:** cálida, minimalista, elegante, limpia, moderna, serena, emocionalmente agradable.

**Paleta sugerida:** base cálida — crema, blanco cálido, beige suave, verde salvia/oliva, dorado muy sutil como color de acento. Evitar colores excesivamente saturados.

**Componentes:** tarjetas, esquinas redondeadas, sombras suaves, jerarquía tipográfica clara, botones grandes, iconos sencillos, suficiente espacio en blanco. Las tarjetas deben sentirse como elementos diseñados, no como simples cajas.

## 7. PRINCIPIO DE DISEÑO MOBILE FIRST

La experiencia principal está diseñada para teléfonos. Debe funcionar correctamente en diferentes tamaños de pantalla. Comprobar visualmente como mínimo: 320px, 360px, 375px, 390px, 430px. No debe haber contenido cortado, botones inaccesibles, texto desbordado, elementos superpuestos ni scroll horizontal involuntario. Los controles táctiles deben ser suficientemente grandes.

## 8. ESTRUCTURA PRINCIPAL DE NAVEGACIÓN

Como mínimo: HOY (pantalla principal y centro de la experiencia), METAS, RUTINA, CÁPSULA, PROGRESO, AJUSTES. La navegación debe ser sencilla. La pantalla "Hoy" debe ser siempre la más importante.

## 9. PANTALLA "HOY"

Debe responder inmediatamente "¿Qué necesito hacer hoy?". Mostrar de forma visualmente jerarquizada: 1) saludo, 2) fecha, 3) cápsula del día, 4) metas, 5) identidad, 6) enfoque del día, 7) A-1, 8) hábitos, 9) progreso, 10) próximo recordatorio. No mostrar todo con la misma importancia. La A-1 debe tener especial protagonismo.

## 10. MIS METAS

El usuario debe poder crear entre 3 y 5 metas principales. Se consideran objetivos importantes de vida y no deben editarse constantemente. La configuración inicial debe solicitar estas metas; después debe existir un botón "Editar metas". Revisión preferiblemente semanal.

**Visualización:** tarjeta visualmente atractiva. Cada meta puede contener: número, título, descripción, imagen opcional, icono opcional. Ejemplo: "01 · Libertad financiera · Construir un negocio rentable que me permita tener mayor libertad." La sección debe sentirse como un pequeño "vision board" personal, visible fácilmente todos los días.

## 11. DECLARACIÓN DE IDENTIDAD

El usuario puede escribir una declaración personal, ej. "Soy una persona disciplinada, enfocada y constante." Debe aparecer destacada. Botón "Ya la dije". La aplicación registra la realización: mañana y noche. Debe poder visualizarse si ya fue realizada.

## 12. GRATITUD

Campo breve diario: "Hoy agradezco:". Independiente para cada día. Se conserva en el historial.

## 13. VISUALIZACIÓN

Espacio "Visualiza tu resultado": el usuario escribe cómo se ve su resultado deseado, preferiblemente en presente (ej. "Estoy disfrutando de..."). Posibilidad de leerlo diariamente. Opcionalmente, un modo de visualización que reduzca elementos visuales y centre la atención en el texto.

## 14. META DEL DÍA — M-P-A

M — Meta: ¿Qué quiero conseguir hoy? P — Por qué: ¿Por qué es importante? A — Acciones: ¿Qué acciones voy a realizar? Debe ser sencillo y práctico.

## 15. SISTEMA ABCDE

A: debe hacerse hoy, consecuencias importantes. B: debería hacerse. C: sería bueno hacerlo. D: puede delegarse. E: puede eliminarse. El usuario puede crear múltiples acciones. Cada acción puede contener opcionalmente: descripción, hora, duración, categoría ABCDE, estado de completado.

## 16. A-1

Una única A-1: la acción más importante del día. Destacada en la pantalla principal. Debe mostrar: acción, hora, duración opcional, estado. Botón "Comenzar A-1"; al completarse, "A-1 completada". No debe permitirse tener múltiples A-1 simultáneamente.

## 17. HÁBITOS

Inicialmente: ejercicio, lectura y reflexión, estudio. Debe permitir hábitos adicionales en el futuro. Cada hábito configurable: activar/desactivar, hora, duración recomendada, duración personal, días, recordatorio. La configuración se guarda y no se solicita nuevamente todos los días.

## 18. EJERCICIO — REGLA ESPECÍFICA

El usuario solo debe marcar el check de completado y registrar opcionalmente la duración. La aplicación NO debe preguntar qué tipo de ejercicio realizó ni imponer una actividad específica. Principio: la aplicación recomienda el hábito; la persona decide cómo ejecutarlo.

## 19. LECTURA Y REFLEXIÓN

Hábito configurable: hora, duración, contenido personal (ej. "Libro actual: Hábitos Atómicos"). La aplicación no debe imponer un libro determinado.

## 20. ESTUDIO

Duración recomendada inicial: 30 minutos, modificable. Campo opcional: "¿Qué estudié hoy?".

## 21. SISTEMA DE RECOMENDACIONES DE TIEMPO

Los tiempos predeterminados son recomendaciones, no obligaciones. Los valores personalizados se mantienen hasta que el usuario los modifique.

## 22. RECORDATORIOS Y ALARMAS

Cada hábito o acción programable puede tener un recordatorio: activar, desactivar, probar, posponer, reprogramar. Opciones de posponer: 5, 15, 30 minutos. Debe existir "Omitir hoy" — omitir un hábito no debe considerarse un fracaso.

## 23. MODO DÍA OCUPADO

Día completo (rutina normal), Día ocupado (solo elementos esenciales), Día mínimo (conserva como mínimo: identidad, meta principal, A-1, gratitud). Finalidad: mantener continuidad sin exigir una rutina perfecta.

## 24. LÍNEA DE TIEMPO DEL DÍA

Mostrar la secuencia del día con horarios y estado (ej. "06:00 — Identidad ✓ ... 09:00 — A-1 → Ahora ... 21:30 — Cierre"), para que el usuario sepa qué ocurre después.

## 25. CÁPSULA DEL DÍA

Pequeña experiencia diaria de crecimiento personal, no limitada a una frase motivacional. Cada cápsula puede contener: número del día, tema, frase o idea, reflexión breve, pregunta, acción práctica opcional.

**Nota (decidida durante el desarrollo):** se eliminó el campo de "reflexión breve" de la estructura real usada; la estructura final es: frase/idea, pregunta para ti, acción práctica, espacio para responder.

## 26. PROGRAMA DE 365 DÍAS

Contenido organizado por temas de desarrollo personal (claridad, metas, disciplina, acción, enfoque, hábitos, responsabilidad, perseverancia, planificación, gratitud, visualización, aprendizaje, crecimiento, confianza, reflexión, constancia). El contenido debe ser original o estar correctamente autorizado — no copiar textos protegidos de libros, cursos o materiales de terceros. Las ideas generales pueden inspirarse en principios conocidos de desarrollo personal, pero la redacción debe ser original. Las citas textuales de autores solo con autorización/licencia adecuada.

**Nota (decidida durante el desarrollo):** el primer lote (Día 001–100, para cubrir el resto de 2026) usa contenido de "sabiduría universal" sin atribución a ningún autor contemporáneo específico — ver `CAPSULAS-2026.md` y `PROCESO-NUEVAS-CAPSULAS.md` para el criterio de derechos de autor a seguir en lotes futuros.

## 27. CIERRE NOCTURNO

Aparece después de una hora configurable. Campos: "¿Qué logré hoy?", "¿Qué aprendí?", "¿Por qué estoy agradecido?". Indicación visual del progreso del día (ej. "Hoy completaste 5 de 7 elementos"). El cierre debe sentirse reflexivo y tranquilo.

## 28. REVISIÓN SEMANAL

Preguntas: ¿Qué logré? ¿Qué no funcionó? ¿Qué aprendí? ¿Qué quiero mejorar? ¿Qué será importante la próxima semana? ¿Necesito cambiar algún horario? Las metas principales pueden revisarse aquí.

## 29. PROGRESO

Mostrar: hábitos completados, A-1 completadas, días con rutina, progreso semanal, continuidad. No usar sistemas excesivamente competitivos. Objetivo: ayudar al usuario a observar su proceso.

**Ampliación (decidida durante el desarrollo, ver CAMBIOS-V1.1.md):** pantalla de progreso con racha de días consecutivos, resumen semanal (hábitos + A-1) y revisión mensual el día 1 de cada mes con tres preguntas (qué avancé, qué se estancó, qué voy a corregir). Todo con fecha en localStorage.

## 30. PRINCIPIO ANTI-PERFECCIONISMO

No castigar la interrupción de una rutina. Si el usuario pierde un día, no mostrar "Racha perdida"; preferir "Puedes retomar hoy". Fomentar continuidad, no culpa.

## 31. PERSISTENCIA DE DATOS

La primera versión usa `localStorage`. Los datos deben permanecer tras cerrar el navegador, actualizar la página o volver a abrir la aplicación. No perder datos al cambiar entre secciones.

## 32. HISTORIAL DIARIO

Cada día genera un registro con, cuando corresponda: fecha, metas, identidad mañana/noche, gratitud, visualización, meta, por qué, acciones, A-1, hábitos, cierre, cápsula, progreso. No sobrescribir accidentalmente registros anteriores.

## 33. EXPORTACIÓN Y RESPALDO

Función de "Exportar mis datos" (preferiblemente JSON) e "Importar mis datos", para recuperar información si el usuario cambia de dispositivo.

## 34. WEBHOOK N8N

Dejar preparada la posibilidad de enviar registros a n8n mediante una variable `N8N_WEBHOOK_URL` (inicialmente vacía). La app debe seguir funcionando normalmente sin webhook configurado. El envío debe usar JSON. Integración futura posible con n8n, Google Sheets, base de datos u otros servicios, sin que la app dependa de ellos para funcionar localmente.

## 35. SEGURIDAD Y PRIVACIDAD

Los datos personales permanecen localmente por defecto. No enviar información automáticamente a servicios externos sin una acción/configuración explícita. El usuario debe saber si sus datos están siendo enviados a un webhook.

## 36. EXPERIENCIA DE USUARIO

Minimizar la fricción. El usuario debe poder abrir la app y saber rápidamente qué es importante hoy. No mostrar demasiadas decisiones simultáneamente. Jerarquía: 1) A-1, 2) próxima acción, 3) hábitos, 4) cápsula, 5) progreso, 6) información secundaria.

## 37. MICROINTERACCIONES

Animaciones sutiles para: completar hábitos, completar A-1, abrir cápsula, progreso, cambiar de sección. No usar animaciones excesivas. La aplicación debe sentirse elegante y rápida.

## 38. REGLAS DE CALIDAD

Antes de considerar terminada una versión, comprobar:

**Funcionalidad:** todos los botones funcionan; todos los campos guardan información; los datos persisten; los checks funcionan; las acciones se pueden editar; A-1 funciona; las configuraciones permanecen.

**Alarmas:** se pueden probar; se pueden activar/desactivar; se pueden posponer; no se duplican; los cambios de horario se reflejan correctamente.

**Fechas:** la cápsula cambia correctamente cada día; el historial conserva días anteriores; el cierre corresponde al día correcto.

**Responsive:** probar diferentes tamaños de pantalla.

**Datos:** localStorage funciona; exportación funciona cuando esté implementada; importación funciona cuando esté implementada; no se pierden registros.

## 39. REGLA DE NO REGRESIÓN

Al modificar código existente: 1) comprender cómo funciona, 2) identificar qué partes dependen de él, 3) realizar el cambio, 4) comprobar las funciones relacionadas, 5) comprobar las funciones que no fueron modificadas. No reconstruir innecesariamente toda la aplicación para un cambio pequeño.

## 40. PRINCIPIO DE EVOLUCIÓN

La V1 no necesita contener todas las funciones posibles. Priorizar: estabilidad > funciones innecesarias; usabilidad > complejidad; experiencia > cantidad de elementos. Las nuevas funciones se agregan solo cuando aportan valor real.

## 41. REGLA DE TRABAJO CON VERSIONES

Cada versión se conserva (V1.0, V1.1, V1.2, V2.0...). Nunca asumir que una nueva versión reemplaza automáticamente una versión estable anterior.

## 42. CAMBIOS FUTUROS

Los cambios solicitados durante el desarrollo se mantienen inicialmente en un documento separado de "CAMBIOS SOLICITADOS" (ver `CAMBIOS-V1.X.md`). Cuando un cambio se convierte en regla permanente del producto, se incorpora a este documento maestro. No modificar silenciosamente las reglas principales.

## 43. REGLA FINAL PARA CLAUDE

Cuando recibas este documento junto con los archivos del proyecto:

1. Lee primero las especificaciones.
2. Analiza el código existente (si lo hay).
3. Conserva las funciones que ya funcionan.
4. No inventes comportamientos contradictorios.
5. No elimines datos existentes.
6. No cambies la filosofía del producto.
7. Implementa los cambios solicitados de forma localizada cuando sea posible.
8. Realiza una auditoría funcional antes de considerar terminada la versión.
9. Prioriza funcionamiento real sobre apariencia.
10. Entrega siempre una aplicación funcional.

La aplicación debe sentirse como: "Un acompañante personal para convertir intención en acción." No como una lista de tareas. No como un calendario. No como una aplicación de productividad fría.

Brújula Interior debe ayudar al usuario a recordar quién quiere ser, qué quiere lograr y cuál es la acción que puede realizar hoy para acercarse a ello.
