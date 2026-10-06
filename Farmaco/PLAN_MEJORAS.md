# PLAN DE MEJORAS — de plataforma de estudio a referencia para el médico general

> Encargo (2026-10-05): completar las cuatro mejoras de la evaluación «¿cuán lista está para la práctica de un médico general?». La plataforma es de **farmacología general, sin país**: nada de sistemas sanitarios ni regulación nacional (ver bloque C).
> Estado de cada bloque: ⬜ pendiente · 🔄 en curso · ✅ hecho. Actualizar al cerrar cada lote.

---

## A. Cobertura de patologías de atención primaria y urgencias (88 → 154) ✅

Cada patología sigue el esquema de `data/patologias/` (escenarios con dosis, vía, intervalo y duración; `ref` a la ficha). Todo fármaco nuevo que haga falta se escribe como ficha **y respeta la regla de ≥3 fármacos individuales por clase** (o `clase_unica` justificada).

| Lote | Patologías | Fichas nuevas que exige |
|---|---|---|
| A1 Urgencias y cardiovascular | Ictus isquémico y hemorragia intracerebral · Bradicardia sintomática · Síncope e hipotensión ortostática · Pericarditis aguda · Enfermedad arterial periférica · Insuficiencia venosa crónica · TCE leve · Heridas y profilaxis antitetánica · Mordeduras · Quemaduras · Cuidados paliativos (dolor, disnea, estertores, delirium) | Simpaticomiméticos no catecolamínicos (midodrina, fenilefrina IV, efedrina) · isoprenalina · cilostazol · flebotónicos (diosmina-hesperidina, dobesilato cálcico, rusco) · vacunas del adulto (Td/dTpa, antigripal, antineumocócica, zóster recombinante, antirrábica) · inmunoglobulina antirrábica · antibacterianos y antisépticos tópicos (mupirocina, ácido fusídico, sulfadiazina argéntica) |
| A2 Digestivo | Pancreatitis aguda · Cólico biliar y colecistitis · Diverticulitis · Dispepsia funcional · Síndrome del intestino irritable · Hemorroides y fisura anal · Hepatitis B crónica · Hepatitis C · Cirrosis con ascitis y PBE · Enfermedad de Crohn | Antiespasmódicos (mebeverina, otilonio, aceite de menta) · secretagogos/procinéticos intestinales (linaclotida, prucaloprida, lubiprostona) · albúmina humana · anti-IL-12/23 e IL-23 (ustekinumab, risankizumab, guselkumab) |
| A3 Aparato locomotor y neurología | Lumbalgia (aguda y crónica) · Artrosis · Cefalea tensional · Vértigo (VPPB, neuritis vestibular, Ménière) · Polimialgia reumática · Fibromialgia | Relajantes musculares de acción central (ciclobenzaprina, metocarbamol, tizanidina, baclofeno) · antivertiginosos (betahistina, dimenhidrinato, cinarizina) · duloxetina · AINE tópico (diclofenaco gel) · inhibidores de JAK (tofacitinib, baricitinib, upadacitinib) |
| A4 Nefrourología y electrolitos | Hiperplasia benigna de próstata · Vejiga hiperactiva e incontinencia · Prostatitis aguda · Disfunción eréctil · Hipopotasemia · Hipercalcemia · Lesión renal aguda | Inhibidores de la PDE-5 (sildenafilo, tadalafilo, vardenafilo) · mirabegrón (`clase_unica`) · calcitonina · cloruro potásico oral (en la ficha existente) |
| A5 Mujer y embarazo | Climaterio · Dismenorrea · Vaginosis bacteriana · Anticoncepción (elección y pauta) · Síndrome de ovario poliquístico · Hipertensión en el embarazo y preeclampsia · Bacteriuria e ITU en el embarazo · Náuseas y vómitos del embarazo | Terapia hormonal de la menopausia (estradiol, progesterona micronizada, tibolona) · doxilamina-piridoxina |
| A6 Respiratorio, ORL y ojo | Resfriado común · Bronquitis aguda y tos (incluida tosferina) · Conjuntivitis · Otitis externa · Glaucoma (crónico y cierre angular agudo) · Rinitis alérgica (completar con corticoide intranasal) | Corticoides intranasales (mometasona, fluticasona, budesonida) · descongestionantes (oximetazolina, xilometazolina, pseudoefedrina) · antitusígenos (dextrometorfano, cloperastina, levodropropizina) · antialérgicos oculares (olopatadina, ketotifeno, azelastina) · preparados óticos (ciprofloxacino ótico, ofloxacino ótico, polimixina-neomicina-hidrocortisona) · pilocarpina |
| A7 Piel | Psoriasis · Rosácea · Dermatitis seborreica · Verrugas y condilomas · Pediculosis · Herpes simple orolabial | Análogos tópicos de vitamina D (calcipotriol, calcitriol, tacalcitol) · anti-IL-17 (secukinumab, ixekizumab, bimekizumab) · tópicos de la rosácea (metronidazol, ivermectina, brimonidina) · queratolíticos y antiverrugas (ácido salicílico, podofilotoxina, 5-FU tópico) · ciclopirox |
| A8 Metabolismo y hábitos | Obesidad · Tabaquismo | Antiobesidad no incretínicos (orlistat, naltrexona-bupropión, fentermina-topiramato) · terapia sustitutiva con nicotina · citisina |
| A9 Infecciones | Pie diabético infectado · Osteomielitis y artritis séptica · Endocarditis infecciosa · COVID-19 · Dengue y otras arbovirosis · Leishmaniasis · Enfermedad de Chagas · Esquistosomiasis · Lepra · Parasitosis intestinales · Sífilis en el embarazo y congénita (escenarios nuevos) | Antileishmaniásicos y antitripanosómicos (antimoniato de meglumina, miltefosina, benznidazol, nifurtimox) · antimicobacterianos de segunda línea y antileprosos (dapsona, clofazimina, bedaquilina) · remdesivir |
| A10 Deuda `sin_ficha` | Las 4 filas restantes | Glucosa oral · angioedema hereditario (icatibant, inhibidor de C1, lanadelumab) · corticoides intranasales (A6) · salino hipertónico nebulizado (pediatría) |

