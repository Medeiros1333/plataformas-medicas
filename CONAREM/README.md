# CONAREM Hub (Paraguay)

Plataforma de estudio para el concurso de residencias médicas CONAREM, en el mismo formato que el MIR Hub
(HTML + JS sin dependencias, abre con doble clic en `hub/index.html` o desde GitHub Pages).

## Qué tiene

- **Exámenes oficiales del INS** transcritos con su gabarito: troncales 2022, 2024 y 2026 (Bloque I y II) y
  subespecialidades 2024 y 2026 — 1.066 preguntas. Las 420 troncales tienen explicación propia.
- **Simulacro**: rendir un examen oficial tal cual, simulacro nuevo con la distribución CONAREM 2026
  (Bloque I = CIR 30 + MI 30 + SP 20; Bloque II = PED 30 + GO 30) o personalizado, con cronómetro.
- **Repaso espaciado** de las falladas, **flashcards** (preguntas oficiales, puntos clave), **temario oficial**
  2026 con checklist, **calendario** hasta la fecha del examen y **bibliografía** con enlaces.
- Resúmenes de CONAFLIX (Proyecto TOP 10, licencia Apache-2.0).

## Banco de uso personal (no se publica)

`data/privado/` y `hub/data_privado.js` contienen el banco del SimuResi (~2.600 preguntas extra con explicación
por alternativa y 225 flashcards). Solo existen en esta computadora: `publicar_github.ps1` los excluye.
Abriendo `hub/index.html` localmente se ven; en GitHub Pages no.

## Cómo regenerar los datos

```
node scripts/parse-transcripciones.js   # data/transcripciones/*.txt -> data/preguntas_oficiales.json
node scripts/importar-externos.js       # SimuResi + CONAFLIX (desde Área de Trabalho/CONAREM)
node scripts/generar-hub-data.js        # -> hub/data.js y hub/data_privado.js
```

- Transcripciones: `data/transcripciones/` (formato descrito en `parse-transcripciones.js`). Las preguntas
  con gabarito oficial dudoso llevan una línea `!? X | nota`.
- Explicaciones propias: `data/explicaciones/*.json` (`{ id: { e: texto, r: referencia } }`).
- Temario: texto de los PDF oficiales en `data/temario_txt/`.

Los PDF de las provas y de la bibliografía están en `Área de Trabalho/CONAREM/Provas_CONAREM` y
`Bibliografia_CONAREM`.

## Pendiente

- Explicaciones propias de las 646 preguntas de subespecialidades (localmente, 195 de 2024 ya muestran la
  explicación del banco SimuResi).
- Exámenes 2015-2021, 2023 y 2025: el INS no publicó los cuadernillos.
