# EST-01 · Tipos de estudios epidemiológicos

**Especialidad:** Estadística y Epidemiología (EST)
**Peso histórico:** el "tema estrella" de la asignatura con diferencia — 73 preguntas en el MIR 2014-2024 (el siguiente tema, Medidas en Epidemiología, solo tiene 19). Son preguntas mayoritariamente teóricas o de reconocimiento de diseño a partir de una vignette metodológica, muy rentables porque los conceptos se repiten año tras año casi sin variación.

---

## 1. Resumen clínico

> Nota: en esta asignatura el "resumen clínico" es metodológico, no clínico — se mantiene el nombre de sección por consistencia con el resto de la plataforma.

### 1.1 Clasificación general: base individual vs. comunitaria, con/sin seguimiento

| | Base individual | Base comunitaria (datos agregados/registros) |
|---|---|---|
| Sin seguimiento (mismo momento exposición+enfermedad) | Estudio transversal (prevalencia) | **Estudio ecológico** (correlación ecológica) |
| Seguimiento retrospectivo | Estudio de casos y controles | — |
| Seguimiento prospectivo | Estudio de cohortes | Series/tendencias temporales |

- **Estudio ecológico:** idéntico al transversal pero con base COMUNITARIA (datos agregados por zona geográfica, obtenidos de registros — datos indirectos/secundarios, de peor calidad). Solo genera hipótesis, nunca las demuestra. Ejemplo clásico: relacionar niveles de contaminación por zona geográfica con tasas de un problema de salud por zona (nunca a nivel individual).
- **Estudio de casos y controles:** base individual, seguimiento RETROSPECTIVO (memoria del paciente, un único encuentro). Se seleccionan enfermos (casos) y sanos (controles) y se busca en su pasado la exposición. Calcula PREVALENCIA de exposición, usa **odds ratio (OR)** como medida de asociación (sobreestima el RR salvo en enfermedades raras). Útil para enfermedades raras o de largo periodo de latencia. Más sensible a sesgos, más barato y rápido.
- **Estudio de cohortes:** base individual, seguimiento PROSPECTIVO real (se ve al paciente varias veces). Se sigue a expuestos y no expuestos y se mide la incidencia de enfermedad en cada grupo. Calcula INCIDENCIAS, usa **riesgo relativo (RR)** como medida de asociación — el mejor estimador de causalidad. Útil para exposiciones raras o enfermedades agudas. Menos sensible a sesgos, pero caro, lento y sensible a pérdidas de seguimiento.
- **Estudio de cohortes históricas (retrospectivo):** el seguimiento sigue siendo PROSPECTIVO en dirección (pasado→presente a través de la historia clínica), solo que se reconstruye con datos ya existentes en vez de verse al paciente en tiempo real — el nombre "retrospectivo" es, según la propia bibliografía, "desafortunado". Más barato/rápido pero más sensible a sesgos (datos indirectos).
- **Casos y controles anidado en una cohorte:** variante para enfermedades agudas/epidémicas donde los casos van apareciendo poco a poco; los controles se seleccionan de la cohorte sana a medida que aparece cada caso.

### 1.2 Estudios experimentales (ensayo clínico) y niveles de evidencia

- Requieren intervención activa del investigador + asignación **aleatoria** (si no es aleatoria, son "cuasi-experimentales": ensayo clínico no aleatorizado, estudio de intervención comunitaria).
- **Ensayo de campo:** intervención PREVENTIVA sobre sujetos SANOS. **Ensayo clínico:** intervención TERAPÉUTICA sobre sujetos ENFERMOS.
- Declaración CONSORT para ensayos clínicos aleatorizados; STROBE para estudios observacionales; PRISMA para metaanálisis.
- **Fases del ensayo clínico:**
  - Fase I: voluntarios sanos, farmacocinética/seguridad, muestra pequeña.
  - **Fase II:** grupo REDUCIDO de enfermos (<100), criterios de selección ESTRICTOS (estudios explicativos). Se evalúan datos de **eficacia PRELIMINAR**; la evaluación de seguridad es más difícil (muestra pequeña, efectos adversos infrecuentes con pocas probabilidades de observarse).
  - **Fase III:** grupo AMPLIO de enfermos (>100), criterios de selección LAXOS (estudios pragmáticos, muestra similar a la práctica clínica real). Son los estudios que **DEMUESTRAN** si el tratamiento es útil clínicamente — constituyen la evidencia fundamental para la comercialización. Suelen usar variables "duras" (muerte, infarto, ictus) de mayor relevancia clínica pero menor potencia estadística.
  - **Fase IV (poscomercialización):** el fármaco YA ESTÁ COMERCIALIZADO/APROBADO. Objetivos: estudio de efectividad en práctica clínica real (EPA — estudios postautorización, observacionales, seguimiento prospectivo), búsqueda de nuevas indicaciones, y **farmacovigilancia** (notificación espontánea mediante "tarjeta amarilla" a la AEMPS/FEDRA, para detectar reacciones adversas poco frecuentes que los ensayos previos, con muestra limitada, no pudieron detectar).
- **NNT (número necesario a tratar) = 1/reducción absoluta del riesgo (RAR).** Aunque dos subgrupos tengan la MISMA reducción relativa del riesgo (p. ej., el tratamiento "reduce la mortalidad a la mitad" en ambos), si el riesgo BASAL difiere entre subgrupos, la RAR (y por tanto el NNT) también difiere: a mayor riesgo basal, mayor RAR y menor NNT (tratamiento más "eficiente" en términos absolutos en ese subgrupo) — no se puede concluir "igual eficacia" solo por compartir la misma reducción relativa.

### 1.3 Medidas de frecuencia y de asociación — interpretación

- **Incidencia acumulada = riesgo:** proporción de individuos sanos que enferman en un periodo — es la medida adecuada para estimar el **riesgo individual** de enfermar.
- **Riesgo relativo (RR):** cociente de incidencias (expuestos/no expuestos). Un RR de 0,47 significa que la incidencia en expuestos es el 47% de la incidencia en no expuestos, es decir, una **reducción relativa del riesgo del 53%** (1-0,47=0,53) al pasar de no-exposición a exposición — no debe confundirse con "se reduce un 47%".
- **Falacia o sesgo ecológico:** asumir que una asociación observada a nivel poblacional/agregado (p. ej. en un estudio ecológico) también existe a nivel individual — es un error de inferencia, no un sesgo de medición.

### 1.4 Riesgo de sesgo vs. precisión — no confundir

- El **riesgo de sesgo** de un estudio se valora por errores SISTEMÁTICOS (p. ej. errores de medida/clasificación en las variables principales, sesgos de selección, de confusión) — NO por el tamaño muestral, la amplitud del intervalo de confianza ni la falta de significación estadística, que son cuestiones de **precisión/potencia estadística** (error aleatorio), no de sesgo.
- Aumentar el tamaño muestral (n) aumenta la **potencia estadística** y reduce la probabilidad de error aleatorio (↓α, ↓β) — es decir, mejora la **precisión** (intervalos de confianza más estrechos). NO mejora por sí solo la **representatividad** de la muestra, que depende del método de selección (aleatorización/muestreo), no del tamaño.
- En el forest plot (diagrama de bosque) de una revisión sistemática/metaanálisis: el cuadrado junto a cada estudio representa el **peso** de ese estudio en el metaanálisis global (su tamaño es proporcional al peso, habitualmente relacionado con la precisión/tamaño muestral de cada estudio); la línea horizontal es el intervalo de confianza.

---

## 2. Puntos clave para el MIR

1. Estudio ecológico = base COMUNITARIA con datos agregados; solo genera hipótesis, nunca demuestra causalidad.
2. Casos y controles = seguimiento retrospectivo, calcula OR; cohortes = seguimiento prospectivo (aunque sea "histórico"), calcula RR.
3. Un estudio de cohortes retrospectivo (históricas) SÍ permite calcular RR; el que NO lo permite es el de casos y controles.
4. Fase IV = fármaco YA aprobado/comercializado; sus tres objetivos son efectividad real, nuevas indicaciones y farmacovigilancia.
5. RR=0,47 significa 53% de reducción relativa del riesgo, no 47%.
6. La falacia ecológica es extrapolar una asociación poblacional al nivel individual.
7. El riesgo de sesgo se valora por errores sistemáticos (medida, selección, confusión), no por tamaño muestral ni amplitud del IC (eso es precisión).
8. Aumentar el tamaño muestral mejora la precisión/potencia, no la representatividad de la muestra.
9. En un forest plot, el tamaño del cuadrado representa el peso del estudio en el metaanálisis.
10. La fase II evalúa eficacia PRELIMINAR en un grupo reducido y muy seleccionado; es la fase III la que DEMUESTRA el efecto terapéutico en un grupo amplio con criterios laxos — no confundir cuál de las dos "demuestra" y cuál solo "explora" el efecto.
11. Un mismo % de reducción relativa del riesgo en dos subgrupos NO implica la misma eficacia en términos absolutos (NNT) si el riesgo basal difiere entre ellos — el subgrupo de mayor riesgo basal tendrá menor NNT (tratamiento más eficiente en ese subgrupo).
12. Un estudio de cohortes HISTÓRICAS (retrospectivo) se reconoce porque TANTO la exposición COMO el desenlace ya están registrados en el pasado antes de que el investigador inicie el estudio — si el periodo de observación del desenlace es anterior al año de inicio del estudio, no puede ser un "prospectivo convencional" (que exige seguir a los sujetos hacia el futuro en tiempo real).
13. Las pérdidas en el seguimiento SÍ son un criterio reconocido de riesgo de sesgo (sesgo de atrición, ítem explícito de la herramienta Cochrane) — no deben confundirse con la "falta de representatividad de la muestra", que es un problema de validez EXTERNA (generalización), no de riesgo de sesgo (validez interna).

---

## 3. Preguntas reales

### MIR-2025-29
¿Qué tipo de sesgo se comete cuando se asume que una asociación observada a nivel poblacional también existe a nivel individual?

A. Sesgo o falacia ecológica.
B. Sesgo de atención o efecto Hawthorne.
C. Falacia de Neyman o sesgo de prevalencia o de incidencia.
D. Sesgo de regresión a la media.

**Respuesta correcta: A** — *(fuente: Examen MIR 2025, pregunta 29)*

### MIR-2024-40
La medida adecuada para estimar el riesgo individual de enfermar es:

A. La incidencia acumulada.
B. La densidad de incidencia.
C. La prevalencia puntual.
D. El riesgo relativo.

**Respuesta correcta: A** — *(fuente: Examen MIR 2024, pregunta 40)*

### MIR-2024-45
En un metaanálisis, el riesgo relativo estimado para la asociación causal entre el uso de mascarilla y la incidencia de SARS-CoV-2 fue de 0,47. ¿Cuál es la interpretación correcta de este resultado?

