# EST-02 · Validación de pruebas diagnósticas y medidas epidemiológicas

**Especialidad:** Estadística y Epidemiología (EST)
**Peso histórico:** Tema 5 "Estudios de validación de una prueba diagnóstica" (18 preguntas 2014-2024) + Tema 6 "Variables de medidas epidemiológicas" (19 preguntas 2014-2024, 3.er tema en importancia del manual) — ambos entre los temas de mayor frecuencia de la asignatura, junto al ya cubierto Tema 7 (EST-01).

---

## 1. Resumen clínico

### 1.1 Parámetros de validez interna de una prueba diagnóstica

- **Sensibilidad (S):** capacidad de detectar ENFERMOS. P(test "+" | enfermo, según gold standard). Complementario: tasa de falsos negativos (TFN=1-S). **Un test muy sensible es útil cuando da NEGATIVO** (descarta enfermedad — "SnNout").
- **Especificidad (E):** capacidad de detectar SANOS. P(test "−" | sano, según gold standard). Complementario: tasa de falsos positivos (TFP=1-E). **Un test muy específico es útil cuando da POSITIVO** (confirma enfermedad — "SpPin").
- **S y E son parámetros de validez INTERNA — NO dependen de la prevalencia de la enfermedad.**
- **Razón de verosimilitud (RV/likelihood ratio):** RPP = S/TFP (cuánto más probable es que un ENFERMO dé positivo respecto a un SANO); RPN = TFN/E. Peor valor posible = 1 (S y E del 50%, igual que el azar). Capacidad diagnóstica: suficiente si RPP≥10 y RPN≤0,1.

### 1.2 Parámetros de validez externa (dependen de la prevalencia)

- **Valor predictivo positivo (VPP):** P(enfermo | test "+"). **Valor predictivo negativo (VPN):** P(sano | test "−"). Estos SÍ dependen de la prevalencia (probabilidad pre-test).
  - ↑ prevalencia → ↑ VPP, ↓ VPN. ↓ prevalencia → ↓ VPP, ↑ VPN.
  - ↑ S → ↓ TFN → ↑ VPN. ↑ E → ↓ TFP → ↑ VPP.
- **Valor global (VG):** proporción de resultados verdaderos (VP+VN) del total.
- La validez interna es requisito previo para la validez externa.

### 1.3 Curvas ROC

- Representan S (eje Y) frente a TFP=1-E (eje X) para cada posible punto de corte de una variable cuantitativa continua. **Resumen la relación (trade-off) entre S y E** — al desplazar el punto de corte hacia valores más "enfermos", ↑E y ↓S; hacia valores más "sanos", ↑S y ↓E.
- El mejor punto de corte es el más cercano al ángulo superior izquierdo. El **área bajo la curva (AUC)** representa la validez global del test — mayor área = mejor test.

### 1.4 Test de screening vs. test de confirmación

- **Screening:** debe ser MUY SENSIBLE (para no dejar enfermos sin detectar); debe tener alto VPP en la población donde se aplique. Criterios de la enfermedad: frecuente, grave, fase presintomática no corta, historia natural conocida, tratamiento más eficaz en fase presintomática. Criterios del test: fácil, inocuo, coste razonable, buena S (prima sobre E), aceptado por la comunidad.
- **Confirmación:** debe ser MUY ESPECÍFICO. Se usa en enfermedades graves sin tratamiento eficaz, cuando los FP causan trauma emocional/consecuencias graves, o en enfermedades de prevalencia muy baja.

### 1.5 Medidas de frecuencia: prevalencia e incidencia

- **Prevalencia:** proporción de individuos que padecen la enfermedad EN UN MOMENTO dado (estática, "foto"). Diseño más eficiente: estudio transversal. Aumenta con: ↑incidencia, ↑duración de la enfermedad (↓mortalidad/cronificación), inmigración de enfermos/emigración de sanos.
- **Incidencia:** proporción de casos NUEVOS en un período (dinámica, "vídeo"). Diseño más eficiente: longitudinal prospectivo.
  - **Incidencia acumulada (IA):** riesgo individual de enfermar en un período fijo (cohorte fija, mismo tiempo de observación para todos).
  - **Densidad de incidencia (DI):** para cohortes dinámicas (tiempos de seguimiento distintos); unidad personas-tiempo.
  - En enfermedades estacionarias: **prevalencia = incidencia × duración media de la enfermedad.**
  - La aproximación de la incidencia acumulada mediante la densidad de incidencia (o viceversa) es útil cuando la tasa es BAJA y el período de seguimiento es CORTO (no cuando es alta/largo — la aproximación se degrada en esos casos).

### 1.6 Medidas de fuerza de asociación

