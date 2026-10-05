# IMN-03 · Inmunología celular y molecular: fundamentos (inmunoglobulinas, tolerancia, interferones, Treg, inmunoterapia)

**Especialidad:** Inmunología (IMN)
**Peso histórico:** tercer módulo de Inmunología, recuperado del bucket "(sin especialidad)" del dataset (hallazgo #203). Cluster de preguntas de inmunología básica/celular muy técnica (receptores Fc, gen AIRE, interferones tipo I, linfocitos T reguladores, inmunodeficiencias primarias, inmunoterapia CAR-T), sin manual de Inmunología dedicado cacheado — verificación basada en conocimiento estándar, fundamental y no controvertido de inmunología celular/molecular (los hechos aquí tratados son de los más consolidados y menos debatidos de toda la disciplina: función de AIRE, mecanismo del síndrome de hiper-IgM, efecto de los interferones tipo I sobre el CMH-I, marcadores y función de los linfocitos Treg).

---

## 1. Resumen clínico

### 1.1 Receptores Fc de las inmunoglobulinas — tabla de referencia

| Isotipo | Receptor Fc | Célula efectora | Función |
|---|---|---|---|
| IgG | FcγRIII (CD16) | Células NK | Citotoxicidad celular dependiente de anticuerpos (ADCC) |
| IgG | FcγRI (CD64) | Fagocitos (macrófagos/neutrófilos) | Opsonización/fagocitosis |
| IgA | Receptor poli-Ig (pIgR) | Epitelio de MUCOSAS | Transcitosis hacia la luz mucosa (intestino, vía respiratoria) y hacia la leche materna — NO atraviesa la placenta |
| IgG | Receptor Fc neonatal (FcRn) | Sincitiotrofoblasto placentario | Transporte activo transplacentario de IgG materna al feto — es EXCLUSIVO de IgG, ni IgM ni IgA lo utilizan |
| IgE | FcεR | Mastocitos, basófilos, eosinófilos | Desgranulación / defensa antihelmíntica |
| IgM | C1q | — | Activación de la vía CLÁSICA del complemento |

- **Solo la IgG atraviesa la placenta** (vía FcRn) — ni la IgM (demasiado grande, pentamérica) ni la IgA lo hacen. La protección mucosa/neonatal de la IgA se transmite por vía distinta: LACTANCIA MATERNA (secreción hacia la leche a través del pIgR), no vía transplacentaria.
- La IgA es la inmunoglobulina más abundante en las mucosas, pero NO activa eficazmente la vía CLÁSICA del complemento (esa es función principal de IgM, y en menor medida IgG); la IgA puede activar la vía ALTERNATIVA.
- El déficit selectivo de IgA es la inmunodeficiencia primaria más frecuente (~1:400), mayoritariamente asintomática.

### 1.2 Gen AIRE y tolerancia central (síndrome poliglandular autoinmune tipo 1, APS-1/APECED)

- **AIRE (Autoimmune Regulator)** se expresa en las CÉLULAS EPITELIALES DE LA MÉDULA TÍMICA (mTEC) — no en linfocitos T reguladores ni en timocitos doble negativos.
- Su función es promover la expresión ECTÓPICA/PROMISCUA de antígenos específicos de tejidos periféricos en las mTEC, permitiendo la eliminación de timocitos autorreactivos mediante **SELECCIÓN NEGATIVA** — este es un mecanismo de **TOLERANCIA CENTRAL** (tímica), NO de tolerancia periférica.
- Las mutaciones de AIRE causan el síndrome poliglandular autoinmune tipo 1 (APS-1/APECED) — una entidad genéticamente distinta del síndrome IPEX (mutación de FOXP3, ligado al X, defecto de los linfocitos T reguladores — tolerancia PERIFÉRICA), con la que no debe confundirse.

### 1.3 Interferones de tipo I (IFN-α/β)

- Función antiviral principal: **ACTIVAN la expresión de genes que confieren resistencia a la infección viral** (genes estimulados por interferón, ISG) en la célula huésped y en células vecinas — estableciendo un "estado antiviral".
- **AUMENTAN (no inhiben) la expresión de moléculas del CMH/HLA de clase I** en las células infectadas, potenciando la presentación antigénica a los linfocitos T CD8+ citotóxicos — es un mecanismo que POTENCIA, no inhibe, la respuesta citotóxica antiviral.
- Producidos principalmente por células infectadas y células dendríticas plasmocitoides tras el reconocimiento de ácidos nucleicos víricos por receptores de reconocimiento de patrones (TLR, RIG-like receptors).

### 1.4 Linfocitos T reguladores (Treg) — marcadores y función

- Fenotipo clásico: CD4+, CD25+, FoxP3+ (factor de transcripción definitorio). Expresan de forma característica el correceptor INHIBIDOR **CTLA-4**.
- Función: SUPRESORA/inmunomoduladora — no colaboran en la eliminación de células tumorales, sino que, cuando infiltran tumores sólidos, contribuyen a la INMUNOSUPRESIÓN del microambiente tumoral (mediante producción de **IL-10** y TGF-β, entre otros mecanismos), facilitando la evasión inmune del tumor — por ello se asocian generalmente a PEOR pronóstico oncológico, no a "buen pronóstico".
- No producen característicamente interferón-γ (citocina Th1/citotóxica) ni IL-17/IL-22 (citocinas Th17) — estas son propias de otros subtipos de linfocitos T efectores, no de los Treg.

### 1.5 Inmunodeficiencias primarias — mecanismos diferenciales

- **Síndrome de hiper-IgM (mutaciones de CD40 o CD40L):** el defecto es en la COLABORACIÓN T-B necesaria para el CAMBIO DE ISOTIPO (class-switch recombination) de las inmunoglobulinas en el centro germinal — los linfocitos B se desarrollan NORMALMENTE en la médula ósea (sin defecto madurativo), pero son incapaces de cambiar de IgM a IgG/IgA/IgE por ausencia de la señal coestimuladora CD40-CD40L del linfocito T colaborador. Resultado clínico: IgM normal o elevada, con IgG/IgA muy disminuidas.
- Esto se diferencia claramente de la **agammaglobulinemia ligada al X (Bruton, mutación BTK)**, que SÍ es un defecto de la DIFERENCIACIÓN de linfocitos B en la médula ósea (bloqueo madurativo pre-B a B, con acúmulo de células con cadena mu intracitoplasmática y ausencia de linfocitos B maduros circulantes) — un mecanismo completamente distinto al del síndrome de hiper-IgM.

### 1.6 Inmunoterapia CAR-T anti-CD19 (CART19)

- CD19 es un marcador de superficie EXCLUSIVO del linaje LINFOIDE B — está ausente en las células mieloides. Por tanto, la terapia CAR-T19 está aprobada para neoplasias de estirpe B (leucemia linfoblástica aguda B, linfomas B), **NUNCA para leucemia MIELOBLÁSTICA aguda** (de estirpe mieloide, CD19-negativa por definición).
- El reconocimiento del antígeno por el receptor CAR es INDEPENDIENTE de HLA (a diferencia del TCR natural) — es una de las ventajas conceptuales de la tecnología CAR, que reconoce el antígeno de superficie directamente, sin necesidad de presentación restringida por HLA.
- Efecto adverso grave característico y bien establecido: **síndrome de liberación de citoquinas (CRS)**.

### 1.7 Vacunación de ARN mensajero (SARS-CoV-2, proteína S)

- Es una forma de INMUNIZACIÓN ACTIVA (estimula al propio sistema inmunitario a generar la respuesta, a diferencia de la inmunización pasiva con anticuerpos preformados) que induce memoria inmunológica mediante activación de linfocitos B, con cambio de isotipo de los anticuerpos generados (de IgM a IgG) — hechos correctos y bien establecidos.
- La proteína S es un ANTÍGENO PROTEICO, por definición **TIMODEPENDIENTE** (requiere colaboración de linfocitos T CD4+ para la respuesta humoral completa, incluyendo cambio de isotipo y memoria) — NO es un antígeno timoindependiente (los antígenos timoindependientes son típicamente polisacáridos, no proteínas).
- Los pacientes inmunodeprimidos (trasplantados, inmunodeficiencias) presentan, de forma bien documentada, una respuesta deficiente a la vacunación de ARNm por la dependencia de la colaboración T-B para una respuesta óptima.

### 1.8 Linfadenopatías/histiocitosis benignas de causa incierta — diagnóstico diferencial

- **Enfermedad de Kikuchi-Fujimoto (linfadenitis histiocítica necrotizante):** mujeres jóvenes, adenopatías cervicales dolorosas y fiebre, frecuentemente autolimitada. Histología característica: áreas de necrosis con histiocitos de núcleo en semiluna y abundante cariorrexis, rodeadas de células dendríticas plasmocitoides, SIN neutrófilos, eosinófilos ni células plasmáticas; la proliferación linfoide asociada (a menudo TCD8+) es POLICLONAL (no neoplásica), lo que la distingue de un linfoma T.
- **Enfermedad de Castleman:** proliferación de linfocitos B no clonal, habitualmente asociada al virus herpes humano 8 (VHH-8).
- **Enfermedad de Rosai-Dorfman:** histiocitosis benigna con afectación ganglionar, de etiología desconocida.
- **Enfermedad de Kimura:** más frecuente en varones; tumoraciones cervicales no dolorosas con linfadenopatías y eosinofilia.

---

## 2. Puntos clave para el MIR

1. Solo la IgG atraviesa la placenta (vía FcRn); la protección neonatal por IgA es vía lactancia materna (pIgR), no transplacentaria.
2. El gen AIRE se expresa en el epitelio medular tímico (mTEC) y media SELECCIÓN NEGATIVA/tolerancia CENTRAL — no se expresa en Treg ni media tolerancia periférica (eso es función de FOXP3/IPEX, entidad genéticamente distinta).
3. Los interferones de tipo I AUMENTAN (no inhiben) la expresión de CMH-I, potenciando la presentación antigénica a linfocitos T CD8+.
4. Los Treg (CD4+CD25+FoxP3+CTLA-4+) son inmunosupresores — producen IL-10, no interferón-γ; en tumores se asocian a peor pronóstico, no a buen pronóstico.
5. El síndrome de hiper-IgM (CD40/CD40L) es un defecto de la colaboración T-B para el cambio de isotipo — los linfocitos B se desarrollan normalmente en médula ósea (a diferencia de la agammaglobulinemia de Bruton, que sí es un defecto madurativo medular).
6. CD19 es un marcador exclusivamente de estirpe B — la terapia CAR-T19 nunca está indicada en leucemia mieloblástica aguda.
7. Los antígenos proteicos (como la proteína S del SARS-CoV-2) son timodependientes, no timoindependientes (estos últimos son típicamente polisacáridos).

---

## 3. Preguntas reales

### MIR-2020-035
Los receptores para los fragmentos Fc de las diferentes clases de inmunoglobulinas (Ig) se pueden expresar en distintos tipos de células que llevan a cabo funciones efectoras. Indique cuál de las siguientes afirmaciones es FALSA:

A. La IgG se une al receptor III para Fc-gamma (Fcgamma-RIII) en las células NK activando la citotoxicidad celular dependiente de anticuerpos (ADCC).
B. La IgA se une al receptor poli-Ig (pIgR) del epitelio intestinal para llegar a la luz intestinal.
C. La IgM se une al receptor Fc neonatal (FcRn) en el sincitiotrofoblasto para atravesar la placenta.
D. La IgE se une al receptor para Fc-epsilon (Fcepsilon-R) en mastocitos e induce su desgranulación.

**Respuesta correcta: C**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte/máxima, hecho fundamental de inmunología) — el FcRn transporta EXCLUSIVAMENTE IgG a través de la placenta; la IgM (pentamérica, de gran tamaño) no utiliza este receptor ni atraviesa la placenta — la opción C es correctamente identificada como la FALSA. El resto de opciones (IgG-FcγRIII-NK-ADCC; IgA-pIgR-mucosa intestinal; IgE-FcεR-mastocitos) son correctas. Coincide con la clave oficial. Sin discrepancia.

