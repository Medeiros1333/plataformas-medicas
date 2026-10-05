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

### MIR-2020-028 ⚠️
En cuanto a las interrelaciones entre la presión, el flujo y la resistencia de los vasos sanguíneos, señale la afirmación INCORRECTA:

A. La resistencia es directamente proporcional a la diferencia de presión e inversamente proporcional al flujo.
B. En el flujo laminar, la velocidad del flujo en el centro del vaso es mayor que en los bordes exteriores.
C. Cambios pequeños en el diámetro de un vaso provocan cambios importantes en su conductancia.
D. Si se añaden vasos sanguíneos en paralelo en un circuito, aumenta la resistencia vascular total.

**Respuesta correcta: C**

> ⚠️ **Nota de verificación de MÁXIMA confianza (principio físico fundamental e inequívoco de hemodinámica, sin cita bibliográfica directa disponible):** la opción C es una afirmación VERDADERA y de las más fundamentales de la fisiología cardiovascular (ley de Poiseuille, R ∝ 1/r⁴) — pequeños cambios de diámetro SÍ producen grandes cambios en la conductancia/resistencia. La opción D, en cambio, es FALSA de forma inequívoca: añadir vasos en PARALELO DISMINUYE la resistencia total (1/R_total = suma de 1/R de cada rama), no la aumenta — es el error clásico de confundir el efecto de las resistencias en paralelo con el de las resistencias en serie. Apoya la opción D. Se mantiene la clave oficial (C) sin alterar.

### MIR-2020-029 ⚠️
En relación con la autorregulación de la filtración glomerular (FG) y del flujo sanguíneo renal (FSR) en condiciones fisiológicas señale la afirmación INCORRECTA:

A. Los valores de FG y FSR se mantienen relativamente constantes a pesar de cambios acentuados en la presión arterial sistémica.
B. Se autorregulan en paralelo, pero en ciertas condiciones es más eficiente la autorregulación del FSR.
C. La reducción del cloruro de sodio en la mácula densa dilata las arteriolas aferentes y aumenta la liberación de renina.
D. La angiotensina II ejerce una acción vasoconstrictora preferente sobre las arteriolas eferentes renales.

**Respuesta correcta: D**

> ⚠️ **Nota de verificación fuerte (hecho fundamental y muy bien establecido de fisiología/farmacología renal, sin cita bibliográfica directa disponible):** la vasoconstricción preferente de la arteriola EFERENTE por la angiotensina II es uno de los hechos más citados y clínicamente relevantes de la fisiología renal (explica, entre otras cosas, por qué los IECA/ARA-II pueden reducir el FG al bloquear este mecanismo compensador, especialmente relevante en la estenosis de arteria renal bilateral) — difícilmente puede ser la afirmación "incorrecta". Las opciones A y C son también hechos correctos y bien establecidos (autorregulación del FG/FSR; mecanismo de retroalimentación tubuloglomerular vía mácula densa). La opción B, con la afirmación menos verificable de las cuatro, resulta la candidata más plausible a ser la realmente incorrecta, aunque sin poder confirmarlo con la misma certeza que el error identificado en D. Apoya que D no debería ser la incorrecta, sin poder determinar con la misma seguridad la alternativa exacta. Se mantiene la clave oficial (D) sin alterar.

### MIR-2021-030 ⚠️
Con respecto a la actividad eléctrica del músculo liso gastrointestinal en una situación fisiológica, indique la afirmación FALSA:

A. El ritmo de casi todas las contracciones gastrointestinales viene determinado por la frecuencia de las ondas lentas.
B. La despolarización de las ondas lentas viene determinada por la entrada de iones sodio y calcio.
C. Los potenciales en espiga son potenciales de acción y tienen una duración mayor que el de las grandes fibras nerviosas.
D. En la generación y características de los potenciales en espiga es determinante la participación de iones calcio.

**Respuesta correcta: A**

> ⚠️ **Nota de verificación fuerte (confianza fuerte, ahora con cita bibliográfica directa — corrección de alcance 2026-08-28):** `02_Bibliografia/Fisiología CTO.pdf` (Tema 04 "Fisiología del músculo", apartado sobre el potencial de acción del músculo liso) afirma textualmente, citando la propia pregunta en el margen (◗ MIR 21-22, 30): *"Las ondas lentas no son auténticos potenciales de acción y (...) se cree que las oscilaciones se deben a cambios en la permeabilidad al sodio"* — sin mencionar el calcio como parte del mecanismo de despolarización de las ONDAS LENTAS. El mismo manual reserva explícitamente el papel determinante del calcio para los **potenciales en espiga** ("en la generación y características de los potenciales en espiga es determinante la participación de iones calcio"), no para las ondas lentas de base. Esto respalda directamente que la opción B (que atribuye la despolarización de las ondas lentas a la entrada de sodio Y calcio) es la afirmación imprecisa, mientras que la opción A —criterio marcado como "falso" en la clave oficial— coincide con la descripción literal del manual ("el ritmo de casi todas las contracciones gastrointestinales viene determinado por la frecuencia de las ondas lentas" es prácticamente una cita textual del texto de referencia). Apoya la opción B como la verdadera afirmación falsa. Se mantiene la clave oficial (A) sin alterar, conforme al protocolo de verificación.

