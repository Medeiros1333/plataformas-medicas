# Playbook de Construcción de Plataforma de Estudio — MIR (España)

Este documento condensa toda la metodología, arquitectura y aprendizaje acumulado en la construcción de plataformas de estudio para exámenes de residencia médica (validado originalmente en Revalida-Brasil, adaptado aquí para el **MIR — Médico Interno Residente, España**). Está escrito para que una sesión de IA sin contexto previo pueda leerlo y ejecutar la construcción completa de la plataforma: desde la organización inicial de carpetas hasta el Hub final publicado, pasando por extracción de exámenes, indexación de bibliografía, generación de contenido, banco de preguntas dual (reales + inéditas) y flashcards.

**Objetivo del proyecto:** construir la base de estudio más completa posible para el MIR, con horizonte al examen de **2028**, en **español**, superando en velocidad, eficiencia de tokens y robustez de banco de preguntas al proyecto original de Revalida.

---

## 1. Filosofía

1. **Fidelidad a la fuente.** Todo el contenido deriva de: (a) exámenes MIR reales con su plantilla de respuestas oficial, y (b) la bibliografía aportada por especialidad (manuales, CTO, AMIR, guías de sociedades científicas). Nada se inventa sin base documental.
2. **Banco de preguntas dual y robusto.** A diferencia de otros exámenes con 2 convocatorias/año, el MIR tiene **1 convocatoria anual**, lo que limita el banco de preguntas reales disponibles por tema. Para compensar, cada módulo debe incluir:
   - Preguntas **reales** (`origen: "real"`), extraídas de exámenes MIR anteriores.
   - Preguntas **inéditas** (`origen: "inedita"`), generadas a partir de la bibliografía, siguiendo el estilo y nivel de exigencia del MIR real, con trazabilidad completa a su fuente.
3. **Máxima eficiencia de tokens.** Separación estricta entre tareas mecánicas (extracción, parsing, reordenamiento de columnas, validación de formato) delegadas a scripts, y tareas de juicio (clasificación clínica, redacción de contenido, verificación de coherencia) reservadas al modelo.
4. **Documentación viva.** El estado del proyecto siempre debe ser recuperable por una sesión nueva sin releer todo el historial — mediante `PROGRESO.md` y `PROCESO_Y_APRENDIZAJE.md`.
5. **Todo en español**, tanto esta metodología como el contenido final de la plataforma.

---

## 2. Arquitectura de carpetas

```
MIR/
├── 00_Metodologia/
│   └── PLAYBOOK_CONSTRUCCION_PLATAFORMA.md   (este archivo)
├── 01_Examenes_Anteriores/
│   └── {año}/
│       ├── Examen_MIR_{año}.pdf
│       └── Plantilla_Respuestas_MIR_{año}.pdf   (o "_definitiva" si aplica, ver sección 12)
├── 02_Bibliografia/
│   └── {Especialidad}/
│       └── {libro/manual/guía}.pdf
├── 03_Recursos_Adicionales/
│   └── (distribución histórica de preguntas por especialidad, normativa, programas formativos BOE, etc.)
├── modulos/
│   └── {COD-especialidad}-{NN}_{tema-slug}.md
├── scripts/
│   └── (scripts de extracción, parsing, validación — Node.js)
├── data/
│   └── (JSON estructurados: preguntas, flashcards, índice de módulos)
├── PROGRESO.md
└── PROCESO_Y_APRENDIZAJE.md
```

Cada carpeta de entrada (`01`, `02`, `03`) tiene su propio `README.md` explicando exactamente qué debe aportar el usuario allí (ver los tres README.md ya creados en este proyecto).

---

## 3. Extracción de PDFs de exámenes

Pipeline de 2 pasadas, igual al validado en Revalida:

1. **Pasada de validación:** `pdftotext` (sin `-layout`) sobre el PDF del examen, para obtener texto crudo y confirmar que el PDF es legible (no escaneado como imagen sin OCR).
2. **Pasada de extracción real:** `pdftotext -layout`, que preserva mejor la disposición en columnas. El examen MIR suele venir en **2 columnas por página** — aplicar un script de reordenamiento de columnas (ya usado en Revalida) para reconstruir el orden de lectura correcto (columna izquierda completa, luego columna derecha), evitando el error clásico de intercalar líneas de ambas columnas.
3. Extraer también la **plantilla de respuestas** (documento separado, normalmente 1-2 páginas con el número de pregunta y la letra correcta A-D).