### MIR-2020-037
En relación con la inmunoterapia basada en linfocitos T con receptores antigénicos quiméricos (chimeric antigen receptor, CAR) que reconocen CD19 (CART19):

A. Está aprobada para el tratamiento de leucemia mieloblástica aguda refractaria o en recaída.
B. Un efecto secundario grave de esta terapia es el síndrome de liberación de citoquinas.
C. El receptor CAR reconoce CD19 de forma restringida por el HLA.
D. Se asocia a hipergammaglobulinemia permanente por activación crónica de linfocitos B CD19+.

**Respuesta correcta: B**

**Explicación:** Las terapias CAR-T anti-CD19 (CART19), como tisagenlecleucel o axicabtagene ciloleucel, están aprobadas para neoplasias de estirpe B (leucemia linfoblástica aguda B y linfomas B agresivos refractarios o en recaída), pero no para la leucemia mieloblástica aguda (LMA), que es de estirpe mieloide y no expresa el antígeno CD19; por ello esta afirmación es incorrecta. El síndrome de liberación de citoquinas es, en cambio, un efecto adverso grave y característico de esta inmunoterapia, causado por la intensa activación de los linfocitos T modificados. El receptor CAR reconoce el antígeno CD19 de manera directa, como un anticuerpo, sin restricción por HLA. Y tras la terapia se produce típicamente aplasia de linfocitos B CD19+ con hipogammaglobulinemia (no hipergammaglobulinemia permanente), que en ocasiones requiere sustitución con inmunoglobulinas.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción A porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la B. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2021-033
Las diferentes clases (isotipos) de inmunoglobulinas (Ig) tienen diferentes funciones que dependen de los fragmentos Fc de sus cadenas pesadas. ¿Cuál de las siguientes afirmaciones es FALSA?:

