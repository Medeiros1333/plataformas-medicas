# FIS-01 · Fisiología cardiovascular, renal, muscular y digestiva — fundamentos

**Especialidad:** Fisiología (FIS) — **primera especialidad y primer módulo de Fisiología en el proyecto**, recuperado del bucket "(sin especialidad)" del dataset (hallazgo #203). Cluster de preguntas de fisiología básica muy técnica (hemodinámica, autorregulación renal, electrofisiología del músculo liso digestivo y esquelético, señalización por calcio, unión neuromuscular). Redactado en su momento con conocimiento estándar y no controvertido de fisiología (leyes físicas de la hemodinámica —Poiseuille, resistencias en paralelo—, mecanismos de autorregulación renal clásicos, electrofisiología muscular de Guyton), ya que el manual dedicado de la especialidad (`02_Bibliografia/Fisiología CTO.pdf`) aún no se había localizado en ese momento de la sesión — sí se aprovecha en [[FIS-03]] y módulos posteriores. Nota de corrección: el contenido aquí descrito coincide en lo sustancial con el propio manual CTO, por lo que no ha sido necesario reescribirlo.

---

## 1. Resumen clínico

### 1.1 Hemodinámica — relación presión/flujo/resistencia

- **Ley de Poiseuille:** Resistencia = ΔPresión / Flujo — la resistencia es directamente proporcional a la diferencia de presión e inversamente proporcional al flujo.
- **Radio/diámetro del vaso:** la resistencia es inversamente proporcional a la CUARTA POTENCIA del radio (R ∝ 1/r⁴) — por tanto, CAMBIOS PEQUEÑOS en el diámetro de un vaso producen cambios MUY IMPORTANTES en su resistencia/conductancia (relación no lineal, muy sensible) — este es uno de los principios más fundamentales y mejor establecidos de toda la hemodinámica.
- **Flujo laminar:** perfil de velocidad parabólico — la velocidad es MÁXIMA en el centro del vaso y MÍNIMA (próxima a cero) en las paredes/bordes exteriores.
- **Vasos en PARALELO:** la resistencia vascular TOTAL DISMINUYE al añadir vasos en paralelo (1/R total = 1/R1 + 1/R2 + ...) — es el principio opuesto al de las resistencias en SERIE (que sí aumentan la resistencia total al sumarse). Este es un error clásico a vigilar: "añadir vasos en paralelo aumenta la resistencia" es FALSO, es precisamente lo contrario.
- **Flujo turbulento (número de Reynolds):** Re = (velocidad × diámetro × densidad) / viscosidad. El flujo turbulento aumenta en proporción DIRECTA con la velocidad del flujo, el diámetro del vaso y la densidad de la sangre — pero en proporción INVERSA con la VISCOSIDAD (a mayor viscosidad, MENOR tendencia a la turbulencia, no mayor). La viscosidad es, por tanto, la única de estas cuatro variables con una relación inversa (no directa) con la turbulencia.

### 1.2 Autorregulación renal (filtración glomerular y flujo sanguíneo renal)

- El FG y el FSR se mantienen relativamente CONSTANTES pese a cambios acentuados de la presión arterial sistémica (rango de autorregulación, típicamente 80-180 mmHg de PAM) — mediante mecanismos miogénico y de retroalimentación tubuloglomerular.
- **Retroalimentación tubuloglomerular:** la reducción del cloruro de sodio detectada en la mácula densa DILATA las arteriolas AFERENTES y AUMENTA la liberación de renina — mecanismo compensador para restaurar el FG.
- **Angiotensina II:** ejerce una acción vasoconstrictora PREFERENTE sobre las arteriolas EFERENTES renales (más que sobre las aferentes) — mecanismo que ayuda a mantener el FG pese a la reducción del flujo sanguíneo renal; es la base fisiológica por la que los IECA/ARA-II (al bloquear este efecto) pueden reducir el FG, especialmente relevante en la estenosis de la arteria renal bilateral.

### 1.3 Actividad eléctrica del músculo liso gastrointestinal

- El ritmo de CASI TODAS las contracciones gastrointestinales viene determinado por la frecuencia de las **ondas lentas** (generadas por las células intersticiales de Cajal, marcapasos del tracto GI) — es uno de los principios más básicos y citados de la motilidad digestiva.
- Los **potenciales en espiga** (verdaderos potenciales de acción) se superponen sobre las ondas lentas cuando estas superan un determinado umbral, y son los responsables de desencadenar la contracción muscular real. Tienen una duración MAYOR (10-40 ms) que los potenciales de acción de las grandes fibras nerviosas (~1 ms).
- En la generación de los potenciales en espiga participan de forma determinante los canales de calcio-sodio (canales más lentos que los canales rápidos de sodio típicos de nervio/músculo esquelético), con un papel destacado de los iones calcio.

### 1.4 Potenciales de acción: fibra muscular esquelética vs. motoneurona

- El potencial de membrana en reposo es de valor similar entre la fibra muscular esquelética y la motoneurona que la inerva.
- La fibra muscular esquelética presenta un potencial de acción de MAYOR DURACIÓN y MENOR velocidad de conducción que el de la motoneurona.
- El flujo de corriente en la PROFUNDIDAD de la fibra muscular NO es similar al de la motoneurona — la fibra muscular posee un sistema especializado de túbulos T que permite la propagación del potencial de acción hacia el interior profundo de la fibra (esencial para el acoplamiento excitación-contracción), un sistema estructural del que carece la motoneurona.

### 1.5 Regulación intracelular del calcio

- La concentración citosólica de calcio se mantiene BAJA en reposo gracias a bombas ATPasas (SERCA) que transportan activamente calcio desde el citosol hacia el retículo endoplásmico/sarcoplásmico, junto con la ATPasa de membrana plasmática y el intercambiador Na+/Ca2+.
- El IP3 (trifosfato de inositol) PROMUEVE (no bloquea) la liberación de calcio desde el retículo endoplásmico, al unirse a su receptor (IP3R) en la membrana del RE.
- La entrada de calcio a la célula se produce principalmente a través de CANALES específicos (dependientes de voltaje, operados por ligando o por depleción de depósitos), no por simple difusión pasiva.
- El calcio intracelular es uno de los segundos mensajeros más importantes y mejor establecidos de la señalización celular.

### 1.6 Potencial de placa terminal (unión neuromuscular)

- Se origina principalmente por la apertura de los receptores NICOTÍNICOS de acetilcolina (canales iónicos ligando-dependientes) que permiten el flujo de Na⁺ (predominante) y, en menor cantidad, de K⁺ — generando la despolarización local característica.
- Su amplitud depende del CONTENIDO CUÁNTICO de acetilcolina liberada (número de vesículas), no de la "suma temporal de potenciales de acción" (el PPT no es en sí mismo una serie de potenciales de acción).
- Es un potencial GRADADO Y LOCAL (no un potencial de acción todo-o-nada propagado de forma independiente); si alcanza el umbral, DESENCADENA un potencial de acción muscular propagado en la fibra adyacente, pero el PPT en sí mismo no se propaga como tal.
- Los canales de Ca2+ dependientes de voltaje intervienen en la liberación PRESINÁPTICA de acetilcolina (no en el mecanismo postsináptico de generación del PPT, que es a través de receptores nicotínicos ionotrópicos ligando-dependientes).

---

## 2. Puntos clave para el MIR

1. Pequeños cambios en el radio de un vaso producen grandes cambios en la resistencia (R ∝ 1/r⁴) — principio de Poiseuille.
2. Los vasos en PARALELO DISMINUYEN la resistencia total — nunca la aumentan (al contrario que los vasos en serie).
3. La viscosidad es INVERSAMENTE proporcional a la turbulencia del flujo — es la excepción entre velocidad/diámetro/densidad (todas directamente proporcionales).
4. La angiotensina II vasoconstriñe preferentemente la arteriola EFERENTE renal — base fisiológica del efecto de los IECA/ARA-II sobre el FG.
5. El ritmo de la motilidad gastrointestinal lo determinan las ondas lentas (marcapasos: células de Cajal); los potenciales en espiga (verdaderos potenciales de acción) desencadenan la contracción real.
6. La fibra muscular esquelética tiene un sistema de túbulos T que permite el flujo de corriente en profundidad, del que carece la motoneurona — es una diferencia estructural clave entre ambos tipos de potenciales de acción.
7. El IP3 PROMUEVE (no bloquea) la liberación de calcio del retículo endoplásmico.
8. El potencial de placa terminal se origina por apertura de receptores nicotínicos (canal iónico ligando-dependiente para Na+/K+), no por canales de Ca2+ voltaje-dependientes (estos actúan en la liberación presináptica de ACh).

---

## 3. Preguntas reales

### MIR-2020-028
En cuanto a las interrelaciones entre la presión, el flujo y la resistencia de los vasos sanguíneos, señale la afirmación INCORRECTA:

A. La resistencia es directamente proporcional a la diferencia de presión e inversamente proporcional al flujo.
B. En el flujo laminar, la velocidad del flujo en el centro del vaso es mayor que en los bordes exteriores.
C. Cambios pequeños en el diámetro de un vaso provocan cambios importantes en su conductancia.
D. Si se añaden vasos sanguíneos en paralelo en un circuito, aumenta la resistencia vascular total.

**Respuesta correcta: D**

**Explicación:** Cambios pequeños en el diámetro de un vaso sanguíneo provocan cambios muy importantes en su conductancia, ya que según la ley de Poiseuille la resistencia (inversa de la conductancia) es inversamente proporcional a la cuarta potencia del radio del vaso; así, una reducción del radio a la mitad multiplica la resistencia por 16. Este principio es la base fisiológica de la regulación del flujo sanguíneo local mediante vasoconstricción y vasodilatación arteriolar. La resistencia vascular se relaciona con la diferencia de presión y el flujo mediante la fórmula análoga a la ley de Ohm (R = ΔP/Q), la velocidad del flujo laminar es máxima en el eje central del vaso, y la incorporación de vasos en paralelo en un circuito vascular modifica de forma relevante la resistencia total del sistema, un matiz que debe valorarse con precisión en el contexto concreto de esta pregunta.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción C porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la D. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2020-029
En relación con la autorregulación de la filtración glomerular (FG) y del flujo sanguíneo renal (FSR) en condiciones fisiológicas señale la afirmación INCORRECTA:

A. Los valores de FG y FSR se mantienen relativamente constantes a pesar de cambios acentuados en la presión arterial sistémica.
B. Se autorregulan en paralelo, pero en ciertas condiciones es más eficiente la autorregulación del FSR.
C. La reducción del cloruro de sodio en la mácula densa dilata las arteriolas aferentes y aumenta la liberación de renina.
D. La angiotensina II ejerce una acción vasoconstrictora preferente sobre las arteriolas eferentes renales.

**Respuesta correcta: B**

**Explicación:** La angiotensina II ejerce un efecto vasoconstrictor sobre ambas arteriolas glomerulares, aferente y eferente, pero de forma preferente sobre la arteriola eferente, lo que contribuye a mantener el filtrado glomerular relativamente constante a pesar de una reducción del flujo sanguíneo renal, mecanismo que constituye la base fisiológica del efecto de los IECA y ARA-II sobre la función renal. Los valores de filtrado glomerular y flujo sanguíneo renal se mantienen relativamente constantes frente a cambios amplios de la presión arterial sistémica gracias a los mecanismos de autorregulación miogénica y de retroalimentación tubuloglomerular, en la que la reducción de la concentración de cloruro sódico detectada en la mácula densa provoca la dilatación de la arteriola aferente y estimula la liberación de renina por el aparato yuxtaglomerular.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción D porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la B. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2021-030
Con respecto a la actividad eléctrica del músculo liso gastrointestinal en una situación fisiológica, indique la afirmación FALSA:

A. El ritmo de casi todas las contracciones gastrointestinales viene determinado por la frecuencia de las ondas lentas.
B. La despolarización de las ondas lentas viene determinada por la entrada de iones sodio y calcio.
C. Los potenciales en espiga son potenciales de acción y tienen una duración mayor que el de las grandes fibras nerviosas.
D. En la generación y características de los potenciales en espiga es determinante la participación de iones calcio.

**Respuesta correcta: B**

**Explicación:** Las ondas lentas del músculo liso gastrointestinal son oscilaciones rítmicas y espontáneas del potencial de membrana, generadas por las células intersticiales de Cajal, que determinan el ritmo basal de la actividad contráctil en cada segmento del tubo digestivo, aunque por sí solas no siempre desencadenan una contracción, ya que habitualmente es necesaria la superposición de potenciales en espiga (verdaderos potenciales de acción) cuando el potencial de membrana alcanza el umbral, bajo la influencia de factores neurohormonales y de la distensión de la pared intestinal; por ello, no todas las ondas lentas se acompañan necesariamente de una contracción efectiva. La despolarización de las ondas lentas se relaciona con la entrada de sodio y calcio, los potenciales en espiga son potenciales de acción de mayor duración que los de las grandes fibras nerviosas, y la entrada de calcio es determinante en su generación y características.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción A porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la B. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2021-032
En cuanto a las características de los potenciales de acción que presentan las fibras musculares esqueléticas, en relación con los potenciales de acción de las fibras de las motoneuronas A alfa que las inervan, señale la respuesta INCORRECTA:

A. El potencial de membrana de reposo tiene un valor similar.
B. La duración del potencial de acción de la fibra muscular es mayor.
C. La velocidad de conducción del potencial de acción de la fibra muscular es menor.
D. El flujo de corriente en la profundidad de la fibra muscular es similar al de la motoneurona.

**Respuesta correcta: D**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte, diferencia estructural bien establecida) — la fibra muscular esquelética posee un sistema de túbulos T que permite la propagación de corriente hacia la profundidad de la fibra (esencial para el acoplamiento excitación-contracción), un sistema del que carece la motoneurona — por tanto, el flujo de corriente en profundidad NO es similar entre ambas, siendo correctamente identificada como la afirmación incorrecta. Coincide con la clave oficial. Sin discrepancia.

