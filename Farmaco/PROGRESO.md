# PROGRESO — Plataforma de Farmacoterapia y Microbiología

> Estado ejecutivo del proyecto. Una sesión nueva debe poder leer **solo este archivo** y el playbook para saber qué hacer a continuación.

**Última actualización:** 2026-10-06 — **bloque F (catálogo amplio): 255 patologías (~95% del catálogo amplio de ~280 cuadros), 1.479 pautas revisadas**
**Idioma del contenido:** español · **Ámbito:** farmacología general, sin país (principio 8 del playbook)
**Metodología:** `00_Metodologia/PLAYBOOK_CONSTRUCCION_PLATAFORMA_FARMACO.md`

---

## 1. Estado global

| Bloque | Fichas | Estado |
|---|---|---|
| Fármacos (adulto) | **675** | ✅ 635 individuales + 40 «Visión de clase» |
| Fármacos (pediatría) | **43** | ✅ |
| Patógenos (microbiología) | **86** | ✅ (+ Trypanosoma cruzi y Schistosoma) |
| Patologías (tratamiento por cuadro clínico) | **255** | ✅ 1.479 pautas; **0 fármacos sin ficha**; todas con campo `revision` |
| **TOTAL DE CONTENIDO** | **1.059** | ✅ |
| Clases farmacológicas de adulto | **177** | Todas con ≥3 fármacos individuales (10 con `clase_unica` justificada) |
| Fichas con `vs_clase` | **632** | Todas las clases con ≥2 miembros |
| Enlaces de correlación fármaco ↔ patógeno | **441** | Simétricos y validados |
| Vista **Calculadoras** | — | ✅ Función renal (Cockcroft-Gault, CKD-EPI 2021), dosis por peso, interacciones |
| Revisión de pautas | **1.479/1.479** | ✅ 1.213 cotejadas en Harrison/Katzung, 7 correcciones ([REVISION_DOSIS.md](REVISION_DOSIS.md)) |
| Tarjetas Anki generadas | **18 137** en 55 mazos | Automático |
| Cobertura de cuadros del médico general | **213/213** de la lista de referencia; **~95%** del catálogo amplio (~280 cuadros) | Ver hallazgos #41 y #42 |
| Errores / avisos de validación | **0 / 0** | ✔ |

> **Qué significa «completo».** El alcance son los **niveles 1 y 2** (lo que un médico prescribe o ve prescribir de forma habitual) y los cuadros clínicos de **atención primaria y urgencias** de un médico general. Los fármacos de nivel 3 entran solo para completar una clase hasta 3 miembros.

**Reparto por nivel (fichas individuales):** 262 de nivel 1, 302 de nivel 2 y 71 de nivel 3.

> **Ampliaciones de octubre de 2026.** (1) Los 3-5 fármacos más usados de cada clase, con `vs_clase` y lo específico resaltado con `**…**`, y la sección de **patologías**. (2) Regla de **≥3 fármacos individuales por clase** en las 17 áreas, con las fichas agrupadas conservadas como «Visión de clase». (3) **Plan de mejoras para el médico general**: 66 patologías nuevas de atención primaria y urgencias (incluidas enfermedades tropicales como infectología general), revisión de todas las pautas, eliminación de toda referencia a un país y vista de calculadoras.

---

## 2. Cobertura por área

| Área | Fármacos adulto | Pediatría | Patologías |
|---|---|---|---|
| **INF** Antiinfecciosos | 111 | 5 | 48 |
| **CAR** Cardiovascular | 65 | 2 | 17 |
| **END** Endocrinología | 54 | 4 | 17 |
| **DER** Dermatología | 55 | 3 | 23 |
| **REU** Analgesia y antiinflamatorios | 40 | 3 | 16 |
| **DIG** Digestivo | 41 | 5 | 22 |
| **NML** Neumología | 36 | 6 | 10 |
| **HEM** Hematología | 35 | 2 | 6 |
| **PSQ** Psiquiatría | 36 | 2 | 12 |
| **NFR** Nefrología y urología | 36 | 2 | 15 |
| **NEU** Neurología | 30 | 4 | 19 |
| **GIN** Ginecología y obstetricia | 29 | 0 | 17 |
| **INM** Inmunología | 28 | 1 | 4 |
| **OFT** Oftalmología | 25 | 0 | 5 |
| **ONC** Oncología | 23 | 0 | 1 |
| **ANE** Anestesia | 16 | 1 | 0 |
| **URG** Urgencias y toxicología | 15 | 3 | 23 |

## 3. Cobertura por grupo microbiológico

| Grupo | Patógenos |
|---|---|
| **BGN** Gramnegativos | 18 |
| **VIR** Virus | 18 |
| **PAR** Parásitos | 14 |
| **BGP** Grampositivos | 9 |
| **ATI** Atípicas y espiroquetas | 9 |
| **HON** Hongos | 8 |
| **ANA** Anaerobios | 6 |
| **MYC** Micobacterias | 4 |