A. La IgA se une al receptor poli-Ig (pIgR) para atravesar la placenta y participar en la defensa del neonato.
B. La IgG se une al receptor III para Fc-gamma (Fc-gamma-RIII) de los fagocitos activando el proceso de opsonización.
C. La IgM se une a C1q y activa la vía clásica del complemento contribuyendo a la eliminación de bacterias extracelulares.
D. La IgE se une al receptor para Fc-épsilon (Fcépsilon-R) y activa a eosinófilos y mastocitos participando en la defensa frente a los helmintos.

**Respuesta correcta: A**

**Explicación:** Cada isotipo de inmunoglobulina posee funciones efectoras específicas mediadas por su fragmento Fc. La IgM, gracias a su estructura pentamérica, es muy eficaz activando la vía clásica del complemento a través de la unión a C1q, contribuyendo así a la opsonización y lisis de bacterias extracelulares. La IgE se une a su receptor de alta afinidad (FcεRI) en mastocitos y basófilos, y también a receptores en eosinófilos, siendo clave en la defensa frente a parásitos helmintos mediante mecanismos de citotoxicidad celular dependiente de anticuerpos. La IgG se une a distintos receptores Fc-gamma en la superficie de los fagocitos, facilitando la opsonización y fagocitosis de los patógenos recubiertos por anticuerpos, así como la citotoxicidad celular dependiente de anticuerpos por células NK a través del FcγRIII (CD16). Por su parte, la única inmunoglobulina capaz de atravesar la placenta es la IgG, mediante su unión al receptor Fc neonatal (FcRn) en el sincitiotrofoblasto; la IgA no atraviesa la placenta, sino que se transmite al neonato a través del calostro y la leche materna, uniéndose al receptor poli-Ig (pIgR) para su transporte a través del epitelio de las mucosas, no de la placenta.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción B porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la A. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2021-035
Diferentes mutaciones en el gen AIRE (Autoimmune Regulator) causan una enfermedad rara denominada síndrome poliglandular autoinmune tipo 1 (APS-1). Respecto al gen ¿cuál de las siguientes afirmaciones es cierta?:

