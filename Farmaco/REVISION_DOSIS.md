# Revisión de las pautas de las patologías

> Bloque B del [plan de mejoras](PLAN_MEJORAS.md). Cada patología lleva un campo `revision` con fecha, fuentes, número de pautas, cuántas se cotejaron literalmente en la bibliografía y el resultado. El Hub lo muestra al pie de cada patología.

## Método (2026-10-05)

1. **Cotejo automático con la bibliografía.** Se extrajo el texto de Harrison 20.ª ed. y Katzung 15.ª ed. (los PDF están en `01_Bibliografia/` y no se publican). Para cada una de las **966 pautas** de las 154 patologías se buscó el nombre del fármaco (con sus variantes en portugués, p. ej. dipirona, norepinefrina, oxacilina) y, en una ventana de ±450 caracteres, la cifra principal de la dosis.
   - **791 pautas**: nombre y cifra aparecen juntos en la fuente (661 en Harrison y 130 en Katzung).
   - **127 pautas**: el fármaco aparece en la fuente, pero sin esa cifra cerca.
   - **48 pautas**: el fármaco no aparece, sobre todo tópicos, flebotónicos, combinaciones y fármacos recientes.
2. **Revisión clínica de las 966 pautas**, línea a línea. Las 175 no cotejadas se revisaron frente a las guías internacionales de referencia: OMS, IDSA, ESC, GINA/GOLD, KDIGO, ACOG/FIGO, AAP y las fichas técnicas de la EMA y la FDA. Las 791 cotejadas se releyeron para detectar errores internos, porque la proximidad de una cifra no garantiza que la pauta sea correcta.

El cotejo automático es solo un indicio. Lo que valida cada pauta es la revisión clínica.

## Correcciones

| Patología | Pauta | Antes | Después | Motivo |
|---|---|---|---|---|
| Crisis hipertensiva (embarazo) | Nifedipino | «Liberación prolongada» 10-20 mg cada 20-30 min | **Liberación inmediata** (tragado, no sublingual) | Solo la forma inmediata permite la titulación cada 20-30 min. |
| Neumonía adquirida en la comunidad (ingreso) | Levofloxacino | 500 mg cada 12 h el 1.er día, después cada 24 h | **750 mg cada 24 h** (o 500 mg cada 12 h el 1.er día) | Pauta de alta dosis estándar. |
| Asma crónica | Fluticasona/salmeterol | 50/250 µg | **250/50 µg** de fluticasona/salmeterol | Orden invertido. |
| Todas (cistitis del varón, celulitis, prostatitis…) | Cotrimoxazol | 800/160 mg en unas filas, 160/800 mg en otras | **160/800 mg** (trimetoprim/sulfametoxazol) | Notación unificada con el nombre del fármaco. |

## Mantenimiento

- **Cada patología nueva** necesita su campo `revision`. El validador avisa si falta.
- **Al cambiar una pauta**, actualizar `revision.fecha` y `revision.resultado`, y anotar el cambio en la tabla de arriba.
- **Para repetir el cotejo automático**, usar `scripts/herramientas/cotejar-pautas-bibliografia.js` (ver PROCESO_Y_APRENDIZAJE.md, hallazgo #39).