A. La incidencia de SARS-CoV-2 se reduce un 47% cuando la población usa mascarilla.
B. No usar mascarilla aumenta un 53% el riesgo de infección por SARS-CoV-2.
C. El uso de mascarilla podría evitar 47 de cada 100 casos de SARS-CoV-2 que se dan en personas que no la usan.
D. La incidencia de SARS-CoV-2 en la población que no usa mascarilla se reduciría un 53% si la utilizara.

**Respuesta correcta: D** — *(fuente: Examen MIR 2024, pregunta 45)*

### MIR-2022-48
En el diagrama de bosque (forest plot) que muestra los resultados de una revisión sistemática de estudios, el cuadrado que aparece al lado de cada estudio es:

A. El tamaño de cada estudio.
B. El estimador de interés (como el riesgo relativo) de cada estudio.
C. El intervalo de confianza del estimador de interés en cada estudio.
D. El peso de cada estudio cuando se realiza un metaanálisis de dichos estudios.

**Respuesta correcta: D** — *(fuente: Examen MIR 2022, pregunta 48)*

### MIR-2022-49
En la valoración del riesgo de sesgo de un estudio epidemiológico se considera uno de los siguientes criterios:

A. Insuficiente tamaño muestral.
B. La excesiva amplitud del intervalo de confianza del 95 % del principal resultado del estudio.
C. La falta de significación estadística de los resultados.
D. Errores de medida en alguna de las principales variables.

**Respuesta correcta: D** — *(fuente: Examen MIR 2022, pregunta 49; A, B y C son cuestiones de precisión/potencia estadística, no de riesgo de sesgo)*

> **Nota de cobertura y fiabilidad:** se descartaron 6 preguntas candidatas adicionales, todas de 2021-2023 (plantilla provisional + correcciones de prensa), por discrepancias claras con esta misma bibliografía — ver hallazgo #25 en `PROCESO_Y_APRENDIZAJE.md`. Es la mayor concentración de discrepancias detectada hasta ahora en un solo clúster temático. Todos los escenarios se reutilizaron como preguntas inéditas en la sección 4.

### MIR-2020-048
Los ensayos clínicos en fase II tienen como objetivo:

A. La estimación inicial de la seguridad y tolerancia.
B. Demostrar el efecto terapéutico.
C. Obtener información sobre la eficacia.
D. Evaluar la aparición de efectos secundarios.

**Respuesta correcta: B** — *(fuente: Examen MIR 2020, pregunta 48)*

> ⚠️ **Nota de verificación fuerte:** la bibliografía atribuye a la fase II la evaluación de "datos de eficacia PRELIMINARES" (opción C), mientras que es la fase III la que, textualmente, "DEMUESTRA si el nuevo tratamiento va a ser útil para los pacientes... y constituye la evidencia fundamental" — es decir, "demostrar el efecto terapéutico" (clave oficial, B) describe el objetivo característico de la fase III, no de la fase II. No se ha alterado `respuesta_correcta` (se mantiene B), pero se aplica el criterio bibliográfico (fase II = eficacia preliminar; fase III = demostración) en el punto clave 10 de este módulo.

### MIR-2021-046
Un ensayo clínico controlado ha evaluado la eficacia de un nuevo antiagregante en pacientes graves con síndrome coronario agudo. En el grupo de tratamiento convencional (control) la mortalidad fue del 10% en mujeres y del 8% en hombres. En el grupo de intervención con el nuevo antiagregante, la mortalidad se redujo a la mitad del observado en el control tanto en mujeres como en hombres. En relación con la eficacia del nuevo antiagregante para mejorar la supervivencia según el género, señale la respuesta correcta:

A. Es más eficaz en mujeres, porque el valor de NNT estimado en mujeres es inferior al de los hombres.
B. Es más eficaz en hombres, porque el valor de NNT estimado en hombres es superior al de las mujeres.
C. El nuevo antiagregante es igual de eficaz en mujeres y hombres, porque en ambos casos reduce la mortalidad a la mitad.
D. Es más eficaz en hombres, porque el valor de NNT estimado en hombres es inferior al de mujeres.

**Respuesta correcta: A** — *(fuente: Examen MIR 2021, pregunta 46; mujeres: RAR=10%-5%=5%→NNT=20; hombres: RAR=8%-4%=4%→NNT=25 — menor NNT en mujeres pese a la misma reducción relativa (50%) en ambos grupos, coincidiendo con el punto clave 11 de este módulo; pregunta sin discrepancia)*

### MIR-2021-045
En la valoración del riesgo de sesgo en los ensayos clínicos ¿cuál de los siguientes criterios se considera?:

A. Pérdidas en el seguimiento.
B. Falta de representatividad de la muestra.
C. Insuficiente tamaño muestral.
D. Escasa comparabilidad de los casos y controles.

**Respuesta correcta: B**

> ⚠️ **Nota de verificación fuerte:** la bibliografía describe la herramienta Cochrane de valoración del riesgo de sesgo en ensayos clínicos incluidos en metaanálisis, enumerando explícitamente entre sus ítems: *"Que los datos de eventos clínicos que ocurran en el seguimiento NO ESTÉN INCOMPLETOS DEBIDO A PÉRDIDAS EN EL SEGUIMIENTO (evitar sesgos de ATRICIÓN)"* — confirmando la opción A (no elegida) como un criterio de riesgo de sesgo explícitamente reconocido. La "falta de representatividad de la muestra" (clave oficial, B) no figura entre los ítems de esta herramienta ni en ningún otro punto de la bibliografía como criterio de riesgo de sesgo — coherente con la distinción, ya establecida en este mismo módulo (punto clave 7-8), entre riesgo de sesgo (validez interna: errores sistemáticos de selección/información/confusión/atrición) y representatividad (validez externa/generalización, que depende del método de muestreo). No se ha alterado `respuesta_correcta` (se mantiene B), pero se aplica el criterio bibliográfico (pérdidas en el seguimiento = sesgo de atrición) en el punto clave 13 de este módulo.

### MIR-2023-047
Para establecer si la exposición a radiaciones ionizantes de los trabajadores de una mina influye en la aparición de muertes por cáncer de pulmón se decide en el año 2010 realizar un estudio. Los investigadores recopilan información del registro de exposición a radiaciones en la empresa minera, con datos sobre las radiaciones acumuladas por cada trabajador desde el año 1980 al 2000, año en que se cierra la mina. Y también recogen información sobre las muertes por cáncer de pulmón en esos trabajadores desde el año 1980 al año 2008, a partir de los registros de mortalidad existentes. Finalmente, comparan la mortalidad por cáncer de pulmón entre los trabajadores con mayor y menor exposición a las radiaciones ionizantes. ¿Qué tipo de diseño epidemiológico es éste?:

A. Estudio de casos y controles retrospectivo.
B. Estudio de casos y controles prospectivo.
C. Estudio de cohortes retrospectivo.
D. Estudio de cohortes prospectivo.

**Respuesta correcta: D**

> ⚠️ **Nota de verificación fuerte:** el escenario descrito —reconstrucción de la exposición (1980-2000) y del desenlace (muertes hasta 2008) a partir de REGISTROS YA EXISTENTES, con el estudio iniciándose en 2010 cuando ambos periodos ya habían concluido— es la definición exacta que la propia bibliografía de este módulo (§1.1) asigna al **"estudio de cohortes históricas (retrospectivo)"**: reconstruir la cohorte con datos ya existentes en vez de verse al paciente en tiempo real. La bibliografía distingue expresamente esta categoría, por su FUENTE de datos (histórica/registros), de un "estudio de cohortes prospectivo CONVENCIONAL" (clave oficial, D), en el que el investigador define la cohorte en el presente y la sigue hacia el futuro en tiempo real —lo que exigiría que el periodo de observación de desenlaces (aquí, hasta 2008) fuera POSTERIOR al inicio del estudio (2010), y no anterior, como ocurre en este caso—. Dado que este mismo módulo ya usa la etiqueta "cohortes históricas (retrospectivo)" como categoría nombrada y distinta en su propia pregunta inédita EST-01-INED-03, la opción coherente con la terminología de la bibliografía del proyecto es C, no D. Ver hallazgo #144 en `PROCESO_Y_APRENDIZAJE.md`. Se mantiene la clave oficial (D) sin alterar.

### MIR-2021-041 ⚠️
Se realiza un estudio para determinar la posible relación entre la contaminación ambiental por SO2 en diversas zonas geográficas y el número de visitas a urgencias por asma. Sobre el diseño del estudio, señale la respuesta correcta:

A. Estudio de correlación ecológica.
B. Estudio de incidencia.
C. Estudio de prevalencia.
D. Estudio de cohortes.

**Respuesta correcta: C**

> ⚠️ **Nota de verificación fuerte (máxima confianza):** la bibliografía, con cita textual DIRECTA a esta misma pregunta ("MIR 22, 41"), define el estudio ecológico (o de correlación ecológica) como *"un estudio idéntico al estudio transversal, con la única diferencia de tener una base COMUNITARIA en lugar de tener una base individual"*. El enunciado usa explícitamente datos agregados por ZONAS GEOGRÁFICAS (contaminación ambiental) correlacionados con datos agregados (número de visitas a urgencias) — la definición exacta de base comunitaria, no individual. El estudio de prevalencia (clave oficial, C) es de base INDIVIDUAL según la misma bibliografía, incompatible con el diseño descrito. Apoya la opción A. Se mantiene la clave oficial (C) sin alterar, conforme al protocolo de verificación. Ver hallazgo #182 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2021-048 ⚠️
Para conocer si el uso habitual de ácido acetil salicílico (AAS) se asocia a un mayor riesgo de hipertensión se selecciona un grupo de sujetos, se averigua cuántos están tomando AAS y se les sigue durante 5 años para identificar los casos nuevos de hipertensión. ¿Cuál es el diseño de este estudio?:

A. Es un ensayo clínico, porque se realiza con fármacos.
B. Es un estudio ecológico, porque se sigue a muchos sujetos.
C. Es un estudio de casos y controles, en el que los casos toman AAS y los controles no.
D. Es un estudio de cohortes, porque se sigue a sujetos clasificados según su exposición para identificar el riesgo de una enfermedad.

**Respuesta correcta: C**

> ⚠️ **Nota de verificación fuerte (máxima confianza):** la bibliografía, con cita textual DIRECTA a esta misma pregunta ("MIR 22, 48"), define el estudio de cohortes como aquel en el que *"se sigue prospectivamente a dos grupos de individuos sanos... un grupo que está expuesto a un factor de riesgo o protector, y un grupo no expuesto... Se analiza la incidencia de enfermedad que aparece en cada uno de esos dos grupos"* — coincide EXACTAMENTE con el enunciado: selección según exposición (toma o no de AAS) y seguimiento prospectivo de 5 años para identificar casos NUEVOS (incidencia) de hipertensión. Esta es la definición de estudio de cohortes, no de casos y controles (que selecciona sujetos según la presencia/ausencia de la ENFERMEDAD, no de la exposición, y no tiene seguimiento real). Apoya la opción D (cuya propia redacción describe correctamente la definición bibliográfica). Se mantiene la clave oficial (C) sin alterar, conforme al protocolo de verificación. Ver hallazgo #182 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2022-043 ⚠️
Para establecer si el consumo habitual de alimentos ultraprocesados (e.g. embutidos) se asocia a mayor riesgo del síndrome de fragilidad en adultos mayores, se selecciona a 5.000 personas mayores de 70 años que viven en sus domicilios, se les pregunta por su dieta habitual y se identifica el consumo de ultraprocesados en cada uno de ellos. Se realiza un seguimiento durante 3 años para identificar quiénes desarrollan el síndrome de fragilidad por primera vez. Señale la respuesta correcta sobre el diseño de este estudio:

A. Es un estudio de cohortes, porque se sigue a sujetos clasificados según su exposición para identificar el riesgo de un problema de salud.
B. Es un ensayo de campo, porque se realiza con personas que no son pacientes.
C. Es un estudio ecológico, porque incluye a un grupo muy amplio de población.
D. Es un estudio de casos y controles, en el que los casos toman muchos alimentos ultraprocesados y los controles toman muy pocos.

**Respuesta correcta: C**

> ⚠️ **Nota de verificación fuerte (máxima confianza):** mismo patrón que MIR-2021-048 en este módulo. La bibliografía, con cita textual DIRECTA a esta misma pregunta ("MIR 23, 43"), define el estudio de cohortes exactamente como el diseño descrito: selección de 5.000 individuos SEGÚN SU EXPOSICIÓN individual (consumo de ultraprocesados, preguntado a CADA UNO), con seguimiento prospectivo de 3 años para identificar casos nuevos del síndrome de fragilidad. El hecho de que la muestra sea numerosa (5.000 personas) NO convierte el estudio en "ecológico" (clave oficial, C) — el estudio ecológico se define por usar datos AGREGADOS/comunitarios, no por el tamaño de la muestra individual; aquí cada persona es encuestada individualmente sobre su propia dieta. Apoya la opción A (cuya redacción coincide literalmente con la definición bibliográfica de cohortes). Se mantiene la clave oficial (C) sin alterar, conforme al protocolo de verificación. Ver hallazgo #182 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2023-044 ⚠️
¿Qué tipo de estudio epidemiológico NO PERMITE calcular un riesgo relativo?:

A. Un ensayo clínico aleatorizado.
B. Un estudio de cohortes retrospectivo.
C. Un estudio de cohortes prospectivo.
D. Un estudio de casos y controles.

**Respuesta correcta: B**

> ⚠️ **Nota de verificación fuerte (máxima confianza):** la bibliografía es explícita: la tabla comparativa "CASOS Y CONTROLES vs. COHORTES" asigna a los casos y controles el cálculo de "prevalencia de exposición" (medida de asociación: OR), mientras que las cohortes (sin distinguir prospectivas de retrospectivas en este aspecto) "calculan incidencias de enfermedad" (medida de asociación: RR). Además, la bibliografía dedica un apartado específico al estudio de cohortes retrospectivo/históricas, afirmando textualmente que *"sus características son IDÉNTICAS a las del estudio de cohortes convencional, EXCEPTO"* en coste/rapidez/reproducibilidad y sensibilidad a sesgos — el cálculo del RR NO figura entre esas excepciones, por lo que el estudio de cohortes retrospectivo SÍ permite calcular RR, igual que el prospectivo. El único diseño de los cuatro que NO permite calcular RR directamente es el estudio de casos y controles (opción D, que usa OR por su base de muestreo según el desenlace, no según la exposición). Apoya la opción D. Se mantiene la clave oficial (B) sin alterar, conforme al protocolo de verificación. Ver hallazgo #182 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2023-049 ⚠️
Un artículo describe un ensayo clínico aleatorizado en fase IV en una muestra de adultos obtenida de 42 centros sanitarios de 16 países distintos que recibieron un fármaco en estudio y un placebo durante 12 semanas. ¿Cuál de las siguientes afirmaciones describe mejor el contexto de esta investigación atendiendo a estas características?:

A. Al ser una investigación aleatorizada, el número de hombres en cada uno de los grupos experimentales (fármaco o placebo) debe ser el mismo que el de mujeres.
B. El fármaco que se investiga en este ensayo ya se encuentra aprobado para su prescripción en otras indicaciones o situaciones clínicas.
C. Este ensayo clínico trata de analizar en personas sanas y enfermas las dosis terapéuticas de un fármaco experimental en comparación con un placebo.
D. Este tipo de ensayo se denomina metaanálisis al incluir pacientes de distintos centros sanitarios y países.

**Respuesta correcta: D**

> ⚠️ **Nota de verificación fuerte (máxima confianza):** la bibliografía, con cita textual DIRECTA a esta misma pregunta ("MIR 24, 49"), define la fase IV como *"fase poscomercialización... estudios realizados con un fármaco TRAS SU COMERCIALIZACIÓN"*, es decir, tras haber sido ya aprobado — coincidiendo exactamente con la opción B. La opción D confunde de raíz dos conceptos metodológicamente distintos: un ensayo clínico MULTICÉNTRICO (un único estudio con varios centros de reclutamiento, como el descrito) NO es un metaanálisis (que es la síntesis estadística de MÚLTIPLES ESTUDIOS INDEPENDIENTES ya publicados). Apoya la opción B. Se mantiene la clave oficial (D) sin alterar, conforme al protocolo de verificación. Ver hallazgo #182 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2020-045 ⚠️
Para conocer si el consumo habitual de una dieta de tipo mediterráneo se asocia a menor riesgo de infarto de miocardio no fatal se selecciona un grupo de sujetos, se averigua el grado de adherencia a dicha dieta y se les sigue durante 5 años para identificar los casos nuevos de infarto de miocardio. Señale la respuesta correcta sobre el diseño de este estudio:

A. Es un ensayo clínico porque puede orientar la prevención en la clínica.
B. Es un estudio de cohortes, porque se sigue a sujetos clasificados según su exposición para identificar el riesgo de una enfermedad.
C. Es un estudio ecológico porque se sigue a un grupo de sujetos.
D. Es un estudio transversal porque la adherencia a la dieta mediterránea se valora en un momento concreto en el tiempo (al inicio del seguimiento).

**Respuesta correcta: D**

> ⚠️ **Nota de verificación de MÁXIMA confianza (cita como ejemplo de referencia directo a esta misma pregunta):** la bibliografía cita explícitamente "MIR 21, 45" (aplicando el desfase habitual, corresponde a MIR-2020-045) dentro de la lista de referencias del epígrafe "Estudio de cohortes", definido textualmente como *"un estudio observacional de base individual y con seguimiento PROSPECTIVO... consiste en ver al paciente hoy y volverle a ver en sucesivas ocasiones en el futuro"* — una descripción que coincide EXACTAMENTE con el diseño del enunciado (adherencia a la dieta evaluada al inicio + seguimiento de 5 años para identificar casos NUEVOS de infarto). El hecho de medir la exposición en un único momento NO convierte a un estudio con seguimiento posterior en "transversal" — lo que define un estudio transversal es medir EXPOSICIÓN Y DESENLACE simultáneamente, sin seguimiento, cosa que este diseño no hace. Apoya la opción B. Se mantiene la clave oficial (D) sin alterar.

### MIR-2020-046 ⚠️
Un forest plot o diagrama de bosque es:

A. Un tipo de representación gráfica de los resultados (por ejemplo, estimadores de efecto) de un metaanálisis de ensayos clínicos.
B. Un tipo de histograma que se usa en las revisiones sistemáticas de la literatura.
C. Una forma de presentar las modas de una distribución no normal.
D. El diagrama de flujos de los artículos en una revisión de la literatura.

**Respuesta correcta: D**

> ⚠️ **Nota de verificación de MÁXIMA confianza (cita textual DIRECTA a esta misma pregunta):** la bibliografía, junto a la figura del diagrama de bosque, afirma literalmente: *"Figura 4. Diagrama de bosque o forest plot (**MIR 21, 46**). El forest plot es un método de representación gráfica de los resultados de un metaanálisis"* (aplicando el desfase habitual, "MIR 21, 46" corresponde a MIR-2020-046) — coincidiendo EXACTAMENTE, palabra por palabra, con la opción A. La opción D (clave oficial) describe en realidad el diagrama de flujo PRISMA (selección de artículos en una revisión sistemática), un concepto completamente distinto y ya diferenciado en la propia bibliografía. Apoya la opción A. Se mantiene la clave oficial (D) sin alterar.

### MIR-2020-047 ⚠️
Las guías de práctica clínica:

A. Son de obligado cumplimiento para todos los médicos.
B. Todo su contenido ha de estar basado en la evidencia científica.
C. Solo deben tener en cuenta los beneficios de salud de los pacientes (por tanto, no debe considerar el coste de las intervenciones clínicas).
D. Son recomendaciones que el médico debe adaptar a la situación clínica de cada paciente.

**Respuesta correcta: B**

> ⚠️ **Nota de verificación fuerte (correspondencia textual indirecta, sin cita directa a esta pregunta exacta):** la propia bibliografía, al describir los niveles de evidencia científica ABC que sustentan las guías de práctica clínica, incluye explícitamente el **"Consenso de expertos"** como categoría válida del nivel de evidencia C (el más bajo) — es decir, la propia fuente reconoce que no todo el contenido de una guía procede de evidencia científica empírica (estudios), sino que también incorpora opinión/consenso de expertos cuando no hay estudios de mayor calidad, contradiciendo la afirmación absoluta de la opción B ("TODO su contenido"). Es, además, conocimiento estándar y no controvertido de Medicina Basada en la Evidencia que las guías de práctica clínica son recomendaciones orientativas que el médico debe adaptar e individualizar según cada paciente (opción D), no normas de obligado cumplimiento (descartando A) ni limitadas exclusivamente a beneficios sin considerar costes (descartando C, ya que la evaluación económica es parte reconocida del proceso de elaboración de guías). Apoya la opción D. Se mantiene la clave oficial (B) sin alterar.

### MIR-2020-049
¿Cuál de las siguientes enfermedades alcanza mayor letalidad?:

A. Ictus.
B. COVID-19.
C. Infarto agudo de miocardio.
D. Encefalopatía espongiforme bovina.

**Respuesta correcta: D**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte, hecho epidemiológico estándar y no controvertido) — las enfermedades priónicas (como la variante humana asociada a la encefalopatía espongiforme bovina) tienen una letalidad/mortalidad case-fatality cercana al 100%, muy superior a la del ictus, el IAM o la COVID-19 (todas con letalidades de un solo dígito o bajas decenas en la mayoría de contextos). Coincide con la clave oficial. Sin discrepancia.

### MIR-2020-182
Una recomendación de clase I en una guía de práctica clínica significa que:

