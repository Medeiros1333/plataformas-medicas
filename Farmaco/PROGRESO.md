# PROGRESO — Plataforma de Farmacoterapia y Microbiología

> Estado ejecutivo del proyecto. Una sesión nueva debe poder leer **solo este archivo** y el playbook para saber qué hacer a continuación.

**Última actualización:** 2026-10-05 — **ampliación: vista por patología (88 cuadros) y 79 fármacos nuevos con lo que los distingue dentro de su clase**
**Idioma del contenido:** español
**Metodología:** `00_Metodologia/PLAYBOOK_CONSTRUCCION_PLATAFORMA_FARMACO.md`

---

## 1. Estado global

| Bloque | Fichas | Objetivo | % | Estado |
|---|---|---|---|---|
| Fármacos (adulto) | **281** | 281 | **100 %** | ✅ COMPLETO (202 + 79 de la ampliación por clase) |
| Fármacos (pediatría) | **40** | 40 | **100 %** | ✅ COMPLETO |
| Patógenos (microbiología) | **84** | 84 | **100 %** | ✅ COMPLETO |
| Patologías (tratamiento por cuadro clínico) | **88** | 88 | **100 %** | ✅ 521 filas fármaco-pauta; 30 fármacos sin ficha propia, declarados |
| **TOTAL DE CONTENIDO** | **493** | **493** | **100 %** | ✅ |
| Infraestructura | — | — | **100 %** | ✅ |
| Enlaces de correlación fármaco ↔ patógeno | **326** | — | — | Simétricos y validados |
| Fichas con `vs_clase` (qué las distingue dentro de su clase) | **185** | — | — | Todas las clases con ≥2 miembros |
| Tarjetas Anki generadas | **10 304** en 53 mazos | — | — | Automático |
| Errores de validación | **0** | — | — | ✔ |
| Avisos de validación | **0** | — | — | ✔ |
| Enlaces rotos | **0** | — | — | ✔ |

> **Qué significa «completo».** El objetivo de cada área corresponde a la cobertura de **niveles 1 y 2**: lo que un médico prescribe o ve prescribir de forma habitual. Los fármacos de nivel 3 (raros, de prescripción hiperespecializada) quedan FUERA del alcance de forma deliberada. La plataforma está terminada respecto a ese alcance, no respecto al vademécum entero.

**Reparto por nivel:** 169 fichas de nivel 1, 111 de nivel 2 y 1 de nivel 3 (imipenem, incluido para completar la comparación entre carbapenémicos).

> **Ampliación de octubre de 2026.** Se añadieron los 3-5 fármacos más usados de cada clase que solo tenía un representante (estatinas, IECA, ARA-II, betabloqueantes, calcioantagonistas, ACOD, heparinas, GLP-1, insulinas basales, IBP, ISRS, antipsicóticos, benzodiacepinas, triptanes, opioides, quinolonas, carbapenémicos…), cada uno con su campo `vs_clase` y con lo específico resaltado con `**…**`. Y se creó la sección de **patologías** (`data/patologias/`), que enlaza cada fármaco a su ficha.

---

## 2. Cobertura por área de fármacos

| Área | Adulto | Pediatría | Estado |
|---|---|---|---|
| **INF** Antiinfecciosos | 56 | 5 | ✅ Antibacterianos, micobacterias, hongos, virus, antipalúdicos y antiparasitarios |
| **CAR** Cardiovascular | 37 | 2 | ✅ Cuatro pilares de la IC, antiarrítmicos, emergencia hipertensiva, ductus neonatal |
| **END** Endocrinología | 23 | 3 | ✅ Diabetes completa, tiroides, hueso, vitamina D, desmopresina |
| **REU** Analgesia y antiinflamatorios | 20 | 3 | ✅ AINE, opioides, gota, antirreumáticos |
| **HEM** Hematología | 19 | 2 | ✅ Anticoagulación con su reversión, antiagregantes, hematínicos, EPO |
| **URG** Urgencias y toxicología | 12 | 3 | ✅ Antídotos completos: opioides, paracetamol, digital, cianuro, alcoholes, metales |
| **DIG** Digestivo | 17 | 4 | ✅ Ácido, motilidad, intestino, hígado, hipertensión portal |
| **NEU** Neurología | 14 | 4 | ✅ Antiepilépticos, migraña, Parkinson, demencia |
| **PSQ** Psiquiatría | 21 | 2 | ✅ Antidepresivos, antipsicóticos, litio, hipnóticos |
| **DER** Dermatología | 10 | 3 | ✅ Corticoides, antifúngicos, acné, atopia, escabiosis, alopecia |
| **NFR** Nefrología | 11 | 2 | ✅ Diuréticos, electrolitos, nefroprotección, tolvaptán |
| **INM** Inmunología | 8 | 1 | ✅ Inmunosupresores, biológicos, inmunoglobulinas, antihistamínicos |
| **NML** Neumología | 12 | 5 | ✅ Broncodilatadores, corticoides, biológicos, oxígeno, surfactante |
| **ONC** Oncología | 6 | 0 | ✅ Platinos, antraciclinas, fluoropirimidinas, inmunoterapia, hormonoterapia, G-CSF |
| **GIN** Ginecología y obstetricia | 6 | 0 | ✅ Anticoncepción, uterotónicos, preeclampsia, parto pretérmino |
| **ANE** Anestesia | 5 | 1 | ✅ Hipnóticos, relajantes, anestésicos locales, sedación |
| **OFT** Oftalmología | 4 | 0 | ✅ Glaucoma, anti-VEGF, antiinfecciosos y midriáticos |

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

1. **Fármacos citados en las patologías sin ficha propia** (declarados con `"sin_ficha": true`, 30 filas): metildopa, dobutamina, noradrenalina, inhibidores de PCSK9, eritromicina, bismuto cuádruple, plantago, cloruro potásico, glucosa oral e IV, tiamina, yodo (Lugol), fludrocortisona, alteplasa, metilergometrina, carboprost, dupilumab, icatibant, corticoides intranasales, penicilina V, penicilina G sódica, fidaxomicina, anti-CGRP, melatonina de adulto, naltrexona, salino hipertónico nebulizado, tamsulosina y urea. Son la deuda natural del próximo lote (hallazgo #27): basta con escribir la ficha y sustituir `sin_ficha` por `ref`.
2. **Usar la plataforma y anotar los huecos que aparezcan al estudiarla.** El hallazgo #27 predice dónde estarán: en fichas ya escritas que nombran un fármaco o un patógeno sin ficha propia. Conviene releer las perlas buscando esos nombres.
3. **Revisión clínica de contenido.** 493 fichas escritas de corrido merecen una lectura crítica por áreas, especialmente en dosis y en pautas, contrastándolas con la bibliografía de `01_Bibliografia`.
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
