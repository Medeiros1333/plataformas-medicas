# PROCESO Y APRENDIZAJE — Plataforma de Farmacoterapia y Microbiología

> Registro numerado de hallazgos, errores y decisiones de diseño. Sirve para que una sesión futura no repita el trabajo de averiguación ni los errores ya cometidos.

---

## Hallazgos sobre la bibliografía

### #1 — Murray 9.ª ed. está DIGITALIZADO COMO IMAGEN
`pdftotext` sobre las 1 098 páginas devuelve solo 48 KB de texto: exclusivamente las páginas del índice. **El cuerpo del libro no es extraíble.** No merece la pena volver a intentarlo con otras herramientas de extracción de texto plano; haría falta OCR sobre 1 000 páginas de imagen.

**Consecuencia adoptada:** Murray se usa como **mapa de estructura** de la sección de Microbiología (su índice sí es texto y está cacheado en `01_Bibliografia/_indices/murray_indice.md`), y el contenido se apoya en AMIR Infecciosas y Microbiología 18.ª ed. (del proyecto MIR, en español y extraíble), Harrison y los capítulos de antimicrobianos de Katzung. Las fichas citan a Murray explícitamente como «(estructura)» para que la trazabilidad sea honesta.

### #2 — Harrison 20.ª ed. está en PORTUGUÉS, no en español
El PDF de 13 348 páginas es la edición brasileña. Es plenamente extraíble como texto.

**Consecuencia adoptada:** se usa como fuente de terapéutica y se **traduce al español** al redactar la ficha. Ojo a los falsos amigos (pt. *pesquisa* → es. *investigación/cribado*; pt. *rim* → es. *riñón*; pt. *taxa* → es. *tasa*; pt. *doente* → es. *paciente*).

### #3 — Katzung 15.ª ed. es la fuente más aprovechable
1 924 páginas, español, íntegramente extraíble (9 MB de texto plano). Su índice de 67 capítulos está cacheado en `01_Bibliografia/_indices/katzung_capitulos.md` y permite citar el capítulo exacto sin volver a abrir el PDF.

### #4 — El índice de capítulos de Katzung hay que reconstruirlo por encabezados
El PDF no tiene una tabla de contenidos extraíble al principio: empieza directamente en el cuerpo del capítulo 1. El índice se generó mecánicamente buscando los encabezados `CAPÍTULO N:` repartidos por el texto y quedándose con la variante más larga de cada número (los encabezados aparecen truncados de forma distinta según la página).

---

## Decisiones de diseño

### #5 — Fuente de verdad en JSON, no en Markdown
A diferencia del proyecto MIR (que guarda módulos `.md` y los parsea con expresiones regulares), aquí el contenido es **fuertemente esquemático**: todo fármaco tiene exactamente los mismos campos. Guardarlo en JSON permite:
- validación mecánica estricta (campos obligatorios, dosis con unidad, vías reconocidas, gravedad de interacción en un enumerado),
- integridad referencial comprobable entre fármacos y patógenos,
- generación automática de tablas comparativas y de mazos Anki sin ambigüedad de parseo.

El coste es que las fichas no se leen cómodamente en crudo; se leen en el Hub, que es donde deben leerse.

### #6 — Varios archivos JSON por área
El cargador (`scripts/lib-fichas.js`) lee **todos** los `.json` de cada carpeta y toma el área del campo `area` de cada ficha, no del nombre del archivo. Eso permite trocear un área grande en varios archivos manejables (`INF_betalactamicos.json`, `INF_otros_antibacterianos.json`, …) sin tocar el código. Aprovecharlo: un archivo de más de ~12 fichas se vuelve incómodo de editar.

### #7 — La correlación se sincroniza con un script, no a mano
Al escribir las fichas es natural que el patógeno cite al fármaco pero el fármaco no cite de vuelta al patógeno. Mantener esa simetría a mano es trabajo mecánico y propenso a error.

`scripts/sincronizar-correlacion.js` la hace simétrica, es **idempotente** (ejecutarlo dos veces no cambia nada) y ordena las listas para que los diffs sean estables. En el primer lote resolvió 47 asimetrías en una sola pasada. **Ejecutarlo siempre antes del validador.**

