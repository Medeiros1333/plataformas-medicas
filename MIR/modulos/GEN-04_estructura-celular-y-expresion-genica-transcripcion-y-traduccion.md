# GEN-04 · Estructura celular básica, transcripción y traducción

**Especialidad:** Genética (GEN)
**Fuente:** `02_Bibliografia/Genetica CTO.pdf`, Tema 01 "Introducción a la genética" y Tema 02 "Regulación y expresión de los genes".
**Peso histórico:** contenido de base. El manual señala explícitamente que el Tema 1 no tiene "preguntas MIR representativas", y que **más del 80% de las preguntas de Genética se concentran en el Tema 3** "Herencia y enfermedad" (ver [[GEN-01]]). Este módulo cierra la explotación completa del manual con el contenido fundacional restante.

---

## 1. Resumen clínico

### 1.1 Célula eucariota vs. procariota

- **Eucariota:** núcleo verdadero, ribosomas **80S**.
- **Procariota:** sin núcleo, ribosomas **70S**.
- **Mitosis:** de 1 célula 2n → 2 células 2n (idénticas). **Meiosis:** de 1 célula 2n → 4 células n (gametos).

### 1.2 Regulación de la expresión génica: niveles

- Todas las células somáticas comparten el mismo **genotipo**, pero expresan genes distintos (**fenotipo**) según el tipo celular y su estado (ejemplo: linfocitos T según su activación).
- **3 niveles de regulación:** pretranscripcional, transcripcional y postranscripcional.
- **Factores pre/transcripcionales:**
  - Organización del ADN: la cromatina debe estar **descondensada** para poder transcribirse.
  - **Metilación del ADN** en islas CG: a **mayor** metilación, **menor** expresión.
  - Modificación postraduccional de histonas: acetilación, metilación, fosforilación.
  - **Regiones reguladoras del gen:** **promotor** (une ARN-polimerasa y factores de transcripción; secuencias TATA/CAAT/GC; inicia la transcripción basal), **intensificador** (une factores de transcripción y proteínas reguladoras; controla la tasa de transcripción), **silenciador** (reprime la transcripción).

### 1.3 Transcripción (ADN → ARNm, en el núcleo)

- Mediada por la **ARN-polimerasa II**. El ARNm maduro contiene solo la información de los **exones** (los intrones no se transcriben al ARN maduro).
- **Regulación postranscripcional:**
  - **Splicing alternativo:** un mismo gen puede generar distintos ARNm omitiendo unos u otros exones — fisiológico en algunos genes, patológico si hay mutaciones en las secuencias adyacentes a los límites exón-intrón (confunde la maquinaria de corte).
  - **Vida media del ARNm:** condicionada por su secuencia, el nivel de traducción y el **ARN corto de interferencia (ARNsi)**.

### 1.4 Traducción (ARNm → proteína, en los ribosomas del RER)

- Ribosoma eucariota: subunidades **60S y 40S**.
- **Código genético:** lectura de tripletes (codones) del ARNm.
  - **Universal** (virus, procariotas, eucariotas).
  - **Degenerado:** 4³ = 64 combinaciones posibles de tripletes > 20 aminoácidos → cada aminoácido puede codificarse por más de un triplete.
  - **Sin ambigüedad:** cada triplete codifica un único aminoácido.
  - Existen codones de inicio y fin de la traducción.
- **ARN de transferencia (ARNt):** transporta los aminoácidos; contiene el **anticodón** (triplete complementario al codón del ARNm).

---

## 2. Puntos clave para el MIR

1. Las células eucariotas tienen ribosomas 80S; las procariotas, 70S.
2. La mitosis genera 2 células 2n a partir de 1 célula 2n; la meiosis genera 4 células n a partir de 1 célula 2n.
3. A mayor metilación del ADN en islas CG, menor expresión génica.
4. El ARNm maduro contiene solo los exones; los intrones se eliminan por splicing.
5. El splicing alternativo permite que un mismo gen genere distintos ARNm/proteínas según qué exones se incluyan.
6. El código genético es universal, degenerado (más tripletes que aminoácidos) y sin ambigüedad (cada triplete codifica un solo aminoácido).
7. El ARNt reconoce el codón del ARNm mediante su anticodón complementario.
8. Más del 80% de las preguntas de Genética del MIR se concentran en el bloque de herencia y enfermedad, no en estos fundamentos moleculares — ver [[GEN-01]].