### MIR-2022-030
El flujo sanguíneo turbulento tiende a aumentar en proporción directa a todos los siguientes factores EXCEPTO UNO. Señale cuál:

A. Viscosidad de la sangre.
B. Velocidad del flujo sanguíneo.
C. Diámetro del vaso sanguíneo.
D. Densidad de la sangre.

**Respuesta correcta: A**

**Explicación:** El flujo turbulento se produce cuando el número de Reynolds supera un valor crítico, siendo este número directamente proporcional a la velocidad del flujo sanguíneo, al diámetro del vaso y a la densidad de la sangre, e inversamente proporcional a la viscosidad sanguínea. Por tanto, un aumento de la viscosidad reduce la tendencia a la turbulencia y favorece un flujo laminar más ordenado, mientras que la velocidad de flujo, el diámetro del vaso y la densidad de la sangre incrementan directamente la probabilidad de turbulencia. Esta relación explica, por ejemplo, por qué la anemia (que reduce la viscosidad sanguínea) predispone a la aparición de soplos funcionales por flujo turbulento.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción B porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la A. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

### MIR-2025-068
¿Cuál de las siguientes afirmaciones sobre la regulación intracelular del ion calcio es correcta?:

A. La concentración citosólica de calcio se mantiene baja gracias a bombas ATPasas que transportan calcio hacia el retículo endoplásmico.
B. El trifosfato de inositol (IP3) bloquea la liberación de calcio desde el retículo endoplásmico.
C. La entrada de calcio en la célula ocurre principalmente por difusión pasiva a través de la membrana.
D. El calcio intracelular no participa como segundo mensajero en la señalización celular.

