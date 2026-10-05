# EST-05 · Contraste de hipótesis: errores, potencia y diseños de estudio

**Especialidad:** Estadística (EST)
**Fuente:** `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 03 "Contraste de hipótesis", apartado 3.1.
**Peso histórico:** el manual señala que "durante varios años ha sido el tema más importante del bloque de Estadística", aunque en los últimos 5 años no ha sido preguntado directamente — se recomienda dominar los conceptos de error alfa/beta, potencia y significación estadística.

---

## 1. Resumen clínico

### 1.1 Concepto e hipótesis

- Se usa el contraste de hipótesis para determinar si las diferencias/asociaciones observadas en un estudio son **reales** o **fruto del azar**.
- **Hipótesis nula (H0):** no existen diferencias/asociación.
- **Hipótesis alternativa (H1):** sí existen diferencias/asociación (la afirmación que se quiere demostrar).
- **Regla fundamental:** nunca se "acepta" H0 (solo se rechaza o no se rechaza); nunca se "rechaza" H1 (solo se acepta o no se acepta).

### 1.2 Errores del contraste de hipótesis (tabla 2×2 realidad vs. estudio)

| | Realidad: se cumple H1 (A≠B) | Realidad: se cumple H0 (A=B) |
|---|---|---|
| **Estudio ve diferencias (acepta H1)** | Potencia (1-β) — verdadero positivo | **Error tipo I (α)** — falso positivo |
| **Estudio no ve diferencias (no rechaza H0)** | **Error tipo II (β)** — falso negativo | 1-α |

- **Error alfa (tipo I):** el más grave. Rechazar H0 siendo cierta (aceptar diferencias que no existen — "falso positivo"). Su probabilidad es **α**, que define la **significación estadística**, habitualmente **α = 0,05 (5%)**.
- **Valor p:** probabilidad de encontrar las diferencias observadas (o mayores) si en realidad se cumpliera H0. **Si p <0,05 → diferencias estadísticamente significativas → se rechaza H0 y se acepta H1.** Si p >0,05, no se rechaza H0.
- **Error beta (tipo II):** menos grave; no rechazar H0 siendo falsa (no detectar diferencias que sí existen — "falso negativo"). Se es menos exigente con su probabilidad (habitualmente <20%).
- **Potencia (poder estadístico) = 1 - β:** probabilidad de detectar diferencias que realmente existen ("verdadero positivo"). **Se exige potencia ≥80%** (β <20%) para concluir con seguridad que no hay diferencias.
- **α y β son errores aleatorios** (debidos al azar de la inferencia desde la muestra). **A mayor tamaño muestral (n) → mayor potencia, menor β, menor α** — un estudio no significativo (p >0,05) puede alcanzar significación con un tamaño muestral mayor.
- La **magnitud** de las diferencias y el **nivel de significación** obtenido son **independientes** entre sí.

### 1.3 Diseños de contraste de hipótesis

| Diseño | H0 | H1 | Tipo de contraste | Objetivo |
|---|---|---|---|---|
| **Superioridad** | A = B | A ≠ B | Bilateral (2 colas) | Demostrar que A es superior a B, o B superior a A (explora ambos sentidos) |
| **No inferioridad** | A < B (A es inferior) | A no es inferior a B | Unilateral (1 cola) | Demostrar que A no es peor que B, sin buscar superioridad; requiere definir un **límite de no inferioridad (δ)** — habitualmente A debe alcanzar ≥80% del efecto de B |
| **Equivalencia** | A ≉ B (no equivalentes) | A ≈ B (equivalentes) | — | Demostrar similitud entre A y B, dentro de unos límites (habitualmente ±20% del efecto: entre 80-120%). Subtipo: **estudios de bioequivalencia** (para genéricos, en parámetros farmacocinéticos) |

### 1.4 Tamaño muestral en contraste de hipótesis

- Distinto del cálculo en estudios de inferencia (ver [[EST-04]]). Aquí sí interviene la **potencia estadística/error beta** como parámetro necesario (a diferencia del cálculo de tamaño muestral puramente de inferencia).
- Depende también del diseño del estudio (superioridad, no inferioridad, equivalencia) y de si el análisis es de una o dos colas.

---

## 2. Puntos clave para el MIR

1. El error tipo I (alfa) es más grave que el error tipo II (beta); por eso se exige un α más estricto (0,05) que un β (habitualmente <0,20).
2. Un valor de p <0,05 permite rechazar H0 y aceptar H1 (diferencias estadísticamente significativas).
3. La potencia estadística (1-β) es la capacidad de detectar diferencias reales; se exige ≥80% para concluir con seguridad la ausencia de diferencias.
4. A mayor tamaño muestral, mayor potencia y menores α y β.
5. El diseño de superioridad usa un contraste bilateral (dos colas); el de no inferioridad usa un contraste unilateral (una cola).
6. El límite de no inferioridad (delta) suele fijarse de forma que la intervención experimental deba alcanzar al menos el 80% del efecto de la de referencia.
7. Los estudios de equivalencia (incluida la bioequivalencia de genéricos) suelen usar límites del 80-120% del efecto.
8. La magnitud de las diferencias observadas y el nivel de significación estadística son conceptos independientes (una diferencia pequeña puede ser significativa con n grande, y viceversa).
9. Nunca se "acepta" la hipótesis nula; solo se "rechaza" o "no se rechaza".

---

## 3. Preguntas reales

> **Nota de cobertura:** todas las citas MIR de este tema en el manual (múltiples, entre ellas MIR 19-118, MIR 18-25, MIR 16-29, MIR 16-190, MIR 15-190, MIR 14-191, MIR 13-174, MIR 12-173, MIR 11-172, MIR 10-176, MIR 10-179, MIR 10-188) corresponden a convocatorias anteriores a 2020, coherente con la propia advertencia del manual de que "en los últimos 5 años no ha sido preguntado" (referido al periodo 2015-2019 respecto a la fecha de esa edición). La incorporación posterior del dataset de exámenes MIR 2009-2019 sí aportó 16 preguntas reales de Tema 3 (Contraste de hipótesis), añadidas a continuación en orden cronológico — incluida una vinculada a una tabla de datos no disponible en el proyecto (MIR-2016-029), incluida por ser razonablemente autosuficiente.

### MIR-2009-194
Para el empleo de los métodos paramétricos en el análisis estadístico de los datos, la distribución de la variable dependiente debe ser:

A. Emparejada por la edad.
B. Dicotómica.
C. Lineal.
D. Nominal.
E. Normal.

**Respuesta correcta: E** — *(fuente: Examen MIR 2009, pregunta 194)*

### MIR-2009-195
Sobre el error de tipo I cuando se estudian las diferencias entre dos tratamientos:

A. Se llama también riesgo Beta.
B. Su opuesto representa la potencia de la prueba.
C. Lleva a concluir que hay una diferencia, cuando en realidad no la hay.
D. Implica que la hipótesis nula estaba mal planteada.
E. Implica que se debería hacer de nuevo el análisis.

**Respuesta correcta: C** — *(fuente: Examen MIR 2009, pregunta 195)*

### MIR-2010-176
¿Cuál es la interpretación de la significación estadística (valor de la “p”) de una prueba de contraste de hipótesis?

A. La probabilidad de rechazar la hipótesis nula.
B. La probabilidad de aceptar la hipótesis nula.
C. La probabilidad de rechazar la hipótesis nula cuando es cierta.
D. La probabilidad de rechazar la hipótesis nula cuando es falsa.
E. La probabilidad de cometer un error en la decisión.

**Respuesta correcta: C** — *(fuente: Examen MIR 2010, pregunta 176)*

### MIR-2010-179
En un contraste de hipótesis estadístico, la probabilidad de rechazar la hipótesis nula cuando ésta es falsa se denomina:

A. Error tipo II.
B. Error tipo I.
C. Potencia.
D. Eficacia.
E. Eficiencia.

**Respuesta correcta: C** — *(fuente: Examen MIR 2010, pregunta 179)*

### MIR-2010-188
En un ensayo clínico comparativo se establece una hipótesis de no-inferioridad de un fármaco experimental con respecto a un fármaco control activo con un límite de no-inferioridad (límite clínicamente relevante) del −3% en la diferencia de porcentajes de pacientes curados, el cual se considera aceptable y justificado. El porcentaje de pacientes curados al final del estudio resulta ser del 85% con el fármaco experimental y del 84% en el grupo control (diferencia absoluta: +1%; intervalo de confianza al 95% bilateral del −2,9% al +4,9%). Bajo las condiciones del estudio, señale la respuesta correcta:

A. El estudio demuestra la no-inferioridad del fármaco control con respecto al fármaco experimental.
B. El estudio demuestra que el fármaco experimental es superior al fármaco control.
C. El estudio es inconcluyente.
D. El fármaco experimental es no-inferior comparado con el fármaco control.
E. El fármaco experimental y el control son equivalentes.

**Respuesta correcta: D** — *(fuente: Examen MIR 2010, pregunta 188)*

### MIR-2012-174
Las curvas de Kaplan-Meier constituyen un método estadístico en:

A. El análisis de supervivencia.
B. La regresión de Poisson.
C. La regresión lineal.
D. La regresión logística.
E. La determinación de las odds ratios.

**Respuesta correcta: A** — *(fuente: Examen MIR 2012, pregunta 174)*

### MIR-2012-176
El objetivo de una investigación es determinar la probabilidad de sufrir cirrosis hepática en función de la presencia o no de cinco variables: sexo, edad, consumo de alcohol, consumo de drogas y nivel de actividad física. La técnica estadística más adecuada para evaluar el objetivo propuesto es:

A. El cálculo de la matriz de correlación entre los factores.
B. El cálculo de la regresión lineal.
C. El análisis de componentes principales.
D. El cálculo de la regresión logística.
E. La prueba de “ji” cuadrado.

**Respuesta correcta: D** — *(fuente: Examen MIR 2012, pregunta 176)*

### MIR-2014-192
El coeficiente de correlación de Pearson indica que existe asociación estadística entre dos variables cuando:

A. Su valor es positivo.
B. Su valor está entre −1 (menos uno) y 1 (uno)
C. Su valor se aproxima a cero.
D. Su valor es igual o muy similar al tamaño muestral utilizado para su cálculo.
E. Su valor se acerca a sus valores extremos posibles, −1 (menos uno) o 1 (uno).

**Respuesta correcta: E** — *(fuente: Examen MIR 2014, pregunta 192)*

### MIR-2014-204
En un ensayo clínico aleatorizado de fase III se comparó la eficacia de un nuevo analgésico (experimental) con un tratamiento control (tramadol) en pacientes con dolor crónico. La hipótesis de trabajo era que el tratamiento experimental reduce el dolor más que el tramadol. El efecto de los dos tratamientos se determinó a las 48 horas mediante la reducción de la puntuación marcada por el paciente en una escala analógica-visual de 0 a 100 mm. La reducción media en el grupo tramadol fue de −27 y en el grupo experimental de −31. Se hizo el contraste de hipótesis para las diferencias, con la correspondiente prueba estadística y se obtuvo un valor de p = 0,03. Respecto al estudio anterior, ¿cuál de las siguientes conclusiones le parece más correcta?

A. El estudio demostró diferencias clínicamente relevantes.
B. Las diferencias en el efecto analgésico entre los dos tratamientos estudiados fueron significativas.
C. El beneficio-riesgo del tratamiento experimental fue mejor que el del tramadol.
D. El tratamiento experimental fue un 20% mejor que el tramadol.
E. Podemos recomendar el uso generalizado del tratamiento experimental, porque es más eficaz que el tramadol en el tratamiento del dolor crónico.

**Respuesta correcta: B** — *(fuente: Examen MIR 2014, pregunta 204)*

### MIR-2015-186
Algunos trabajos muestran indicios de que existe relación entre la calidad del sueño de las personas y la tendencia a la depresión. Para obtener los anteriores resultados, los investigadores usaron dos cuestionarios distintos, uno sobre la calidad del sueño y otro sobre los síntomas de depresión que asignaban una puntuación a cada paciente en cada uno de ellos. ¿Qué prueba estadística cree usted que utilizaron para contrastar su hipótesis?

A. Prueba “t de Student”.
B. Análisis de regresión logística.
C. Análisis de la varianza.
D. Prueba de “Chi cuadrado”.
E. Coeficiente de correlación.

**Respuesta correcta: E** — *(fuente: Examen MIR 2015, pregunta 186)*

### MIR-2015-190
En un ensayo clínico se evaluó la no-inferioridad del inhalador HDP-MDI (experimental) frente al inhalador FDC-ELIPTUS (control). El límite clínicamente relevante inferior se fijó en -50 ml en el volumen espiratorio forzado en el primer segundo (VEF1). Los resultados mostraron una diferencia absoluta en VEF1 entre tratamientos de +8 mL a favor del inhalador HDP-MDI (intervalo de confianza al 95%: -59 ml a +67 ml). Señale la respuesta CORRECTA:

A. El nuevo inhalador HDP-MDI es superior al inhalador control.
B. El inhalador FDC-ELIPTUS es no-inferior al inhalador experimental.
C. El estudio no es concluyente.
D. Ambos inhaladores son equivalentes.
E. El inhalador HDP-MDI es no-inferior al inhalador control.

**Respuesta correcta: C** — *(fuente: Examen MIR 2015, pregunta 190)*

### MIR-2016-029
Pregunta vinculada a la imagen n.º 29. Un ensayo clínico, publicado en New England Journal of Medicine, estudió el efecto de administrar un tratamiento anticoagulante “puente” subcutáneo con heparina de bajo peso molecular respecto de un placebo en pacientes con tratamiento anticoagulante crónico que estaban programados para una intervención quirúrgica, a los que se interrumpió el anticoagulante oral desde unos días antes de la cirugía hasta las 24 horas postoperatorias. Tanto la heparina como el placebo se administraron por vía subcutánea desde 3 días antes y hasta 24 horas antes de la intervención, y posteriormente, desde los días 5 a 10 postoperatorios. El análisis principal fue para contrastar si el tratamiento con placebo (No bridging) era no inferior a la heparina (Bridging), considerando un margen de no inferioridad del 1% para la diferencia en la aparición de tromboembolismo arterial. Considerando los datos de la tabla adjunta, ¿Cuál de las siguientes afirmaciones es INCORRECTA?

A. Se observó una frecuencia significativamente menor de tromboembolismo arterial en el grupo que recibió tratamiento anticoagulante “puente”.
B. No se observaron diferencias significativas en la mortalidad entre los dos grupos.
C. La administración de tratamiento “puente” con heparina de bajo peso molecular se asoció a una mayor frecuencia de sangrados mayores y menores.
D. Se pudo concluir que el tratamiento con placebo no es inferior en cuanto a la frecuencia de tromboembolismo arterial que la utilización “puente” de heparinas de bajo peso molecular, descartando diferencias superiores a un 1%.

**Respuesta correcta: A** — *(fuente: Examen MIR 2016, pregunta 29)*

> **Nota:** pregunta vinculada a una tabla de datos no disponible en el proyecto (imagen n.º 29); se incluye porque el enunciado y las opciones son razonablemente autosuficientes por coherencia interna — la opción D confirma la no inferioridad del placebo frente a la heparina "puente" en tromboembolismo arterial, lo que descarta lógicamente que la opción A (mayor frecuencia significativa en el grupo "puente") sea también cierta.

### MIR-2017-122
La prueba de “chi cuadrado” se puede utilizar para determinar:

A. El grado de asociación en variables cuantitativas.
B. Comparación de medias en dos muestras.
C. La igualdad de varianzas en dos grupos.
D. El grado de asociación en variables cualitativas.

**Respuesta correcta: D** — *(fuente: Examen MIR 2017, pregunta 122)*

### MIR-2018-214
Se está evaluando la supervivencia de los pacientes infectados por el virus de inmunodeficiencia humana (VIH) en función del momento de adquisición de la infección. ¿Cuál de las siguientes pruebas es la más adecuada para el objetivo propuesto?

A. Prueba t de Student.
B. Cálculo de la regresión lineal.
C. Estimador de Kaplan-Meier.
D. Cálculo de la regresión logística.

**Respuesta correcta: C** — *(fuente: Examen MIR 2018, pregunta 214)*

### MIR-2019-115
¿Cuál de las siguientes afirmaciones sobre los ensayos clínicos es CORRECTA?

A. Los ensayos clínicos de no inferioridad permiten concluir sobre si dos medicamentos son bioequivalentes.
B. Las variables intermedias o subrogadas permiten garantizar que un efecto intermedio se traduce en el efecto final deseado.
C. En el diseño de un ensayo, el nivel de tolerancia con el error de tipo 2 es habitualmente mayor que con el error de tipo 1.
D. El error de tipo 1 puede tener como consecuencia que no se siga investigando un nuevo fármaco que potencialmente sería eficaz.

**Respuesta correcta: C** — *(fuente: Examen MIR 2019, pregunta 115)*

### MIR-2019-118
Un meta-análisis de 9 estudios observacionales retrospectivos de pequeño tamaño muestral en pacientes con tumores cerebrales encuentra un riesgo relativo de hemorragia intracraneal (HIC) en anticoagulados de 2,14 en comparación con los no anticoagulados, con un intervalo de confianza al 95% entre 0,98 y 4,56. La heterogeneidad entre estudios es significativa (I2 >50%). Señale la conclusión más ajustada a la calidad de los datos disponibles y el resultado obtenido:

A. Podemos concluir con un 95% de confianza que la anticoagulación no aumenta el riesgo relativo de HIC en pacientes con tumores cerebrales más allá de un 456%.
B. No podemos descartar que exista un riesgo aumentado de HIC en pacientes anticoagulados con tumores cerebrales.
C. Podemos concluir que existe un riesgo aumentado de HIC en pacientes anticoagulados con tumores cerebrales.
D. Podemos descartar que exista un riesgo aumentado de HIC en pacientes anticoagulados con tumores cerebrales, pudiendo incluso reducirse el riesgo absoluto de HIC con anticoagulación en un 2%.

**Respuesta correcta: B** — *(fuente: Examen MIR 2019, pregunta 118)*

---

## 4. Preguntas inéditas

### EST-05-INED-01
En un ensayo clínico se compara un nuevo antihipertensivo (A) frente al tratamiento estándar (B), obteniéndose un valor de p = 0,03 a favor de una mayor reducción de la presión arterial con A. ¿Cómo debe interpretarse este resultado?

A. Existe un 3% de probabilidad de que el fármaco A sea realmente mejor que B.
B. Existe un 3% de probabilidad de encontrar una diferencia como la observada (o mayor) si en realidad no existiera diferencia entre A y B; al ser menor de 0,05, se rechaza H0 y se considera la diferencia estadísticamente significativa.
C. El fármaco A es un 3% más eficaz que el fármaco B en términos absolutos.
D. Existe una probabilidad del 97% de cometer un error beta.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — el valor p no es la probabilidad de que la hipótesis alternativa sea cierta, sino la probabilidad de los datos observados (o más extremos) bajo el supuesto de que H0 es cierta.
- C: incorrecta — el valor p no cuantifica la magnitud del efecto ni su equivalente en términos absolutos; magnitud del efecto y significación estadística son conceptos independientes.
- D: incorrecta — el valor p se relaciona con el error alfa, no con el error beta.
**Origen:** inédita | **Referencia bibliográfica:** `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 03, apartado 3.1, "Error alfa o tipo I".
**Fecha de generación:** 2026-08-28

