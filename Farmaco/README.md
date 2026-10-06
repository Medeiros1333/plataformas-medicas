# Farmaco Hub — Farmacoterapia clínica, pediatría y microbiología

Plataforma de estudio y consulta construida con el mismo modelo que la plataforma [[MIR]]: archivos estáticos, sin dependencias externas y con los datos incrustados, de modo que **funciona abriendo un archivo con doble clic**.

## Cómo usarla

Abre **`hub/index.html`** con doble clic. No hace falta servidor ni conexión a internet.

Para consultarla desde el móvil o la tablet en la misma red:

```bash
node scripts/servir-hub.js
# luego abrir http://<ip-del-ordenador>:8090/hub/index.html
```

## Qué contiene

| Vista | Para qué sirve |
|---|---|
| **Panel** | Cobertura por área y por grupo, y por nivel de prioridad clínica |
| **Patologías** | 154 cuadros de atención primaria y urgencias. Busca el cuadro clínico (o un fármaco) y ve con qué se trata: fármaco, dosis, vía, cada cuántas horas y cuánto tiempo, por línea de tratamiento y población. Cada fármaco abre su ficha completa, que ofrece volver a la patología |
| **Vademécum** | Ficha completa de cada fármaco de adulto (624; **cada clase con al menos 3 fármacos individuales**), con un recuadro de **qué lo distingue dentro de su clase**, los otros fármacos de su clase y las patologías en las que se usa. Las fichas «Visión de clase» resumen y comparan la familia entera |
| **Pediatría** | Sección independiente con los datos propios del niño |
| **Microbiología** | Ficha completa de cada patógeno |
| **Correlación** | Patógeno → antimicrobianos que lo cubren, y antimicrobiano → patógenos de su espectro |
| **Comparar** | Tabla comparativa de hasta 10 fármacos de una misma clase, lado a lado, empezando por lo que distingue a cada uno |
| **Calculadoras** | Función renal (Cockcroft-Gault y CKD-EPI 2021) con el ajuste de cada fármaco del paciente resaltado; dosis por peso con alerta de dosis máxima; verificador de interacciones entre la medicación del paciente |

Buscador global (patología, fármaco o patógeno) y cuatro temas: automático, claro, oscuro y negro.

### Estructura de cada ficha de patología

Cuándo y cómo tratar · objetivo terapéutico · escenarios (líneas de tratamiento, gravedad, población) con una tabla **fármaco · dosis · vía · cada cuánto · duración · nota** · medidas no farmacológicas · claves y errores frecuentes · **revisión de la pauta** (fecha, fuentes y resultado; ver [REVISION_DOSIS.md](REVISION_DOSIS.md)).

### Estructura de cada ficha de fármaco

Clasificación · **qué lo distingue dentro de su clase** (lo específico, además, aparece resaltado en amarillo en el resto de la ficha) · mecanismo de acción · espectro (si es antiinfeccioso) · indicaciones con dosis, posología y vía · **esquema de tratamiento** (con qué se empieza, cómo se titula, cuánto dura, cómo se retira, qué se monitoriza) · farmacocinética con interacciones graduadas por gravedad · efectos adversos separados en frecuentes y graves · contraindicaciones · embarazo y lactancia · **particularidades del fármaco**.

### Estructura de cada ficha de patógeno

Clasificación · morfología y tinción · mecanismos de patogenia · patologías que causa con clínica y lesiones · características clave que lo distinguen · diagnóstico (muestra, pruebas y claves de interpretación) · tratamiento con elección, alternativas, resistencias y duración · fármacos correlacionados.

## Flashcards para Anki

Los mazos se generan automáticamente desde las fichas en `anki/*.tsv`.

Importar en Anki: **Archivo → Importar** → seleccionar el `.tsv` → separador **tabulador** → la 3.ª columna es el mazo de destino.

Estructura: `Farmacoterapia::{Área}`, `Farmacoterapia::Pediatría::{Área}`, `Microbiología::{Grupo}` y `Patologías::{Área}`.

## Estructura del proyecto

```
Farmaco/
├── 00_Metodologia/   Playbook completo de construcción
├── 01_Bibliografia/  Los 3 PDFs fuente + índices cacheados
├── data/             Fuente de verdad (JSON): farmacos/, pediatria/, microbiologia/, patologias/
├── scripts/          Validador, sincronizador, generadores
├── hub/              La aplicación (abrir index.html)
├── anki/             Mazos TSV generados
├── PROGRESO.md       Estado del proyecto y próximos lotes
└── PROCESO_Y_APRENDIZAJE.md   Hallazgos y decisiones de diseño
```

## Para añadir contenido

1. Editar o crear un `.json` en `data/farmacos/`, `data/pediatria/`, `data/microbiologia/` o `data/patologias/` siguiendo el esquema del playbook.
2. Ejecutar el pipeline:

```bash
node scripts/sincronizar-correlacion.js
node scripts/validar-fichas.js       # debe dar 0 errores
node scripts/generar-hub-data.js
node scripts/exportar-anki.js
```

3. Actualizar `PROGRESO.md`.

## Fuentes

- **Katzung**, Farmacología Básica y Clínica, 15.ª ed. — farmacología (fuente primaria)
- **Harrison**, Principios de Medicina Interna, 20.ª ed. — terapéutica por patología
- **Murray**, Microbiología Médica, 9.ª ed. — estructura de la sección de microbiología
- **AMIR** Infecciosas y Microbiología 18.ª ed. y **AMIR** Pediatría — apoyo (del proyecto MIR)

---

⚠️ Herramienta de **estudio**. Verificar siempre la ficha técnica vigente antes de prescribir.
