# PROGRESO — Plataforma de Farmacoterapia y Microbiología

> Estado ejecutivo del proyecto. Una sesión nueva debe poder leer **solo este archivo** y el playbook para saber qué hacer a continuación.

**Última actualización:** 2026-10-05 — **segunda ampliación: todas las clases de adulto con ≥3 fármacos individuales (529 fichas) y patologías re-enlazadas a las fichas nuevas**
**Idioma del contenido:** español
**Metodología:** `00_Metodologia/PLAYBOOK_CONSTRUCCION_PLATAFORMA_FARMACO.md`

---

## 1. Estado global

| Bloque | Fichas | Objetivo | % | Estado |
|---|---|---|---|---|
| Fármacos (adulto) | **529** | 529 | **100 %** | ✅ COMPLETO (489 individuales + 40 «Visión de clase») |
| Fármacos (pediatría) | **40** | 40 | **100 %** | ✅ COMPLETO |
| Patógenos (microbiología) | **84** | 84 | **100 %** | ✅ COMPLETO |
| Patologías (tratamiento por cuadro clínico) | **88** | 88 | **100 %** | ✅ 521 filas fármaco-pauta; solo 4 sin ficha propia, declaradas |
| **TOTAL DE CONTENIDO** | **741** | **741** | **100 %** | ✅ |
| Infraestructura | — | — | **100 %** | ✅ |
| Clases farmacológicas de adulto | **137** | — | — | **Todas con ≥3 fármacos individuales** (4 con `clase_unica` justificada) |
| Enlaces de correlación fármaco ↔ patógeno | **413** | — | — | Simétricos y validados |
| Fichas con `vs_clase` (qué las distingue dentro de su clase) | **492** | — | — | Todas las clases con ≥2 miembros |
| Tarjetas Anki generadas | **14 175** en 53 mazos | — | — | Automático |
| Errores de validación | **0** | — | — | ✔ |
| Avisos de validación | **0** | — | — | ✔ |
| Enlaces rotos | **0** | — | — | ✔ |

> **Qué significa «completo».** El objetivo de cada área corresponde a la cobertura de **niveles 1 y 2**: lo que un médico prescribe o ve prescribir de forma habitual. Los fármacos de nivel 3 (raros, de prescripción hiperespecializada) quedan FUERA del alcance de forma deliberada. La plataforma está terminada respecto a ese alcance, no respecto al vademécum entero.

**Reparto por nivel (fichas individuales):** 239 de nivel 1, 224 de nivel 2 y 26 de nivel 3. Los de nivel 3 entran solo para completar una clase hasta 3 miembros (p. ej. imipenem entre los carbapenémicos, daunorubicina entre las antraciclinas).

> **Ampliación de octubre de 2026.** Primera fase: los 3-5 fármacos más usados de cada clase que solo tenía un representante (estatinas, IECA, ARA-II, betabloqueantes, ACOD, IBP, ISRS…), cada uno con `vs_clase` y lo específico resaltado con `**…**`, y la sección de **patologías** (`data/patologias/`). Segunda fase: **regla de ≥3 fármacos individuales por clase** aplicada a las 17 áreas (cefalosporinas de 1.ª, 2.ª, 3.ª y 4.ª-5.ª generación por separado, aminoglucósidos, antigripales, platinos, antraciclinas, anti-VEGF, hipotensores oculares…). Las fichas antiguas que agrupaban varios fármacos se conservan como **«Visión de clase»** (`vision_clase: true`) y ya no cuentan como miembro.

---

## 2. Cobertura por área de fármacos

