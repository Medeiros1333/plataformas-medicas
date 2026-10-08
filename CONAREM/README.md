# CONAREM Hub (Paraguay)

Plataforma de estudio para el concurso de residencias médicas CONAREM, en el mismo formato que el MIR Hub
(HTML + JS sin dependencias, abre con doble clic en `hub/index.html` o desde GitHub Pages).

## Qué tiene

- **Solo las 5 especialidades troncales** (el examen se divide en ellas): Medicina Interna (Clínica Médica),
  Pediatría, Cirugía General (Clínica Quirúrgica), Ginecología y Obstetricia y Salud Pública.
- Cada troncal está dividida en **contenidos y temas según el edital/temario oficial CONAREM** (Acta 11/2025):
  MI 13 contenidos, PED 12, CIR 10, GO 11, SP 8 (`scripts/taxonomia.js`).
- **Exámenes oficiales del INS** transcritos con su gabarito: troncales 2022, 2024 y 2026 (420 preguntas, todas con
  explicación propia) y subespecialidades 2024 y 2026 (646 preguntas), separadas de las troncales en todo el Hub.
- **Banco por contenido**: troncal → contenido → tema, con la incidencia de cada contenido en el examen.
- **Temario**: por troncal, contenidos ordenados por incidencia (preguntas por año), temas con su frecuencia,
  capítulos de los libros y checklist de los ítems del edital.
- **Simulacro** (examen oficial tal cual, formato CONAREM 2026 o personalizado por contenido), **repaso espaciado**,
  **flashcards**, **calendario** (los contenidos de mayor incidencia primero) y **bibliografía**.

## Incidencia

Incidencia de un contenido = % de las preguntas troncales oficiales (2022, 2024, 2026) del área que cayeron en él.
Alta ≥ 10 %, media 5–10 %, baja < 5 %. Las 420 preguntas troncales se clasificaron automáticamente y luego se
revisaron a mano (`data/clasificacion_manual.json` corrige las que el clasificador erró).

## Libros (uso local)

`scripts/indice-libros.js` lee los marcadores de los PDF de `Área de Trabalho/CONAREM/Bibliografia_CONAREM/Livros`
(Harrison 20ª pt, Schwartz 11ª, Williams Obstetricia 26ª, Williams Gynecology 4ª, Nelson 22ª, Johns Hopkins 6ª) y
guarda capítulo → página en `data/privado/indice_libros.json`. `data/referencias_libros.json` asigna capítulos a cada
tema. Abriendo `hub/index.html` en esta computadora, los capítulos abren el PDF en la página; en GitHub Pages solo se
ve la referencia (libro y capítulo).

## Banco de uso personal (no se publica)

`data/privado/` y `hub/data_privado.js` contienen el banco del SimuResi (~2.600 preguntas extra con explicación
por alternativa y 225 flashcards) y los enlaces a los PDF locales. `publicar_github.ps1` los excluye.

## Cómo regenerar los datos

```
node scripts/parse-transcripciones.js   # data/transcripciones/*.txt -> data/preguntas_oficiales.json
node scripts/importar-externos.js       # SimuResi + CONAFLIX (desde Área de Trabalho/CONAREM)
node scripts/indice-libros.js           # índice de capítulos de los PDF de los libros (requiere pdftohtml)
node scripts/generar-hub-data.js        # clasifica y genera hub/data.js y hub/data_privado.js
```

- Transcripciones: `data/transcripciones/` (formato descrito en `parse-transcripciones.js`). Las preguntas
  con gabarito oficial dudoso llevan una línea `!? X | nota`.
- Explicaciones propias: `data/explicaciones/*.json` (`{ id: { e: texto, r: referencia } }`).
- Clasificación: palabras clave por tema en `scripts/taxonomia.js`, lógica en `scripts/lib-clasificar.js`,
  correcciones en `data/clasificacion_manual.json` (`id: "AREA-CONTENIDO-TEMA"`).

## Pendiente

- Explicaciones propias de las 646 preguntas de subespecialidades (no es el foco).
- Exámenes 2015-2021, 2023 y 2025: el INS no publicó los cuadernillos.