### MIR-2021-032
En cuanto a las características de los potenciales de acción que presentan las fibras musculares esqueléticas, en relación con los potenciales de acción de las fibras de las motoneuronas A alfa que las inervan, señale la respuesta INCORRECTA:

A. El potencial de membrana de reposo tiene un valor similar.
B. La duración del potencial de acción de la fibra muscular es mayor.
C. La velocidad de conducción del potencial de acción de la fibra muscular es menor.
D. El flujo de corriente en la profundidad de la fibra muscular es similar al de la motoneurona.

**Respuesta correcta: D**

> **Nota de cobertura:** confirmación LIMPIA (confianza fuerte, diferencia estructural bien establecida) — la fibra muscular esquelética posee un sistema de túbulos T que permite la propagación de corriente hacia la profundidad de la fibra (esencial para el acoplamiento excitación-contracción), un sistema del que carece la motoneurona — por tanto, el flujo de corriente en profundidad NO es similar entre ambas, siendo correctamente identificada como la afirmación incorrecta. Coincide con la clave oficial. Sin discrepancia.

### MIR-2022-030 ⚠️
El flujo sanguíneo turbulento tiende a aumentar en proporción directa a todos los siguientes factores EXCEPTO UNO. Señale cuál:

A. Viscosidad de la sangre.
B. Velocidad del flujo sanguíneo.
C. Diámetro del vaso sanguíneo.
D. Densidad de la sangre.

**Respuesta correcta: B**

> ⚠️ **Nota de verificación de MÁXIMA confianza (principio físico fundamental del número de Reynolds, sin cita bibliográfica directa disponible):** el número de Reynolds (Re = velocidad × diámetro × densidad / viscosidad), que determina la tendencia a la turbulencia, muestra una relación DIRECTA con la velocidad, el diámetro y la densidad — pero una relación INVERSA con la viscosidad (a mayor viscosidad, MENOR tendencia a la turbulencia, no proporcionalidad directa). La viscosidad (opción A) es, por tanto, la única de las cuatro variables que NO aumenta la turbulencia en proporción directa — es la verdadera excepción. La velocidad (clave oficial, B) sí guarda una relación directamente proporcional con la turbulencia. Apoya la opción A. Se mantiene la clave oficial (B) sin alterar.

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

### MIR-2023-141 ⚠️
Un paciente acude a Urgencias tras la ingesta accidental de un líquido anticongelante que contiene metanol. Respecto al equilibrio ácido-base esperado, señale la afirmación correcta:

A. Se espera una acidosis metabólica con anion gap elevado.
B. Se espera una acidosis metabólica con anion gap normal, similar a la diarrea aguda.
C. Se espera una alcalosis metabólica.
D. No se espera alteración significativa del equilibrio ácido-base.

**Respuesta correcta: D**

> ⚠️ **Nota de verificación de MÁXIMA confianza (principio fundamental y no controvertido de fisiología ácido-base):** la intoxicación por metanol es un ejemplo clásico y muy citado de acidosis metabólica con ANION GAP ELEVADO (por acumulación de ácido fórmico, metabolito tóxico del metanol vía alcohol deshidrogenasa) — junto con etilenglicol, salicilatos, cetoacidosis y acidosis láctica (regla mnemotécnica "MUDPILES"). La diarrea aguda, en cambio, es precisamente el ejemplo clásico de acidosis metabólica con anion gap NORMAL (hiperclorémica), por pérdida digestiva de bicarbonato — es decir, la opción B describe con precisión la fisiopatología de la diarrea, no la del metanol, y por tanto no puede ser correcta para este caso; la opción A (acidosis con anion gap elevado) es la que corresponde realmente a la intoxicación por metanol. Apoya la opción A. Se mantiene la clave oficial (D) sin alterar. *(Pregunta reclasificada desde el bucket "sin especialidad" — fisiopatología ácido-base fundamental.)*

> **Nota de cobertura y fiabilidad del módulo (actualizada):** con esta pregunta se eleva a 9 preguntas reales, **4 discrepancias** (3 previas + 1 nueva), 5 limpias.

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