A. Está basada en evidencias científicas procedentes de ensayos clínicos.
B. Hay evidencia o acuerdo de que seguir la recomendación tiene más beneficios que perjuicios para los pacientes.
C. Todos los pacientes en que se siga la recomendación van a mejorar su nivel de salud.
D. Que la intervención recomendada tiene alto coste.

**Respuesta correcta: B** — *(fuente: Examen MIR 2020, pregunta 182, citada directamente en la bibliografía como "MIR 21, 182")*

> **Nota de cobertura:** confirmación LIMPIA con cita directa y correspondencia literal — la bibliografía define la Clase I textualmente como *"hay consenso general y/o evidencia científica sobre el beneficio de la actitud... 'está recomendada/indicada'"*, coincidiendo con la clave oficial B. Sin discrepancia.

### MIR-2021-043 ⚠️
En un meta-análisis, el estimador combinado de los resultados de los estudios revisados es:

A. La suma de los resultados de todos los estudios.
B. La media aritmética de los resultados de todos los estudios.
C. La media ponderada de los resultados de todos los estudios.
D. El porcentaje de resultados favorables a la hipótesis estudiada en todos los estudios.

**Respuesta correcta: D**

> ⚠️ **Nota de verificación de MÁXIMA confianza (cita textual DIRECTA a esta misma pregunta):** la bibliografía afirma literalmente: *"Para combinar los estudios y obtener el resultado agrupado global del metaanálisis, se calcula la **media** del resultado de los estudios individuales, **ponderados** según el tamaño muestral, la dispersión y la calidad de los mismos (**MIR 22, 43**)"* (aplicando el desfase habitual, "MIR 22, 43" corresponde a MIR-2021-043) — coincidiendo EXACTAMENTE con la opción C ("la media ponderada"), no con la D (clave oficial), que describe un concepto ajeno a la metodología estándar de meta-análisis (no existe tal "porcentaje de resultados favorables" como estimador combinado; eso se aproximaría al método de "recuento de votos", una técnica obsoleta y desaconsejada). Apoya la opción C. Se mantiene la clave oficial (D) sin alterar.

### MIR-2021-049
¿Cuál es la mejor forma de medir la carga global de enfermedad en una población?:

A. Los años vividos con discapacidad.
B. Los años de vida perdidos por muerte prematura.
C. La mortalidad general y por las principales enfermedades.
D. Los años de vida ajustados por discapacidad.

**Respuesta correcta: D**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte, indicador estándar internacional de la OMS) — los DALY (años de vida ajustados por discapacidad) son la métrica de referencia mundial para medir la carga global de enfermedad, al combinar en una sola medida tanto los años perdidos por muerte prematura como los años vividos con discapacidad (A y B son, cada uno, solo un componente parcial de los DALY). Coincide con la clave oficial. Sin discrepancia.

### MIR-2022-046
El motivo por el que una intervención tiene un grado de recomendación "fuerte" en una guía de práctica clínica es que:

A. Tiene más beneficios que riesgos.
B. Está basada en un alto nivel de evidencia.
C. Tiene un bajo coste.
D. Es la preferida por los pacientes.

**Respuesta correcta: A**

> **Nota de cobertura:** confirmación LIMPIA con correspondencia textual — la bibliografía distingue explícitamente dos dimensiones independientes de una guía de práctica clínica: el **nivel de evidencia** (indica la calidad de los estudios en que se basa la recomendación) y la **clase/fuerza de recomendación** (se refiere al nivel de consenso para indicar o contraindicar una actitud, "en función de su relación beneficio/riesgo") — confirmando que la fuerza de la recomendación depende del balance beneficio/riesgo (opción A), no directamente del nivel de evidencia (opción B, un concepto relacionado pero formalmente distinto). Coincide con la clave oficial. Sin discrepancia.

### MIR-2022-052 ⚠️
Un ensayo clínico en el cual los participantes se asignan por azar a una de varias intervenciones clínicas se conoce como:

A. Ensayo doble ciego.
B. Ensayo controlado no aleatorizado.
C. Ensayo controlado aleatorizado.
D. Ensayo de superioridad.

**Respuesta correcta: B**

> ⚠️ **Nota de verificación de MÁXIMA confianza (cita textual DIRECTA a esta misma pregunta, contradicción lógica evidente en el propio enunciado):** la bibliografía describe los estudios "experimentales" afirmando textualmente: *"La asignación de intervención o no intervención a cada individuo se realiza de manera aleatoria, de modo que es el azar el que forma los distintos grupos [...] que se van a comparar entre sí (**MIR 23, 52**)"* (aplicando el desfase habitual, "MIR 23, 52" corresponde a MIR-2022-052) — es decir, la propia bibliografía usa esta pregunta como ejemplo de referencia de un ensayo **aleatorizado**. Además, el propio enunciado de la pregunta describe literalmente la asignación "por azar", lo cual es, por definición, la aleatorización — la clave oficial (B, "ensayo controlado NO aleatorizado") contradice frontal y literalmente el propio texto de la pregunta, que describe una asignación aleatoria. Apoya la opción C. Se mantiene la clave oficial (B) sin alterar — una de las discrepancias con mayor evidencia interna (contradicción directa dentro del propio enunciado) detectada en todo el proyecto.

### MIR-2024-042
En evaluación económica de intervenciones sanitarias, un estudio que compare los costes alternativos de dos intervenciones frente a sus resultados de salud expresados en años ajustados por calidad o años de vida ajustados por discapacidad se denomina:

A. Análisis coste-beneficio.
B. Análisis coste-efectividad.
C. Análisis coste-utilidad.
D. Análisis de minimización de costes.

**Respuesta correcta: C**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte, concepto estándar de economía de la salud) — el análisis coste-utilidad es, por definición, aquel que mide los resultados de salud en unidades que combinan cantidad Y calidad de vida (QALY/AVAC o DALY), a diferencia del coste-efectividad (unidades clínicas naturales, p. ej. años de vida ganados, sin ajuste por calidad) o el coste-beneficio (resultados monetizados). Coincide con la clave oficial. Sin discrepancia.

> **Nota de cobertura y fiabilidad del módulo (actualizada):** con estas 10 preguntas se eleva a 24 preguntas reales, **10 discrepancias de MÁXIMA/alta confianza** (9 de ellas con cita bibliográfica textual directa, varias con el propio número de pregunta citado explícitamente en la fuente — una de las mayores concentraciones de discrepancias verificadas con precisión del proyecto), 14 limpias.

> **Nota de cobertura (dataset 2009-2019):** la incorporación del dataset de exámenes MIR 2009-2019 aportó 54 preguntas reales adicionales de Tema 7 (Tipos de estudios epidemiológicos, el tema más preguntado de la asignatura), añadidas a continuación en orden cronológico — con estas 54 preguntas se eleva a 78 preguntas reales en el módulo, con diferencia el mayor bloque de preguntas reales de toda la especialidad EST.

### MIR-2009-196
¿Qué es un metaanálisis?

A. Es una manera de analizar los datos de un estudio.
B. Es una manera de agrupar estudios heterogéneos.
C. Es un tipo de revisión narrativa.
D. Es una manera sistemática de agrupar los resultados de diversos estudios.
E. Es una manera de hacer búsquedas bibliográficas.

**Respuesta correcta: D** — *(fuente: Examen MIR 2009, pregunta 196)*

### MIR-2009-198
En investigación clínica el diseño que mejor evalúa el efecto de los fármacos en el ser humano es:

A. Estudio observacional prospectivo.
B. Estudio observacional retrospectivo.
C. Ensayo clínico aleatorizado controlado prospectivo.
D. Ensayo clínico aleatorizado controlado retrospectivo.
E. Ensayo clínico con control histórico.

**Respuesta correcta: C** — *(fuente: Examen MIR 2009, pregunta 198)*

### MIR-2009-202
¿Cuál de las siguientes características es propia de las fases precoces de la investigación con un nuevo fármaco?

A. Se prioriza la validez externa de los estudios.
B. Se incluyen pacientes parecidos a la población susceptible de recibir el fármaco.
C. Se miden parámetros farmacodinámicos o variables intermedias.
D. La duración de los estudios es más larga que en fases avanzadas.
E. No se restringe el número de pacientes incluidos.

**Respuesta correcta: C** — *(fuente: Examen MIR 2009, pregunta 202)*

### MIR-2009-208
Los ensayos clínicos de diseño cruzado:

A. Reclutan un número de pacientes superior al de un diseño paralelo con objetivo similar.
B. Todos los pacientes reciben todos los tratamientos estudiados.
C. No emplean placebo.
D. No requieren consentimiento informado del sujeto.
E. No suelen incluir periodos de lavado.

**Respuesta correcta: B** — *(fuente: Examen MIR 2009, pregunta 208)*

### MIR-2009-214
Deseamos investigar la hipótesis de que los fármacos antirretrovirales que se administran durante el embarazo para prevenir la transmisión vertical del VIH pueden afectar negativamente el aprendizaje en los niños expuestos intraútero a estos fármacos, independientemente de que estos niños resulten o no infectados por el VIH. De entre los siguientes diseños de estudios, ¿cuál es el más adecuado?

A. Un ensayo clínico, que compare la prevalencia de retraso psicomotor en recién nacidos cuyas madres recibieron tratamiento antirretroviral en el embarazo, y en recién nacidos cuyas madres recibieron placebo.
B. Un estudio de cohortes, que compare la incidencia de retraso psicomotor en dos grupos de niños: uno de ellos infectado por el VIH y el otro grupo no infectado.
C. Un estudio de cohortes, que compare la prevalencia de retraso psicomotor en niños infectados por el VIH entre aquellos que fueron expuestos intraútero a antirretrovirales y los que no lo fueron.
D. Un estudio de cohortes, que mida la incidencia de retraso psicomotor en niños no infectados por el VIH, hijos de madres seropositivas, y estudie su asociación con la exposición intraútero a antirretrovirales.
E. Un estudio de casos y controles, en el que se seleccionan como casos niños con retraso psicomotor y como controles niños no expuestos intraútero a antirretrovirales.

**Respuesta correcta: D** — *(fuente: Examen MIR 2009, pregunta 214)*

### MIR-2009-218
¿Cuál de las siguientes afirmaciones es FALSA sobre los estudios transversales?

A. Sólo tienen como finalidad estimar la prevalencia de una determinada variable.
B. Los estudios transversales utilizan técnicas estadísticas descriptivas y analíticas.
C. A veces se utilizan para investigar la asociación de una determinada exposición y una enfermedad.
D. En los estudios transversales analíticos la medición de la exposición y la enfermedad se realiza simultáneamente.
E. Los estudios transversales descriptivos tienen como finalidad estimar la frecuencia de una variable de interés en una determinada población en un momento concreto.

**Respuesta correcta: A** — *(fuente: Examen MIR 2009, pregunta 218)*

### MIR-2010-131
¿Qué significa la práctica de la medicina basada en la evidencia?

