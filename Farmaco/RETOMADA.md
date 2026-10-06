# RETOMADA — dónde seguir en la próxima sesión

**Estado (2026-10-06):** 643 fármacos de adulto, 43 pediátricos, 86 patógenos, **212 patologías** (1.261 pautas revisadas), vista Calculadoras, plataforma sin país. Validador 0 errores / 0 avisos. Todo publicado en GitHub (`Farmaco/hub/`).

## Siguiente tarea
**Bloque F de [PLAN_MEJORAS.md](PLAN_MEJORAS.md)**: ~40-60 patologías del catálogo amplio, por lotes F1-F6 (piel, toxicología, electrolitos, embarazo, endocrino-urología, otros). El usuario pidió continuarlo.

## Cómo trabajar (resumen)
1. Leer `PROGRESO.md`, `PLAN_MEJORAS.md` y el playbook (`00_Metodologia/`); copiar la `clase` de un hermano existente antes de crear fichas.
2. Por lote: fichas en `data/farmacos/F*_*.json` (≥3 fármacos individuales por clase o `clase_unica` justificada; `vs_clase` con `**…**`) → patologías en `data/patologias/F*_*.json` (dosis con unidad, `alternativa` como TEXTO, filas pediátricas en escenarios con `poblacion`, `otra_poblacion: true` si la ficha es de la otra población).
3. Revisión: `pdftotext -enc UTF-8 -layout "01_Bibliografia/Harrison-20°edi.pdf" <scratchpad>/harrison.txt` y lo mismo con Katzung (los .txt NUNCA dentro del repositorio) → `node scripts/herramientas/cotejar-pautas-bibliografia.js . <scratchpad> > informe.json` → revisión clínica línea a línea → añadir `revision` (fecha, fuentes, filas, cotejadas_en_fuente, resultado) → anotar correcciones en `REVISION_DOSIS.md`.
4. Pipeline: `node scripts/sincronizar-correlacion.js && node scripts/validar-fichas.js && node scripts/generar-hub-data.js && node scripts/exportar-anki.js`.
5. Publicar desde `AI Agent/`: `powershell -ExecutionPolicy Bypass -File publicar_github.ps1 "mensaje"`.
6. Actualizar `PROGRESO.md` (tabla y registro), `PLAN_MEJORAS.md` (registro) y `PROCESO_Y_APRENDIZAJE.md` si hay hallazgos.

## Reglas que no se negocian
- Plataforma **sin país** (nada de SUS, Revalida, Brasil, agencias o guías nacionales; EMA/FDA y guías internacionales).
- Contenido en **español**; respuestas al usuario en **portugués**.
- No publicar libros, PDF ni texto extraído de la bibliografía.