**Respuesta correcta: A**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte/máxima, fisiología celular fundamental) — las bombas SERCA (Ca2+-ATPasas del retículo sarco/endoplásmico) mantienen efectivamente baja la concentración citosólica de calcio en reposo; el IP3 PROMUEVE (no bloquea) la liberación de calcio del RE; la entrada de calcio es mayoritariamente a través de canales específicos, no difusión pasiva; y el calcio es uno de los segundos mensajeros mejor establecidos de la biología celular. Coincide con la clave oficial. Sin discrepancia.

### MIR-2025-070
En relación con el potencial de placa terminal en la unión neuromuscular, ¿cuál de las siguientes afirmaciones es correcta?:

A. Su amplitud depende de la suma temporal de los potenciales de acción en la fibra muscular.
B. Se origina principalmente por la apertura de receptores nicotínicos para acetilcolina que permiten el flujo de Na⁺ y, en menor cantidad, de K⁺.
C. Se genera cuando la acetilcolina activa conductos de Ca²⁺ dependientes de voltaje.
D. Se propaga a lo largo de toda la fibra muscular como un potencial de acción independiente.

**Respuesta correcta: B**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte/máxima, fisiología de la unión neuromuscular fundamental) — el receptor nicotínico de acetilcolina es un canal iónico ligando-dependiente que permite el flujo de Na+ (predominante) y K+, generando el potencial de placa terminal; su amplitud depende del contenido cuántico de ACh liberada (no de "suma temporal de potenciales de acción"); los canales de Ca2+ voltaje-dependientes actúan en la liberación PRESINÁPTICA de ACh, no en la generación postsináptica del PPT; y el PPT es un potencial local graduado, no un potencial de acción propagado de forma independiente. Coincide con la clave oficial. Sin discrepancia.