A. La aplicación de los resultados de los ensayos clínicos a la práctica clínica.
B. Que todas las decisiones médicas están fundamentadas en evidencias científicas de calidad.
C. La integración de la maestría clínica individual con las mejores evidencias científicas disponibles.
D. Que debe rechazarse la información que no procede de ensayos clínicos o metaanálisis.
E. La búsqueda de las mejores respuestas para las preguntas que surgen en la práctica clínica diaria.

**Respuesta correcta: C** — *(fuente: Examen MIR 2010, pregunta 131)*

### MIR-2010-180
En 1962 unos investigadores de la Universidad de Harvard identificaron a 16.936 graduados de dicha universidad a los que se les solicitó la cumplimentación de un cuestionario sobre la actividad física y otros factores de riesgo cardiovasculares, también recogieron datos a partir de los registros de la universidad. 10 años más tarde se envió un cuestionario de seguimiento sobre la arteriopatía coronaria y se recogieron datos sobre esta enfermedad a partir de los registros de defunción. ¿Cuál es el tipo de diseño de estudio empleado?

A. Estudio Transversal o de prevalencia.
B. Estudio de cohortes.
C. Estudio de casos y controles.
D. Ensayo clínico.
E. Estudio ecológico.

**Respuesta correcta: B** — *(fuente: Examen MIR 2010, pregunta 180)*

### MIR-2010-182
Los estudios epidemiológicos de tipo corte transversal son los más apropiados para:

A. Realizar inferencias causales sobre la relación entre la exposición a un factor y la enfermedad.
B. Estimar la incidencia real de una enfermedad a partir de un muestreo aleatorio.
C. Estimar la prevalencia de una enfermedad crónica.
D. Diferenciar entre factores etiológicos y factores pronósticos de la enfermedad.
E. Diferenciar entre casos incidentes y casos prevalentes de la enfermedad.

**Respuesta correcta: C** — *(fuente: Examen MIR 2010, pregunta 182)*

### MIR-2010-183
En un estudio un pediatra seleccionó 30 niños que habían presentado el Síndrome de Reye y otros 60 pacientes que sufrieron enfermedades víricas de carácter más leves. Se interrogó a los padres sobre el consumo de ácido acetilsalicílico en los niños. ¿Cuál es el tipo de diseño de estudio empleado?

A. Estudio Transversal o de prevalencia.
B. Estudio de cohortes.
C. Estudio de casos y controles.
D. Ensayo clínico.
E. Estudio ecológico.

**Respuesta correcta: C** — *(fuente: Examen MIR 2010, pregunta 183)*

### MIR-2010-187
En un ensayo clínico aleatorizado, controlado y con diseño doble-ciego se han administrado dosis crecientes de 10 mg, 20 mg, 50 mg y 100 mg de un nuevo fármaco en un total de 60 pacientes (15 pacientes por cada grupo de dosis), con el fin de establecer la relación entre la eficacia y toxicidad del nuevo fármaco. Además, se ha incluido un grupo control con 15 pacientes. Señale la respuesta correcta:

A. Se trata de un estudio Fase I.
B. Se trata de un estudio Fase IIa.
C. Se trata de un estudio Fase IIb.
D. Se trata de un estudio Fase III.
E. Se trata de un estudio Fase IV.

**Respuesta correcta: C** — *(fuente: Examen MIR 2010, pregunta 187)*

### MIR-2010-192
Con respecto a los ensayos clínicos necesarios para el registro de medicamentos, señale la afirmación INCORRECTA:

A. Los fase III, también llamados confirmatorios, intentan proporcionar una base adecuada para la evaluación del beneficio/riesgo que apoye el registro del medicamento.
B. Se diseñan específicamente para evaluar la efectividad del tratamiento a estudio.
C. No permiten detectar acontecimientos adversos poco frecuentes.
D. No siempre se pueden extrapolar sus resultados a la población general.
E. La asignación aleatoria evita sesgos y permite tener confianza en que las diferencias encontradas entre los grupos se deben al tratamiento recibido.

**Respuesta correcta: B** — *(fuente: Examen MIR 2010, pregunta 192)*

### MIR-2010-198
¿En qué tipo de evaluación económica se evalúan los resultados clínicos a través de los años de vida ganados?

A. Análisis coste-efectividad.
B. Análisis coste-utilidad.
C. Análisis coste-beneficio.
D. Análisis coste-consecuencia.
E. Estudios de coste de la enfermedad.

**Respuesta correcta: A** — *(fuente: Examen MIR 2010, pregunta 198)*

### MIR-2011-179
Se diseña un estudio para evaluar el efecto sobre la salud de la exposición a los teléfonos móviles en el que durante 10 años se sigue a una población inicialmente sana. ¿Qué tipo de diseño tiene este estudio?

A. Estudio de casos y controles.
B. Estudio de cohortes.
C. Estudio transversal.
D. Serie de casos.
E. Ensayo controlado.

**Respuesta correcta: B** — *(fuente: Examen MIR 2011, pregunta 179)*

### MIR-2011-180
En un estudio de seguimiento de 25.000 trabajadores durante 8 años se han encontrado 250 casos de una enfermedad. Queremos usar estos datos para analizar asociación de esta enfermedad con cierta predisposición genética cuyo diagnóstico es muy caro y no podemos realizarlo a todo el grupo de trabajadores sólo a 500 de ellos. El diseño que sería conveniente usar en este caso es:

A. Estudio transversal o de corte.
B. Estudio de cohortes.
C. Estudio de casos y controles anidado.
D. Estudio experimental.
E. Estudio ecológico.

**Respuesta correcta: C** — *(fuente: Examen MIR 2011, pregunta 180)*

### MIR-2011-183
Si desea leer críticamente un artículo sobre un ensayo clínico aleatorizado empleará la declaración:

A. CONSORT.
B. QUOROM.
C. PRISMA.
D. STROBE.
E. STARD.

**Respuesta correcta: A** — *(fuente: Examen MIR 2011, pregunta 183)*

### MIR-2011-194
La eficiencia de una intervención o programa sanitario, viene definida por:

A. El cociente riesgo/beneficio.
B. El beneficio neto obtenido.
C. La relación entre los costes empleados y los resultados clínicos obtenidos.
D. La diferencia entre los costes necesarios para evitar los riesgos y los costes intrínsecos para obtener los beneficios terapéuticos.
E. El cociente entre los costes médicos directos y el grado de calidad de vida resultante de emplear cada alternativa terapéutica evaluada.

**Respuesta correcta: C** — *(fuente: Examen MIR 2011, pregunta 194)*

### MIR-2011-195
Respecto al metaanálisis de ensayos clínicos señale la respuesta CORRECTA:

A. La heterogeneidad de los estudios incluidos potencia la precisión y exactitud de los resultados agregados.
B. El sesgo de publicación consiste en publicar los estudios negativos para perjudicar a los promotores de los mismos.
C. Cuando los resultados de los ensayos son homogéneos es apropiado aplicar un modelo de efectos fijos.
D. Con los modelos de efectos aleatorios (al azar) los intervalos de confianza son más estrechos que con los modelos de efectos fijos.
E. Permite generar un estimador del efecto con intervalos de confianza habitualmente más amplios que los de cada estudio por separado.

**Respuesta correcta: C** — *(fuente: Examen MIR 2011, pregunta 195)*

### MIR-2012-178
¿Cuál de los siguientes diseños es un diseño experimental?

A. Estudio de casos y controles.
B. Estudio de cohortes.
C. Estudio transversal.
D. Serie de casos.
E. Un ensayo clínico controlado.

**Respuesta correcta: E** — *(fuente: Examen MIR 2012, pregunta 178)*

### MIR-2012-179
Se ha realizado un estudio epidemiológico con el objetivo de dilucidar si existe asociación entre la administración de una nueva vacuna antigripal y la aparición de síndrome de Guillain-Barré. Para ello se recogieron los datos de todos los sujetos vacunados en determinada área geográfica y mediante la conexión de estos datos en los nuevos diagnósticos de Síndrome de Guillain-Barré en sujetos expuestos y en no expuestos a la vacuna en una ventana temporal definida. ¿A qué tipo de diseño corresponde este estudio?

A. Estudio de cohortes.
B. Estudio de casos y controles anidado en un cohorte.
C. Estudio de casos y controles de campo.
D. Estudio de corte transversal.
E. Estudio descriptivo.

**Respuesta correcta: A** — *(fuente: Examen MIR 2012, pregunta 179)*

### MIR-2012-184
Teniendo en cuenta que la prevalencia de espina bífida es de 1 caso por cada 1000 nacidos vivos, ¿qué tipo de estudio sería el más válido y eficiente para estudiar la posible asociación entre la ocurrencia de espina bífida en el recién nacido y la exposición a diversos factores ambientales durante el embarazo?

A. Un estudio de cohorte prospectivo e integrado por mujeres que están planificando el embarazo.
B. Un estudio de cohorte retrospectivo a través de las historias clínicas de mujeres que han parido en los hospitales seleccionados.
C. Un estudio de casos y controles de base hospitalaria, tomando como casos a las madres de niños que han nacido con espina bífida y como controles a las madres de niños que han nacido sin malformaciones, haciéndoles a ambos grupos una entrevista sobre exposiciones ambientales durante el embarazo.
D. Un estudio de casos y controles de base poblacional tomando como casos a las mujeres expuestas a los factores ambientales de interés y como controles a las mujeres no expuestas.
E. Un estudio de corte transversal en la población general de mujeres de edad comprendida entre los 20 y los 40 años.

**Respuesta correcta: C** — *(fuente: Examen MIR 2012, pregunta 184)*

### MIR-2012-187
La autorización de la Agencia Española de Medicamentos es necesaria para el desarrollo de cualquier ensayo clínico con medicamentos en un centro sanitario. ¿De qué otro organismo también es imprescindible tener un informe favorable para desarrollar el ensayo clínico en el centro?

A. El Comité de Ética Asistencial del centro sanitario.
B. La Comisión de Farmacoterapéutica del centro sanitario.
C. El Comité Ético de Investigación Clínica del centro sanitario.
D. La Dirección de Investigación del centro sanitario.
E. La Unidad Central de Investigación Clínica en Ensayos Clínicos del centro sanitario.

**Respuesta correcta: C** — *(fuente: Examen MIR 2012, pregunta 187)*

### MIR-2012-189
Se está planificando un ensayo clínico en Fase III para evaluar la eficacia, en términos de erradicación microbiológica, en una nueva fluorquinolona en pacientes con infección del tracto urinario. ¿Cuál de los siguientes diseños es el más apropiado?

A. Diseño factorial.
B. Paralelo, abierto, controlado con placebo.
C. Paralelo, aleatorizado, doble ciego, controlado con otro antibiótico activo frente a gramnegativos.
D. Cruzado, aleatorizado, doble ciego, controlado con otro antibiótico activo frente a gramnegativos.
E. Cruzado, aleatorizado, doble ciego, controlado con placebo.

