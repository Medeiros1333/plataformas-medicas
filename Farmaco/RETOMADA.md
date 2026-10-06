# RETOMADA — dónde seguir en la próxima sesión

**Estado (2026-10-06):** 675 fármacos de adulto, 43 pediátricos, 86 patógenos, **255 patologías** (1.479 pautas revisadas), vista Calculadoras, plataforma sin país. Validador 0 errores / 0 avisos. Todo publicado en GitHub (`Farmaco/hub/`). **Bloque F completo** (~95% del catálogo amplio).

## Siguiente tarea
Ninguna obligatoria: el plan de mejoras (A-F) está completo. Opciones si el usuario quiere seguir: (1) los ~15 cuadros restantes del catálogo amplio (p. ej. miastenia gravis, esclerosis múltiple, sarcoidosis, vasculitis sistémicas, esclerodermia, síndrome de Sjögren, porfiria); (2) ampliar las interacciones de las fichas antiguas para el verificador; (3) modo examen en el Hub. Ver «Qué queda por hacer» en PROGRESO.md.

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