### #8 — El generador del Hub completa la correlación en ambos sentidos aunque falte en el origen
`generar-hub-data.js` construye el índice `correlacion` rellenando los dos sentidos, de modo que el Hub funcionaría aunque los datos fuente estuvieran asimétricos. La simetría en los archivos fuente es, por tanto, una cuestión de **calidad del dato**, no un requisito de funcionamiento — por eso la asimetría es un AVISO del validador y no un ERROR.

### #9 — Datos incrustados en `hub/data.js`, no leídos con `fetch()`
Igual que en el Hub del MIR: `fetch()` de un JSON local está bloqueado por CORS al abrir el HTML con doble clic (`file://`). Incrustar los datos como `window.FARMACO_HUB_DATA` en un `.js` cargado con `<script>` evita el problema por completo y permite usar el Hub sin servidor. `scripts/servir-hub.js` existe solo para consultarlo desde otro dispositivo de la red local.

### #10 — Campo `nivel` para hacer auditable la priorización
El encargo pide priorizar los fármacos de uso habitual del clínico general y posponer los raros. Para que ese criterio no sea una intención vaga, cada ficha lleva `nivel` 1 (núcleo), 2 (frecuente con matiz) o 3 (hospitalario/específico), el validador lo exige y el Hub permite filtrar por él. Así se puede comprobar de un vistazo si un área tiene su nivel 1 completo antes de bajar al nivel 3.

### #11 — `espectro` obligatorio como campo, `null` como valor
Se exige que el campo exista siempre (con `null` en los no antiinfecciosos) en lugar de permitir su ausencia. Así una ficha a la que se le olvidó el espectro siendo un antiinfeccioso se distingue de una a la que no le corresponde, y el validador puede exigir espectro no vacío a todo lo que sea del área INF.

---

## Errores encontrados y corregidos

### #12 — El validador rechazaba «pulsaciones» como unidad de dosis
La expresión regular que comprueba que toda dosis lleve cantidad con unidad (`TIENE_UNIDAD`) no contemplaba las unidades de los inhaladores. Marcaba como aviso la dosis correcta «2 pulsaciones» del salbutamol.

**Corregido** añadiendo `pulsación(es)`, `inhalación(es)`, `puff`, `parche` y `sobres` a la expresión. Lección: el validador debe adaptarse a las formas de dosificación reales de cada área que se incorpora, no al revés.

### #13 — Una dosis pediátrica estaba escrita como texto sin cantidad
La indicación de salbutamol en bronquiolitis decía «Prueba terapéutica única en casos seleccionados» en el campo `dosis`, que es un campo para la cantidad. El validador lo detectó.

**Corregido** a «2-4 pulsaciones de 100 µg con cámara (prueba terapéutica única)». Lección: el matiz clínico va en `nota`, la cantidad va en `dosis`. El validador es útil precisamente porque obliga a esa disciplina.

---

## Criterios de contenido adoptados

### #14 — La duplicación adulto/pediatría es deliberada
El encargo pide expresamente un apartado pediátrico completo aunque repita fármacos. Las fichas pediátricas **no** son un subconjunto ni una nota al pie: tienen `id` propio con prefijo `PED-`, campos exclusivos obligatorios (`dosis_pediatrica_base`, `dosis_maxima`, `edad_minima`, `peculiaridad_pediatrica`, `franjas_edad`, `presentaciones`) y su propia vista en el Hub. **No consolidar nunca con las de adulto.**

### #15 — `peculiaridad_pediatrica` debe explicar QUÉ CAMBIA y POR QUÉ
El campo no es para repetir la dosis en mg/kg (que ya está en otro campo), sino para el razonamiento que hace distinto al niño: inmadurez enzimática, contraindicaciones específicas por edad (ibuprofeno y varicela), errores de dosificación característicos (confusión entre concentraciones de suspensión), o diferencias de estrategia (cámara espaciadora frente a nebulizador).