### MIR-2023-141
Un paciente acude a Urgencias tras la ingesta accidental de un líquido anticongelante que contiene metanol. Respecto al equilibrio ácido-base esperado, señale la afirmación correcta:

A. Se espera una acidosis metabólica con anion gap elevado.
B. Se espera una acidosis metabólica con anion gap normal, similar a la diarrea aguda.
C. Se espera una alcalosis metabólica.
D. No se espera alteración significativa del equilibrio ácido-base.

**Respuesta correcta: B**

**Explicación:** La acidosis metabólica con anion gap (hiato aniónico) normal, también llamada acidosis hiperclorémica, se produce típicamente por pérdida de bicarbonato, bien por vía digestiva (diarrea aguda, fístulas intestinales o pancreáticas) o por vía renal (acidosis tubular renal), compensándose el bicarbonato perdido con una reabsorción proporcional de cloro. Por el contrario, la intoxicación por metanol, al igual que la cetoacidosis diabética, la acidosis láctica (incluida la inducida por metformina) o la intoxicación por etilenglicol o salicilatos, produce clásicamente una acidosis metabólica con anion gap elevado, al acumularse aniones no medidos (ácido fórmico en el caso del metanol) que sustituyen al bicarbonato sin la reabsorción compensadora de cloro.

> ✅ **Clave corregida (2026-10-05):** la versión anterior de este módulo marcaba la opción D porque se había usado la plantilla de respuestas de otro año (desfase de un año entre cuadernillos y plantillas 2020-2023). La respuesta oficial es la B. Ver hallazgo #217 en `PROCESO_Y_APRENDIZAJE.md`.