---

## 3. Preguntas reales

> **Nota de cobertura:** el manual señala explícitamente que el Tema 1 "no tiene preguntas MIR representativas". Para el Tema 2, se localizaron 2 citas (MIR 22-23, 42, sobre intrones/ARN maduro; y una pregunta sobre splicing alternativo y recombinación de exones) que, por su formato de cita AMIR/CTO, no se corresponden de forma fiable con la numeración `numero_pregunta` del dataset del proyecto (ver hallazgo #240). Se realizó búsqueda por contenido (splicing alternativo, ARN de interferencia, ribosoma 80S/70S, metilación de ADN, código genético) sin localizar preguntas reales, no usadas en otros módulos, en el dataset.

---

## 4. Preguntas inéditas

### GEN-04-INED-01
En un gen determinado, una mutación afecta a la secuencia adyacente al límite entre un exón y un intrón, sin alterar directamente la secuencia codificante del exón. ¿Cuál es la consecuencia más probable de esta mutación?

A. Ninguna, ya que las secuencias intrónicas no influyen en la expresión génica.
B. Alteración del splicing, con posible inclusión o exclusión errónea de exones en el ARNm maduro.
C. Aumento directo de la tasa de transcripción por activación del promotor.
D. Bloqueo completo e irreversible de la traducción en el ribosoma.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — las secuencias adyacentes a los límites exón-intrón son reconocidas por la maquinaria de splicing; su alteración sí tiene consecuencias funcionales.
- C: incorrecta — el promotor es una región distinta, relacionada con el inicio de la transcripción, no con los límites exón-intrón.
- D: incorrecta — el efecto descrito se produce a nivel de procesamiento del ARN (splicing), no directamente sobre la maquinaria de traducción ribosomal.
**Origen:** inédita | **Referencia bibliográfica:** `02_Bibliografia/Genetica CTO.pdf`, Tema 02, apartado "Regulación postranscripcional", splicing alternativo.
**Fecha de generación:** 2026-08-28

### GEN-04-INED-02
¿Cuál de las siguientes características define correctamente al código genético?

A. Es específico de cada especie, sin homología entre virus, procariotas y eucariotas.
B. Es degenerado: existen más combinaciones posibles de tripletes que aminoácidos a codificar, por lo que un mismo aminoácido puede tener varios codones.
C. Cada triplete puede codificar indistintamente para varios aminoácidos diferentes, según el contexto celular.
D. Se organiza en dobletes de nucleótidos, no en tripletes.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — el código genético es universal, compartido por virus, procariotas y eucariotas.
- C: incorrecta — el código genético no tiene ambigüedad: cada triplete codifica siempre un único aminoácido.
- D: incorrecta — el código genético se organiza en tripletes (codones), no en dobletes.
**Origen:** inédita | **Referencia bibliográfica:** `02_Bibliografia/Genetica CTO.pdf`, Tema 02, apartado 2.2 "Traducción", código genético.
**Fecha de generación:** 2026-08-28

---

## 5. Flashcards del módulo

```
¿Cuántas subunidades ribosomales tiene la célula eucariota, y qué coeficiente de sedimentación tiene el ribosoma completo?	80S en total	MIR::GEN::Estructura celular
¿Qué relación existe entre la metilación del ADN en islas CG y la expresión génica?	A mayor metilación, menor expresión	MIR::GEN::Regulación génica
¿Qué contiene el ARNm maduro: exones, intrones, o ambos?	Solo exones; los intrones se eliminan	MIR::GEN::Transcripción
¿Qué es el splicing alternativo?	La generación de distintos ARNm a partir de un mismo gen, incluyendo u omitiendo distintos exones	MIR::GEN::Regulación postranscripcional
¿Es el código genético universal o específico de cada especie?	Universal (virus, procariotas y eucariotas)	MIR::GEN::Traducción
¿Qué significa que el código genético sea "degenerado"?	Que existen más combinaciones de tripletes (64) que aminoácidos (20), por lo que un aminoácido puede tener varios codones	MIR::GEN::Traducción
¿Qué molécula reconoce el codón del ARNm mediante su anticodón?	El ARN de transferencia (ARNt)	MIR::GEN::Traducción
```

---

## 6. Referencias

- `02_Bibliografia/Genetica CTO.pdf`, Tema 01 "Introducción a la genética" y Tema 02 "Regulación y expresión de los genes".