**Particularidad MIR:** cada examen tiene 4 alternativas (A, B, C, D), no 5. Verificar que el script de parsing de alternativas no asuma un rango A-E heredado de otros exámenes.

---

## 4. Extracción de bibliografía

- **Nunca leer un libro/manual completo de una vez.** Extraer primero el índice/tabla de contenidos (o escanear encabezados de capítulo) para ubicar la sección relevante al tema del módulo.
- Cachear el índice de cada libro (CTO, AMIR, manuales de sociedad) la primera vez que se procesa, para reutilizarlo en módulos posteriores de la misma especialidad.
- Al citar contenido de bibliografía en un módulo o en una pregunta inédita, guardar la referencia exacta (libro, edición, capítulo/página) para trazabilidad.

---

## 5. Esquema de datos (JSON)

Estructura por pregunta (nota: el campo de respuesta correcta se llama `respuesta_correcta`, no `gabarito_oficial` como en el proyecto Revalida/CONAREM — ajuste de nomenclatura para España):

```json
{
  "id": "MIR-2024-087",
  "año": 2024,
  "numero_pregunta": 87,
  "especialidad": "CAR",
  "enunciado": "...",
  "alternativas": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  },
  "respuesta_correcta": "B",
  "anulada": false,
  "origen": "real",
  "fuente": "Examen MIR 2024, pregunta 87",
  "modulo_asociado": "CAR-05_fibrilacion-auricular.md"
}
```

Para preguntas inéditas, campos adicionales obligatorios:

```json
{
  "origen": "inedita",
  "referencia_bibliografica": "CTO Cardiología 12ª ed., cap. 4",
  "justificacion_alternativas_incorrectas": "...",
  "fecha_generacion": "2026-08-08"
}
```

---

## 6. Fase de clasificación

Antes de generar contenido, clasificar cada pregunta extraída por:
- Especialidad (código, ver lista en sección 12.1)
- Tema/subtema clínico
- Módulo al que pertenece (existente o nuevo)

Esta fase es puramente de organización — no requiere redacción de contenido todavía, solo mapeo pregunta → módulo.

---

## 7. Plantilla de módulo

Cada archivo `modulos/{COD}-{NN}_{tema-slug}.md` sigue una estructura de 6 secciones:

1. **Resumen clínico** — el tema explicado de forma completa y estructurada (definición, epidemiología, fisiopatología, clínica, diagnóstico, tratamiento), basado en la bibliografía indexada.
2. **Puntos clave para el MIR** — lista condensada de lo que históricamente más se pregunta sobre este tema.
3. **Preguntas reales** — todas las preguntas MIR anteriores clasificadas en este módulo, con sus 4 alternativas y la respuesta correcta.
4. **Preguntas inéditas** — preguntas generadas siguiendo el estilo MIR real, basadas en la bibliografía del tema, con la misma estructura y trazabilidad de fuente.
5. **Flashcards del módulo** — tarjetas de repetición espaciada derivadas del resumen clínico y de las preguntas (ver sección 9).
6. **Referencias** — bibliografía específica usada para ese módulo.

---

## 8. Generación de preguntas inéditas

Dado que el MIR tiene solo 1 convocatoria/año (banco de preguntas reales más limitado que exámenes con 2 convocatorias), las preguntas inéditas son una pieza central del proyecto:

- Estudiar el **estilo real** de las preguntas MIR del tema (longitud del enunciado, tipo de razonamiento exigido — caso clínico vs. pregunta directa, nivel de distractor) antes de generar.
- Basar cada pregunta inédita en un hecho concreto de la bibliografía indexada, nunca en conocimiento no verificable.
- Las alternativas incorrectas deben ser plausibles (errores conceptuales realistas, no absurdas), y cada una debe llevar su propia justificación de por qué es incorrecta.
- Marcar siempre `origen: "inedita"` — nunca mezclar sin distinción con preguntas reales, para mantener la trazabilidad e integridad del banco.
- Meta orientativa: igualar o superar en cantidad a las preguntas reales disponibles por módulo, priorizando los temas con menor cobertura histórica real.

---

## 9. Flashcards Anki

Cada módulo genera un set de flashcards exportable en formato TSV (`[pregunta]\t[respuesta]\t[Mazo::Submazo]`), siguiendo los mismos principios de tarjeta atómica y repetición espaciada documentados en el proyecto [[Flashcards_Anki]] (`PLAYBOOK_GENERACION_FLASHCARDS.md`), aplicados aquí específicamente al contenido de cada módulo MIR.

