# Playbook de Construcción — Plataforma de Farmacoterapia, Farmacología Clínica y Microbiología

Este documento es la metodología completa de la plataforma `Farmaco/`. Está escrito para que una sesión de IA **sin contexto previo** pueda leerlo y continuar la construcción desde donde quedó, sin releer el historial de chat.

Deriva del `PLAYBOOK_CONSTRUCCION_PLATAFORMA.md` del proyecto [[MIR]] y comparte su filosofía, pero **el objeto de estudio es distinto**: aquí no hay banco de preguntas de examen, sino un **vademécum clínico estructurado** (fichas de fármaco) correlacionado con un **atlas de patógenos** (fichas de microbiología).

---

## 1. Filosofía

1. **Prioridad absoluta a la práctica clínica.** La pregunta que gobierna cada dato incluido es: *«¿esto cambia lo que el médico hace delante del paciente?»*. Dosis, vía, duración, cuándo parar, qué monitorizar, qué interacción mata. La farmacología molecular entra **solo en la medida en que explica un efecto adverso, una interacción o una elección terapéutica**.
2. **Curva de uso real, no exhaustividad.** Se priorizan los fármacos que un clínico general/internista prescribe de forma habitual. Los fármacos raros, de uso exclusivamente hospitalario-superespecializado o de nicho se posponen o se omiten (ver sección 6, criterio de priorización).
3. **Fidelidad a la fuente.** Todo dato deriva de la bibliografía indexada en `01_Bibliografia/` (más las fuentes complementarias autorizadas de la sección 3). Cada ficha lleva su campo `fuente` con libro + edición + capítulo. No se inventan dosis.
4. **Correlación fármaco ↔ patógeno como pieza central.** La sección de Microbiología no es un apéndice: cada patógeno enlaza a los fármacos que lo cubren y cada antimicrobiano enlaza a los patógenos de su espectro. Esa navegación bidireccional es el diferencial de esta plataforma.
5. **Pediatría es una sección propia, no una nota al pie.** Se repite el fármaco completo con datos pediátricos (mg/kg, presentaciones, hitos de edad, contraindicaciones por edad). **La duplicación con la sección de adultos es deliberada y correcta** — no consolidar.
6. **Datos estructurados, no prosa libre.** A diferencia del proyecto MIR (módulos `.md` parseados con regex), aquí la fuente de verdad es **JSON con esquema fijo** (sección 4). Esto permite validación mecánica fuerte, tablas comparativas automáticas y export a Anki sin ambigüedad de parseo.
7. **Todo el contenido en español.**
8. **Sin país.** La plataforma es de farmacología general: nada de sistemas sanitarios, financiación, agencias o guías de un país concreto. Las alertas regulatorias se citan de la EMA y la FDA; las guías, las internacionales (OMS, GINA, GOLD, KDIGO, ESC/AHA, Maastricht, FIGO, AAP…); la epidemiología se expresa por regiones («donde la resistencia a macrólidos es alta»), no por un país (hallazgo #38).

---

## 2. Arquitectura de carpetas

```
Farmaco/
├── 00_Metodologia/
│   └── PLAYBOOK_CONSTRUCCION_PLATAFORMA_FARMACO.md   (este archivo)
├── 01_Bibliografia/
│   ├── Farmacologia Basica y Clinica Katzung 15a Edicion.pdf
│   ├── Harrison-20°edi.pdf
│   ├── Microbiologia Medica Murray 9a Edicion.pdf
│   └── _indices/                    (índices de capítulos cacheados — ver sección 3)
├── data/
│   ├── farmacos/{AREA}.json         (fichas de fármaco de adulto, una por área médica)
│   ├── pediatria/{AREA}.json        (fichas pediátricas, mismo esquema + campos propios)
│   └── microbiologia/{GRUPO}.json   (fichas de patógeno)
├── scripts/
│   ├── validar-fichas.js            (validación de esquema + integridad referencial)
│   ├── generar-hub-data.js          (data/*.json → hub/data.js)
│   ├── exportar-anki.js             (data/*.json → mazos TSV para Anki)
│   └── servir-hub.js                (servidor estático local opcional)
├── hub/
│   ├── index.html · style.css · app.js · data.js
├── anki/                            (mazos TSV generados)
├── PROGRESO.md
└── PROCESO_Y_APRENDIZAJE.md
```

---

## 3. Bibliografía: estado real de las fuentes

**Verificado con `pdftotext` al inicio del proyecto. Leer esto antes de intentar extraer nada:**

| Fuente | Páginas | Idioma | ¿Texto extraíble? | Uso |
|---|---|---|---|---|
| **Katzung, Farmacología Básica y Clínica, 15.ª ed.** | 1 924 | Español | ✅ Sí, íntegro | **Fuente primaria de farmacología**: mecanismo, farmacocinética, interacciones, efectos adversos, espectro antimicrobiano |
| **Harrison, Principios de Medicina Interna, 20.ª ed.** | 13 348 | **Portugués** | ✅ Sí, íntegro | **Fuente primaria de terapéutica**: indicación por patología, esquema de tratamiento, duración, criterios de inicio/fin |
| **Murray, Microbiología Médica, 9.ª ed.** | 1 098 | Español | ❌ **No — PDF digitalizado como imagen** | Solo su **índice** es texto. Sirve de **mapa de estructura** de la sección de Microbiología |

**Fuentes complementarias autorizadas** (del proyecto hermano `MIR/02_Bibliografia/`, en español y extraíbles), usadas donde Murray no alcanza:
- `infecciosas y microbiologia AMIR 18ed.pdf` (191 pp.) — **sustituto operativo de Murray** para el cuerpo de microbiología.
- `Infecciosas y microbiologia 14ed.pdf` (CTO) — contraste.
- `Pediatria AMIR.pdf` (112 pp.) — apoyo para la sección pediátrica.
- `Farmacologia 14ed.pdf` (CTO, 17 pp.) — repaso de principios generales.

### 3.1 Regla de extracción

1. **Nunca leer un libro completo en contexto.** Extraer una vez el texto plano a un archivo de trabajo temporal (scratchpad) y hacer `grep` dirigido sobre él.
2. Los índices de capítulos ya están cacheados en `01_Bibliografia/_indices/` — consultarlos **antes** de cualquier búsqueda, para acotar el rango de páginas.
3. Al citar, guardar la referencia exacta en el campo `fuente` de la ficha (`"Katzung 15.ª ed., cap. 43"`).
4. **Nota sobre Harrison:** el texto fuente está en portugués; el contenido de la ficha se redacta **traducido al español**. Verificar los falsos amigos habituales (pt. *pesquisa* → es. *investigación/cribado*; pt. *rim* → es. *riñón*; pt. *taxa* → es. *tasa*).

---

## 4. Esquema de datos

### 4.1 Ficha de fármaco (`data/farmacos/{AREA}.json` y `data/pediatria/{AREA}.json`)

Cada archivo es un **array** de fichas. Campos obligatorios marcados con ●.

```json
{
  "id": "CAR-enalapril",                    // ● {AREA}-{slug}; en pediatría "PED-{AREA}-{slug}"
  "nombre": "Enalapril",                     // ●
  "sinonimos": ["Enalaprilato (IV)"],
  "area": "CAR",                             // ● código de área (sección 5.1)
  "clase": "IECA",                           // ● clasificación farmacológica
  "subclase": "Profármaco de acción larga",
  "mecanismo": "...",                        // ● mecanismo de acción, orientado a por qué produce sus efectos clínicos
  "espectro": null,                          // ● solo antiinfecciosos: cobertura microbiológica; null en el resto
  "indicaciones": [                          // ● al menos una
    {
      "patologia": "Insuficiencia cardiaca con FEVI reducida",   // ●
      "dosis": "Inicio 2,5 mg/12 h",                              // ●
      "posologia": "Cada 12 h",                                   // ●
      "via": "VO",                                                // ●
      "dosis_objetivo": null,   // solo si la dosis NO es una cantidad fija sino la que
                                // haga falta para alcanzar una diana medible: INR del
                                // acenocumarol, glucemia del bolo corrector de insulina,
                                // tiempo de coagulación activado de la heparina en ECMO.
                                // El validador acepta una dosis sin cantidad SOLO si este
                                // campo está relleno, para que la excepción sea deliberada.
      "nota": "Doblar dosis cada 2 semanas hasta la máxima tolerada"
    }
  ],
  "esquema": {                               // ● esquema de tratamiento: el «cómo se maneja en el tiempo»
    "inicio": "Con qué dosis se empieza y en qué condiciones",              // ●
    "titulacion": "Cómo y cada cuánto se sube",
    "duracion": "Cuánto tiempo dura el tratamiento",                        // ●
    "fin": "Cuándo y cómo se suspende (retirada brusca vs. gradual)",       // ●
    "via": "VO / IV / IM / SC / inhalada / tópica",                          // ●
    "monitorizacion": "Qué se vigila y con qué periodicidad"
  },
  "farmacocinetica": {                       // ●
    "absorcion": "...", "distribucion": "...", "metabolismo": "...",
    "eliminacion": "...", "vida_media": "...",
    "ajuste_renal": "...", "ajuste_hepatico": "...",
    "interacciones": [                       // ● interacciones que cambian la conducta clínica
      { "con": "AINE", "efecto": "Reducen su efecto e ↑ riesgo de FRA", "gravedad": "alta", "manejo": "Evitar o vigilar Cr/K" }
    ]
  },
  "efectos_adversos": { "frecuentes": ["..."], "graves": ["..."] },   // ●
  "contraindicaciones": ["..."],             // ●
  "perlas": ["..."],                         // ● características únicas del fármaco que hay que tener en cuenta
  "embarazo_lactancia": "...",
  "micro_relacionado": ["BGP-staphylococcus-aureus"],   // ids de patógenos cubiertos (antiinfecciosos)
  "fuente": "Katzung 15.ª ed., cap. 11; Harrison 20.ª ed., cap. 252"   // ●
}
```

**Campos adicionales exclusivos de pediatría** (`data/pediatria/`):

```json
{
  "dosis_pediatrica_base": "10-15 mg/kg/dosis",   // ● la referencia mg/kg de un vistazo
  "dosis_maxima": "No superar la dosis de adulto",// ●
  "presentaciones": ["Jarabe 100 mg/5 mL", "Supositorio 150 mg"],
  "edad_minima": "≥3 meses",                      // ●
  "franjas_edad": [ { "franja": "Neonato (<28 d)", "ajuste": "..." } ],
  "peculiaridad_pediatrica": "Lo que cambia respecto al adulto y por qué"   // ●
}
```

### 4.2 Ficha de patógeno (`data/microbiologia/{GRUPO}.json`)

```json
{
  "id": "BGP-staphylococcus-aureus",         // ● {GRUPO}-{slug}
  "nombre": "Staphylococcus aureus",         // ●
  "grupo": "BGP",                            // ● código de grupo (sección 5.2)
  "clasificacion": "Coco grampositivo en racimos, catalasa +, coagulasa +",  // ●
  "morfologia_tincion": "Cocos grampositivos agrupados en racimos",           // ●
  "mecanismo_patogenia": ["..."],            // ● factores de virulencia → cómo produce daño
  "patologias": [                            // ● cuadros que causa
    { "cuadro": "Endocarditis aguda", "clinica": "...", "lesiones": "...", "clave": "..." }
  ],
  "caracteristicas_clave": ["..."],          // ● lo que lo identifica y distingue de sus vecinos
  "diagnostico": { "muestra": "...", "pruebas": ["..."], "claves": "..." },   // ●
  "tratamiento": {                           // ●
    "eleccion": "...", "alternativas": "...",
    "resistencias": "...", "duracion": "...", "notas": "..."
  },
  "farmacos_relacionados": ["INF-cloxacilina"],   // ● ids de fármaco — correlación bidireccional
  "fuente": "AMIR Infecciosas y Microbiología 18.ª ed.; Harrison 20.ª ed., cap. 142"
}
```

### 4.1.1 Lo que distingue a un fármaco dentro de su clase

```json
{
  "clase": "Estatina (inhibidor de la HMG-CoA reductasa)",   // ● COPIAR literal de un hermano existente (hallazgo #31)
  "subclase": "Estatina de intensidad moderada, lipófila",   // el matiz va aquí, no en «clase»
  "vs_clase": [                                              // obligatorio (aviso) si la clase tiene ≥2 fármacos
    "**Vida media corta: se toma por la NOCHE**; atorvastatina y rosuvastatina, a cualquier hora."
  ]
}
```

- **`**…**`** en cualquier texto de la ficha marca lo PROPIO del fármaco: el Hub lo resalta y Anki lo pone en negrita. El validador da error si un `**` queda desemparejado.
- Cada elemento de `vs_clase` debe ser una diferencia real con los hermanos (farmacocinética, indicación propia, efecto adverso propio, interacción propia), no una propiedad de la clase.

**Regla de tamaño de clase (≥3 fármacos individuales).** El validador avisa si una clase de adulto tiene 1 o 2 fármacos individuales. Hay tres salidas legítimas, y solo tres:

```json
{ "vision_clase": true,  "clase": "Visión de clase: antraciclinas" }   // ficha agrupada (varios fármacos en una): NO cuenta para la clase
{ "clase_unica": "Justificación de por qué la familia tiene un solo fármaco de uso real" }  // p. ej. litio, colchicina, oxígeno
```

1. **Completar la clase** con fichas individuales de los fármacos más usados (lo normal).
2. **Convertir la ficha agrupada en `vision_clase`**: se conserva como resumen comparativo («Visión de clase: …»), el Hub la marca con la insignia «Visión de clase» y deja de contar como miembro.
3. **Declarar `clase_unica`** con su justificación cuando la familia, de verdad, tiene un único representante en la práctica.

### 4.4 Ficha de patología (`data/patologias/*.json`)

```json
{
  "id": "PAT-hipertension-arterial",          // ● prefijo PAT-
  "nombre": "Hipertensión arterial esencial", // ●
  "sinonimos": ["HTA"],
  "area": "CAR",                               // ● área de la sección 5.1
  "resumen": "Cuándo y cómo tratar",           // ●
  "objetivo": "Diana terapéutica",
  "escenarios": [                              // ● al menos uno
    {
      "titulo": "Paso 1: combinación doble",   // ●
      "poblacion": "Pediatría",                // opcional; si contiene pedi/niñ/lactante/neonat → escenario pediátrico
      "nota": "...",
      "farmacos": [                            // ● al menos uno
        {
          "nombre": "Ramipril",                // ●
          "ref": "CAR-ramipril",               // id de la ficha; en escenario pediátrico, ficha PED-
          "dosis": "2,5-10 mg",                // ● con unidad (o "dosis_objetivo")
          "via": "VO",                         // ●
          "intervalo": "Cada 24 h",            // ● cada cuánto
          "duracion": "Indefinida",            // ● durante cuánto
          "alternativa": "o enalapril 10-20 mg cada 12-24 h",
          "nota": "...",
          "alternativa": "o empagliflozina 10 mg", // TEXTO (no booleano) que se pinta junto al nombre
          "sin_ficha": true,                   // SOLO si el fármaco aún no tiene ficha (deuda declarada, hallazgo #34)
          "otra_poblacion": true               // SOLO si se enlaza a sabiendas a la ficha de la otra población
        }
      ]
    }
  ],
  "no_farmacologico": ["..."],
  "claves": ["..."],
  "fuente": "Harrison 20.ª ed., cap. ...",    // ●
  "revision": {                                // ● (aviso si falta) — hallazgo #39, REVISION_DOSIS.md
    "fecha": "2026-10-05",
    "fuentes": ["Harrison 20.ª ed.", "Katzung 15.ª ed."],
    "filas": 6, "cotejadas_en_fuente": 5,
    "resultado": "Revisadas las 6 pautas: sin discrepancias."
  }
}
```

El generador del Hub construye el índice inverso `pat_por_farmaco` para que cada ficha de fármaco liste sus patologías.

### 4.3 Integridad referencial

`micro_relacionado` y `farmacos_relacionados` deben apuntar a `id` existentes. `scripts/validar-fichas.js` lo comprueba y **avisa de enlaces unidireccionales** (fármaco que cita a un patógeno que no lo cita de vuelta), para mantener la correlación simétrica.

---

## 5. Taxonomías

### 5.1 Áreas de fármacos (decks)

| Código | Área |
|---|---|
| CAR | Cardiovascular |
| NML | Neumología / vía aérea |
| DIG | Digestivo y hepatología |
| INF | Antiinfecciosos (antibióticos, antifúngicos, antivirales, antiparasitarios) |
| END | Endocrinología y metabolismo |
| NEU | Neurología |
| PSQ | Psiquiatría |
| NFR | Nefrología, diuréticos e hidroelectrolítico |
| HEM | Hematología, anticoagulación y antiagregación |
| REU | Reumatología, analgesia y antiinflamatorios |
| INM | Inmunosupresores, biológicos y vacunas |
| ONC | Oncología (uso clínico general) |
| DER | Dermatología |
| GIN | Ginecología y obstetricia |
| URG | Urgencias, cuidados críticos y toxicología (antídotos) |
| ANE | Anestesia y sedoanalgesia |
| OFT | Oftalmología y ORL |

### 5.2 Grupos de microbiología

| Código | Grupo |
|---|---|
| BGP | Bacterias grampositivas |
| BGN | Bacterias gramnegativas |
| ANA | Anaerobios |
| MYC | Micobacterias |
| ATI | Atípicas, intracelulares y espiroquetas |
| VIR | Virus |
| HON | Hongos |
| PAR | Parásitos |

---

## 6. Criterio de priorización (qué entra y en qué orden)

Cada fármaco/patógeno candidato se clasifica en un nivel. **Se completa un nivel entero antes de bajar al siguiente.**

- **Nivel 1 — Núcleo del clínico general.** Se prescribe/diagnostica en consulta o planta a diario. *Ej.: enalapril, amoxicilina‑clavulánico, omeprazol, metformina, salbutamol, E. coli, S. aureus.* → **Obligatorio.**
- **Nivel 2 — Frecuente con matiz.** Uso habitual pero con manejo especializado o de segunda línea. *Ej.: amiodarona, vancomicina, litio, anfotericina B, P. aeruginosa.* → **Obligatorio.**
- **Nivel 3 — Hospitalario/específico.** El clínico general lo reconoce y vigila, pero rara vez lo inicia. *Ej.: ceftazidima‑avibactam, tacrolimús, biológicos anti‑TNF.* → **Solo tras completar niveles 1‑2 del área.**
- **Nivel 4 — Raro / superespecializado.** *Ej.: antídotos huérfanos, antiparasitarios tropicales de nicho.* → **Se omite** salvo petición explícita, o se cita en una línea dentro de las `perlas` de un fármaco de su clase.

Cada ficha lleva `"nivel": 1|2|3` para que este criterio sea auditable y filtrable en el Hub.

---

## 7. Flujo de trabajo por lote

Un **lote** = un área de fármacos, o un grupo de microbiología, o una tanda pediátrica.

1. Consultar `PROGRESO.md` → tomar el siguiente lote pendiente.
2. Consultar `01_Bibliografia/_indices/` → localizar los capítulos relevantes.
3. Extraer con `grep` dirigido sobre el texto plano cacheado (nunca leer capítulos enteros en contexto).
4. Redactar las fichas del lote **en una sola pasada** (no iterativa) al JSON del área.
5. `node scripts/validar-fichas.js` → corregir todo error de esquema y de integridad referencial.
6. `node scripts/generar-hub-data.js` → regenera `hub/data.js`.
7. `node scripts/exportar-anki.js` → regenera los mazos TSV.
8. Actualizar `PROGRESO.md` y, si hubo hallazgos, `PROCESO_Y_APRENDIZAJE.md`.
9. Pasar al siguiente lote **sin narrar cada paso intermedio**; reportar al cerrar el lote.

---

## 8. Checklist de calidad de una ficha de fármaco

Antes de dar por cerrada una ficha, verificar:

1. ¿La dosis lleva **unidad, frecuencia y vía**? (`"500 mg"` sin más es una ficha incompleta.)
2. ¿El esquema responde a las cuatro preguntas: **con qué empiezo, cómo subo, cuánto dura, cómo lo retiro**?
3. ¿Las interacciones listadas **cambian la conducta**? (Una interacción farmacocinética teórica sin consecuencia clínica no entra.)
4. ¿Los efectos adversos están **separados en frecuentes vs. graves**? El clínico necesita distinguir «avisar al paciente» de «suspender ya».
5. ¿Las `perlas` contienen algo que **no sea deducible de la clase**? Si la perla vale para toda la clase, no es una perla de ese fármaco.
6. ¿Los ajustes **renal y hepático** están explícitos, aunque sea para decir «no precisa»?
7. Si es antiinfeccioso: ¿el `espectro` está redactado como **cobertura clínica utilizable** (qué cubre / qué NO cubre), no como una lista taxonómica?
8. ¿`fuente` cita libro + edición + capítulo?
9. ¿Está libre de referencias a un país (agencia nacional, guía nacional, «en nuestro medio»)? Ver principio 8.

## 8.1 Checklist de calidad de una ficha de patógeno

1. ¿`caracteristicas_clave` permite **distinguirlo de su vecino taxonómico** más parecido?
2. ¿Cada patología incluye **clínica y lesión/cuadro**, no solo el nombre del síndrome?
3. ¿El diagnóstico dice **qué muestra tomar** y no solo qué técnica se usa?
4. ¿El tratamiento distingue **elección vs. alternativa** e incluye **duración** y **resistencias** relevantes?
5. ¿`farmacos_relacionados` apunta a fichas existentes y **esas fichas lo citan de vuelta**?

---

## 9. Flashcards Anki

`scripts/exportar-anki.js` deriva mazos TSV (`pregunta \t respuesta \t Mazo::Submazo`) desde las fichas, siguiendo los principios de tarjeta atómica de `Flashcards_Anki/00_Metodologia/PLAYBOOK_GENERACION_FLASHCARDS.md`. Una tarjeta por atributo relevante y por fármaco (mecanismo, dosis por indicación, interacción crítica, efecto adverso grave, perla), **nunca** una tarjeta con la ficha entera.

Estructura de mazos: `Farmacoterapia::{Área}`, `Farmacoterapia::Pediatría::{Área}`, `Microbiología::{Grupo}`.

---

## 10. Hub

Mismo modelo que el Hub del MIR: **archivos estáticos, sin dependencias externas, datos incrustados en `hub/data.js` como `window.FARMACO_HUB_DATA`** para que funcione abriendo `index.html` con doble clic (`file://`), sin servidor ni CORS.

Vistas:
- **Panel** — cobertura por área y por nivel de prioridad.
- **Patologías** — tratamiento por cuadro clínico: fármaco, dosis, vía, intervalo y duración por escenario, con enlace a la ficha del fármaco y retorno.
- **Vademécum** — fichas de fármaco de adulto, filtrables por área/clase/nivel.
- **Pediatría** — sección propia, mismo motor, datos pediátricos.
- **Microbiología** — fichas de patógeno filtrables por grupo.
- **Correlación** — la vista puente: patógeno → antimicrobianos que lo cubren, y antimicrobiano → patógenos de su espectro.
- **Comparar** — tabla comparativa de fármacos de una misma clase (el uso real: «¿cuál de estos elijo?»).
- Buscador global y tema claro/oscuro/negro, como en el Hub del MIR.

---

## 11. Optimización de tokens

1. No releer un archivo recién escrito en la misma sesión.
2. Delegar a scripts todo lo mecánico: validación, conteos, generación de `data.js`, export a Anki.
3. Indexar antes de leer; `grep` dirigido sobre el texto cacheado, nunca el capítulo entero.
4. Redacción de cada lote en una sola pasada.
5. Reportar al cerrar el lote, no paso a paso.

---

## Glosario

- **Ficha** — unidad mínima de contenido: un fármaco o un patógeno, con su esquema completo de campos.
- **Área** — agrupación de fármacos por especialidad médica; equivale a un «deck».
- **Nivel** — prioridad clínica de la ficha (1 = núcleo del clínico general … 4 = raro, se omite).
- **Correlación** — enlace bidireccional fármaco ↔ patógeno que vertebra la plataforma.
- **Hub** — la aplicación HTML estática que consume `hub/data.js`.
- **Perla** — dato singular de ese fármaco concreto que cambia el manejo y no se deduce de su clase.