## B. Revisión de dosis contra la bibliografía ✅

- Revisar **todas** las pautas de las patologías (las 88 previas y las nuevas) contra Harrison 20.ª ed. y Katzung 15.ª ed. (`01_Bibliografia/`, que NUNCA se publica).
- Cada patología recibe un campo `revision` con fecha, fuentes consultadas (capítulo) y resultado; las discrepancias se corrigen y se anotan en `REVISION_DOSIS.md`.
- El Hub muestra en cada patología «Pauta revisada con: …».

## C. Neutralidad de país (sustituye a la «adaptación a un país») ✅

- Eliminar o generalizar las referencias a un país concreto (≈50: «en España», AEMPS, financiación, receta): las alertas regulatorias pasan a «agencias reguladoras (EMA, FDA)» y la epidemiología local a «regiones con alta resistencia».
- Las dosis siguen referencias internacionales (OMS, guías europeas y norteamericanas, Harrison, Katzung).
- Las enfermedades tropicales del bloque A9 entran como infectología general, no como módulo de un país.

## D. Herramientas clínicas del Hub (nueva vista «Calculadoras») ✅

1. **Función renal**: Cockcroft-Gault (aclaramiento de creatinina) y CKD-EPI 2021 (FGe); con el resultado, lista de los fármacos elegidos con su `ajuste_renal`.
2. **Dosis por peso**: fármaco pediátrico + indicación + peso → dosis por toma y por día, con el tope de dosis máxima de la ficha.
3. **Verificador de interacciones**: elegir varios fármacos → todas las interacciones registradas entre ellos (por nombre, sinónimo, clase o subclase), ordenadas por gravedad, con efecto y manejo.

## E. Cierre ✅

Pipeline completo (0 errores, 0 avisos) · prueba headless del Hub · PROGRESO.md, PROCESO_Y_APRENDIZAJE.md, README y playbook · publicación en GitHub tras cada bloque.

---

## Registro

| Fecha | Lote | Estado |
|---|---|---|
| 2026-10-05 | Plan creado | ✅ |
| 2026-10-05 | A1-A3: urgencias, cardiovascular, digestivo, locomotor y neurología (28 patologías, 38 fichas) | ✅ |
| 2026-10-05 | A4-A7: nefrourología, mujer y embarazo, respiratorio-ORL-ojo, piel (34 patologías, 52 fichas) | ✅ |
| 2026-10-05 | A8-A10: metabolismo y hábitos, infecciones (incluidas tropicales), deuda `sin_ficha` (12 patologías, 17 fichas, 2 patógenos); 0 filas `sin_ficha` | ✅ |
| 2026-10-05 | C: 59 cadenas neutralizadas (epidemiología por regiones, EMA/FDA en lugar de agencia nacional, guías internacionales en lugar de nacionales); principio 8 del playbook | ✅ |
| 2026-10-05 | D: vista «Calculadoras» (hub/calculadoras.js): Cockcroft-Gault (peso real/ideal/ajustado) y CKD-EPI 2021 con resaltado del ajuste renal aplicable; dosis por peso con total diario y alerta de dosis máxima; verificador de interacciones agrupado por par y ordenado por gravedad | ✅ |
| 2026-10-05 | B: 966 pautas revisadas (791 cotejadas en Harrison/Katzung, todas revisadas clínicamente), 4 correcciones, campo `revision` en las 154 patologías y aviso del validador si falta (REVISION_DOSIS.md) | ✅ |
| 2026-10-05 | E: pipeline 0 errores/0 avisos, prueba headless, PROGRESO, PROCESO_Y_APRENDIZAJE (#38-40), README y playbook actualizados; publicado | ✅ |