A. Está ligado al cromosoma X, por lo que el síndrome APS-1 también se conoce como IPEX (Inmunodesregulación, Poliendocrinopatía y Enteropatía ligada al cromosoma X).
B. Se expresa en los timocitos que no expresan CD4 ni CD8 (doble negativos) promoviendo su expansión y participando en el proceso de selección positiva en el timo.
C. Se expresa en las células T reguladoras controlando su función y siendo responsable del proceso de tolerancia periférica.
D. Se expresa en células epiteliales de la médula tímica regulando la expresión antígenos específicos de otros tejidos y participando en el proceso de selección negativa en el timo.

**Respuesta correcta: D**

**Explicación:** El gen AIRE (Autoimmune Regulator) es un factor de transcripción autosómico (no ligado al cromosoma X) que se expresa característicamente en las células epiteliales de la médula tímica, donde induce la expresión ectópica ('promiscua') de antígenos propios de tejidos periféricos. Esto permite que los timocitos autorreactivos frente a dichos antígenos sean eliminados por selección negativa, estableciendo la tolerancia central, y contribuye también a la generación del repertorio de linfocitos T reguladores capaces de controlar a los clones autorreactivos que escapan a esta selección. Mutaciones en AIRE alteran este proceso y permiten la salida a la periferia de clones T autorreactivos frente a múltiples órganos endocrinos, dando lugar al síndrome poliglandular autoinmune tipo 1 (APS-1), caracterizado por la tríada candidiasis mucocutánea crónica, hipoparatiroidismo e insuficiencia suprarrenal. No debe confundirse con el síndrome IPEX, que sí está ligado al cromosoma X y causado por mutaciones en el gen FOXP3, expresado directamente en los linfocitos T reguladores.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción C porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la D. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2021-036
Un estudio reciente indica que aproximadamente el 10-20 % de los pacientes muy graves o fallecidos por COVID-19 poseen autoanticuerpos neutralizantes de los interferones de tipo I. Los interferones de tipo I:

A. Inhiben la actividad citotóxica de los linfocitos T CD8+ contra las células infectadas.
B. Son producidos por linfocitos CD4+ Th1 tras el reconocimiento de péptidos víricos mediante el receptor T para el antígeno.
C. Activan la expresión de genes que confieren a la célula huésped una resistencia mayor a la infección viral.
D. Inhiben la expresión de los antígenos de histocompatibilidad (HLA) de clase I en las células infectadas.

**Respuesta correcta: C**

**Explicación:** Los interferones de tipo I (IFN-alfa e IFN-beta) son citocinas clave de la inmunidad innata antiviral, producidas principalmente por las células dendríticas plasmocitoides y por la práctica totalidad de las células nucleadas en respuesta al reconocimiento de ácidos nucleicos virales por receptores de la inmunidad innata (a diferencia del interferón gamma, de tipo II, que es producido por linfocitos Th1 y células NK tras el reconocimiento antigénico específico). Tras unirse a su receptor IFNAR, activan la vía JAK-STAT e inducen la transcripción de cientos de genes estimulados por interferón (ISGs, como PKR, OAS/RNasa L o las proteínas Mx) que confieren a la célula infectada y a las células vecinas un estado de resistencia frente a la replicación viral, además de potenciar la actividad citotóxica de los linfocitos T CD8+ y de las células NK frente a las células infectadas. La existencia de autoanticuerpos neutralizantes frente a los interferones de tipo I, descrita hasta en un 10-20% de los pacientes con COVID-19 grave, compromete gravemente esta respuesta antiviral temprana y facilita la progresión a formas graves de la enfermedad.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción D porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la C. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2021-037
Respecto a las células T reguladoras (Treg) es cierto que:

A. Colaboran en la eliminación de células tumorales.
B. Expresan el correceptor inhibidor CTLA-4.
C. Coexpresan tanto CD4 como CD8.
D. Liberan citoquinas como IL-17 o IL-22.

**Respuesta correcta: B**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte/máxima, marcador definitorio bien establecido) — CTLA-4 es un correceptor inhibidor constitutivamente expresado por los Treg (CD4+CD25+FoxP3+), central en su función supresora. Los Treg NO colaboran en la eliminación de tumores (más bien la suprimen), no coexpresan CD4/CD8 (son CD4+ simples), y no producen IL-17/IL-22 (citocinas Th17, no Treg). Coincide con la clave oficial. Sin discrepancia.

### MIR-2022-034
En relación con el papel de la inmunoglobulina A (IgA) en la defensa frente a patógenos, señale la respuesta INCORRECTA:

A. La IgA activa la vía clásica del complemento contribuyendo a la eliminación de bacterias extracelulares.
B. La IgA pasa de la madre al recién nacido durante la lactancia contribuyendo a la protección de las mucosas del neonato.
C. La IgA puede atravesar la barrera epitelial de las mucosas uniéndose al receptor poli-Ig (pIgR) siendo la inmunoglobulina más abundante en las mucosas.
D. El déficit selectivo de IgA es la inmunodeficiencia más frecuente (aproximadamente 1:400) y la mayoría de los casos son asintomáticos.

**Respuesta correcta: A**

**Explicación:** El receptor poli-Ig (pIgR) transporta de forma específica las inmunoglobulinas poliméricas —IgA dimérica unida por cadena J e IgM pentamérica— a través del epitelio mucoso; no toda la IgA es sustrato de este receptor, ya que una proporción relevante de la IgA circulante en el suero es monomérica y no se une al pIgR, lo que introduce imprecisión en esta afirmación pese a que la IgA secretora sea, en efecto, la inmunoglobulina predominante en las secreciones mucosas. Son correctas, en cambio: el paso de IgA a través de la leche materna, protegiendo las mucosas del neonato durante la lactancia; el déficit selectivo de IgA como la inmunodeficiencia primaria más frecuente (aproximadamente 1 de cada 400 personas), mayoritariamente asintomática; y la contribución de la IgA a la opsonización y a la activación del complemento en la defensa frente a bacterias extracelulares.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción C porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la A. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2022-036
Las células T reguladoras (CD4+, CD25+, FoxP3+) se encuentran con frecuencia en el infiltrado de tumores sólidos. Estas células:

