// Paciente simulado de la estación 1: entiende la pregunta (en español) por palabras clave
// y responde con los datos del caso, en la voz del paciente o del acompañante.
(function (root) {
  const norm = s => ' ' + String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim() + ' ';

  // Categorías: k = palabras clave (se buscan al inicio de palabra), d = respuesta por defecto.
  const CATS = {
    saludo: { k: ['hola', 'buen dia', 'buenos dias', 'buenas tardes', 'buenas noches', 'mucho gusto', 'soy estudiante', 'soy el estudiante', 'soy la estudiante', 'me presento'], d: 'Buenos días.' },
    nombre: { k: ['como se llama', 'su nombre', 'nombre completo', 'como te llamas', 'como le llaman'], d: null },
    edad: { k: ['cuantos anos', 'que edad', 'su edad', 'edad tiene', 'fecha de nacimiento'], d: null },
    mot: { k: ['que le trae', 'que lo trae', 'que la trae', 'que te trae', 'que le paso', 'que le pasa', 'que lo trajo', 'que la trajo', 'motivo', 'en que le puedo ayudar', 'en que lo puedo ayudar', 'en que la puedo ayudar', 'en que puedo ayudar', 'por que vino', 'por que viene', 'por que consulta', 'a que se debe', 'cuenteme', 'cuentame', 'que siente', 'que le ocurre', 'digame que', 'que les trae', 'que los trae'], d: null },
    ini: { k: ['desde cuando', 'cuando empezo', 'cuando comenzo', 'cuando inicio', 'cuando le empezo', 'cuando aparecio', 'hace cuanto', 'cuanto tiempo', 'como empezo', 'como comenzo', 'como inicio', 'como aparecio', 'forma de inicio'], d: 'Hace unos días, no sé exactamente.' },
    evo: { k: ['evolucion', 'empeor', 'fue cambiando', 'fue aumentando', 'cada vez', 'progres', 'como siguio', 'esta igual', 'ha cambiado', 'fue empeorando'], d: 'Más o menos igual.' },
    mod: { k: ['que lo mejora', 'que la mejora', 'que lo alivia', 'que la alivia', 'algo lo alivia', 'algo la alivia', 'alivia', 'calma', 'mejora con', 'empeora con', 'que lo empeora', 'que la empeora', 'atenuant', 'agravant', 'se le pasa'], d: 'Nada en especial.' },
    loc: { k: ['donde le duele', 'donde te duele', 'en que parte', 'en que lugar', 'donde siente', 'donde lo siente', 'donde exactamente', 'localiz', 'senale', 'muestreme', 'que zona'], d: 'No sabría decirle un lugar exacto.' },
    irr: { k: ['irradia', 'se corre', 'se va hacia', 'se va para', 'se extiende', 'se desplaza', 'hacia otro lado', 'a otro lado', 'a otra parte'], d: 'No, no se va a ningún lado.' },
    int: { k: ['intensidad', 'del 1 al 10', 'del uno al diez', 'de 1 a 10', 'de uno a diez', 'que tan fuerte', 'cuanto le duele', 'escala', 'muy fuerte'], d: 'Molesta, pero se aguanta.' },
    car: { k: ['como es el dolor', 'como es ese dolor', 'tipo de dolor', 'punzante', 'opresivo', 'quemante', 'puntada', 'colico', 'urente', 'pulsatil', 'como describe'], d: 'No sé cómo describirlo.' },
    dolor: { k: ['dolor', 'duele', 'dolio', 'molestia'], d: 'No, dolor no.' },
    fiebre: { k: ['fiebre', 'temperatura', 'calentura', 'febril', 'febricula', 'escalofr', 'tiritona'], d: 'No, fiebre no.' },
    sudor: { k: ['sudor', 'sudoracion', 'transpir', 'suda'], d: 'No, sudoración no.' },
    peso: { k: ['peso', 'adelgaz', 'engord', 'kilo', 'perdio peso', 'subio de peso', 'flaco', 'la ropa'], d: 'No, el peso está igual.' },
    apetito: { k: ['apetito', 'hambre', 'ganas de comer', 'come bien', 'comiendo'], d: 'Come normal.', d1: 'Como normal.' },
    astenia: { k: ['cansan', 'cansad', 'fatiga', 'astenia', 'energia', 'agotad', 'sin fuerza', 'debilidad general', 'debil', 'decaid'], d: 'No, cansancio no.' },
    sueno: { k: ['duerme', 'dormir', 'sueno', 'insomnio', 'descansa'], d: 'Duerme bien.', d1: 'Duermo bien.' },
    vomitos: { k: ['vomit', 'nausea', 'devolv', 'arcada'], d: 'No, vómitos no.' },
    diarrea: { k: ['diarrea', 'suelta', 'liquida', 'blanda'], d: 'No, diarrea no.' },
    constip: { k: ['constip', 'estren', 'no va de cuerpo', 'no evacua'], d: 'No, va de cuerpo normal.', d1: 'No, voy de cuerpo normal.' },
    heces: { k: ['heces', 'deposicion', 'materia fecal', 'evacua', 'ir de cuerpo', 'va de cuerpo', 'ir al bano', 'va al bano', 'caca', 'intestin', 'habito intestinal', 'ritmo evacuatorio', 'catarsis'], d: 'Va de cuerpo normal.', d1: 'Voy de cuerpo normal.' },
    sangreheces: { k: ['sangre en las heces', 'sangre en la materia', 'heces negras', 'materia fecal negra', 'caca negra', 'melena', 'negras', 'sangre al ir', 'sangre en la caca', 'sangrado digestivo', 'sangrado rectal', 'heces oscuras'], d: 'No, sangre en la materia fecal no.' },
    sangrado: { k: ['sangr', 'hemorrag', 'moreton', 'hematoma', 'encia', 'nariz', 'epistaxis', 'gingivo'], d: 'No, sangrados no.' },
    orina: { k: ['orina', 'orinar', 'orino', 'miccion', 'pis', 'diuresis', 'vejiga'], d: 'Orina normal.', d1: 'Orino normal.' },
    sed: { k: ['sed', 'mucha agua', 'mucho liquido', 'polidipsia', 'poliuria'], d: 'No, sed normal.' },
    tos: { k: ['tos', 'flema', 'expector', 'catarro', 'esputo', 'gripe', 'resfri'], d: 'No, tos no.' },
    disnea: { k: ['falta de aire', 'falta el aire', 'le falta aire', 'ahogo', 'ahoga', 'disnea', 'respira', 'agitad', 'aire'], d: 'No, respira bien.', d1: 'No, respiro bien.' },
    palpit: { k: ['palpita', 'corazon', 'latido', 'taquicard', 'late rapido', 'late fuerte'], d: 'No, el corazón bien.' },
    torax: { k: ['pecho', 'torax', 'toracic', 'costado'], d: 'No, del pecho nada.' },
    cefalea: { k: ['cabeza', 'cefalea', 'jaqueca', 'migrana'], d: 'No, dolor de cabeza no.' },
    mareo: { k: ['mareo', 'marea', 'desmay', 'sincope', 'vertigo', 'perdio el conocimiento'], d: 'No, mareos no.' },
    vision: { k: ['vista', 'vision', 've bien', 'ver doble', 'borros', 'ojos', 'ojo', 'luz'], d: 'Ve bien.', d1: 'Veo bien.' },
    piel: { k: ['piel', 'mancha', 'lesion', 'erupcion', 'sarpullido', 'granito', 'rash', 'roncha', 'picazon', 'prurito', 'pica', 'color de la piel'], d: 'No, en la piel nada.' },
    ictericia: { k: ['amarill', 'ictericia', 'ictero'], d: 'No, amarillo no.' },
    artic: { k: ['articulac', 'coyuntura', 'rodilla', 'codo', 'muneca', 'tobillo', 'hombro', 'dedo', 'mano', 'huesos', 'reuma', 'artritis', 'artralg'], d: 'No, las articulaciones bien.' },
    edema: { k: ['hinchad', 'hincha', 'edema', 'retencion de liquido'], d: 'No, hinchazón no.' },
    neuro: { k: ['hormigue', 'adormec', 'entumec', 'fuerza', 'paralis', 'debilidad en', 'perdida de fuerza', 'parestesia', 'sensibilidad', 'calambre'], d: 'No, nada de eso.' },
    concien: { k: ['dormido', 'somnol', 'confund', 'confus', 'desorient', 'conciencia', 'se da cuenta', 'ubicado', 'ubicada'], d: 'No, está bien despierto, se da cuenta de todo.', d1: 'No, estoy bien despierto, me doy cuenta de todo.' },
    convul: { k: ['convuls', 'epileps', 'ataque'], d: 'No, convulsiones no.' },
    memoria: { k: ['memoria', 'olvid', 'recuerda'], d: 'La memoria bien.' },
    cuello: { k: ['cuello', 'nuca', 'bocio', 'garganta'], d: 'No, del cuello nada.' },
    abdomen: { k: ['panza', 'abdomen', 'abdominal', 'barriga', 'estomago', 'vientre', 'epigastr', 'tripa'], d: 'No, de la panza bien.' },
    espalda: { k: ['espalda', 'cintura', 'lumbar', 'columna', 'dorsal'], d: 'No, la espalda bien.' },
    boca: { k: ['boca', 'lengua', 'afta', 'llaga', 'paladar'], d: 'No, en la boca nada.' },
    mens: { k: ['menstru', 'regla', 'periodo', 'ciclo', 'menopaus', 'ultima menstruacion'], d: 'Normal.' },
    embarazo: { k: ['embaraz', 'anticoncep', 'gesta', 'partos', 'se cuida'], d: 'No.' },
    sexual: { k: ['relaciones sexuales', 'sexual', 'pareja', 'preservativo', 'enfermedad venerea', 'vih', 'sida', 'condon'], d: 'Nada de riesgo.' },
    alergias: { k: ['alergi', 'alergic'], d: 'No, alergias no.' },
    med: { k: ['medicament', 'medicacion', 'remedio', 'pastilla', 'toma algo', 'toma alguna', 'farmaco', 'tratamiento', 'automedic', 'que toma', 'tomando'], d: 'No, ningún remedio.' },
    app: { k: ['enfermedad', 'antecedente', 'diabet', 'presion alta', 'hipertens', 'cronic', 'problema de salud', 'padece', 'sufre de', 'asma', 'tiroid'], d: 'No, enfermedades no.' },
    cirugias: { k: ['cirug', 'operad', 'operacion', 'opero', 'operaron', 'operar', 'intervenc'], d: 'No, operaciones nunca.' },
    intern: { k: ['internad', 'hospitaliz', 'internacion'], d: 'No, internaciones no.' },
    transf: { k: ['transfus', 'recibio sangre'], d: 'No, transfusiones nunca.' },
    vacunas: { k: ['vacun'], d: 'Las de chico; no sé bien.' },
    fam: { k: ['familia', 'familiar', 'padre', 'madre', 'papa', 'mama', 'hermano', 'hermana', 'abuel', 'hereditari', 'herencia'], d: 'En la familia nada importante, que sepa.', d1: 'En la familia nada importante, que yo sepa.' },
    tabaco: { k: ['fuma', 'fumo', 'cigarr', 'tabaco', 'tabaquismo'], d: 'No, cigarrillo no.' },
    alcohol: { k: ['alcohol', 'bebida', 'bebe', 'cerveza', 'vino', 'trago', 'whisky'], d: 'No, alcohol no.' },
    drogas: { k: ['droga', 'cocaina', 'marihuana', 'crack', 'inyectable', 'sustancia'], d: 'No, drogas nunca.' },
    ocup: { k: ['trabaja', 'trabajo', 'ocupacion', 'a que se dedica', 'profesion', 'estudia', 'oficio', 'jubilad'], d: 'Ahora no está trabajando.', d1: 'Ahora no estoy trabajando.' },
    vivienda: { k: ['vive', 'con quien', 'casa', 'vivienda', 'hogar', 'agua potable', 'pozo', 'barrio', 'campo', 'ciudad'], d: 'Vive con la familia, en la ciudad.', d1: 'Vivo con mi familia, en la ciudad.' },
    animales: { k: ['animal', 'perro', 'gato', 'mascota', 'vaca', 'oveja', 'cabra', 'cerdo', 'chancho', 'gallina', 'rata', 'raton'], d: 'No, animales no.' },
    viajes: { k: ['viaj', 'fuera del pais', 'exterior', 'estuvo en'], d: 'No, viajes no.' },
    contactos: { k: ['contacto', 'alguien enfermo', 'otra persona', 'vecino', 'companer', 'convivient', 'alguien con lo mismo', 'alguien cerca', 'alguien mas'], d: 'Que sepa, nadie.', d1: 'Que yo sepa, nadie.' },
    alim: { k: ['aliment', 'dieta', 'comida', 'que come', 'carne', 'verdura', 'leche', 'lacteo', 'come'], d: 'Come de todo.', d1: 'Como de todo.' },
    preoc: { k: ['preocupa', 'miedo', 'que piensa', 'que cree', 'duda', 'que espera', 'expectativ', 'asusta'], d: 'Quiero saber qué tengo.' },
    otros: { k: ['algo mas', 'alguna otra cosa', 'otra cosa', 'algo que quiera agregar', 'algo que agregar', 'quiere agregar', 'algo que no le haya'], d: 'No, creo que eso es todo.' },
    despedida: { k: ['gracias', 'eso es todo', 'hemos terminado', 'terminamos'], d: 'Gracias a usted.' },
    frio: { k: ['frio', 'friolent'], d: 'No, frío no.' },
    calor: { k: ['calor'], d: 'No, el calor lo tolera bien.', d1: 'No, el calor lo tolero bien.' },
    animo: { k: ['animo', 'triste', 'deprim', 'nervios', 'ansios'], d: 'El ánimo bien.' },
    marcha: { k: ['caminar', 'marcha', 'equilibrio', 'tambale', 'camina'], d: 'Camina bien.', d1: 'Camino bien.' },
    caidas: { k: ['caida', 'se cayo', 'caido', 'caer'], d: 'No, caídas no.' },
    noct: { k: ['de noche', 'nocturn', 'lo despierta', 'la despierta'], d: 'De noche no cambia.' },
    infec: { k: ['infeccion', 'infecciones'], d: 'No, infecciones no.' },
    antes: { k: ['antes de esto', 'antes de estos', 'meses previos', 'como estaba antes', 'antes estaba bien'], d: 'Antes estaba bien.' },
    previos: { k: ['episodios previos', 'le paso antes', 'alguna vez le paso', 'paso antes', 'primera vez', 'otras veces', 'otro episodio'], d: 'No, es la primera vez.' },
    fract: { k: ['fractur', 'quebr', 'se rompio'], d: 'No, fracturas no.' },
    temblor: { k: ['tembl'], d: 'No, temblores no.' },
    func: { k: ['actividades', 'se maneja', 'independ', 'hacer sus cosas', 'vida diaria', 'valerse'], d: 'Se maneja bien para todo.', d1: 'Me manejo bien para todo.' },
    trauma: { k: ['golpe', 'trauma', 'golpeo', 'accidente'], d: 'No, golpes no.' },
    oido: { k: ['oido', 'otitis', 'sinusitis', 'muela', 'diente'], d: 'No.' },
    liquidos: { k: ['liquido', 'toma agua', 'hidrat'], d: 'Toma agua normal.', d1: 'Tomo agua normal.' },
    genital: { k: ['testicul', 'genital', 'escroto', 'pene', 'flujo', 'uretr'], d: 'No, nada de eso.' },
    herida: { k: ['herida', 'ulcera', 'lastimadura', 'lastim'], d: 'No, heridas no.' },
    claud: { k: ['claudic', 'pantorrill'], d: 'No, al caminar no duele nada.', d1: 'No, al caminar no me duele nada.' },
    rigidez: { k: ['rigid', 'duras', 'tiesas', 'entumecid'], d: 'No, rigidez no.' },
    seco: { k: ['ojos secos', 'boca seca', 'sequedad'], d: 'No.' },
    pelo: { k: ['pelo', 'cabello', 'alopecia'], d: 'No, el pelo bien.' },
    raynaud: { k: ['dedos blancos', 'cambian de color', 'raynaud'], d: 'No.' },
    talla: { k: ['talla', 'altura', 'estatura', 'achic'], d: 'No se midió.', d1: 'No me medí.' },
  };
  // 'dolor' es débil: si hay otra categoría, se descarta. Las temporales ceden ante un síntoma concreto.
  const TEMPORALES = new Set(['ini', 'evo', 'mod', 'irr', 'int', 'car']);
  const SOCIALES = new Set(['saludo', 'despedida', 'otros']);
  // Si aparece la clave, se descartan las otras (p. ej. «¿es alérgico a algún medicamento?» → solo alergias).
  const SUPRIME = { alergias: ['med'], ictericia: ['vision'], fam: ['app', 'med', 'vivienda'], animales: ['vivienda', 'contactos'], sangreheces: ['heces', 'sangrado'],
    preoc: ['app'], vacunas: ['app'], transf: ['sangrado'], cirugias: ['app'], intern: ['app'], embarazo: ['fam'], tabaco: ['app'], alcohol: ['app'] };
  const FALLBACK = ['No, eso no lo noté.', 'No, nada de eso.', 'No, eso no me pasó.'];
  const ABIERTA = /^ (como|que|cual|cuales|donde|cuando|cuanto|cuanta|cuantos|cuantas|por que|quien) /;

  const compiled = {};
  for (const [cat, v] of Object.entries(CATS)) compiled[cat] = v.k.map(k => norm(k).trim());

  function matchSpans(q, kws, tag, out) {
    for (const kw of kws) {
      let i = q.indexOf(' ' + kw);
      while (i !== -1) { out.push({ s: i + 1, e: i + 1 + kw.length, tag }); i = q.indexOf(' ' + kw, i + 1); }
    }
  }

  function nombreDe(caso) { const p = (caso.tarjeta.pac || '').split(',')[0].trim(); return p; }
  function edadDe(caso) { const m = (caso.tarjeta.pac || '').match(/(\d+)\s*años/); return m ? m[1] + ' años.' : null; }
  function motivoDe(caso) { const g = (caso.guion[0] || ''); const m = g.match(/«([^»]+)»/); return m ? m[1] : caso.tarjeta.mot; }

  function responder(caso, P, pregunta, turno) {
    const q = norm(pregunta);
    if (q.trim().length < 2) return null;
    const spans = [];
    (P.x || []).forEach((it, i) => matchSpans(q, it[0].map(k => norm(k).trim()), 'x' + i, spans));
    for (const cat in compiled) matchSpans(q, compiled[cat], cat, spans);
    // Quitar coincidencias cubiertas por otra más larga (o igual, si la otra es propia del caso).
    const keep = spans.filter(a => !spans.some(b => b !== a && b.s <= a.s && b.e >= a.e &&
      ((b.e - b.s) > (a.e - a.s) || (b.tag[0] === 'x' && a.tag[0] !== 'x' && (b.e - b.s) === (a.e - a.s)))));
    const score = {};
    for (const m of keep) score[m.tag] = (score[m.tag] || 0) + (m.e - m.s) + (m.tag[0] === 'x' ? 4 : 0);
    let tags = Object.keys(score);
    const texto = t => {
      if (t[0] === 'x') return P.x[+t.slice(1)][1];
      if (P[t]) return P[t];
      if (t === 'saludo') return (P.voz || '') + (/buenas tardes/.test(q) ? 'Buenas tardes.' : /buenas noches/.test(q) ? 'Buenas noches.' : /buen(os)? dia/.test(q) ? 'Buenos días.' : 'Hola, buen día.');
      if (t === 'nombre') return nombreDe(caso) + '.';
      if (t === 'edad') return edadDe(caso);
      if (t === 'mot') return P.mot || motivoDe(caso);
      const d = CATS[t] && (P.voz ? CATS[t].d : (CATS[t].d1 || CATS[t].d));
      return d ? (P.voz || '') + d : null;
    };
    tags = tags.filter(t => texto(t));
    if (tags.length > 1) tags = tags.filter(t => t !== 'dolor' && t !== 'noct');
    for (const [a, quita] of Object.entries(SUPRIME)) if (tags.includes(a)) tags = tags.filter(t => !quita.includes(t));
    if (tags.some(t => t !== 'mot' && !SOCIALES.has(t))) tags = tags.filter(t => t !== 'mot');
    if (tags.some(t => !TEMPORALES.has(t) && !SOCIALES.has(t)) && tags.some(t => TEMPORALES.has(t))) {
      const sint = tags.filter(t => !TEMPORALES.has(t) && !SOCIALES.has(t) && t !== 'mot');
      if (sint.length) tags = tags.filter(t => !TEMPORALES.has(t));
    }
    if (tags.length > 1 && tags.some(t => !SOCIALES.has(t))) tags = tags.filter(t => !SOCIALES.has(t) || t === 'saludo');
    const hayX = tags.some(t => t[0] === 'x');
    tags.sort((a, b) => (b === 'saludo') - (a === 'saludo') || score[b] - score[a]);
    if (hayX) { const top = Math.max(...tags.filter(t => t[0] === 'x').map(t => score[t])); tags = tags.filter(t => t[0] === 'x' || score[t] > top || P[t]); }
    const out = [];
    for (const t of tags) { const r = texto(t); if (r && !out.includes(r)) out.push(r); if (out.length >= 2) break; }
    if (!out.length) {
      if (ABIERTA.test(q)) return (P.voz || '') + 'No sabría qué decirle sobre eso.';
      return (P.voz || '') + FALLBACK[(turno || 0) % FALLBACK.length];
    }
    return out.join(' ');
  }

  const api = { responder, norm, CATS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Motor = api;
})(typeof window !== 'undefined' ? window : globalThis);