| Área | Adulto | Pediatría | Estado |
|---|---|---|---|
| **INF** Antiinfecciosos | 92 | 5 | ✅ Penicilinas y cefalosporinas por generación, aminoglucósidos, MLS, tetraciclinas, antivíricos (gripe, VIH, VHB, VHC), antifúngicos, antiparasitarios |
| **CAR** Cardiovascular | 58 | 2 | ✅ IC, antiarrítmicos, vasopresores e inotrópicos, nitratos, hipolipemiantes no estatínicos, antihipertensivos de todas las familias |
| **END** Endocrinología | 43 | 3 | ✅ Antidiabéticos orales y todas las insulinas, tiroides y antitiroideos, hueso, vitamina D, corticoides |
| **HEM** Hematología | 32 | 2 | ✅ Anticoagulantes y reversores, fibrinolíticos, vitaminas B, hierro, factores de crecimiento |
| **REU** Analgesia y antiinflamatorios | 32 | 3 | ✅ AINE, coxibs, opioides menores y mayores, hipouricemiantes, FAME |
| **DER** Dermatología | 32 | 3 | ✅ Retinoides, antiacneicos, corticoides tópicos, inmunomoduladores, escabicidas, alopecia |
| **DIG** Digestivo | 31 | 4 | ✅ Laxantes, antidiarreicos, protectores, EII, ácidos biliares, somatostatina |
| **PSQ** Psiquiatría | 28 | 2 | ✅ Antidepresivos, antipsicóticos, litio, hipnóticos, deshabituación |
| **NFR** Nefrología | 27 | 2 | ✅ Diuréticos, quelantes de fósforo y potasio, fluidoterapia, eje de la vasopresina, urología |
| **NML** Neumología | 27 | 5 | ✅ Broncodilatadores, corticoides inhalados, mucolíticos, biológicos del asma, oxígeno |
| **NEU** Neurología | 24 | 4 | ✅ Antiepilépticos, migraña (incluido anti-CGRP), Parkinson, demencia, gabapentinoides |
| **ONC** Oncología | 23 | 0 | ✅ Antimetabolitos, platinos, antraciclinas, inhibidores de checkpoint, hormonoterapia de mama, G-CSF |
| **GIN** Ginecología y obstetricia | 20 | 0 | ✅ Anticoncepción combinada, de gestágeno y de urgencia, uterotónicos, parto pretérmino |
| **OFT** Oftalmología | 17 | 0 | ✅ Hipotensores oculares, anti-VEGF, antiinfecciosos y corticoides, midriáticos |
| **URG** Urgencias y toxicología | 15 | 3 | ✅ Antídotos de receptor y de tóxicos metabólicos |
| **INM** Inmunología | 15 | 1 | ✅ Inmunosupresores, biológicos, inmunoglobulinas, antihistamínicos H1 |
| **ANE** Anestesia | 13 | 1 | ✅ Hipnóticos IV, anestésicos locales, bloqueantes neuromusculares y reversores |

> Las cifras de adulto incluyen las 40 fichas «Visión de clase» (resúmenes comparativos que ya no cuentan como miembro de su clase).

## 3. Cobertura por grupo microbiológico

| Grupo | Patógenos | Estado |
|---|---|---|
| **BGN** Gramnegativos | 18 | ✅ Completo |
| **VIR** Virus | 18 | ✅ Completo |
| **PAR** Parásitos | 12 | ✅ Completo |
| **BGP** Grampositivos | 9 | ✅ Completo |
| **ATI** Atípicas y espiroquetas | 9 | ✅ Completo |
| **HON** Hongos | 8 | ✅ Completo |
| **ANA** Anaerobios | 6 | ✅ Completo |
| **MYC** Micobacterias | 4 | ✅ Completo |

---

## 4. Qué queda por hacer

El contenido previsto está terminado. Lo que sigue no es construcción sino **mantenimiento y uso**:

1. **Fármacos citados en las patologías sin ficha propia** (declarados con `"sin_ficha": true`): de 30 filas quedan **4**: glucosa oral (hipoglucemia), icatibant (angioedema hereditario), corticoides intranasales (rinitis) y salino hipertónico nebulizado (bronquiolitis). Basta con escribir la ficha y sustituir `sin_ficha` por `ref`.
2. **Usar la plataforma y anotar los huecos que aparezcan al estudiarla.** El hallazgo #27 predice dónde estarán: en fichas ya escritas que nombran un fármaco o un patógeno sin ficha propia. Conviene releer las perlas buscando esos nombres.
3. **Revisión clínica de contenido.** 741 fichas escritas de corrido merecen una lectura crítica por áreas, especialmente en dosis y en pautas, contrastándolas con la bibliografía de `01_Bibliografia`.
4. **Actualización periódica.** Hay áreas que envejecen deprisa: oncología (inmunoterapia y terapias dirigidas), diabetes, insuficiencia cardiaca, VIH y hepatitis, y las resistencias antimicrobianas.
5. **Ampliación a nivel 3 si el uso lo pide.** Solo si al estudiar aparecen carencias concretas; no como objetivo en sí mismo.
6. **Mejoras del Hub.** Buscador por interacción, filtro por vía de administración y modo examen son las que más se han echado en falta.

---

## 5. Comandos del pipeline

Ejecutar siempre en este orden tras editar cualquier archivo de `data/`:

```bash
node scripts/sincronizar-correlacion.js   # hace simétrica la correlación fármaco <-> patógeno
node scripts/validar-fichas.js            # 0 errores obligatorio antes de continuar
node scripts/generar-hub-data.js          # regenera hub/data.js
node scripts/exportar-anki.js             # regenera los mazos TSV en anki/
```

Para ver el Hub: abrir `hub/index.html` con doble clic (funciona sin servidor), o `node scripts/servir-hub.js` para acceder desde otro dispositivo de la red local.