A. Se consideran marcadores de buen pronóstico en el desarrollo del tumor.
B. Contribuyen a la defensa inmune antitumoral.
C. Producen interferón gamma que contribuye a la activación de linfocitos citotóxicos.
D. Producen interleucina-10 que contribuye a un microambiente tumoral inmunosupresor.

**Respuesta correcta: D**

**Explicación:** Los linfocitos T reguladores (Treg, CD4+CD25+FoxP3+) son una subpoblación especializada en mantener la tolerancia inmunológica y limitar las respuestas inflamatorias excesivas. En el microambiente tumoral, las Treg son reclutadas y expandidas en gran número, y contribuyen a la evasión inmunológica del tumor mediante la secreción de citocinas inmunosupresoras como la interleucina-10 y el TGF-beta, la expresión de moléculas inhibidoras como CTLA-4, y el consumo competitivo de IL-2, todo lo cual inhibe la actividad de los linfocitos T citotóxicos y las células NK antitumorales. Por este motivo, una elevada infiltración de Treg en tumores sólidos se asocia generalmente con un peor pronóstico oncológico, al favorecer un microambiente inmunosupresor que dificulta la respuesta antitumoral en lugar de contribuir a ella.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción C porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la D. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2022-037
El síndrome de hiper-IgM, una inmunodeficiencia primaria asociada a diferentes mutaciones en las moléculas CD40 o su ligando CD40L, se caracteriza porque:

A. Los pacientes presentan niveles elevados de IgM mientras que mantienen niveles normales de IgG e IgA en suero.
B. Presentan un defecto de la diferenciación de los linfocitos B en la médula ósea con aumento de linfocitos B inmaduros que expresan la cadena mu intracitoplasmática.
C. Existe un defecto en el proceso de colaboración entre linfocitos T y B necesario para el cambio de isotipo de las inmunoglobulinas.
D. Existe un defecto en el proceso de reordenamiento de los genes V de las inmunoglobulinas.

**Respuesta correcta: C**

**Explicación:** El síndrome de hiper-IgM ligado a mutaciones en CD40 o su ligando CD40L (CD154) se debe a un fallo en la señal de coestimulación que los linfocitos T colaboradores activados proporcionan a los linfocitos B a través de la interacción CD40-CD40L. Esta señal es imprescindible para que, en el centro germinal, los linfocitos B lleven a cabo el cambio de isotipo de las inmunoglobulinas (de IgM/IgD a IgG, IgA o IgE) y la hipermutación somática. Como consecuencia, los pacientes mantienen niveles normales o elevados de IgM, pero presentan niveles muy disminuidos o indetectables de IgG, IgA e IgE, con la consiguiente susceptibilidad a infecciones piógenas de repetición e infecciones oportunistas, como la neumonía por Pneumocystis jirovecii.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción B porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la C. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2023-037
La vacunación utilizando ARN mensajero de la proteína S (Spike) del SARS-CoV-2 va dirigida a la protección de la población frente a la COVID-19. En relación con la respuesta a esta vacuna señale la afirmación INCORRECTA:

A. La respuesta no requiere la colaboración de los linfocitos T, al ser un antígeno timoindependiente.
B. Un elevado porcentaje de pacientes inmunodeprimidos, como aquellos con trasplante de órganos o con inmunodeficiencia, tienen un defecto en la respuesta a esta vacuna.
C. Es una forma de inmunización activa cuyo resultado se asocia al cambio de isotipo de los anticuerpos.
D. Induce memoria inmunológica basada en la activación de linfocitos B.

**Respuesta correcta: A**