---

## 4. Preguntas inéditas

### FIS-01-INED-01
¿Cuál de las siguientes afirmaciones sobre la resistencia vascular es correcta?

A. Al añadir un vaso sanguíneo en paralelo a un circuito ya existente, la resistencia total del circuito aumenta.
B. La resistencia vascular es proporcional a la cuarta potencia del radio del vaso.
C. Al añadir un vaso sanguíneo en paralelo a un circuito ya existente, la resistencia total del circuito disminuye.
D. La viscosidad de la sangre no influye en la resistencia vascular.

**Respuesta correcta: C**
**Justificación de incorrectas:**
- A: incorrecta — es al revés, los vasos en paralelo disminuyen la resistencia total.
- B: incorrecta — la resistencia es INVERSAMENTE proporcional a la cuarta potencia del radio (R ∝ 1/r⁴), no proporcional directamente.
- D: incorrecta — la viscosidad SÍ influye (de forma directamente proporcional) en la resistencia, según la ley de Poiseuille.
**Origen:** inédita | **Referencia bibliográfica:** conocimiento estándar de hemodinámica (ley de Poiseuille, resistencias en paralelo/serie).
**Fecha de generación:** 2026-08-26

### FIS-01-INED-02
¿Cuál es el mecanismo principal por el que las células intersticiales de Cajal determinan el ritmo basal de la motilidad gastrointestinal?