---

## 6. Registro de lotes completados

| Fecha | Lote | Contenido |
|---|---|---|
| 2026-09-02 | Infraestructura | Playbook, esquema JSON, validador, sincronizador, generador del Hub, exportador Anki, servidor y aplicación Hub con 6 vistas |
| 2026-09-02 | Índices bibliográficos | 67 capítulos de Katzung y estructura completa de Murray cacheados en `01_Bibliografia/_indices/` |
| 2026-09-02 | INF (3 lotes) | 32 fichas: betalactámicos, otros antibacterianos, micobacterias, hongos, virus y parásitos |
| 2026-09-02 | Microbiología | 54 patógenos en 8 grupos, con correlación bidireccional |
| 2026-09-02 | CAR, REU y pediatría inicial | 21 fichas |
| 2026-09-03 | VIR, INF antivíricos, END, HEM, DIG, DER | 14 patógenos y 33 fármacos |
| 2026-09-03 | NML, URG, NEU, PSQ, NFR y pediatría | 17 adultos y 12 pediátricas |
| 2026-09-03 | Mejoras del validador | Campo `dosis_objetivo`; excepción de correlación para patógenos sin tratamiento etiológico |
| 2026-09-03 | Niveles 2 de las áreas abiertas | 15 fichas: URG, REU, CAR, NEU, PSQ y NFR |
| 2026-09-03 | PAR, HON y sus fármacos | 4 patógenos y 7 fármacos: antipalúdicos, antifúngicos invasivos y terbinafina |
| 2026-09-04 | **Microbiología COMPLETA** | 12 patógenos finales: difteria, Nocardia, botulismo, Actinomyces, Vibrio, micobacterias de crecimiento rápido, Bartonella, norovirus, Histoplasma, Malassezia, Trichomonas y Echinococcus |
| 2026-09-04 | **INM, ONC, GIN, ANE y OFT** | 29 fichas: cinco áreas nuevas abiertas y completadas |
| 2026-09-04 | **Niveles 1-2 restantes de las 12 áreas previas** | 45 fichas: DER, CAR, NEU, PSQ, END, DIG, HEM, URG, NFR, NML, REU e INF |
| 2026-09-04 | **Pediatría COMPLETA** | 20 fichas: antihistamínicos, vitamina D, amoxicilina-clavulánico, nirsevimab, corticoides y permetrina tópicos, macrogol, omeprazol, alprostadil, ibuprofeno del ductus, vitamina K, surfactante, prednisona del nefrótico, vigabatrina, insulina, carbón activado, melatonina, montelukast, ketamina y mupirocina |
| 2026-09-04 | Mejoras del validador | `TIENE_UNIDAD` acepta microgramos, miligramos, viales y ampollas; nueva constante `DOSIS_NO_PONDERAL` para las dosis pediátricas fijas, por franja de edad o por superficie (hallazgos #29 y #30) |
| 2026-10-05 | **Normalización de clases** | 75 fichas reclasificadas para que cada familia comparta exactamente la misma `clase` (antes amikacina y gentamicina, o azitromicina y claritromicina, estaban en clases distintas) |
| 2026-10-05 | **Ampliación por clase: 79 fármacos** | CAR 22, HEM 7, END 9, REU 8, NML 4, DIG 6, NEU 4, PSQ 11, INF 6, NFR 2. Campo `vs_clase` en 185 fichas y resaltado `**…**` de lo específico |
| 2026-10-05 | **Patologías: 88 cuadros clínicos** | Nueva vista del Hub con la pauta por escenario (fármaco, dosis, vía, intervalo, duración), enlace a la ficha y botón de retorno; mazos Anki `Patologías::{Área}` |
| 2026-10-05 | **Regla de ≥3 fármacos por clase: 248 fármacos más** | Las 17 áreas de adulto, por lotes: INF (cefalosporinas por generación, aminoglucósidos, MLS, tetraciclinas, antivíricos, antifúngicos), CAR, NFR, DIG, END, REU, HEM, NEU, PSQ, INM, NML, ANE, URG, DER, GIN, OFT y ONC. 40 fichas agrupadas convertidas en «Visión de clase»; 4 clases con `clase_unica` justificada; taxonomía unificada (p. ej. calcioantagonistas DHP y no DHP en una clase, ACOD y AVK en «Anticoagulante oral») |
| 2026-10-05 | **Patologías re-enlazadas** | 82 filas: 26 que eran `sin_ficha` apuntan ya a su ficha y 56 que apuntaban a una «Visión de clase» apuntan al fármaco concreto (labetalol, gliclazida, bilastina, cefalexina…) |