**Respuesta correcta: C** — *(fuente: Examen MIR 2012, pregunta 189)*

### MIR-2012-232
¿Cuál sería el diseño más adecuado para evaluar la eficacia de un tratamiento para detener la progresión de la enfermedad de Alzheimer leve-moderada?

A. Ensayo clínico aleatorizado, paralelo, doble ciego, controlado con placebo, de 2 años de tratamiento.
B. Ensayo clínico con control histórico de 4 años de tratamiento.
C. Estudio retrospectivo de casos y controles.
D. Estudio observacional de seguimiento prospectivo durante 5 años.
E. Ensayo clínico aleatorizado, abierto, comparado con el tratamiento estándar, de 6 meses de tratamiento.

**Respuesta correcta: A** — *(fuente: Examen MIR 2012, pregunta 232)*

### MIR-2013-178
Durante los meses de octubre a diciembre de 2011 se procedió a la selección de 200 pacientes diagnosticados de EPOC a partir de los registros del programa correspondiente en el centro de salud, mediante un muestreo aleatorio sistemático. Los pacientes fueron evaluados mediante una espirometría, y respondieron a un cuestionario de calidad de vida y a otro sobre adherencia terapéutica. ¿Qué tipo de estudio epidemiológico se ha realizado?

A. Ensayo clínico aleatorizado.
B. Estudio de cohortes.
C. Estudio de casos y controles.
D. Serie de casos.
E. Estudio transversal.

**Respuesta correcta: E** — *(fuente: Examen MIR 2013, pregunta 178)*

### MIR-2013-179
Un grupo de 1000 pacientes diagnosticados de Síndrome del Aceite Tóxico (SA T) fueron seguidos desde 1981 hasta 1995 junto con un número similar de vecinos sin dicho diagnóstico. Entre los pacientes con SAT se observó en 1995 un 20% con signos de neuropatía periférica frente a un 2% en los vecinos. Según el diseño descrito ¿de qué tipo de estudio se trata?

A. Estudio transversal.
B. Estudio de cohortes.
C. Estudio de casos y controles.
D. Estudio cuasiexperimental.
E. Ensayo clínico controlado.

**Respuesta correcta: B** — *(fuente: Examen MIR 2013, pregunta 179)*

### MIR-2013-184
¿Qué es un estudio de casos y controles anidado?

A. Es el tipo de estudio de casos y controles en el que la serie de controles está apareada con los casos en posibles factores de confusión
B. Es el tipo de estudio de casos y controles en el que la serie de controles está muestreada aleatoriamente de la cohorte que da origen a los casos.
C. Es el tipo de estudio de casos y controles en el que tanto los casos como los controles se extraen del mismo hospital o centro de estudio.
D. Es el tipo de estudio de casos y controles que se realiza para estudiar los factores etiológicos de las malformaciones congénitas y que se llevan a cabo en las unidades de neonatología.
E. Es el tipo de estudio de casos y controles que se realiza en poblaciones estáticas o cerradas en las que no se permita la entrada o salida de la misma.

**Respuesta correcta: B** — *(fuente: Examen MIR 2013, pregunta 184)*

### MIR-2013-191
¿A qué tipo de ensayo clínico nos referimos cuando los criterios de inclusión se ajustan a las indicaciones, con criterios de exclusión menos restrictivos para incluir una amplia representación de la enfermedad en estudio y fundamentar así el registro de un medicamento?

A. Estudio piloto.
B. Estudio en fase I.
C. Estudio en fase II.
D. Estudio en fase III.
E. Estudio en fase IV.

**Respuesta correcta: D** — *(fuente: Examen MIR 2013, pregunta 191)*

### MIR-2014-193
Si desea estimar los efectos de una intervención empleará:

A. Un diseño transversal.
B. Un diseño retrospectivo.
C. Un estudio ecológico.
D. Un ensayo clínico aleatorizado.
E. Un diseño observacional con selección al azar de los participantes.

**Respuesta correcta: D** — *(fuente: Examen MIR 2014, pregunta 193)*

### MIR-2014-194
¿Cuál de las siguientes aseveraciones sobre el metaanálisis es correcta?

A. El objetivo del metaanálisis es resumir cuantitativamente los resultados de los estudios realizados.
B. El metaanálisis es un ensayo clínico de grandes proporciones.
C. Sería deseable evitar los ensayos clínicos negativos, así como los no publicados, para impedir sesgos de selección.
D. Por definición, todos los metaanálisis son una fuente fidedigna de evidencia, siendo irrelevante la calidad de los ensayos o si incluyen los resultados de ensayos clínicos aleatorizados.
E. El metaanálisis subsanará los errores de realización de los ensayos.

**Respuesta correcta: A** — *(fuente: Examen MIR 2014, pregunta 194)*

### MIR-2014-202
Respecto a los diseños de los ensayos clínicos para demostrar eficacia de los antidepresivos, ¿cuál de las siguientes es FALSA?

A. La inclusión en el diseño de los ensayos clínicos de variables secundarias de seguridad es importante para poder establecer la ubicación terapéutica de los medicamentos estudiados.
B. En estudios de depresión no se considera ético usar un grupo de control con placebo.
C. La eficacia de los antidepresivos se mide mediante la proporción de sujetos con una reducción porcentual predeterminada en las escalas de depresión específicas, como la de Hamilton o la de Beck.
D. Debido a la gran variabilidad de la respuesta entre un estudio y otro, las comparaciones entre fármacos activos con un diseño de no inferioridad no permiten concluir eficacia de forma robusta.
E. Aunque la mejoría clínica se puede observar en una o dos semanas, generalmente son necesarias 4 semanas de seguimiento en los ensayos clínicos para establecer diferencias significativas.

**Respuesta correcta: B** — *(fuente: Examen MIR 2014, pregunta 202)*

### MIR-2015-178
Si se quisiera estudiar la eficacia y seguridad de un nuevo citostático para un determinado proceso oncológico y, al mismo tiempo, contrastar la eficacia que añade a dicho tratamiento un nuevo anticuerpo monoclonal, ¿cuál sería el diseño de estudio más apropiado?

A. Ensayo paralelo.
B. Ensayo cruzado.
C. Ensayo factorial.
D. Ensayo secuencial.
E. Ensayo de n = 1.

**Respuesta correcta: C** — *(fuente: Examen MIR 2015, pregunta 178)*

### MIR-2015-182
En un centro de salud se está realizando un estudio para determinar el efecto de la exposición al humo del tabaco en hijos de padres fumadores. Para ello, se selecciona a un grupo de niños sanos entre 3 y 7 años cuyos padres son fumadores y al mismo tiempo se selecciona en el mismo centro un igual número de niños cuyos padres no son fumadores. Un año después se investigará en ambos grupos la aparición de enfermedades respiratorias durante ese año. Indique la respuesta correcta:

A. El diseño del estudio es una cohorte prospectiva.
B. El diseño del estudio es casos y controles.
C. El diseño del estudio sigue una metodología cualitativa.
D. El estudio es experimental.
E. El tipo de diseño utilizado es eficiente para estudiar enfermedades raras.

**Respuesta correcta: A** — *(fuente: Examen MIR 2015, pregunta 182)*

### MIR-2015-183
Se ha llevado a cabo un estudio con el fin de determinar el riesgo de hemorragia digestiva alta (HDA) asociado con el uso de diferentes anti-inflamatorios no esteroideos (AINE). Para ello se incluyeron 2.777 pacientes con HDA y 5.532 pacientes emparejados con los anteriores por edad y mes de ingreso o consulta, en los mismos hospitales, pero por razones que no tuvieran nada que ver con el uso de AINE. Se calculó el riesgo comparativo de sufrir una HDA asociado a la exposición previa a diferentes AINE. ¿De qué tipo de estudio se trata?

A. Estudio de cohortes.
B. Estudio de casos y controles.
C. Estudio transversal.
D. Estudio experimental.
E. Estudio ecológico.

**Respuesta correcta: B** — *(fuente: Examen MIR 2015, pregunta 183)*

### MIR-2015-193
En un ensayo clínico que evalúa la eficacia de un hipolipemiante en la prevención primaria de la cardiopatía coronaria, si los investigadores han planificado análisis de resultados intermedios y a la vista de ellos suspenden el estudio antes de su finalización tienen que saber que:

A. Sólo puede ser interrumpido el estudio cuando en algún análisis intermedio hay una diferencia entre los resultados de las intervenciones, p <0,05.
B. Sólo está justificada la interrupción en aquellos estudios que tienen como variable de resultado la mortalidad.
C. Si la intervención es segura el estudio no puede interrumpirse antes de que haya finalizado.
D. Cuando se interrumpe precozmente un ensayo clínico es frecuente que se sobrestime el efecto de la intervención evaluada.
E. La realización de análisis intermedios disminuye el error tipo I.

**Respuesta correcta: D** — *(fuente: Examen MIR 2015, pregunta 193)*

### MIR-2015-200
Respecto al meta-análisis de ensayos clínicos señale la respuesta FALSA:

A. Lo más correcto es incluir los estudios publicados y no publicados.
B. Es apropiado aplicar el modelo de efectos fijos cuando los resultados de los estudios incluidos son homogéneos.
C. El gráfico en embudo (funnel plot) se utiliza habitualmente en los análisis de sensibilidad.
D. Los modelos de efectos al azar suelen proporcionar intervalos de confianza más amplios que los modelos de efectos fijos.
E. La heterogeneidad de los estudios incluidos disminuye la precisión y exactitud del resultado agregado.

**Respuesta correcta: D** — *(fuente: Examen MIR 2015, pregunta 200)*

### MIR-2016-038
Se considera que dos fármacos son bioequivalentes cuando:

A. Contienen el mismo principio activo, aunque cambien los excipientes.
B. Su vida media biológica, semivida o t½, no difiere en más de un 5%.
C. Los procesos de biotransformación metabólica tienen lugar a través de las mismas isoformas enzimáticas.
D. Presentan una biodisponibilidad similar.

**Respuesta correcta: D** — *(fuente: Examen MIR 2016, pregunta 38)*

### MIR-2016-192
En un estudio epidemiológico se trató de correlacionar el consumo de carne procesada “per cápita” en distintos países en el año 2012 con la incidencia de cáncer de colon registrada en ese mismo año en dichos países. ¿De qué tipo de estudio se trata?

A. Estudio ecológico.
B. Series de casos.
C. Estudio de caso-cohorte.
D. Estudio de corte transversal.

**Respuesta correcta: A** — *(fuente: Examen MIR 2016, pregunta 192)*

### MIR-2016-193
Seleccionamos una muestra aleatoria entre los pacientes que acuden a vacunarse de la gripe durante la campaña anual en un centro de salud. Se registra en los pacientes seleccionados si están utilizando fármacos hipolipemiantes y si están diagnosticados de diabetes mellitus, entre otros datos. Se obtiene que la diabetes mellitus es más frecuente entre los pacientes que toman hipolipemiantes que entre los que no los toman. ¿A cuál de los siguientes corresponde el diseño de este estudio?