### #16 — Las `perlas` deben ser específicas del fármaco, no de su clase
Si una perla vale para toda la familia, no es una perla de ese fármaco. Ejemplos de perlas que sí cumplen: la eliminación biliar de la doxiciclina (única tetraciclina segura en insuficiencia renal), la cadena lateral única de la cefazolina (reactividad cruzada casi nula con penicilina), el efecto uricosúrico del losartán (único de su clase), la actividad intrínseca del sulbactam frente a Acinetobacter.

### #17 — Las interacciones se filtran por consecuencia clínica, no por mecanismo
Una interacción farmacocinética teórica sin cambio de conducta no entra. Sí entran las que obligan a hacer algo distinto: reducir a la mitad la digoxina al iniciar amiodarona, respetar 48 h entre tadalafilo y nitroglicerina, cambiar de antiepiléptico ante meropenem y valproato, no combinar alopurinol con azatioprina.

---

### #20 — Hay dosis que NO son una cantidad: el campo `dosis_objetivo`
El validador exigía que toda dosis llevase cantidad con unidad (hallazgo #13). Al incorporar HEM y END apareció una excepción legítima: el **acenocumarol** no tiene dosis fija, su dosis *es* el INR objetivo; lo mismo ocurre con el bolo corrector de insulina (factor de sensibilidad) y con la heparina no fraccionada en circuitos extracorpóreos (protocolo por tiempo de coagulación activado).

Escribir un número inventado habría falsificado el dato; silenciar el aviso habría abierto la puerta a dosis olvidadas. **Solución adoptada:** campo opcional `dosis_objetivo` que declara la diana medible. El validador acepta la ausencia de cantidad **solo** si ese campo está presente, de modo que la excepción es deliberada y auditable. El Hub lo muestra bajo la dosis y el exportador genera una tarjeta específica.

**Regla general que deja este hallazgo:** cuando el validador choca con contenido correcto, la respuesta no es relajar la regla ni deformar el dato, sino **modelar explícitamente el caso** con un campo nuevo.

### #21 — Un patógeno sin fármaco correlacionado no siempre es un hueco
El validador avisaba de todo patógeno de nivel 1-2 sin fármaco enlazado. Con los 14 virus nuevos ese aviso se disparó nueve veces, y en ocho de ellas el dato era CORRECTO: sarampión, rubéola, parvovirus B19, VEB, VHA, VRS, dengue y rotavirus no tienen tratamiento etiológico, solo soporte.

**Solución adoptada:** el aviso se omite cuando `tratamiento.eleccion` empieza por «SINTOMÁTICO», «SOPORTE» o «REHIDRATACIÓN». El resultado fue que quedó **un solo aviso**, y era un hueco real: el VPH sí tiene tratamiento farmacológico y no había ficha. Se escribió la de imiquimod, que además abrió el área DER.

**Lección:** un aviso que salta muchas veces por motivos legítimos deja de leerse. Afinar la regla hasta que cada aviso signifique algo es lo que mantiene útil al validador.

### #22 — Los virus arrastran fármacos de áreas que aún no existen
Escribir la sección de virus obligó a crear ocho antivíricos (INF) y, de forma menos previsible, la primera ficha de DERMATOLOGÍA. La correlación bidireccional actúa como un detector de deuda: cada patógeno bien escrito reclama los fármacos que lo tratan, y el validador los exige. Conviene **anticipar ese arrastre** al planificar un lote de microbiología.

---

## Pendientes conocidos

### #18 — RESUELTO (2026-09-03): la sección de virus era el mayor hueco
Se cerró con 14 patógenos nuevos (VHA, VHB, VHC, VIH, CMV, VEB, VRS, SARS-CoV-2, sarampión, rubéola, parvovirus B19, rotavirus, VPH, dengue) y los 8 antivíricos que les dan soporte. VIR pasó de 3 a 17 fichas. Se conserva a continuación la redacción original como registro del estado previo.

#### Estado original (histórico)
Solo hay 3 fichas (influenza, VHS, VVZ), las estrictamente necesarias para dar soporte a los antivirales ya escritos. Faltan VIH, hepatitis, resto de herpesvirus y exantemáticos. Es el primer lote a abordar, y arrastra la necesidad de escribir las fichas de antirretrovirales y de antivirales de acción directa frente a las hepatitis.

### #19 — Áreas de fármacos sin empezar (actualizado 2026-09-03)
END, HEM, DIG y DER ya tienen núcleo. Siguen sin ninguna ficha NFR, NEU, PSQ, INM, ONC, GIN, ANE y OFT. NML y URG solo tienen la ficha pediátrica, sin su equivalente de adulto. Ver el orden de prioridad en `PROGRESO.md`, sección 4.

### #23 — El desequilibrio adulto/pediatría (CORREGIDO en método el 2026-09-03)
Con 80 fichas de adulto frente a 6 pediátricas, la sección de pediatría ha quedado muy por detrás. No es un problema de diseño (la duplicación es deliberada, hallazgo #14) sino de RITMO: cada lote de adulto se ha escrito sin su contrapartida pediátrica. **Corrección de método para los próximos lotes:** escribir las fichas pediátricas EN EL MISMO lote que las de adulto, no como una fase posterior.

**Aplicación de la corrección:** el lote de NML y URG se escribió ya con sus fichas pediátricas en la misma tanda (budesonida inhalada, dexametasona del crup, naloxona pediátrica), y se aprovechó para cubrir la pediatría de las áreas del lote anterior (hierro, levotiroxina, ondansetrón, suero de rehidratación oral, ceftriaxona). Pediatría pasó de 6 a 14 fichas.

### #24 — La ficha pediátrica debe explicar QUÉ mecanismo hace distinto al niño
Al escribir el segundo lote pediátrico quedó claro qué distingue una buena ficha pediátrica de una mala. La mala repite la del adulto cambiando la dosis a mg/kg. La buena identifica el MECANISMO por el que el niño es distinto, y ese mecanismo casi nunca es farmacológico:

- **Anatómico:** la laringitis existe porque el cricoides es un anillo completo y la resistencia varía con la cuarta potencia del radio.
- **Fisicoquímico:** la ceftriaxona está contraindicada en el neonato porque desplaza la bilirrubina de la albúmina y porque precipita con el calcio, no por una diferencia de metabolismo.
- **Del desarrollo:** el hierro y la levotiroxina se tratan con urgencia porque intervienen en la mielinización, y el daño de su déficit es irreversible.
- **De seguridad doméstica:** la intoxicación por hierro y la ingesta accidental de opioides son problemas del entorno del niño, no del fármaco.
- **De administración:** el dispositivo inhalatorio según la edad, los 5 mL cada 2 minutos de la rehidratación, no diluir la levotiroxina en un biberón entero.

Esa es la información que hace útil la sección pediátrica y la que debe ir en `peculiaridad_pediatrica`.

### #25 — El validador se amplía con cada área nueva, y eso es señal de salud
Al incorporar NEU y PSQ volvió a ocurrir lo del hallazgo #12: la lista de vías reconocidas rechazó la vía BUCAL del midazolam pediátrico y la vía INTESTINAL del gel de levodopa. Ambas son correctas y ambas se añadieron.

Es el tercer episodio del mismo patrón (pulsaciones inhaladas, dosis guiadas por diana, vías nuevas). La conclusión ya no es una anécdota sino una regla de mantenimiento: **el validador codifica lo que la plataforma ha visto hasta ahora, no la farmacología entera**. Cada área nueva ampliará alguno de sus enumerados, y ese aviso es exactamente lo que debe hacer: obligar a decidir de forma consciente si el dato es un error o una forma real que faltaba modelar.

El contraste con los avisos por dosis sin cantidad es instructivo: en este lote, de 5 avisos, 3 eran del validador quedándose corto (vías) y 2 eran errores reales míos (dosis escritas por referencia, del tipo «misma dosis por edad», en vez de con la cantidad). Un validador afinado distingue esas dos cosas en lugar de mezclarlas.

### #26 — Los protocolos multifármaco necesitan que TODAS sus piezas existan
El lote de NFR dejó claro un tipo de hueco que no detecta ningún script: la ficha de quelantes del potasio explica que el manejo de la hiperpotasemia tiene tres pisos (estabilizar con calcio, redistribuir con insulina y salbutamol, eliminar con quelantes o diálisis), pero el CALCIO no tenía ficha. Una perla que remite a un fármaco ausente de la plataforma es una promesa incumplida al lector.

**Consecuencia adoptada:** se escribió la ficha de gluconato cálcico en el mismo lote. Y de forma más general: **cuando una ficha describe un protocolo con varios fármacos, hay que comprobar que todos ellos existen o anotarlos como deuda explícita en PROGRESO.md.** La correlación fármaco-patógeno sí la vigila el validador; esta otra forma de dependencia, entre fármacos de un mismo algoritmo, no.

Otros protocolos ya escritos con la misma dependencia pendiente de revisar: cetoacidosis (insulina e hidratación están, falta potasio intravenoso), anafilaxia (falta adrenalina adulto), intoxicación por calcioantagonistas (falta glucagón).

### #27 — El hallazgo #26 se confirma como la fuente principal de huecos reales
Al aplicar la regla del hallazgo #26 de forma sistemática, las deudas anotadas allí se saldaron y aparecieron tres más, todas del mismo tipo y ninguna detectable por script:

- La ficha de **Aspergillus** decía «iniciar voriconazol de inmediato» y el voriconazol no tenía ficha.
- La ficha de **Candida** decía «empezar con una equinocandina y desescalar a fluconazol» y las equinocandinas no tenían ficha.
- La ficha de **Plasmodium vivax** indicaba cloroquina más primaquina, y ninguno de los dos existía.

Es decir: **los huecos no aparecen donde falta un área entera, sino donde una ficha ya escrita nombra un fármaco que nadie escribió.** Son los más dañinos porque el lector confía en la plataforma justo en el momento en que le falla.

**Consecuencia adoptada:** la comprobación de las piezas del protocolo pasa de ser una buena práctica del hallazgo #26 a ser un paso fijo del cierre de lote, escrito en la sección 4 de PROGRESO.md. Antes de dar un lote por terminado, se releen las perlas y los apartados de tratamiento buscando nombres de fármacos sin ficha.

### #28 — El porcentaje de avance necesita un denominador escrito, no estimado
Hasta este lote el estado se medía en número absoluto de fichas, que no dice nada sobre cuánto falta. Al fijar en PROGRESO.md un **objetivo explícito por área** (correspondiente solo a los niveles 1 y 2) el porcentaje se vuelve auditable y, sobre todo, comparable entre sesiones: cualquier sesión futura puede recalcularlo sin reinventar el criterio.

La decisión de dejar el **nivel 3 fuera del denominador** es deliberada y conviene no olvidarla: el proyecto prioriza lo que se prescribe, y meter los fármacos raros en el objetivo haría que el porcentaje bajara al añadir contenido útil, que es exactamente el incentivo contrario al que se busca.

### #29 — No todo lo pediátrico se dosifica por kilo
El validador exigía que `dosis_pediatrica_base` incluyera «kg», y esa regla, razonable para la inmensa mayoría de los fármacos, chocó con tres casos legítimos: la vitamina D profiláctica (400 UI, **dosis fija**), el montelukast y los antihistamínicos (**por franja de edad**) y los tópicos como la permetrina o los corticoides (**por superficie**). Escribir una dosis por kilo inventada para contentar al validador habría sido falsear el dato.

**Consecuencia adoptada:** se añadió la constante `DOSIS_NO_PONDERAL`, que acepta la excepción **solo si la ficha la DECLARA expresamente** («dosis FIJA», «por franja de edad», «por SUPERFICIE», «no ponderal»). Es la misma solución que se dio a `dosis_objetivo` en el hallazgo #20: la excepción existe, pero es deliberada y auditable, y no una dosis que se quedó sin escribir.

### #30 — La lista de unidades del validador es un registro vivo, no una constante
`TIENE_UNIDAD` se ha ampliado ya cinco veces a lo largo del proyecto: primero por vías nuevas (bucal, intestinal), después por «microgramos» y «miligramos» escritos con todas sus letras, y por último por «viales» y «ampollas», que es como se dosifican los antídotos y los hemoderivados.

El patrón se repite tanto que conviene enunciarlo: **cuando el validador avisa, la primera pregunta no es cómo reescribir la ficha sino si el validador conoce la forma real en que se prescribe ese fármaco.** En este último lote, de 18 avisos, 12 fueron vaguedad mía (dosis escritas «según protocolo» o «según la edad», que se corrigieron poniendo la cantidad real) y 6 fueron el validador quedándose corto. Distinguir ambas cosas en cada aviso es lo que ha permitido que el proyecto termine con 326 fichas y cero avisos sin haber relajado ni una sola regla.

Un detalle técnico que costó dos intentos: al ampliar `TIENE_UNIDAD` se añadieron `UI/kg` y `mEq/L`, cuyas barras rompen el literal de expresión regular. Eran además redundantes, porque `UI` y `mEq` ya casaban. **Al tocar una regex de validación conviene ejecutar el script inmediatamente: un error de sintaxis ahí deja todo el pipeline sin red.**

---

## Ampliación de octubre de 2026: patologías y fármacos por clase

### #31 — Una taxonomía de clases inconsistente rompe en silencio la comparación
Al añadir simvastatina, rosuvastatina y pravastatina quedó claro que la plataforma tenía un problema que no detectaba ningún script: el campo `clase` se había escrito de forma libre en cada lote. Amikacina estaba en «Antibiótico» y gentamicina en «Aminoglucósido»; azitromicina en «Macrólido (azálido)» y claritromicina en «Macrólido»; el lorazepam en «Benzodiacepina de acción intermedia». La vista **Comparar** y los nuevos chips **«Otros de su clase»** agrupan por igualdad exacta del texto, así que esos fármacos nunca aparecían juntos.

**Consecuencia adoptada:** se normalizaron 75 fichas para que cada familia comparta **exactamente** el mismo string de `clase`, y el matiz pasó a `subclase` (p. ej. clase «Benzodiacepina», subclase «Acción intermedia, sin metabolitos activos»). Las clases-cajón que agrupaban fármacos sin relación (los cuatro «Antídoto», los tres «Antineoplásico») se separaron en clases reales. **Regla para el futuro: antes de escribir la `clase` de una ficha nueva, copiarla de un hermano existente.**

### #32 — `vs_clase` + resaltado: la forma de que la repetición no oculte lo específico
El encargo pedía fichas completas de cada fármaco aunque repitieran la de su clase, pero con lo propio de cada uno destacado. Se resolvió con dos piezas:
- **Campo `vs_clase`** (lista): «qué distingue a este fármaco de los demás de su clase». El Hub lo muestra arriba de la ficha en un recuadro destacado y como primera fila de Comparar; el exportador genera una tarjeta por elemento.
- **Marcado `**…**`** en cualquier texto de la ficha: el Hub lo pinta como un resaltador amarillo y Anki como negrita. Así, dentro del mecanismo o la farmacocinética repetidos, lo específico salta a la vista.

El validador **avisa** cuando una ficha pertenece a una clase con ≥2 miembros y no declara `vs_clase`, y da **error** si un `**` queda desemparejado (dejaría el resto del texto resaltado). Al aplicarlo aparecieron 108 fichas antiguas sin `vs_clase`: se completaron todas, porque una comparación solo vale si es simétrica.

### #33 — La patología es una vista transversal, no una ficha más
Una ficha de patología no tiene sentido sin los fármacos a los que remite, así que se diseñó como **índice de pautas** con enlace (`ref`) a la ficha del fármaco, y no como un resumen que duplicara dosis sin control. Cada fila obliga a declarar **dosis, vía, intervalo y duración**, porque eso es lo que se busca al consultar una patología. Las pautas pediátricas van en escenarios con `poblacion` y enlazan a las fichas `PED-`; el validador avisa si un escenario pediátrico enlaza a una ficha de adulto (o al revés) salvo que la fila lo declare con `"otra_poblacion": true` (la SRO solo tiene ficha pediátrica y se usa también en adultos).

El generador construye además el **índice inverso** (`pat_por_farmaco`), de modo que cada ficha de fármaco muestra «Se usa en estas patologías». Y al saltar de una patología a un fármaco, la ficha ofrece **volver** a la patología: sin eso, la navegación de ida y vuelta que pedía el encargo se perdía en dos clics.

### #34 — `sin_ficha` convierte la deuda de contenido en una lista auditable
Escribir 88 patologías sacó a la luz, exactamente como predijo el hallazgo #27, fármacos de uso habitual que no tenían ficha (noradrenalina, tiamina, cloruro potásico, alteplasa, fidaxomicina…). Inventar una ficha a medias para cada uno habría bajado la calidad; omitirlos habría falseado las pautas. **Se adoptó el campo `"sin_ficha": true`**: la fila aparece completa en la patología (sin chip enlazable) y el validador solo avisa de las filas sin `ref` que NO lo declaran. La lista de estos 30 fármacos está en PROGRESO.md como deuda del próximo lote.

### #35 — «Al menos 3 por clase» exige decidir qué cuenta como miembro
Al convertir el encargo en una regla del validador apareció la pregunta que el encargo no respondía: una ficha como «Cisplatino, carboplatino y oxaliplatino» ¿es un miembro o tres? Contarla como tres habría dado la regla por cumplida sin escribir nada; contarla como uno dejaba una ficha valiosa (el resumen comparativo) compitiendo con las individuales.

**Consecuencia adoptada:** las fichas agrupadas se marcan con `vision_clase: true`, pasan a la clase «Visión de clase: …» y **no cuentan** para el mínimo; el Hub las señala con su propia insignia y la lista las presenta como resumen. La regla solo cuenta **fichas individuales**. Con ese criterio, los avisos de clase bajaron de 118 a 0 a lo largo de 17 lotes por área, y la plataforma pasó de 281 a 529 fichas de adulto.

### #36 — Una excepción a la regla solo es aceptable si se escribe su porqué
Algunas familias tienen de verdad un único representante de uso real: litio, colchicina, oxígeno, emolientes. Rellenarlas con fármacos de nivel 3 o con presentaciones del mismo principio activo habría sido inflar el contenido para contentar al validador, el error que ya señaló el hallazgo #29.

**Consecuencia adoptada:** el campo `clase_unica` exige un **texto con la justificación**, no un booleano. El validador acepta la clase de un solo miembro solo si lo declara así. Son 4 en toda la plataforma, y cada una dice por qué.

### #37 — Ampliar una clase obliga a revisar su nombre y los enlaces que la apuntan
Completar clases hizo visibles fronteras mal trazadas: los calcioantagonistas DHP y no DHP estaban en dos clases de un miembro cada una, igual que los ACOD y los AVK, y la gemcitabina no cabía en una clase llamada «fluoropirimidina». **Se fusionaron las familias que la práctica clínica compara entre sí** y se renombraron las que excluían a un hermano legítimo («Antimetabolito antineoplásico (análogo de pirimidina)»).

Además, cada ficha nueva deja obsoletos los enlaces anteriores: 26 filas de patologías marcadas `sin_ficha` ya tenían ficha, y 56 apuntaban a una «Visión de clase» cuando la pauta citaba un fármaco concreto (labetalol, gliclazida, bilastina). **Tras cada ampliación hay que re-enlazar las patologías**; se hizo con un mapa explícito fila → ficha que aborta si un id no existe, y el validador detectó el único error de población (escabiosis infantil enlazada a la permetrina de adulto).

---

## Plan de mejoras para el médico general (octubre de 2026)

### #38 — «Sin país» es una regla de redacción, no solo de contenido
El encargo pidió una plataforma de farmacología general, sin vínculo con ningún país. Ya no había prácticamente nada clínico específico de un país. Sí quedaban **59 textos** que lo daban por supuesto sin decirlo:
- **epidemiología local**: «resistencia a macrólidos del 25% en España»;
- **agencias nacionales**: «alerta de la AEMPS»;
- **guías nacionales**: GEMA, SEGO, AEP, guías SEN.

Esos textos eran correctos, pero solo para un lector de ese país.

**Consecuencia adoptada:**
- la epidemiología se expresa por **condición**: «donde la resistencia a macrólidos es alta»;
- las alertas, por la **EMA y la FDA**;
- las guías, por las **internacionales**: GINA, OMS, FIGO, AAP, ILAE, Maastricht.

Las enfermedades tropicales (dengue, Chagas, leishmaniasis, lepra, esquistosomiasis) entraron como **infectología general**, no como módulo de un país. La regla quedó escrita como principio 8 del playbook y como punto 9 del checklist.

### #39 — Cotejar 966 pautas con la bibliografía: lo automático filtra, lo clínico valida
Releer 966 pautas a mano sin ningún apoyo es lento y propenso a pasar cosas por alto. Fiarse solo de un cotejo automático no valida nada. Se combinaron las dos cosas:
- **Cotejo automático.** `scripts/herramientas/cotejar-pautas-bibliografia.js` busca en el texto de Harrison y Katzung el nombre del fármaco, con variantes en portugués, y la cifra de la dosis a menos de 450 caracteres. Así se cotejaron 791 pautas.
- **Revisión clínica.** Se revisaron las 966 pautas, empezando por las 175 no cotejadas.

Los errores encontrados **no estaban donde el cotejo fallaba**. Estaban en pautas «cotejadas»: una nifedipina retard repetida cada 20 minutos y una combinación con la dosis en orden invertido. **La proximidad de una cifra en el libro no prueba que la pauta esté bien escrita.** El cotejo sirve para priorizar la lectura, no para darla por hecha.

**Consecuencia adoptada:** cada patología lleva el campo `revision`, que el Hub muestra al pie, y el validador avisa si falta. El registro de cambios vive en `REVISION_DOSIS.md`.

### #40 — Una calculadora clínica debe enseñar su fuente, no sustituirla
Las tres herramientas de la vista Calculadoras **leen el texto de las fichas** en lugar de tener datos propios. Así no hay una segunda fuente de verdad que pueda desincronizarse:
- **ajuste renal**: resalta el fragmento que aplica al filtrado calculado;
- **dosis por peso**: multiplica cada «mg/kg» de la ficha y la compara con su dosis máxima;
- **interacciones**: cruza el campo «con» de cada interacción con el nombre, los sinónimos y la clase del otro fármaco.

El precio es que solo saben lo que dicen las fichas. Por eso cada resultado muestra el texto original y de qué ficha procede.

Dos errores aparecieron al probarlas con casos conocidos:
1. **El tope «60 mg/kg/día» se leía como «60 mg».** El analizador tuvo que ignorar los máximos expresados por kilo.
2. **Faltaba la dosis diaria.** Una dosis «por toma» solo se compara con un máximo diario si se calcula el total del día con el intervalo.

**Probar con casos cuyo resultado se conoce de antemano detectó lo que la revisión del código no había visto:** paracetamol con 80 kg, mujer de 78 años con creatinina 1,4, y sildenafilo con nitrato.

### #41 — Medir la cobertura exige una lista de referencia escrita
A la pregunta «¿qué porcentaje de la práctica del médico general cubre la plataforma?» no se puede responder contando patologías: 154 no dice nada sin un denominador. Se escribió una **lista de referencia de 213 cuadros tratados con fármacos** en atención primaria y urgencias, agrupados por área y con criterios de los motivos de consulta (tipo ICPC-2) y de los protocolos de urgencias.

Con ella, la cobertura era del 73% (156/213), o de ~90% ponderando por frecuencia de consulta. Las lagunas tenían un patrón claro:
- **urgencias específicas**: PCR, intubación, intoxicaciones;
- **quejas comunes de consulta** que no parecen «enfermedades»: abscesos, ombro doloroso, epistaxis, ojo seco, aftas, sangrado uterino;
- **pediatría del lactante**.

El cierre añadió 58 patologías y llevó la lista al 100%.

**Advertencia para el futuro:** el 100% es respecto a esa lista, no respecto a toda la medicina general. La lista es finita y propia. Cada hueco que aparezca al usar la plataforma se añade **a la lista y a la plataforma**, para que el porcentaje siga siendo honesto.
