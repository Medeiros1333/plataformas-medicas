# EST-04 · Estadística descriptiva e inferencial: muestreo, variables e intervalos de confianza

**Especialidad:** Estadística (EST)
**Fuente:** `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 01 "Estadística descriptiva" y Tema 02 "Estadística inferencial".
**Peso histórico:** el manual señala Estadística Descriptiva como "uno de los temas menos preguntados" (0-1 pregunta/año), destacando el muestreo y la distribución normal como los apartados más rentables. La Estadística Inferencial de medias fue más preguntada en el pasado (intervalos de confianza, error estándar), con menos preguntas —más teóricas— en años recientes.

---

## 1. Resumen clínico

### 1.1 El proceso estadístico: de la muestra a la población

- **Estadística descriptiva:** analiza la muestra en sí (resultados verídicos, no generalizables, sin error de extrapolación).
- **Estadística inferencial:** extrapola los resultados de la muestra a la población, con una probabilidad de error inherente.
- **Contraste de hipótesis:** compara resultados entre grupos/poblaciones — ver [[EST-05]].
- **Clave de identificación en el examen:** si el enunciado habla de "pacientes"/"muestra" → descriptiva; si habla de "población"/"verdadero valor"/"confianza" → inferencial.

### 1.2 Técnicas de muestreo

**Probabilístico** (usa el azar → mayor representatividad, mejor calidad metodológica):
- **Aleatorio simple:** número a cada individuo, selección al azar. Con reposición (probabilidades iguales en cada extracción, preferible en poblaciones grandes) vs. sin reposición.
- **Aleatorio sistemático:** asignación numérica + regla matemática (equivalente al simple si la población está ordenada aleatoriamente).
- **Estratificado:** divide la población según una variable que se quiere controlar (evitar confusión) y muestrea al azar dentro de cada estrato.
- **Por conglomerados:** agrupaciones naturales preexistentes y representativas (p. ej., hospitales); se seleccionan uno o varios al azar; si son muy grandes, muestreo bietápico (aleatorio simple dentro del conglomerado).

**No probabilístico** (criterios no aleatorios → menor representatividad):
- **Casos consecutivos:** el más usado en ensayos clínicos; incorpora a quienes cumplen criterios de elegibilidad en un período/hasta un número dado — si se hace bien, la representatividad puede acercarse a la probabilística.
- **De conveniencia/accidental:** sujetos disponibles, riesgo de sesgo si el fenómeno no es homogéneo.
- **A criterio/intencional:** grupos que el investigador considera representativos.

### 1.3 Tipos de variables

| Tipo | Subtipo | Ejemplo |
|---|---|---|
| **Cualitativa (categórica)** | Nominal (sin orden): color de ojos, sexo | — |
| | **Dicotómica/binaria** (2 valores, p. ej. HTA sí/no) vs. **policotómica** (>2 valores) | — |
| | **Ordinal** (orden natural, números sin propiedades matemáticas — no representan cantidad real): escala de dolor 1-2-3 | Tener dolor "2" no es el doble que "1" |
| **Cuantitativa** | **Discreta** (solo enteros): n.º de hijos | | **Continua** (cualquier valor, con decimales): glucemia |

### 1.4 Medidas descriptivas

- **Cualitativas:** porcentajes/proporciones (sin medidas de dispersión).
- **Cuantitativas:** tendencia central + dispersión.
  - **Media:** la más usada en distribuciones simétricas; sensible a valores extremos.
  - **Mediana** (percentil 50): más robusta en distribuciones asimétricas/con extremos; coincide con la media si la distribución es simétrica.
  - **Moda:** valor más repetido (uni o polimodal).
  - **Desviación típica (σ):** raíz de la varianza; medida de dispersión para distribuciones **simétricas**.
  - **Rango intercuartílico** (C3-C1, percentil 75 - percentil 25): medida de dispersión para distribuciones **asimétricas**.
  - **Rango:** máximo - mínimo.
- **Distribución normal (descriptiva):** x ± 1 DE = 68% central de las observaciones; x ± 2 DE = 95% central.

### 1.5 Estadística inferencial: intervalos de confianza

- **Teorema central del límite:** las infinitas medias muestrales de una población siguen una distribución normal centrada en la verdadera media poblacional (µ).
- **Para variables cuantitativas (inferencia de medias):**
  - No se usa σ, sino el **error estándar de la media (eem) = σ/√n**.
  - **IC 68% = µ ± eem; IC 95% = µ ± 2 eem; IC 99% = µ ± 2,5 eem.**
- **Para variables cualitativas (inferencia de proporciones):**
  - Distribución binomial → se evalúa una categoría "A" frente al resto.
  - **Error estándar de la proporción (eep) = √[p(A)·p(1-A)/n]**.
  - **IC 68% = P(A) ± eep; IC 95% = P(A) ± 2 eep; IC 99% = P(A) ± 2,5 eep.**

### 1.6 Cálculo del tamaño muestral en estudios de inferencia

- **No confundir** con el cálculo del tamaño muestral en contraste de hipótesis (ver [[EST-05]]).
- Datos necesarios: **nivel de precisión** deseado (a mayor precisión = menor anchura del IC = mayor n necesario); **nivel de confianza** deseado (95%, 99%...; a menor confianza, menor anchura del IC con el mismo n); y según el tipo de variable: **porcentaje esperado** (cualitativa) o **varianza** (cuantitativa).
- **Distractor típico:** la potencia estadística/error beta **no** interviene en el cálculo del tamaño muestral de inferencia — sí en el de contraste de hipótesis.
- El MIR a veces se refiere (de forma no estrictamente correcta) al inverso del nivel de confianza como "error alfa" — si aparece como opción, debe asumirse como correcta en ese contexto.

---

## 2. Puntos clave para el MIR

1. El muestreo probabilístico usa el azar y ofrece mejor calidad metodológica que el no probabilístico.
2. El muestreo de casos consecutivos es el más utilizado en ensayos clínicos.
3. El muestreo estratificado controla una variable de confusión dividiendo la población antes de muestrear.
4. Las variables ordinales tienen orden pero sus números no representan magnitudes reales (no son cuantitativas).
5. La media es sensible a valores extremos; la mediana es robusta frente a ellos.
6. La desviación típica se usa en distribuciones simétricas; el rango intercuartílico, en asimétricas.
7. En estadística descriptiva, x ± 2 DE = 95% de las observaciones; en estadística inferencial, µ ± 2 eem = IC del 95%.
8. El error estándar de la media (eem) = σ/√n; a mayor n, menor eem y más estrecho el intervalo de confianza.
9. La potencia estadística y el error beta NO intervienen en el cálculo del tamaño muestral de un estudio de inferencia (sí en el de contraste de hipótesis).

---

## 3. Preguntas reales

> **Nota de cobertura:** la búsqueda inicial en el dataset 2020-2025 no localizó preguntas reales específicas de estos apartados (la única coincidencia relacionada con "tamaño muestral", MIR-2023-45, trata sobre el efecto del tamaño muestral en un estudio transversal, ya correctamente clasificada en [[EST-02]] — se mantiene allí sin duplicar). La incorporación posterior del dataset de exámenes MIR 2009-2019 sí aportó 9 preguntas reales de Tema 1 (Estadística descriptiva) y Tema 2 (Estadística inferencial), añadidas a continuación en orden cronológico.

### MIR-2009-193
Se realiza un estudio para determinar si se produce o no hemorragia digestiva con un determinado tipo de tratamiento. En este caso la variable principal del estudio es de tipo?

A. Cualitativo continuo.
B. Categórico ordinal.
C. Categórico discreto.
D. Cualitativo binario.
E. Categórico dependiente.

**Respuesta correcta: D** — *(fuente: Examen MIR 2009, pregunta 193)*

### MIR-2010-178
¿Cuál de los siguientes índices NO es una medida de dispersión?

A. Desviación estándar.
B. Varianza.
C. Rango de amplitud.
D. Desviación media.
E. Mediana.

**Respuesta correcta: E** — *(fuente: Examen MIR 2010, pregunta 178)*

### MIR-2013-175
En una población, el valor medio del colesterol total es de 216 mg/dl, con una desviación típica de 5 mg/ dl. El porcentaje de personas cuyo nivel de colesterol es mayor de 226 mg/dl es, aproximadamente:

A. El 0,025%.
B. El 0,5%.
C. El 2,5%.
D. El 5%.
E. El 10%.

**Respuesta correcta: C** — *(fuente: Examen MIR 2013, pregunta 175)*

### MIR-2013-177
¿Cuál de los siguientes parámetros mide el apuntamiento de una distribución?

A. El coeficiente de Fisher.
B. Los cuartiles.
C. La varianza.
D. La curtosis.
E. La amplitud.

**Respuesta correcta: D** — *(fuente: Examen MIR 2013, pregunta 177)*

### MIR-2014-191
Un Pediatra desea estudiar el sobrepeso en los niños de 14 años, según los valores del IMC (índice de masa corporal). Para estimar el tamaño muestral necesario propone un nivel de confianza del 95% y una precisión de 1 unidad de IMC. ¿Qué más parámetros necesita conocer para determinar el tamaño muestral?

A. La media del IMC en la población.
B. La varianza del IMC.
C. La media y la desviación típica del IMC.
D. El tamaño de la población y la media del IMC.
E. La desviación típica del IMC y el tamaño de población.

**Respuesta correcta: B** — *(fuente: Examen MIR 2014, pregunta 191)*

### MIR-2015-184
Se ha determinado en un grupo de sujetos la presencia (x=1) o ausencia (x=0) de bacteriuria. ¿De qué tipo de variable se trata?

A. Ordinal.
B. Numérica.
C. Categórica.
D. Cuantitativa continua.
E. Cuantitativa discreta.

**Respuesta correcta: C** — *(fuente: Examen MIR 2015, pregunta 184)*

### MIR-2015-185
Se realiza una estimación poblacional de los niveles de creatinina en sangre, en un grupo de mujeres embarazadas, obteniéndose los siguientes resultados: media (×) 0,8 mg/dL; desviación típica (s) 0,62 mg/dL; tamaño muestral (n) 85 mujeres. Según los datos anteriores el intervalo de confianza para la media poblacional (?) con un nivel de confianza de 95% (Z=1,96), es:

A. 0,8 ± 0,04.
B. 0,8 ± 0,13.
C. 0,8 ± 0,62.
D. 0,8 ± 1,96.
E. 0,8 ± 0,07

**Respuesta correcta: B** — *(fuente: Examen MIR 2015, pregunta 185)*

### MIR-2017-130
En una población se quiere determinar la prevalencia de pediculosis en niños menores de 12 años. Para ello se divide la población en barrios y en cada uno de ellos se toma una muestra aleatoria cuyo tamaño idóneo ha sido previamente determinado. El tipo de muestreo utilizado ha sido:

A. Muestreo aleatorio simple.
B. Muestreo aleatorio estratificado.
C. Muestreo aleatorio por conglomerados.
D. Muestreo sistemático.

**Respuesta correcta: B** — *(fuente: Examen MIR 2017, pregunta 130)*

### MIR-2019-122
Si el número de observaciones de una muestra se multiplica por 4, el error típico (o estándar) de la media:

A. Se divide por 4.
B. Se divide por 2.
C. Se multiplica por 4.
D. Se multiplica por 2.

**Respuesta correcta: B** — *(fuente: Examen MIR 2019, pregunta 122)*

---

## 4. Preguntas inéditas

### EST-04-INED-01
Un investigador desea estudiar la prevalencia de una enfermedad rara en pacientes hospitalizados de una ciudad con 8 hospitales de características similares. Por motivos logísticos, decide seleccionar aleatoriamente 2 de los 8 hospitales y estudiar a todos los pacientes ingresados en ellos. ¿Qué técnica de muestreo ha empleado?

A. Muestreo aleatorio estratificado.
B. Muestreo por conglomerados.
C. Muestreo de casos consecutivos.
D. Muestreo a criterio o intencional.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — el muestreo estratificado requiere dividir la población según una variable de control y muestrear dentro de cada estrato, no seleccionar unidades naturales completas como los hospitales.
- C: incorrecta — el muestreo de casos consecutivos incorpora pacientes según criterios de elegibilidad a medida que se presentan, no mediante la selección aleatoria de unidades preexistentes.
- D: incorrecta — el muestreo a criterio se basa en la elección subjetiva del investigador de grupos que considera representativos, no en una selección aleatoria de conglomerados.
**Origen:** inédita | **Referencia bibliográfica:** `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 01, apartado 1.1, "Muestreo por conglomerados".
**Fecha de generación:** 2026-08-28