---

## 10. Construcción del Hub

- El Hub es un único archivo HTML autocontenido (artifact), con el contenido embebido como constante JSON dentro del propio HTML.
- Se republica siempre a la **misma URL fija** cada vez que se actualiza — nunca crear una URL nueva por actualización.
- Debe incluir: navegación por especialidad/módulo, buscador, modo de estudio (resumen + preguntas), y un **modo examen real (simulacro)** que presenta preguntas sin mostrar la respuesta correcta hasta finalizar, replicando la corrección con nota negativa real del MIR (ver 12.1).

---

## 11. Pipeline de inyección y verificación

1. Generar/actualizar el JSON de datos del módulo.
2. Inyectar el JSON en el Hub (reemplazo de la constante embebida).
3. Verificar mecánicamente (script): número de preguntas, integridad de alternativas (ninguna vacía), consistencia de `respuesta_correcta` contra el rango A-D.
4. Verificar por juicio clínico: coherencia entre pregunta, alternativas y respuesta marcada como correcta (ver taxonomía de daños, sección 12).
5. Publicar el Hub actualizado a la URL fija.

---

## 12. Taxonomía de daños de extracción

Errores recurrentes al extraer exámenes en PDF, y cómo detectarlos:

| Tipo de daño | Descripción | Cómo detectarlo |
|---|---|---|
| Sangrado/contaminación cruzada | Texto de una pregunta se mezcla con la siguiente | Enunciado no tiene sentido gramatical completo |
| Desplazamiento por reordenamiento de columnas | Líneas de columna izquierda/derecha intercaladas mal | Alternativas no siguen orden A→D lógico |
| Alternativas vacías | El parser no capturó el texto de una alternativa | Alternativa con string vacío o solo la letra |
| Plantilla de respuestas dañada | OCR/extracción falló en la tabla de respuestas | Letra de respuesta fuera de rango A-D o ausente |
| Valores clínicamente implausibles | Dato numérico/clínico que no tiene sentido médico | Contrastar contra conocimiento clínico objetivo antes de concluir error |
| Discrepancia pregunta-plantilla | La respuesta marcada como correcta no calza con el enunciado | Releer el enunciado completo antes de asumir error — puede ser "falsa alarma" |
| Respuesta nula sin anulación oficial | Pregunta sin letra de respuesta pero no consta como anulada | Verificar contra la plantilla **definitiva**, no la provisional |
| **Pregunta oficialmente anulada** | El Ministerio/comisión anuló la pregunta tras impugnaciones | Marcar `anulada: true`, excluir del banco de preguntas activo o marcar explícitamente como anulada en el Hub |
| **Discrepancia provisional vs. definitiva** | La plantilla provisional difiere de la definitiva tras el proceso de reclamaciones | Priorizar **siempre** la plantilla definitiva; si solo se tiene la provisional, marcar el módulo como "pendiente de verificación con plantilla definitiva" |

### 12.1 Particularidades del examen MIR (España)

- **4 alternativas (A-D)**, no 5.
- **Corrección con nota negativa:** fórmula aproximada de penalización de 1/3 de punto por respuesta incorrecta (aciertos − errores/3), sin penalización por preguntas en blanco. Replicar esta fórmula en el modo simulacro del Hub.
- **Plantilla provisional vs. definitiva:** tras la publicación del examen, el Ministerio de Sanidad publica una plantilla de respuestas **provisional**, se abre un plazo de **reclamaciones/impugnaciones**, y luego se publica la plantilla **definitiva** (que puede anular preguntas o cambiar la respuesta correcta respecto a la provisional). Siempre usar la definitiva como fuente autoritativa para el banco de preguntas.
- Códigos de especialidad orientativos para España (ajustar según nomenclatura MIR oficial): CAR (Cardiología), DIG (Digestivo), NEU (Neurología), NFR (Nefrología), NML (Neumología), END (Endocrinología), REU (Reumatología), HEM (Hematología), ONC (Oncología), INF (Infecciosas), PED (Pediatría), GIN (Ginecología y Obstetricia), PSQ (Psiquiatría), DER (Dermatología), OFT (Oftalmología), ORL (Otorrinolaringología), TRA (Traumatología), CIR (Cirugía General), URO (Urología), PREV (Medicina Preventiva y Salud Pública), FAR (Farmacología), ETC.