- **Riesgo relativo (RR):** IAexpuestos/IAno-expuestos. Estudios con seguimiento prospectivo (cohortes, ensayo clínico). Mejor estimador del riesgo real.
- **Odds ratio (OR):** estudios retrospectivos (casos y controles), usa prevalencias/odds, no incidencias. Peor estimador que el RR — **sobreestima la fuerza de asociación** (salvo en enfermedades poco frecuentes, <10%, donde se aproxima al RR).
- **Razón de prevalencia (RP):** estudios transversales (sin seguimiento). Peor estimador de riesgo real de los tres.
- Interpretación: resultado <1 = factor protector; >1 = factor de riesgo; =1 = sin asociación.
- **IC de significación:** diseño de superioridad, no significativo si el IC incluye 1; no inferioridad, no significativo si incluye 1,2; equivalencia terapéutica, no significativo si incluye 0,8 o 1,2.

### 1.7 Medidas de impacto

- **Riesgo atribuible (RA) = Ie − Io** (exceso de riesgo por la exposición). **NNH = 100/RA(%)** (nº de sujetos a exponer para 1 caso dañado). **Fracción atribuible (FA) = RA/Ie.**
- **Reducción absoluta de riesgo (RAR) = Io − Ie** (para factores protectores). **NNT = 100/RAR(%)**. **Reducción relativa de riesgo (RRR) = RAR/Io.**

### 1.8 Criterios de causalidad de Bradford Hill (9 criterios)

Fuerza de asociación, consistencia/reproducibilidad, especificidad, **temporalidad (único criterio IMPRESCINDIBLE — la causa debe preceder al efecto)**, gradiente biológico (dosis-respuesta), plausibilidad biológica, coherencia, demostración experimental (**el criterio más potente**), analogía. La significación estadística, la ausencia de sesgos y la ausencia de confusión NO son criterios de Bradford Hill — son consideraciones metodológicas generales distintas.

---

## 2. Puntos clave para el MIR

1. S y E NO dependen de la prevalencia; VPP y VPN SÍ dependen de ella.
2. Test muy sensible → útil si da negativo (descarta); test muy específico → útil si da positivo (confirma).
3. La curva ROC representa y resume la relación (trade-off) entre S y E a distintos puntos de corte — no debe confundirse con el índice de Kappa (que mide CONCORDANCIA/acuerdo entre observadores, un concepto distinto).
4. Los tests de screening deben ser muy sensibles; los de confirmación, muy específicos.
5. Prevalencia = incidencia × duración media de la enfermedad (en situación estacionaria).
6. El RR se usa en estudios prospectivos; el OR en retrospectivos (y sobreestima el riesgo real, salvo en enfermedades poco frecuentes); la RP en transversales.
7. La temporalidad es el único criterio de causalidad de Bradford Hill verdaderamente imprescindible.
8. La especificidad se define exclusivamente en relación con los sujetos SANOS (probabilidad de test negativo en sanos) — no debe mezclarse con la tasa de falsos negativos entre enfermos, que es un concepto ligado a la sensibilidad, no a la especificidad.

---

## 3. Preguntas reales

### MIR-2020-050
Respecto a las características de una prueba diagnóstica, indique la respuesta correcta:

A. Los valores predictivos dependen de la probabilidad a priori de tener la enfermedad.
B. La especificidad es la capacidad de la prueba de clasificar correctamente, con un resultado negativo, a los enfermos.
C. La especificidad es la capacidad de la prueba de clasificar correctamente, con un resultado positivo, a los enfermos.
D. El valor predictivo positivo indica la probabilidad de que un paciente con un resultado positivo no tenga la enfermedad.

**Respuesta correcta: A** — *(fuente: Examen MIR 2020, pregunta 50)*

### MIR-2022-045
El valor predictivo negativo de una prueba diagnóstica es del 92 %. ¿Cómo debe interpretarse dicho resultado?

A. De cada 100 resultados negativos, 92 corresponderán a personas sanas.
B. De cada 100 personas sanas, en 92 de ellos el resultado de la prueba será negativo.
C. De cada 100 enfermos, en 8 de ellos el resultado de la prueba será negativo.
D. De cada 100 resultados positivos, 8 de ellos corresponderán a enfermos.

**Respuesta correcta: A** — *(fuente: Examen MIR 2022, pregunta 45)*

### MIR-2024-207
En relación con el estudio de la causalidad en epidemiología, solo uno de los siguientes es un criterio o consideración causal de Bradford Hill. Señálelo:

A. Gradiente biológico (relación dosis-respuesta).
B. Ausencia de sesgos.
C. Ausencia de confusión.
D. Significación estadística de la asociación.

**Respuesta correcta: A** — *(fuente: Examen MIR 2024, pregunta 207)*

### MIR-2025-033
Señale el enunciado INCORRECTO:

A. La tasa de incidencia acumulada de una enfermedad depende tanto de la incidencia como de la duración del período de medición.
B. La tasa de incidencia acumulada es una aproximación útil de la incidencia cuando la tasa es alta o cuando el período de estudio es largo.
C. La tasa de incidencia requiere la utilización de una unidad de tiempo.
D. La prevalencia incrementa con una mayor duración de la enfermedad.

**Respuesta correcta: B** — *(fuente: Examen MIR 2025, pregunta 33; la aproximación es útil precisamente cuando la tasa es BAJA y el período CORTO, no al contrario)*

### MIR-2021-044
La especificidad de una prueba diagnóstica es del 94 %. ¿Cuál es la interpretación correcta?

A. De cada 100 resultados negativos, 94 corresponden a pacientes sanos.
B. De cada 100 pacientes sanos, en 94 el resultado de la prueba será negativo.
C. De cada 100 pacientes enfermos, en 6 el resultado de la prueba será negativo.
D. De cada 100 resultados positivos, 6 corresponden a pacientes enfermos.

**Respuesta correcta: B** — *(fuente: Examen MIR 2021, pregunta 44)*

**Explicación:** La especificidad de una prueba diagnóstica se define como la proporción de personas sanas (sin la enfermedad) que obtienen un resultado negativo en la prueba, es decir, la capacidad de la prueba para identificar correctamente a los sanos. Por tanto, una especificidad del 94% significa que, de cada 100 personas sanas, en 94 el resultado de la prueba será negativo (verdaderos negativos), y en las 6 restantes será positivo a pesar de no tener la enfermedad (falsos positivos). Esta interpretación debe distinguirse claramente del valor predictivo negativo (que indica qué proporción de los resultados negativos corresponde realmente a personas sanas) y de la sensibilidad o su complementario (que se refieren a la proporción de enfermos correctamente clasificados).

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción C porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la B. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2023-046
En un estudio sobre la validez de una prueba diagnóstica, para resumir la relación entre la sensibilidad y la especificidad de la prueba se puede usar:

A. El índice de Kappa.
B. La curva ROC (receiver operating characteristics).
C. El coeficiente de correlación intraclase.
D. El gráfico de Altman y Bland.

**Respuesta correcta: B** — *(fuente: Examen MIR 2023, pregunta 46)*

**Explicación:** La curva ROC (receiver operating characteristic) es la herramienta gráfica estándar para resumir la relación entre la sensibilidad y la especificidad de una prueba diagnóstica continua a lo largo de los distintos puntos de corte posibles, representando en el eje de ordenadas la sensibilidad (fracción de verdaderos positivos) y en el de abscisas el complementario de la especificidad (1-especificidad, fracción de falsos positivos) para cada posible valor de corte. El área bajo la curva ROC (AUC) resume la capacidad discriminativa global de la prueba. El índice de Kappa y el coeficiente de correlación intraclase se emplean para valorar la concordancia o fiabilidad entre observadores o mediciones, y el gráfico de Bland-Altman se utiliza para evaluar la concordancia entre dos métodos de medición de una variable continua, no la relación sensibilidad-especificidad.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción A porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la B. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2020-052
Sobre los cocientes de probabilidad o razones de verosimilitud de una prueba diagnóstica, indique la respuesta INCORRECTA:

A. El cociente de probabilidades se configura como el índice que engloba la sensibilidad y especificidad y sus complementarios.
B. Las pruebas diagnósticas con cocientes de probabilidad próximos al valor 1 no tienen utilidad, pues sus resultados no cambiarán la probabilidad previa.
C. El cociente de probabilidades del resultado positivo de una prueba nos indica cuántas veces más probable es que la prueba sea positiva en una persona que no tenga la enfermedad que en una que sí la tenga.
D. Los cocientes de probabilidad indican hasta qué punto un resultado determinado de un examen diagnóstico aumentará o disminuirá la probabilidad preexamen de un trastorno objetivo.

**Respuesta correcta: C** — *(fuente: Examen MIR 2020, pregunta 52; coherente con la bibliografía: las razones de verosimilitud "indican cuántas veces es más probable que un ENFERMO obtenga un resultado determinado... respecto a un individuo SANO" — la opción C invierte esta relación (dice "más probable en persona SIN la enfermedad que en una que SÍ la tenga"), lo que la convierte correctamente en la afirmación INCORRECTA buscada. Confirmación LIMPIA, sin discrepancia)*

### MIR-2023-045
Al aumentar el tamaño muestral de un estudio transversal (o de prevalencia) aumenta:

A. La representatividad de la muestra.
B. La validez del estudio.
C. La reproducibilidad del estudio.
D. La precisión del estudio.

**Respuesta correcta: D**