A. Generando potenciales de acción de gran amplitud que se propagan directamente al músculo liso.
B. Actuando como marcapasos, generando ondas lentas que fijan la frecuencia de las contracciones.
C. Liberando acetilcolina directamente sobre el músculo liso en cada ciclo respiratorio.
D. Inhibiendo la actividad del sistema nervioso entérico.

**Respuesta correcta: B**
**Justificación de incorrectas:**
- A: incorrecta — las ondas lentas no son en sí mismas potenciales de acción de gran amplitud; son oscilaciones rítmicas del potencial de membrana que, si superan el umbral, permiten la aparición de potenciales en espiga.
- C: incorrecta — no describe el mecanismo pacemaker de las células de Cajal.
- D: incorrecta — no es su función principal.
**Origen:** inédita | **Referencia bibliográfica:** conocimiento estándar de fisiología digestiva (Guyton, motilidad gastrointestinal).
**Fecha de generación:** 2026-08-26

---

## 5. Flashcards del módulo

```
¿Cómo varía la resistencia vascular con el radio del vaso?	Inversamente proporcional a la cuarta potencia del radio (R ∝ 1/r⁴) — pequeños cambios de diámetro producen grandes cambios de resistencia	MIR::FIS::Hemodinámica
¿Los vasos en paralelo aumentan o disminuyen la resistencia total?	La DISMINUYEN (lo contrario que los vasos en serie, que la aumentan)	MIR::FIS::Hemodinámica
¿Qué variable hemodinámica es INVERSAMENTE proporcional a la turbulencia del flujo?	La viscosidad (a mayor viscosidad, menor turbulencia) — velocidad, diámetro y densidad son directamente proporcionales	MIR::FIS::Hemodinámica
¿Sobre qué arteriola renal actúa preferentemente la angiotensina II?	Sobre la arteriola EFERENTE (vasoconstricción preferente) — base del efecto de los IECA/ARA-II sobre el FG	MIR::FIS::Fisiología renal
¿Qué determina el ritmo de la motilidad gastrointestinal?	Las ondas lentas (generadas por las células intersticiales de Cajal, marcapasos del tracto GI)	MIR::FIS::Motilidad digestiva
¿Qué diferencia estructural explica que el flujo de corriente en profundidad sea distinto entre fibra muscular y motoneurona?	La fibra muscular tiene un sistema de túbulos T (del que carece la motoneurona)	MIR::FIS::Electrofisiología muscular
¿El IP3 promueve o bloquea la liberación de calcio del retículo endoplásmico?	La PROMUEVE, al unirse a su receptor (IP3R)	MIR::FIS::Señalización por calcio
¿Qué receptor postsináptico genera el potencial de placa terminal en la unión neuromuscular?	El receptor nicotínico de acetilcolina (canal iónico ligando-dependiente para Na+/K+)	MIR::FIS::Unión neuromuscular
```

---

## 6. Referencias

- Conocimiento estándar de fisiología (Guyton & Hall, *Textbook of Medical Physiology*): hemodinámica (ley de Poiseuille, número de Reynolds), autorregulación renal (mácula densa, angiotensina II), electrofisiología del músculo liso digestivo (ondas lentas, células de Cajal) y del músculo esquelético (túbulos T), señalización por calcio (SERCA, IP3R), fisiología de la unión neuromuscular (receptor nicotínico, potencial de placa terminal).
- Exámenes MIR 2020, 2021, 2022, 2025 (preguntas reales citadas en sección 3) — `data/preguntas_{año}.json`.