**Explicación:** La vacunación con ARNm de la proteína S del SARS-CoV-2 es una forma de inmunización activa, en la que el organismo genera su propia respuesta inmunitaria tras la síntesis endógena del antígeno viral. Esta respuesta implica la colaboración de linfocitos T colaboradores CD4+, que reconocen péptidos derivados de la proteína S presentados en moléculas HLA de clase II y proporcionan a los linfocitos B activados la señal necesaria para experimentar el cambio de isotipo de anticuerpos (de IgM a IgG) y la maduración de afinidad en los centros germinales; este cambio de isotipo es, precisamente, uno de los resultados característicos de la respuesta a esta vacuna. Además, se genera memoria inmunológica duradera basada en linfocitos B de memoria y células plasmáticas de vida larga, y un porcentaje relevante de pacientes inmunodeprimidos (trasplantados o con inmunodeficiencias primarias o secundarias) presenta una respuesta subóptima a la vacunación.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción C porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la A. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2019-038
Mujer de 28 años con adenopatías cervicales dolorosas y fiebre. En la biopsia-cilindro de uno de los ganglios se observa una población muy proliferativa de linfocitos grandes CD8+, sugiriéndose la posibilidad de un linfoma T. El estudio de clonalidad de la biopsia fue negativo. Ante esta discordancia se extirpa un ganglio completo en el que, además de áreas como las previamente descritas, observamos otras de necrosis con numerosos histiocitos con núcleo en semiluna y abundante cariorrexis y rodeadas por células dendríticas plamocitoides. No hay neutrófilos, eosinófilos ni células plasmáticas. Sigue siendo policlonal. ¿Cuál es el diagnóstico más probable?

A. Enfermedad de Kimura.
B. Enfermedad de Castleman.
C. Enfermedad de Rosai-Dorfman.
D. Enfermedad de Kikuchi-Fujimoto.

**Respuesta correcta: D** — *(fuente: Examen MIR 2019, pregunta 38)*

---

## 4. Preguntas inéditas

### IMN-03-INED-01
¿Cuál de las siguientes afirmaciones sobre el gen AIRE y el síndrome poliglandular autoinmune tipo 1 (APS-1) es correcta?

A. AIRE se expresa en los linfocitos T reguladores periféricos.
B. AIRE se expresa en las células epiteliales de la médula tímica y promueve la selección negativa de timocitos autorreactivos mediante expresión ectópica de antígenos tisulares.
C. APS-1 es sinónimo de síndrome IPEX.
D. Las mutaciones de AIRE afectan principalmente a la tolerancia periférica.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — AIRE se expresa en células epiteliales de la médula tímica (mTEC), no en Treg.
- C: incorrecta — APS-1/APECED (mutación de AIRE) es una entidad genéticamente distinta de IPEX (mutación de FOXP3).
- D: incorrecta — AIRE participa en la tolerancia CENTRAL (tímica), no en la periférica.
**Origen:** inédita | **Referencia bibliográfica:** conocimiento estándar de inmunología de la tolerancia (AIRE/mTEC/selección negativa vs. FOXP3/Treg/tolerancia periférica).
**Fecha de generación:** 2026-08-26

### IMN-03-INED-02
Respecto al efecto de los interferones de tipo I sobre la expresión del complejo mayor de histocompatibilidad (CMH) de clase I en células infectadas por virus, señale la afirmación correcta:

A. La disminuyen, para evitar el reconocimiento por linfocitos T CD8+.
B. La aumentan, potenciando la presentación antigénica a linfocitos T CD8+ citotóxicos.
C. No tienen ningún efecto sobre la expresión del CMH-I.
D. Solo afectan a la expresión del CMH de clase II.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — es al revés; el efecto es un aumento, no una disminución.
- C: incorrecta — sí tienen un efecto bien documentado sobre el CMH-I.
- D: incorrecta — el efecto principal de los interferones tipo I es sobre el CMH de clase I, relevante para la citotoxicidad CD8+.
**Origen:** inédita | **Referencia bibliográfica:** conocimiento estándar de inmunología antiviral (interferones tipo I).
**Fecha de generación:** 2026-08-26

---

### IMN-03-INED-03
Niño de 3 años con infecciones bacterianas piógenas de repetición. Estudio inmunológico: IgM sérica elevada, IgG e IgA muy disminuidas, linfocitos B presentes en número normal en sangre periférica. Se confirma mutación en el gen de CD40L. ¿Cuál es el mecanismo patogénico fundamental y qué distingue a esta entidad de la agammaglobulinemia de Bruton?