### EST-04-INED-02
En un estudio se mide la presión arterial sistólica en una muestra de 400 pacientes, obteniendo una media de 130 mmHg y una desviación estándar de 10 mmHg. Se desea calcular el intervalo de confianza del 95% para la verdadera media poblacional. ¿Cuál es el procedimiento correcto?

A. Calcular 130 ± 2 × 10 = [110, 150] mmHg.
B. Calcular el error estándar de la media (eem = 10/√400 = 0,5) y obtener 130 ± 2 × 0,5 = [129, 131] mmHg.
C. Calcular el error estándar de la proporción, ya que se trata de una variable cuantitativa medida en una muestra grande.
D. No es posible calcular un intervalo de confianza sin conocer la potencia estadística del estudio.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — ese cálculo (media ± 2 DE) corresponde a estadística descriptiva (95% de los pacientes de la muestra), no a la estimación del intervalo de confianza poblacional, que requiere el error estándar de la media, no la desviación estándar directamente.
- C: incorrecta — el error estándar de la proporción se usa para variables cualitativas, no para variables cuantitativas como la presión arterial.
- D: incorrecta — la potencia estadística no es necesaria para calcular un intervalo de confianza en un estudio de inferencia.
**Origen:** inédita | **Referencia bibliográfica:** `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 02, apartado 2.1, "Estadística Inferencial para variables cuantitativas".
**Fecha de generación:** 2026-08-28

---

## 5. Flashcards del módulo

```
¿Qué técnica de muestreo es la más utilizada en el reclutamiento de ensayos clínicos?	El muestreo de casos consecutivos	MIR::EST::Técnicas de muestreo
¿Para qué se usa el muestreo estratificado?	Para controlar una variable de confusión, dividiendo la población antes de muestrear	MIR::EST::Técnicas de muestreo
¿Qué son los conglomerados en el muestreo?	Agrupaciones naturales preexistentes y representativas de la población (p. ej., hospitales)	MIR::EST::Técnicas de muestreo
¿Una variable ordinal es cualitativa o cuantitativa?	Cualitativa (los números no representan magnitudes matemáticas reales, solo un orden)	MIR::EST::Tipos de variables
¿Qué medida de dispersión se usa en distribuciones simétricas, y cuál en asimétricas?	Simétricas: desviación típica. Asimétricas: rango intercuartílico	MIR::EST::Medidas de dispersión
¿Qué porcentaje de observaciones engloba el intervalo x ± 2 DE en estadística descriptiva?	El 95% central	MIR::EST::Estadística descriptiva
¿Cómo se calcula el error estándar de la media (eem)?	eem = σ/√n	MIR::EST::Estadística inferencial
¿Qué fórmula define el intervalo de confianza del 95% para una media poblacional?	µ ± 2 eem	MIR::EST::Intervalos de confianza
¿La potencia estadística interviene en el cálculo del tamaño muestral de un estudio de inferencia?	No; solo en el cálculo del tamaño muestral de un contraste de hipótesis	MIR::EST::Tamaño muestral
```

---

## 6. Referencias

- `02_Bibliografia/Epidemiologia y estadistica AMIR.pdf`, Tema 01 "Estadística descriptiva" y Tema 02 "Estadística inferencial".
- Examen MIR 2023 (pregunta real citada en sección 3, integrada en [[EST-02]]) — `data/preguntas_2023.json`.