---

## 4. Qué queda por hacer

El plan de mejoras está completo, incluido el bloque F (catálogo amplio). Lo que sigue es **mantenimiento y uso**:

1. **Usar la plataforma y anotar los huecos.** Cada cuadro clínico que falte se añade con el esquema de `data/patologias/` y su campo `revision`.
2. **Revisión periódica de las áreas que envejecen deprisa**: oncología, diabetes y obesidad, insuficiencia cardiaca, VIH y hepatitis, resistencias antimicrobianas, biológicos e inhibidores de JAK. Al cambiar una pauta, se anota en REVISION_DOSIS.md.
3. **Interacciones de las fichas antiguas.** El verificador de la vista Calculadoras solo encuentra lo que está registrado en las fichas. Ampliar las interacciones de las fichas de la primera fase aumenta su sensibilidad.
4. **Mejoras posibles del Hub**: modo examen y filtro por vía de administración.

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
| 2026-10-05 | **Plan de mejoras A: 66 patologías nuevas** | Urgencias y cardiovascular, digestivo, locomotor y neurología, nefrourología, mujer y embarazo, respiratorio-ORL-ojo, piel, metabolismo y hábitos, infecciones (incluidas dengue, leishmaniasis, Chagas, esquistosomiasis, lepra, COVID-19). 95 fichas nuevas (vacunas del adulto, flebotónicos, PDE-5, anti-IL-17/23, JAK, antiparasitarios tropicales…) y 2 patógenos. 0 filas `sin_ficha` |
| 2026-10-05 | **Plan de mejoras C: neutralidad de país** | 59 textos: epidemiología por regiones, EMA/FDA en vez de agencia nacional, guías internacionales en vez de nacionales; principio 8 del playbook |
| 2026-10-05 | **Plan de mejoras D: vista Calculadoras** | `hub/calculadoras.js`: función renal con ajuste resaltado por fármaco, dosis por peso con alerta de dosis máxima, verificador de interacciones |
| 2026-10-05 | **Plan de mejoras B: revisión de las 966 pautas** | Cotejo automático con Harrison y Katzung + revisión clínica completa; 4 correcciones; campo `revision` en todas las patologías ([REVISION_DOSIS.md](REVISION_DOSIS.md)) |
| 2026-10-06 | **Cierre de lagunas del médico general: 58 patologías** | PCR y TV, secuencia rápida de intubación, intoxicaciones (CO/cianuro, organofosforados, salicilatos, cardiovasculares, etílica), hipotermia y golpe de calor, estado hiperosmolar, neutropenia febril, crisis falciforme, INR alto, epistaxis; cefalea en racimos, Bell, piernas inquietas, temblor esencial, encefalitis; TDAH, dependencia de opioides, TCA, TOC/TEPT; hombro y tendinopatías, espondiloartritis, lupus, túnel carpiano, esguinces, cervicalgia; varicela, Lyme/rickettsiosis, EIP, profilaxis quirúrgica, epididimitis, abscesos; dermatitis de contacto, picaduras, alopecia, pitiriasis versicolor, intertrigo; candidiasis oral, aftas, ojo seco, blefaritis; bronquiectasias, tos crónica; MASLD, hiperprolactinemia, déficit de vitamina D; sangrado uterino, endometriosis, mastitis, aborto farmacológico; enuresis, cólico y reflujo del lactante, profilaxis de hierro y vitamina D, ITU febril infantil. 19 fichas nuevas. 295 pautas revisadas sin discrepancias |
| 2026-10-06 | **Bloque F: catálogo amplio, 43 patologías** | F1 piel (hidradenitis, molusco, queratosis actínica, prurito crónico, quemadura solar, vitíligo, liquen plano, hiperhidrosis); F2 toxicología (serotoninérgico, neuroléptico maligno, distonía aguda, tricíclicos, litio, hierro, cocaína/anfetaminas, serpiente, escorpión); F3 electrolitos (hipocalcemia, hipomagnesemia, hipernatremia, hipofosfatemia/realimentación); F4 embarazo (diabetes gestacional, colestasis gravídica, anemia, fármacos en embarazo y lactancia); F5 endocrino-urología (prediabetes, tiroiditis subaguda, hipogonadismo, prevención de litiasis, ITU recurrente, eyaculación precoz, síndrome premenstrual); F6 otros (CBP, gastroparesia, Raynaud, miocarditis, NVIQ, oportunistas del VIH, hipo, neuralgia del trigémino, HII, urticaria crónica, rinosinusitis crónica). 32 fichas nuevas y 5 clases nuevas (hiperhidrosis, testosterona, sales orales de electrolitos, segunda línea de la CBP, dantroleno con `clase_unica`). 218 pautas revisadas, 3 correcciones |