**Explicación:** Al aumentar el tamaño muestral de un estudio, lo que mejora fundamentalmente es la precisión de las estimaciones: se reduce el error aleatorio, se estrechan los intervalos de confianza y aumenta la potencia estadística para detectar diferencias reales si existen. Sin embargo, un tamaño muestral mayor no mejora por sí solo la representatividad de la muestra (que depende del método de muestreo empleado, no del número de sujetos: una muestra grande pero mal seleccionada sigue sin ser representativa), ni corrige la validez del estudio (que depende de la ausencia de sesgos de selección, información o confusión en el diseño), ni garantiza la reproducibilidad de los resultados en otros contextos.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción A porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la D. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2024-041
Al finalizar el periodo de seguimiento en el estudio PREDIMET ("Primary Prevention of Cardiovascular Disease with a Mediterranean Diet"), el 3,8% de los individuos asignados a dieta mediterránea presentaron algún tipo de evento cardiovascular (infartos de miocardio, ictus o muertes de origen cardiovascular), frente al 4,4% de eventos ocurridos en el grupo control. ¿Cuál es el número necesario de pacientes a tratar (NNT) con dieta mediterránea para evitar un evento cardiovascular?:

A. 26.
B. 60.
C. 80.
D. 167.

**Respuesta correcta: D** — *(fuente: Examen MIR 2024, pregunta 41; cálculo aritmético directo: reducción absoluta del riesgo (RAR) = 4,4% − 3,8% = 0,6% = 0,006; NNT = 1/RAR = 1/0,006 ≈ 166,7 ≈ 167. Confirmación LIMPIA, sin discrepancia. Pregunta reclasificada desde NEU en un lote anterior de la sesión —hallazgo #173—, tageada aquí en EST-02)*

**MIR-2025-064 (ANULADA por la organización del examen —** `respuesta_correcta: null` **en el dataset):** ensayo de un colirio anticatarata, con incidencias del 10%→5% en mujeres y 8%→4% en hombres. Se descartó como pregunta con clave asignable: cálculo directo — mujeres: RAR = 5%, NNT = 100/5 = 20; hombres: RAR = 4%, NNT = 100/4 = 25. El NNT es MENOR en mujeres (20 < 25), lo que sustentaría "más eficaz en mujeres" en términos absolutos; sin embargo, la reducción relativa del riesgo (RRR) es idéntica en ambos sexos (50%), lo que sustentaría igualmente "igual de eficaz". Esta ambigüedad genuina entre una medida de efecto ABSOLUTA (NNT/RAR, distinta entre sexos por la diferente incidencia basal) y una RELATIVA (RRR, idéntica) es, con toda probabilidad, la razón de la anulación oficial — ilustra con claridad la diferencia conceptual entre "eficacia relativa" y "eficacia/impacto absoluto". No se fuerza ningún veredicto, dado que el propio examen la anuló.

> **Nota de cobertura (actualizada 2026-10-05):** las discrepancias con la clave oficial que se contabilizaban antes en las preguntas 2020-2023 de este módulo se debían a que se había usado la plantilla de respuestas de otro año; ya están corregidas y la clave de cada pregunta coincide con la explicación (ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`).

> **Nota de cobertura (dataset 2009-2019):** la incorporación del dataset de exámenes MIR 2009-2019 aportó 22 preguntas reales adicionales de Tema 5 (Estudios de validación de una prueba diagnóstica) y Tema 6 (Medidas en epidemiología), añadidas a continuación en orden cronológico — con estas 22 preguntas se eleva a 32 preguntas reales en el módulo.

### MIR-2009-197
¿Cuál de las características de un test diagnóstico es análoga al poder o potencia de un estudio?

A. Valor predictivo positivo.
B. Valor predictivo negativo.
C. Sensibilidad.
D. Especificidad.
E. Utilidad.

**Respuesta correcta: C** — *(fuente: Examen MIR 2009, pregunta 197)*

### MIR-2010-196
Una prueba dio positivo en el 90% de los enfermos; el 79% de los que dieron positivo estaban enfermos; sólo el 87% de los sanos dio negativo; y el 96% de los que dieron negativo estaban sanos. La sensibilidad (S), especificidad (E), valor predictivo positivo (VPP) y valor predictivo negativo (VPN) son:

A. S = 0,87, E = 0,90, VPP = 0,79, VPN = 0,96.
B. S = 0,79, E = 0,87, VPP = 0,90, VPN = 0,96.
C. S = 0,79, E = 0,96, VPP = 0,90, VPN = 0,87.
D. S = 0,90, E = 0,87, VPP = 0,79, VPN = 0,96.
E. S = 0,87, E = 0,79, VPP = 0,96, VPN = 0,90.

**Respuesta correcta: D** — *(fuente: Examen MIR 2010, pregunta 196)*

### MIR-2011-186
En un ensayo clínico que compara un nuevo antiagregante frente al tratamiento habitual con ácido acetilsalicílico en la prevención de infarto de miocardio (IAM) tras 2 años de tratamiento, se han obtenido los siguientes resultados: Nuevo tratamiento: 25 IAM sobre 500 pacientes. Tratamiento habitual: 50 IAM sobre 500 pacientes. ¿Cuál es la reducción absoluta de riesgo (RAR) que se consigue con el nuevo antiagregante?

A. 50%.
B. 25%.
C. 10%.
D. 100%.
E. 5%.

**Respuesta correcta: E** — *(fuente: Examen MIR 2011, pregunta 186)*

### MIR-2011-190
Un paciente se somete a una prueba de cribado para el diagnóstico precoz de una enfermedad neoplásica. En nuestra población dicha prueba tiene una sensibilidad del 98,2%, una especificidad del 94,7%, un valor predictivo positivo del 66,2% y un valor predictivo negativo del 99,8%. Si la prueba arroja un resultado alterado, ¿qué probabilidad tiene de NO padecer la enfermedad?

A. 98,2%.
B. 33,8%.
C. 99,8%.
D. 66,2%.
E. 5,3%.

**Respuesta correcta: B** — *(fuente: Examen MIR 2011, pregunta 190)*

### MIR-2011-191
La prevalencia de cáncer de cérvix en Inglaterra es tres veces superior a la de España. Si usamos el mismo test serológico de detección del virus del papiloma humano (VPH):

A. El valor predictivo positivo del test en Inglaterra será mayor que en España.
B. El valor predictivo positivo del test en Inglaterra será igual que en España.
C. El valor predictivo positivo del test en Inglaterra será menor que en España.
D. La validez interna de la prueba en Inglaterra será mayor que en España.
E. La validez interna de la prueba en Inglaterra será menor que en España.

**Respuesta correcta: A** — *(fuente: Examen MIR 2011, pregunta 191)*

### MIR-2012-182
Se ha realizado un estudio de cohorte restrospectivo para conocer si los pacientes que toman antipsicóticos presentan un mayor riesgo de muerte súbita que la población que no utiliza antipsicóticos. Una vez realizado el ajuste por posibles factores de confusión se ha obtenido un riesgo relativo de 2,39 (intervalo de confianza al 95% de 1,77-3,22). ¿Cuál es la interpretación más correcta del resultado?

A. El resultado es compatible con un incremento de riesgo asociado al uso de antipsicóticos, pero no es estadísticamente significativo.
B. El resultado sugiere que los antipsicóticos protegen frente al riesgo de muerte súbita.
C. El resultado no es interpretable porque no se ha hecho una asignación aleatoria de los tratamientos.
D. Hay un incremento de riesgo pero es pequeño e irrelevante desde un punto de vista clínico.
E. El resultado apoya la hipótesis de que el uso de antipsicóticos aumenta el riesgo de muerte.

**Respuesta correcta: E** — *(fuente: Examen MIR 2012, pregunta 182)*

### MIR-2012-193
Si consideramos una cifra de 24 mmHg de tensión intraocular medida por tonometría ocular como criterio diagnóstico de glaucoma en lugar de 20 mmHg:

A. Aumenta el número de verdaderos negativos.
B. Disminuye el número de falsos negativos.
C. Aumenta el número de verdaderos positivos.
D. Aumenta el número de falsos positivos
E. Aumenta la sensibilidad y disminuye la especificidad.

**Respuesta correcta: A** — *(fuente: Examen MIR 2012, pregunta 193)*

### MIR-2012-194
La sensibilidad de una prueba diagnóstica mide:

A. La proporción de casos de pacientes sin la enfermedad que presentan un resultado negativo de la prueba diagnóstica.
B. La proporción de casos de pacientes sin la enfermedad que presenta un resultado positivo de la prueba diagnóstica.
C. La proporción de pacientes que se someten a la prueba que tienen la enfermedad.
D. La proporción de casos de enfermos con resultado positivo de la prueba diagnóstica.
E. La proporción de casos con resultado positivo de la prueba que son verdaderos enfermos.

**Respuesta correcta: D** — *(fuente: Examen MIR 2012, pregunta 194)*

### MIR-2013-176
La prueba kappa o test de Cohen:

A. Mide la validez interna de una prueba diagnóstica.
B. Mide la validez externa de una prueba diagnóstica.
C. Se mantiene estable para una misma prueba diagnóstica al modificar la frecuencia de la enfermedad.
D. Se mantiene estable para una misma prueba diagnóstica tanto si se utiliza como cribado o prueba clínica.
E. Tiende a disminuir su valor al aumentar el número de categorías de la prueba diagnóstica.

**Respuesta correcta: E** — *(fuente: Examen MIR 2013, pregunta 176)*

### MIR-2013-181
En un estudio prospectivo en que se compara un nuevo antiagregante (grupo experimental) frente al tratamiento habitual con ácido acetilsalicílico (grupo control) se han obtenido los siguientes resultados en la prevención de infartos de miocardio (IAM) a los 2 años de tratamiento: nuevo tratamiento, 25 IAM sobre 500 pacientes; tratamiento habitual, 50 IAM sobre 500 pacientes. ¿Cuál es el riego relativo de padecer un IAM con el nuevo tratamiento respecto al tratamiento habitual?

A. 0,75.
B. 0,5.
C. 60%.
D. 5%
E. 2.

**Respuesta correcta: B** — *(fuente: Examen MIR 2013, pregunta 181)*

### MIR-2013-195
Si aplicamos una prueba de laboratorio para el diagnóstico de una determinada enfermedad que es dos veces más frecuente en hombres que en mujeres, ¿cuál de los siguientes parámetros será más elevado en la población femenina que en la masculina?

A. La prevalencia de la enfermedad.
B. La sensibilidad de la prueba.
C. La especificidad de la prueba.
D. El valor predictivo positivo de la prueba
E. El valor predictivo negativo de la prueba.

**Respuesta correcta: E** — *(fuente: Examen MIR 2013, pregunta 195)*

### MIR-2013-198
Una prueba diagnóstica tiene una sensibilidad del 95%, ¿qué nos indica este resultado?

A. La prueba dará, como máximo, un 5% de falsos negativos.
B. La prueba dará, como máximo, un 5% de falsos positivos.
C. La probabilidad que un resultado positivo corresponda realmente a un enfermo será alta.
D. La probabilidad que un resultado negativo corresponda realmente a un sano será alta.
E. La prueba será muy específica.

**Respuesta correcta: A** — *(fuente: Examen MIR 2013, pregunta 198)*

### MIR-2014-195
Señale la definición correcta:

A. El Número Necesario a Tratar (NNT) es el inverso del Riesgo Relativo (RR).
B. La Reducción del Riesgo Relativo (RRR) puede diferenciar claramente los riesgos y beneficios grandes de los pequeños.
C. La Reducción del Riesgo Relativo (RRR) es una medida del esfuerzo terapéutico que deben realizar clínicos y pacientes para evitar resultados negativos de sus enfermedades.
D. El Número Necesario a Dañar (NND) se calcula dividiendo la unidad entre el Número Necesario a Tratar (NNT).
E. La Reducción del Riesgo Absoluto (RRA) se calcula mediante la diferencia absoluta de la tasa de episodios en el grupo control menos la tasa de episodios en el grupo intervención.

**Respuesta correcta: E** — *(fuente: Examen MIR 2014, pregunta 195)*

### MIR-2014-206
Si definimos el punto de corte para diagnosticar insuficiencia renal a través del Índice de Filtrado Glomerular (IFG) como 15 ml/min en vez de 60 ml/ min está aumentando:

A. La sensibilidad del IFG.
B. La especificidad del IFG.
C. El Valor Predictivo Positivo del IFG.
D. El Valor Predictivo Negativo del IFG.
E. La Validez interna y externa del IFG.

**Respuesta correcta: B** — *(fuente: Examen MIR 2014, pregunta 206)*

### MIR-2015-131
Un paciente acude a consulta por malestar general y coloración amarillenta de la piel y su médico sospecha que se trata de un cuadro de hepatitis A. ¿Cuál de las siguientes respuestas constituye el factor que de forma más exacta y segura permite determinar la probabilidad preprueba (antes de realizar ningún estudio) de que se trate de dicho cuadro?

A. Intensidad de la ictericia.
B. Frecuencia de la hepatitis A en el entorno.
C. Días de duración del cuadro.
D. Experiencia del profesional sobre cuadros de ictericia.
E. Enfermedades previas del paciente.

**Respuesta correcta: B** — *(fuente: Examen MIR 2015, pregunta 131)*

### MIR-2015-189
Se realiza un estudio para investigar la asociación existente entre el factor X y la enfermedad Z. Para ello se seleccionan 120 sujetos con la enfermedad y 420 controles (sin la enfermedad) emparejados por edad y sexo. En ambos grupos se encuentra que 20 sujetos estaban expuestos al factor X. ¿Cuál es la razón de ventaja (“Odds Ratio”, OR) entre el factor X y la enfermedad Z?

A. OR = 1 (no hay asociación).
B. OR = 2.
C. OR = 4.
D. OR = 6
E. OR = 8.

**Respuesta correcta: C** — *(fuente: Examen MIR 2015, pregunta 189)*

### MIR-2015-235
Cuando realizamos el triple test (alfafetoproteina, gonadotropina coriónica humana y el estriol no conjugado) a las embarazadas, la sensibilidad y especificidad frente a la trisomía 21 (S. de Down) son del 63 y 95% respectivamente. Ello significa:

A. El porcentaje de falsos negativos es del 5%.
B. El porcentaje de falsos positivos es del 37%.
C. El Área Bajo la Curva (AUC) ROC valdría 1.
D. La probabilidad de no tener trisomía 21 (S. de Down) siendo el resultado negativo es del 95%.
E. La probabilidad de tener resultado positivo a la prueba teniendo la trisomía 21 (S. de Down) es del 63%.

**Respuesta correcta: E** — *(fuente: Examen MIR 2015, pregunta 235)*

### MIR-2016-206
Realizamos la determinación de antígeno prostático específico (PSA) para diagnosticar carcinoma de próstata en adolescentes y en ancianos sanos, sin hiperplasia benigna de próstata:

A. La sensibilidad del PSA en los adolescentes será mayor que en los ancianos.
B. La especificidad del PSA en los adolescentes será menor que en los ancianos.
C. No cambiará la validez interna del PSA en adolescentes o ancianos sanos.
D. El valor predictivo positivo del PSA en los adolescentes será mayor que en los ancianos.

**Respuesta correcta: C** — *(fuente: Examen MIR 2016, pregunta 206)*

### MIR-2017-118
El NNT o número de pacientes que deben recibir tratamiento para conseguir que uno de ellos presente el acontecimiento de interés se obtiene:

A. Dividiendo por dos la disminución de riesgo relativo.
B. Dividiendo por dos la reducción absoluta del riesgo.
C. Obteniendo el inverso de la reducción del riesgo relativo.
D. Obteniendo el inverso de la reducción absoluta del riesgo.

**Respuesta correcta: D** — *(fuente: Examen MIR 2017, pregunta 118)*

### MIR-2017-129
Un signo patognomónico supone:

A. Una sensibilidad del 100%.
B. Un área bajo la curva (AUC) de 1.
C. Un valor predictivo positivo del 100%.
D. Un elevado número de falsos positivos.

**Respuesta correcta: C** — *(fuente: Examen MIR 2017, pregunta 129)*

### MIR-2018-222
¿Cuál de las siguientes características tiene MENOS importancia en un programa de cribado (o detección precoz) poblacional?

A. Que la prueba diagnóstica para la detección precoz sea muy específica.
B. Que la identificación precoz del trastorno permita aplicar intervenciones que mejoren su pronóstico.
C. Que el proceso de detección precoz sea económicamente rentable.
D. Que el programa se aplique a un trastorno común con una gran carga de morbilidad.

**Respuesta correcta: A** — *(fuente: Examen MIR 2018, pregunta 222)*

### MIR-2019-129
La angiografía coronaria se considera patrón oro, gold estándar o criterio de verdad en el diagnóstico de la cardiopatía isquémica. En la evaluación del electrocardiograma (ECG) como prueba diagnóstica, se han estudiado 1000 electrocardiogramas de pacientes con infarto agudo de miocardio como manifestación de cardiopatía isquémica. La angiografía coronaria confirmó cardiopatía isquémica en 950 de los 1000 pacientes. Señale la respuesta correcta:

A. La sensibilidad diagnóstica del ECG es de 0,05.
B. El valor predictivo positivo del ECG es de 0,95.
C. El valor predictivo negativo del ECG es de 1.
D. La especificidad diagnóstica del ECG es de 1,05.

**Respuesta correcta: B** — *(fuente: Examen MIR 2019, pregunta 129)*

---

## 4. Preguntas inéditas

### EST-02-INED-01
Un nuevo test para detectar una enfermedad tiene una sensibilidad del 90% y una especificidad del 85%. Se aplica en dos poblaciones: la población A tiene una prevalencia de la enfermedad del 1%, y la población B tiene una prevalencia del 40%. ¿Cuál de las siguientes afirmaciones es correcta?

A. La sensibilidad y la especificidad del test serán distintas en ambas poblaciones, ya que dependen de la prevalencia.
B. El valor predictivo positivo del test será mayor en la población B que en la población A.
C. El valor predictivo negativo del test será menor en la población B que en la población A, y esto es correcto.
D. B y C son ciertas.

**Respuesta correcta: D**
**Justificación de incorrectas:**
- A: incorrecta — la sensibilidad y la especificidad son parámetros de validez interna, no dependen de la prevalencia; serán las mismas (90% y 85%) en ambas poblaciones.
- B (aislada) y C (aislada) son ciertas individualmente, por lo que la respuesta que las combina (D) es la más completa y correcta.
**Nota:** a mayor prevalencia (población B), el VPP aumenta y el VPN disminuye — es la relación inversa clásica entre prevalencia y valores predictivos.
**Origen:** inédita | **Referencia bibliográfica:** AMIR, *Manual de Estadística y Epidemiología*, Tema 5.1 "Parámetros de validez externa", pág. 28.
**Fecha de generación:** 2026-08-19

### EST-02-INED-02
En un ensayo clínico se compara un fármaco antihipertensivo experimental frente a placebo para prevenir el ictus. Tras el seguimiento, la incidencia acumulada de ictus es del 8% en el grupo placebo y del 5% en el grupo tratado. ¿Cuántos pacientes es necesario tratar (NNT) para evitar 1 caso de ictus?

A. 3.
B. 13.
C. 33.
D. 62.

**Respuesta correcta: C**
**Justificación de incorrectas:**
- A: incorrecta — confunde la RAR (3%) con el NNT directamente, sin aplicar la fórmula NNT=100/RAR(%).
- B: incorrecta — no corresponde al cálculo correcto (100/3 ≈ 33, no 13).
- D: incorrecta — no corresponde al cálculo correcto.
**Nota de cálculo:** RAR = Io − Ie = 8% − 5% = 3%. NNT = 100/RAR(%) = 100/3 ≈ 33.
**Origen:** inédita | **Referencia bibliográfica:** AMIR, *Manual de Estadística y Epidemiología*, Tema 6.3 "Medidas de impacto — NNT", pág. 32-33.
**Fecha de generación:** 2026-08-19

---

## 5. Flashcards del módulo

```
¿Depende la sensibilidad de la prevalencia de la enfermedad?	No, es un parámetro de validez interna	MIR::EST::Validacion-medidas-epi
¿Depende el valor predictivo positivo de la prevalencia?	Sí, es un parámetro de validez externa	MIR::EST::Validacion-medidas-epi
¿Cuándo es útil un test muy sensible en la práctica?	Cuando el resultado es negativo (permite descartar enfermedad, "SnNout")	MIR::EST::Validacion-medidas-epi
¿Cuándo es útil un test muy específico en la práctica?	Cuando el resultado es positivo (permite confirmar enfermedad, "SpPin")	MIR::EST::Validacion-medidas-epi
¿Qué representa la curva ROC?	La relación (trade-off) entre sensibilidad y especificidad a distintos puntos de corte	MIR::EST::Validacion-medidas-epi
¿Qué mide el índice de Kappa (y con qué NO debe confundirse)?	La concordancia/acuerdo entre observadores — no debe confundirse con la relación S/E, que se resume con la curva ROC	MIR::EST::Validacion-medidas-epi
¿Debe ser un test de screening muy sensible o muy específico?	Muy sensible	MIR::EST::Validacion-medidas-epi
¿Debe ser un test de confirmación muy sensible o muy específico?	Muy específico	MIR::EST::Validacion-medidas-epi
¿Cuál es la fórmula de la prevalencia en una enfermedad estacionaria?	Prevalencia = incidencia × duración media de la enfermedad	MIR::EST::Validacion-medidas-epi
¿En qué tipo de estudios se usa el riesgo relativo (RR)?	En estudios con seguimiento prospectivo (cohortes, ensayo clínico)	MIR::EST::Validacion-medidas-epi
¿En qué tipo de estudios se usa la odds ratio (OR) y qué limitación tiene?	En estudios retrospectivos (casos y controles); sobreestima la fuerza de asociación real, salvo en enfermedades poco frecuentes (<10%)	MIR::EST::Validacion-medidas-epi
¿Cómo se calcula el NNT?	NNT = 100 / RAR (expresando la RAR en %)	MIR::EST::Validacion-medidas-epi
¿Cuál es el único criterio de causalidad de Bradford Hill verdaderamente imprescindible?	La temporalidad (la causa debe preceder al efecto)	MIR::EST::Validacion-medidas-epi
¿Cuál es el criterio de causalidad de Bradford Hill considerado más potente?	La demostración experimental	MIR::EST::Validacion-medidas-epi
¿Son la significación estadística y la ausencia de sesgos criterios de Bradford Hill?	No, son consideraciones metodológicas distintas, no forman parte de los 9 criterios	MIR::EST::Validacion-medidas-epi
```

---

## 6. Referencias

- AMIR. *Manual de Estadística y Epidemiología*. Academia de Estudios MIR. Tema 5 "Estudios de validación de una prueba diagnóstica" y Tema 6 "Variables de medidas epidemiológicas", pág. 26-34. Fuente: `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`.
- Exámenes MIR 2020, 2021, 2022, 2023, 2024, 2025 (preguntas reales citadas en sección 3) — `data/preguntas_{año}.json`.