A. Un estudio de prevalencia.
B. Un estudio de casos y controles.
C. Un estudio de cohortes prospectivo.
D. Un ensayo clínico aleatorizado.

**Respuesta correcta: A** — *(fuente: Examen MIR 2016, pregunta 193)*

### MIR-2016-196
¿Qué se entiende por eficiencia de un servicio sanitario?

A. La medida en que un servicio sanitario mejora el estado de salud de la población al menor coste posible.
B. La posibilidad que un sujeto tiene de ser atendido por el sistema sanitario independientemente de su condición social, sexo o lugar de nacimiento.
C. La mejora del estado de salud de la población obtenida por un servicio sanitario en condiciones habituales o reales de actuación.
D. La medida en que un servicio sanitario alcanza sus objetivos de mejora del estado de salud de la población a la cual atiende.

**Respuesta correcta: A** — *(fuente: Examen MIR 2016, pregunta 196)*

### MIR-2017-036
¿Cuál de las siguientes afirmaciones sobre los medicamentos genéricos NO es correcta?

A. Para demostrar la eficacia y seguridad de un medicamento genérico se deben realizar ensayos clínicos de bioequivalencia en pacientes que padecen una de las patologías para las que está indicado.
B. El nombre del medicamento genérico suele coincidir con la denominación común internacional o la denominación oficial española del principio activo seguido del nombre del laboratorio farmacéutico.
C. El medicamento genérico tiene el mismo principio activo que el fármaco de referencia pero pueden cambiar los excipientes.
D. El medicamento genérico tiene que cumplir los mismos requisitos de calidad que los exigidos para cualquier otro medicamento (normas de correcta fabricación de medicamentos).

**Respuesta correcta: A** — *(fuente: Examen MIR 2017, pregunta 36)*

### MIR-2017-116
¿Cuál de las siguientes frases es cierta en relación con las distintas fases de ensayos clínicos?

A. Los ensayos clínicos de fase I se realizan sobre un número muy elevado de pacientes.
B. Los ensayos clínicos de fase IV son exploratorios de eficacia.
C. Los estudios de bioequivalencia son un tipo especial de ensayos de fase III.
D. La búsqueda de dosis es uno de los objetivos principales de los ensayos clínicos de fase II.

**Respuesta correcta: D** — *(fuente: Examen MIR 2017, pregunta 116)*

### MIR-2017-119
En el Centro de Vacunación Internacional de Bilbao se pretende realizar un estudio para determinar si la incidencia y características de los efectos adversos que aparecen en sus viajeros tras la administración de la vacuna frente a la fiebre amarilla se corresponden con las evidencias disponibles en la literatura. ¿De qué tipo de estudio se trata?

A. Ensayo clínico fase III de seguridad.
B. Estudio casos y controles.
C. Estudio preautorización.
D. Estudio postautorización de tipo observacional de seguimiento prospectivo (EPA).

**Respuesta correcta: D** — *(fuente: Examen MIR 2017, pregunta 119)*

### MIR-2017-120
El diseño de estudio epidemiológico que mejor se ajusta a la evaluación de la asociación entre una reacción adversa poco frecuente y un tratamiento farmacológico frecuentemente utilizado es:

A. Un estudio de cohortes.
B. Un estudio de casos y controles.
C. Un estudio ecológico.
D. Evaluación de series de casos.

**Respuesta correcta: B** — *(fuente: Examen MIR 2017, pregunta 120)*

### MIR-2017-133
¿Cuál de los siguientes tipos de estudio sería el de elección para estudiar la asociación entre la aparición de una reacción adversa grave muy poco frecuente y tardía, y el consumo de un determinado medicamento?

A. Ensayo clínico con el medicamento sospechoso.
B. Estudio de prevalencia.
C. Estudio de casos y controles.
D. Estudio ecológico.

**Respuesta correcta: C** — *(fuente: Examen MIR 2017, pregunta 133)*

### MIR-2017-234
La medicina basada en la evidencia propone integrar las mejores evidencias con la experiencia clínica y las circunstancias de los pacientes en la toma de las decisiones clínicas. En relación a la calidad de la evidencia qué tipo de estudio nos proporciona evidencias de mayor calidad:

A. Revisiones sistemáticas.
B. Estudio de cohortes.
C. Ensayos clínicos aleatorizados.
D. Serie de casos.

**Respuesta correcta: A** — *(fuente: Examen MIR 2017, pregunta 234)*

### MIR-2018-208
Señale la respuesta correcta sobre los ensayos clínicos con medicamentos en menores:

A. Son legalmente posibles y éticamente aceptables, pero el investigador debe respetar el deseo explícito del menor de negarse a participar en el ensayo, siempre que éste sea capaz de formarse una opinión.
B. Son legalmente posibles y éticamente aceptables y únicamente requieren la autorización de los padres o tutores legales.
C. Son legalmente posibles y éticamente aceptables, siempre que el niño tenga 12 años o más.
D. Son legalmente posibles pero no son éticos, dado que los niños no tienen capacidad para consentir con la investigación.

**Respuesta correcta: A** — *(fuente: Examen MIR 2018, pregunta 208)*

### MIR-2018-209
Un ensayo clínico no mostró diferencias significativas entre el nuevo fármaco tromboporix y placebo en la incidencia de infarto de miocardio (7% versus 5%; p = 0,68) en la población total del estudio, pero sí mostró que tromboporix reducía el riesgo de infarto en uno de los 20 subgrupos analizados, concretamente en mayores de 55 años (3% versus 8%; p = 0,048). Señale lo CIERTO:

A. El resultado significativo en el subgrupo descarta razonablemente un error de tipo I.
B. Puede ser útil para plantear nuevas hipótesis, que deberán ser comprobadas en nuevos ensayos diseñados a tal fin.
C. El error de tipo II puede ser el causante de la significación estadística en dicho subgrupo.
D. El resultado obtenido en el subgrupo es un ejemplo de la denominada paradoja de Brawnwald.

**Respuesta correcta: B** — *(fuente: Examen MIR 2018, pregunta 209)*

### MIR-2018-212
En un estudio epidemiológico de cohortes, ¿qué entendemos por pacientes expuestos?

A. Pacientes que tienen el factor de riesgo de la enfermedad o problema de salud que queremos estudiar.
B. Pacientes que aceptan participar en el estudio tras otorgar su consentimiento informado.
C. Sujetos que no desarrollan la enfermedad o problema de salud en estudio durante el seguimiento.
D. Pacientes que tienen la enfermedad o problema de salud que queremos estudiar.

**Respuesta correcta: A** — *(fuente: Examen MIR 2018, pregunta 212)*

### MIR-2018-213
El servicio de dermatología de un hospital ha registrado durante los últimos veinte años todos los casos diagnosticados de necrolisis epidérmica tóxica en el centro. Se encuentra que un 20% de estos pacientes habían estado expuestos a carbamazepina en las 6 semanas previas al diagnóstico, mientras que un 10% habían estado expuestos a fenitoína. ¿A cuál de los siguientes corresponde el diseño de este estudio?

A. Un estudio ecológico.
B. Un estudio de casos y controles.
C. Un estudio de prevalencia.
D. Un estudio descriptivo.

**Respuesta correcta: D** — *(fuente: Examen MIR 2018, pregunta 213)*

### MIR-2018-224
¿Cuál de las siguientes características es atribuible a los estudios de casos y controles?

A. Permiten conocer el riesgo asociado con la exposición a varios factores.
B. Se incluye un grupo expuesto a un factor y otro grupo no expuesto.
C. Son muy eficientes cuando la prevalencia de exposición al factor es muy baja.
D. Son estudios aleatorizados.

**Respuesta correcta: A** — *(fuente: Examen MIR 2018, pregunta 224)*

### MIR-2018-225
Cuando se elabora el protocolo de un proyecto de investigación, ¿cuál de los siguientes aspectos debe acometerse en primer lugar?

A. Definir los objetivos.
B. Justificar el problema.
C. Establecer la población de referencia.
D. Definir la hipótesis.

**Respuesta correcta: B** — *(fuente: Examen MIR 2018, pregunta 225)*

### MIR-2019-120
¿Cuál es la principal característica de un estudio de casos y controles anidado?

A. Que la serie de controles se ha extraído de una cohorte primaria.
B. Que estudian asociaciones entre la exposición y la enfermedad no previstas en el protocolo inicial.
C. Que la serie de controles se ha apareado con los casos.
D. Que los casos actúan como sus propios controles.

**Respuesta correcta: A** — *(fuente: Examen MIR 2019, pregunta 120)*

### MIR-2019-121
Un estudio recluta a un grupo de graduados de la universidad. En el momento de la incorporación, los participantes proporcionan una muestra de sangre que se almacena inmediatamente y completan un cuestionario sobre estilos de vida. Los participantes son seguidos en el tiempo para evaluar quién desarrolla enfermedad de Parkinson. En un estudio inicial, los investigadores comparan las personas clasificadas como activas frente a las que fueron clasificadas como sedentarias. ¿Cuál es el diseño del estudio?

A. Estudio de cohortes histórico o retrospectivo.
B. Estudio de cohortes prospectivo.
C. Estudio transversal en el momento del reclutamiento.
D. Estudio de caso-control anidado en una cohorte.

**Respuesta correcta: B** — *(fuente: Examen MIR 2019, pregunta 121)*

---

## 4. Preguntas inéditas

### EST-01-INED-01
Se realiza un estudio para determinar la posible relación entre la contaminación ambiental por SO2 en diversas zonas geográficas y el número de visitas a urgencias por asma en cada una de esas zonas, utilizando los datos agregados de registros medioambientales y hospitalarios por zona, sin recoger información individual de cada paciente. Sobre el diseño del estudio, señale la respuesta correcta:

A. Estudio de correlación ecológica; permite generar hipótesis pero no demostrar causalidad a nivel individual.
B. Estudio de incidencia individual, ya que mide directamente el riesgo de cada paciente.
C. Estudio de prevalencia de base individual.
D. Estudio de cohortes, ya que compara zonas expuestas y no expuestas a la contaminación.

**Respuesta correcta: A**
**Justificación de incorrectas:**
- B: incorrecta — al usar datos agregados por zona geográfica (no datos individuales), no se puede calcular un riesgo individual; es precisamente la limitación que define al estudio ecológico.
- C: incorrecta — un estudio de prevalencia (transversal) es de base INDIVIDUAL; este estudio usa datos agregados por zona, lo que lo convierte en ecológico, no transversal.
- D: incorrecta — un estudio de cohortes es de base individual con seguimiento real de sujetos expuestos y no expuestos; aquí no hay seguimiento individual, solo comparación de tasas agregadas por zona.
**Origen:** inédita | **Referencia bibliográfica:** AMIR, *Manual de Estadística y Epidemiología*, Tema 7.1, "Estudio ecológico", pág. 37.
**Fecha de generación:** 2026-08-19