### EST-05-INED-02
Un laboratorio quiere demostrar que su nuevo fármaco genérico presenta un perfil farmacocinético comparable al fármaco de referencia, sin pretender demostrar superioridad. ¿Qué tipo de diseño de contraste de hipótesis es el más adecuado, y qué características tiene?

A. Diseño de superioridad, con contraste bilateral y H0 de igualdad.
B. Diseño de no inferioridad, con contraste bilateral.
C. Diseño de equivalencia (bioequivalencia), estableciendo unos límites predefinidos (habitualmente 80-120% del efecto) dentro de los cuales se considera que ambos fármacos son equivalentes.
D. No es posible realizar un contraste de hipótesis en este contexto; solo se puede usar estadística descriptiva.

**Respuesta correcta: C**
**Justificación de incorrectas:**
- A: incorrecta — el diseño de superioridad busca demostrar diferencias en cualquier sentido, no similitud entre dos intervenciones.
- B: incorrecta — el diseño de no inferioridad es unilateral (una cola), no bilateral, y busca demostrar que A no es peor que B, no una equivalencia mutua en ambos sentidos.
- D: incorrecta — sí es posible y necesario realizar un contraste de hipótesis (de equivalencia) para este objetivo.
**Origen:** inédita | **Referencia bibliográfica:** `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 03, apartado 3.1, "Diseño de equivalencia" y "estudios de bioequivalencia".
**Fecha de generación:** 2026-08-28

---

## 5. Flashcards del módulo

```
¿Qué es el error alfa o tipo I?	Rechazar H0 siendo cierta (falso positivo); es el error más grave, con α habitual de 0,05	MIR::EST::Contraste de hipótesis
¿Qué es el error beta o tipo II?	No rechazar H0 siendo falsa (falso negativo); se admite con mayor probabilidad (habitualmente <20%)	MIR::EST::Contraste de hipótesis
¿Qué es la potencia estadística y qué valor mínimo se exige?	La probabilidad de detectar diferencias reales (1-β); se exige al menos el 80%	MIR::EST::Contraste de hipótesis
¿Qué significa un valor de p <0,05?	Que la probabilidad de los datos observados bajo H0 es tan baja que se rechaza H0 y se acepta H1 (diferencia estadísticamente significativa)	MIR::EST::Contraste de hipótesis
¿Qué relación tiene el tamaño muestral con la potencia, α y β?	A mayor n, mayor potencia, menor β y menor α	MIR::EST::Contraste de hipótesis
¿Qué tipo de contraste usa el diseño de superioridad: uni o bilateral?	Bilateral (dos colas)	MIR::EST::Diseños de contraste
¿Qué tipo de contraste usa el diseño de no inferioridad?	Unilateral (una cola)	MIR::EST::Diseños de contraste
¿Qué límite suele exigirse en un diseño de no inferioridad?	Que la intervención experimental alcance al menos el 80% del efecto de la de referencia (delta del 20%)	MIR::EST::Diseños de contraste
¿Qué límites suelen usarse en un estudio de equivalencia/bioequivalencia?	Entre el 80% y el 120% del efecto de referencia	MIR::EST::Diseños de contraste
¿Son independientes la magnitud de las diferencias y el nivel de significación estadística?	Sí	MIR::EST::Contraste de hipótesis
```

---

## 6. Referencias

- `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 03 "Contraste de hipótesis", apartado 3.1.