A. Defecto de la diferenciación medular de linfocitos B, igual que en Bruton.
B. Defecto de la colaboración T-B para el cambio de isotipo (class-switch recombination); a diferencia de Bruton, los linfocitos B se desarrollan y circulan con normalidad.
C. Ausencia completa de linfocitos B circulantes, igual que en Bruton.
D. Defecto del reordenamiento V(D)J de las inmunoglobulinas.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A y C: incorrectas — a diferencia de Bruton (bloqueo madurativo medular con ausencia de linfocitos B maduros), en el síndrome de hiper-IgM los linfocitos B se desarrollan y circulan con normalidad.
- D: incorrecta — el defecto no está en el reordenamiento V(D)J (eso causaría inmunodeficiencia combinada grave), sino en la señal coestimuladora CD40-CD40L necesaria para el cambio de isotipo.
**Origen:** inédita | **Referencia bibliográfica:** conocimiento estándar de inmunología — síndrome de hiper-IgM vs. agammaglobulinemia de Bruton.
**Fecha de generación:** 2026-08-27

---

## 5. Flashcards del módulo

```
¿Qué inmunoglobulina atraviesa la placenta y mediante qué receptor?	Solo la IgG, vía el receptor Fc neonatal (FcRn) en el sincitiotrofoblasto	MIR::IMN::Receptores Fc
¿Cómo llega la IgA al neonato para su protección mucosa?	Vía lactancia materna (secreción a la leche mediante el receptor poli-Ig, pIgR), no vía transplacentaria	MIR::IMN::Receptores Fc
¿Dónde se expresa el gen AIRE y qué tipo de tolerancia media?	En las células epiteliales de la médula tímica (mTEC); media tolerancia CENTRAL (selección negativa)	MIR::IMN::Tolerancia inmunológica
¿Qué gen está mutado en el síndrome IPEX y qué tipo de tolerancia afecta?	FOXP3, ligado al X; afecta a la tolerancia PERIFÉRICA (función de los Treg) — entidad distinta de APS-1/AIRE	MIR::IMN::Tolerancia inmunológica
¿Qué efecto tienen los interferones de tipo I sobre el CMH de clase I?	Lo AUMENTAN, potenciando la presentación antigénica a linfocitos T CD8+	MIR::IMN::Interferones
¿Qué correceptor inhibidor caracteriza a los linfocitos T reguladores (Treg)?	CTLA-4	MIR::IMN::Linfocitos Treg
¿Qué citocina producen los Treg intratumorales que contribuye a la inmunosupresión del microambiente tumoral?	IL-10 (junto con TGF-β)	MIR::IMN::Linfocitos Treg
¿Cuál es el defecto patogénico del síndrome de hiper-IgM (CD40/CD40L)?	Defecto de la colaboración T-B necesaria para el cambio de isotipo (class-switch) — los linfocitos B se desarrollan normalmente en médula ósea	MIR::IMN::Inmunodeficiencias primarias
¿Por qué la terapia CAR-T19 nunca se usa en leucemia mieloblástica aguda?	Porque CD19 es un marcador exclusivo de estirpe linfoide B, ausente en las células mieloides	MIR::IMN::Inmunoterapia
¿Son los antígenos proteicos (como la proteína S del SARS-CoV-2) timodependientes o timoindependientes?	Timodependientes — requieren colaboración de linfocitos T CD4+	MIR::IMN::Vacunas
¿Activa la IgA eficazmente la vía clásica del complemento?	No — esa es función principal de la IgM (vía C1q); la IgA puede activar la vía alternativa	MIR::IMN::Receptores Fc
```

---

## 6. Referencias

- Conocimiento estándar de inmunología celular y molecular fundamental: función de los receptores Fc, gen AIRE y tolerancia central (Anderson MS et al., Science 2002), interferones tipo I y CMH-I, biología de los linfocitos T reguladores (Sakaguchi S et al.), mecanismo del síndrome de hiper-IgM (Notarangelo LD, revisiones clásicas de inmunodeficiencias primarias).
- Exámenes MIR 2020, 2021, 2022, 2023 (preguntas reales citadas en sección 3) — `data/preguntas_{año}.json`.
- Nota: las preguntas MIR-2020-039 (mastocitosis), MIR-2021-040 (inmunoterapia con aeroalérgenos) y MIR-2022-039 (inmunoterapia con veneno de himenópteros), presentes en versiones anteriores de este módulo, se reclasificaron a la especialidad de Alergología — ver [[ALG-03]] — por pertenecer temáticamente al manual de Alergología (Temas 5-6), no al de Inmunología. Reclasificación realizada el 2026-08-28.