### EST-01-INED-02
Para determinar si el consumo habitual de alimentos ultraprocesados se asocia a mayor riesgo de síndrome de fragilidad, se selecciona a 5.000 personas mayores de 70 años, se identifica su consumo habitual de ultraprocesados en el momento basal, y se les realiza un seguimiento real durante 3 años para identificar quiénes desarrollan el síndrome de fragilidad por primera vez. ¿Cuál es el diseño de este estudio y qué medida de asociación permite calcular?

A. Estudio de cohortes prospectivo; permite calcular el riesgo relativo (RR).
B. Estudio ecológico; permite calcular una correlación agregada, no una medida de riesgo individual.
C. Estudio de casos y controles; permite calcular la odds ratio (OR).
D. Ensayo de campo; permite calcular la eficacia de una intervención preventiva.

**Respuesta correcta: A**
**Justificación de incorrectas:**
- B: incorrecta — el estudio recoge datos INDIVIDUALES de exposición (consumo de ultraprocesados) y realiza un seguimiento real de cada sujeto, lo que descarta el diseño ecológico (que usa datos agregados sin seguimiento individual).
- C: incorrecta — no hay selección de sujetos por su estado de enfermedad (casos) ni seguimiento retrospectivo mediante memoria; se selecciona por exposición y se sigue prospectivamente hacia el futuro, la definición exacta de un estudio de cohortes.
- D: incorrecta — no hay ninguna intervención activa por parte del investigador (no se administra ninguna medida preventiva); es un estudio puramente observacional.
**Origen:** inédita | **Referencia bibliográfica:** AMIR, *Manual de Estadística y Epidemiología*, Tema 7.1, "Estudio de cohortes", pág. 37.
**Fecha de generación:** 2026-08-19

### EST-01-INED-03
¿Qué tipo de estudio epidemiológico NO permite calcular directamente un riesgo relativo (RR), utilizando en su lugar la odds ratio (OR) como medida de asociación?

A. Un ensayo clínico aleatorizado.
B. Un estudio de cohortes históricas (retrospectivo).
C. Un estudio de cohortes prospectivo convencional.
D. Un estudio de casos y controles.

**Respuesta correcta: D**
**Justificación de incorrectas:**
- A: incorrecta — un ensayo clínico aleatorizado, al asignar y seguir prospectivamente a los grupos de intervención, permite calcular incidencias y por tanto el RR.
- B: incorrecta — el estudio de cohortes históricas mantiene una dirección de seguimiento PROSPECTIVA (aunque reconstruida con datos ya existentes), por lo que sigue permitiendo calcular incidencias y RR; solo se diferencia del convencional en la fuente de los datos, no en el tipo de medida de asociación que permite calcular.
- C: incorrecta — es el diseño por excelencia para calcular el RR, al medir directamente la incidencia de enfermedad en expuestos y no expuestos.
**Origen:** inédita | **Referencia bibliográfica:** AMIR, *Manual de Estadística y Epidemiología*, Tema 7.1, "Estudio de cohortes históricas" y Tabla 1 "Diferencias entre casos y controles y cohortes", pág. 37.
**Fecha de generación:** 2026-08-19

### EST-01-INED-04
Al aumentar el tamaño muestral de un estudio transversal (de prevalencia), manteniendo el mismo método de selección de sujetos, ¿qué característica del estudio mejora principalmente?

A. La precisión del estudio (intervalos de confianza más estrechos, mayor potencia estadística).
B. La representatividad de la muestra respecto a la población de origen.
C. La validez interna del estudio frente a los sesgos de selección.
D. La secuencia temporal entre exposición y enfermedad.

**Respuesta correcta: A**
**Justificación de incorrectas:**
- B: incorrecta — la representatividad de una muestra depende de CÓMO se seleccionan los sujetos (aleatorización, técnica de muestreo), no de CUÁNTOS se incluyen; una muestra grande pero mal seleccionada sigue sin ser representativa.
- C: incorrecta — el riesgo de sesgos de selección depende del método de reclutamiento, no del tamaño muestral.
- D: incorrecta — el estudio transversal, por definición, mide exposición y enfermedad en el mismo momento, y esto no cambia por aumentar el tamaño muestral.
**Origen:** inédita | **Referencia bibliográfica:** AMIR, *Manual de Estadística y Epidemiología*, Tema 3.1, "Contraste de hipótesis: errores — relación entre tamaño muestral y potencia estadística", pág. 20.
**Fecha de generación:** 2026-08-19

### EST-01-INED-05
Un artículo describe un ensayo clínico aleatorizado en fase IV, realizado en 42 centros sanitarios de 16 países, en el que se compara un fármaco ya autorizado para otra indicación frente a placebo, con el objetivo de valorar su efectividad en la práctica clínica habitual y detectar posibles reacciones adversas infrecuentes. ¿Cuál de las siguientes afirmaciones es correcta?

A. Al tratarse de un ensayo en fase IV, el fármaco estudiado ya se encuentra comercializado/aprobado, y uno de sus objetivos es la farmacovigilancia.
B. Este diseño se denomina metaanálisis, al incluir participantes de múltiples centros y países.
C. Al ser un ensayo en fase IV, el fármaco todavía no ha demostrado eficacia ni seguridad en ningún contexto previo.
D. La aleatorización garantiza necesariamente el mismo número exacto de hombres y mujeres en cada grupo del estudio.

**Respuesta correcta: A**
**Justificación de incorrectas:**
- B: incorrecta — un metaanálisis es la síntesis estadística de MÚLTIPLES ESTUDIOS INDEPENDIENTES ya publicados, no un único ensayo clínico multicéntrico e internacional, por muchos centros/países que incluya.
- C: incorrecta — es precisamente lo contrario: la fase IV ocurre DESPUÉS de que el fármaco haya superado las fases I-III y haya sido comercializado, es decir, ya cuenta con eficacia y seguridad demostradas en su indicación aprobada.
- D: incorrecta — la aleatorización distribuye a los sujetos al azar entre los grupos, pero no garantiza un equilibrio exacto de ninguna característica concreta (como el sexo) salvo que se utilicen técnicas de estratificación específicas para ello.
**Origen:** inédita | **Referencia bibliográfica:** AMIR, *Manual de Estadística y Epidemiología*, Tema 7.6, "Fase IV (fase poscomercialización)", pág. 44.
**Fecha de generación:** 2026-08-19

---

## 5. Flashcards del módulo

```
¿Qué diferencia a un estudio ecológico de un estudio transversal?	La base de los datos: comunitaria/agregada en el ecológico, individual en el transversal	MIR::EST::Tipos de estudios
¿Puede un estudio ecológico demostrar causalidad a nivel individual?	No, solo genera hipótesis (riesgo de falacia ecológica si se extrapola al individuo)	MIR::EST::Tipos de estudios
¿Qué medida de asociación calcula el estudio de casos y controles?	La odds ratio (OR)	MIR::EST::Tipos de estudios
¿Qué medida de asociación calcula el estudio de cohortes?	El riesgo relativo (RR)	MIR::EST::Tipos de estudios
¿Es el seguimiento de un estudio de cohortes históricas (retrospectivo) realmente retrospectivo?	No, la dirección del seguimiento sigue siendo prospectiva (pasado→presente), solo cambia la fuente de los datos	MIR::EST::Tipos de estudios
¿Permite un estudio de cohortes históricas calcular el RR?	Sí, al igual que un estudio de cohortes convencional	MIR::EST::Tipos de estudios
¿Qué estudio NO permite calcular directamente el RR?	El estudio de casos y controles	MIR::EST::Tipos de estudios
¿Qué caracteriza a un ensayo clínico en fase IV?	Que el fármaco ya está comercializado/aprobado; sus objetivos son efectividad real, nuevas indicaciones y farmacovigilancia	MIR::EST::Tipos de estudios
¿Cómo se notifican las reacciones adversas en farmacovigilancia en España?	Mediante la "tarjeta amarilla" a la AEMPS o la aplicación FEDRA	MIR::EST::Tipos de estudios
¿Cómo se interpreta un RR de 0,47?	Como una reducción relativa del riesgo del 53% (no del 47%) al pasar de no-exposición a exposición	MIR::EST::Tipos de estudios
¿Qué es la falacia o sesgo ecológico?	Asumir que una asociación observada a nivel poblacional también existe a nivel individual	MIR::EST::Tipos de estudios
¿Depende el riesgo de sesgo del tamaño muestral de un estudio?	No — el riesgo de sesgo depende de errores sistemáticos (medida, selección, confusión), no del tamaño muestral	MIR::EST::Tipos de estudios
¿Qué mejora al aumentar el tamaño muestral: la precisión o la representatividad?	La precisión (potencia estadística); la representatividad depende del método de selección, no del tamaño	MIR::EST::Tipos de estudios
¿Qué representa el tamaño del cuadrado en un forest plot?	El peso de cada estudio en el metaanálisis	MIR::EST::Tipos de estudios
¿Qué medida es la adecuada para estimar el riesgo individual de enfermar?	La incidencia acumulada	MIR::EST::Tipos de estudios
¿Qué diferencia el objetivo de la fase II del de la fase III de un ensayo clínico?	Fase II: eficacia PRELIMINAR en grupo reducido y muy seleccionado. Fase III: DEMUESTRA el efecto terapéutico en grupo amplio con criterios laxos	MIR::EST::Tipos de estudios
¿Cómo se calcula el NNT (número necesario a tratar)?	NNT = 1 / reducción absoluta del riesgo (RAR)	MIR::EST::Tipos de estudios
¿Implica la misma reducción relativa del riesgo en dos subgrupos la misma eficacia en términos de NNT?	No, si el riesgo basal difiere entre subgrupos — a mayor riesgo basal, mayor RAR y menor NNT	MIR::EST::Tipos de estudios
¿Cómo se reconoce un estudio de cohortes HISTÓRICAS (retrospectivo)?	Tanto la exposición como el desenlace ya están registrados en el pasado antes de que el investigador inicie el estudio	MIR::EST::Tipos de estudios
¿Son las pérdidas en el seguimiento un criterio de riesgo de sesgo?	Sí — es el "sesgo de atrición", un ítem explícito de la herramienta Cochrane	MIR::EST::Tipos de estudios
¿Es la representatividad de la muestra un criterio de riesgo de sesgo?	No — es un problema de validez EXTERNA (generalización), no de riesgo de sesgo (validez interna)	MIR::EST::Tipos de estudios
```

---

## 6. Referencias

- AMIR. *Manual de Estadística y Epidemiología* (18.ª ed.). Academia de Estudios MIR. Tema 7 "Tipos de estudios epidemiológicos", pág. 35-48; Tema 3 "Contraste de hipótesis" (potencia y tamaño muestral), pág. 19-21. Fuente: `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`.
- Exámenes MIR 2020, 2021, 2022, 2024, 2025 (preguntas reales citadas en sección 3) — `data/preguntas_{año}.json`.