---

## 13. Verificación cruzada de respuestas (gabaritos)

Antes de dar por definitivo el `respuesta_correcta` de una pregunta real:
1. Contrastar contra la plantilla **definitiva** oficial.
2. Si hay conflicto entre lo extraído del PDF y el conocimiento clínico objetivo, releer el enunciado completo — no concluir error por una lectura parcial.
3. Si la pregunta consta como anulada, marcarla como tal y no forzar una respuesta correcta.

---

## 14. Consolidación de fragmentación

Si el mismo tema aparece disperso en varios módulos pequeños tras la fase de clasificación (por ejemplo, distintos años tratando el mismo subtema con nombres de archivo ligeramente distintos), consolidar en un único módulo antes de la fase de generación de contenido, para evitar duplicidad de preguntas y de flashcards.

---

## 15. Documentación viva

- **`PROGRESO.md`** — resumen ejecutivo del estado del proyecto (módulos completados / pendientes, cobertura por especialidad, próximos pasos).
- **`PROCESO_Y_APRENDIZAJE.md`** — registro numerado de errores encontrados y lecciones aprendidas durante la construcción (ej. "Error #7: plantilla provisional de 2023 tenía 2 preguntas anuladas que la provisional no reflejaba — siempre verificar definitiva").

Ambos documentos deben actualizarse al final de cada lote de trabajo, no solo al final del proyecto.

---

## 16. Flujo autónomo por lotes

Para avanzar de forma autónoma (sin confirmación paso a paso del usuario):
1. Tomar el siguiente lote de preguntas/temas pendientes según `PROGRESO.md`.
2. Ejecutar el pipeline completo (extracción → clasificación → contenido → preguntas inéditas → flashcards → inyección → verificación).
3. Actualizar `PROGRESO.md` y `PROCESO_Y_APRENDIZAJE.md`.
4. Continuar con el siguiente lote sin narrar cada paso intermedio en el chat — reportar solo al completar el lote o al encontrar un bloqueo real (ej. material fuente faltante).

---

## 17. Optimización de tokens

1. Nunca releer un archivo recién escrito en la misma sesión.
2. Delegar todo trabajo mecánico (parsing, reordenamiento de columnas, validación de formato JSON) a scripts, no hacerlo leyendo/contando manualmente.
3. Indexar antes de leer: ubicar la sección exacta de un libro/examen antes de leerlo completo.
4. Generación de contenido en una sola pasada por módulo, no iterativa.
5. No narrar cada paso en el chat — trabajar y reportar al final del lote.
6. Reutilizar siempre la misma URL del Hub al republicar.

---

## 18. Checklist operativo

1. Verificar que el material fuente (examen + plantilla definitiva, o bibliografía) esté disponible en `01_Examenes_Anteriores/` o `02_Bibliografia/`.
2. Extraer y validar (2 pasadas + reordenamiento de columnas si aplica).
3. Clasificar preguntas por especialidad/tema/módulo.
4. Verificar respuestas contra plantilla definitiva (nunca provisional si la definitiva está disponible).
5. Redactar/actualizar módulo (6 secciones).
6. Generar preguntas inéditas con trazabilidad bibliográfica.
7. Generar flashcards del módulo.
8. Inyectar en el Hub y verificar mecánica + clínicamente.
9. Publicar Hub a la URL fija.
10. Actualizar `PROGRESO.md` y `PROCESO_Y_APRENDIZAJE.md`.

---

## Glosario

- **MIR:** Médico Interno Residente — examen nacional de acceso a la formación sanitaria especializada en España.
- **Plantilla de respuestas:** documento oficial con la letra correcta de cada pregunta.
- **Plantilla provisional / definitiva:** dos versiones sucesivas de la plantilla; la definitiva incorpora el resultado del proceso de reclamaciones/impugnaciones y es la fuente autoritativa.
- **Pregunta anulada:** pregunta excluida de la corrección oficial tras impugnación exitosa.
- **Origen real vs. inédita:** clasificación de cada pregunta del banco según si proviene de un examen MIR real o fue generada a partir de bibliografía.
- **Hub:** plataforma HTML única que centraliza el contenido, las preguntas y las flashcards de todos los módulos.
- **CTO / AMIR:** academias/editoriales de referencia para la preparación del MIR, fuente bibliográfica habitual.
