#!/usr/bin/env node
// Valida el esquema de todas las fichas y la integridad referencial fármaco <-> patógeno.
// Uso: node scripts/validar-fichas.js
// Salida: lista de ERRORES (rompen el build) y AVISOS (calidad). Código de salida 1 si hay errores.

const { AREAS, GRUPOS, cargarTodo } = require('./lib-fichas');

const errores = [];
const avisos = [];
const err = (ficha, msg) => errores.push(`[${ficha._archivo}] ${ficha.id || ficha.nombre || '¿?'}: ${msg}`);
const avi = (ficha, msg) => avisos.push(`[${ficha._archivo}] ${ficha.id || ficha.nombre || '¿?'}: ${msg}`);

const noVacio = v => typeof v === 'string' && v.trim().length > 0;
const arrNoVacio = v => Array.isArray(v) && v.length > 0 && v.every(noVacio);

// Una dosis clínicamente utilizable debe llevar una cantidad con unidad.
// La unidad puede venir abreviada o escrita con todas sus letras: el fentanilo y los
// vasoactivos se pautan en "microgramos", no en "mcg". El validador debe reconocer la
// unidad que el clinico escribe de verdad, no imponer una abreviatura (ver hallazgo #25).
const TIENE_UNIDAD = /\d\s*(microgramos?|miligramos?|mg|g|mcg|µg|ug|UI|U|mL|ml|L|mEq|mmol|%|gotas?|comprimidos?|caps?|pulsaci[oó]n(es)?|inhalaci[oó]n(es)?|puff|parches?|ap[oó]sitos?|sobres?|viales?|ampollas?|aplicaci[oó]n(es)?|cm|mm)/i;
// 'bucal' (mucosa yugal) e 'intestinal' se añadieron al incorporar el midazolam bucal
// pediátrico y el gel intestinal de levodopa: el validador debe seguir a las formas de
// administración reales de cada área nueva, no al revés (ver hallazgo #12).
const DOSIS_NO_PONDERAL = /dosis\s+FIJA|franja\s+de\s+edad|por\s+EDAD|por\s+SUPERFICIE|no\s+ponderal/i;

const VIAS = ['VO', 'IV', 'IM', 'SC', 'SL', 'IN', 'inhalada', 'nebulizada', 'tópica', 'oftálmica', 'ótica', 'rectal', 'vaginal', 'intratecal', 'intraarticular', 'transdérmica', 'epidural', 'intraósea', 'intravesical', 'intravítrea', 'bucal', 'intestinal'];

function validarFarmaco(f, { esPediatria }) {
  for (const campo of ['id', 'nombre', 'area', 'clase', 'mecanismo', 'fuente']) {
    if (!noVacio(f[campo])) err(f, `campo obligatorio ausente o vacío: ${campo}`);
  }
  if (!AREAS[f.area]) err(f, `área desconocida: ${f.area}`);
  if (![1, 2, 3].includes(f.nivel)) err(f, `nivel debe ser 1, 2 o 3 (recibido: ${JSON.stringify(f.nivel)})`);

  const prefijoEsperado = esPediatria ? `PED-${f.area}-` : `${f.area}-`;
  if (f.id && !f.id.startsWith(prefijoEsperado)) err(f, `el id debería empezar por "${prefijoEsperado}"`);

  // 'espectro' es obligatorio como campo: string en antiinfecciosos, null en el resto.
  if (!('espectro' in f)) err(f, 'falta el campo "espectro" (usar null si no es antiinfeccioso)');
  if (f.area === 'INF' && !noVacio(f.espectro)) err(f, 'un antiinfeccioso debe declarar su espectro');

  // Indicaciones
  if (!Array.isArray(f.indicaciones) || f.indicaciones.length === 0) {
    err(f, 'debe tener al menos una indicación');
  } else {
    f.indicaciones.forEach((ind, i) => {
      for (const c of ['patologia', 'dosis', 'posologia', 'via']) {
        if (!noVacio(ind[c])) err(f, `indicaciones[${i}]: falta ${c}`);
      }
      // Hay fármacos cuya dosis NO es una cantidad fija sino la que haga falta para
      // alcanzar un objetivo medible (INR del acenocumarol, factor de sensibilidad de
      // la insulina, protocolo del circuito extracorpóreo). En esos casos la ficha debe
      // declarar explícitamente ese objetivo en "dosis_objetivo": así la excepción es
      // deliberada y auditable, y no una dosis que se quedó sin escribir.
      if (noVacio(ind.dosis) && !TIENE_UNIDAD.test(ind.dosis) && !noVacio(ind.dosis_objetivo)) {
        avi(f, `indicaciones[${i}] ("${ind.patologia}"): la dosis no incluye cantidad con unidad ni declara "dosis_objetivo" → "${ind.dosis}"`);
      }
      if (noVacio(ind.via) && !VIAS.some(v => ind.via.toLowerCase().includes(v.toLowerCase()))) {
        avi(f, `indicaciones[${i}]: vía no reconocida → "${ind.via}"`);
      }
    });
  }

  // Esquema de tratamiento
  const e = f.esquema;
  if (!e || typeof e !== 'object') {
    err(f, 'falta el objeto "esquema"');
  } else {
    for (const c of ['inicio', 'duracion', 'fin', 'via']) {
      if (!noVacio(e[c])) err(f, `esquema: falta ${c}`);
    }
  }

  // Farmacocinética
  const fc = f.farmacocinetica;
  if (!fc || typeof fc !== 'object') {
    err(f, 'falta el objeto "farmacocinetica"');
  } else {
    for (const c of ['metabolismo', 'eliminacion', 'vida_media', 'ajuste_renal', 'ajuste_hepatico']) {
      if (!noVacio(fc[c])) err(f, `farmacocinetica: falta ${c} (usar "No precisa ajuste" si aplica)`);
    }
    if (!Array.isArray(fc.interacciones)) {
      err(f, 'farmacocinetica.interacciones debe ser un array (vacío si no hay relevantes)');
    } else {
      fc.interacciones.forEach((it, i) => {
        for (const c of ['con', 'efecto', 'manejo']) {
          if (!noVacio(it[c])) err(f, `interacciones[${i}]: falta ${c}`);
        }
        if (!['alta', 'media', 'baja'].includes(it.gravedad)) {
          err(f, `interacciones[${i}]: gravedad debe ser alta|media|baja`);
        }
      });
    }
  }

  // Efectos adversos: la separación frecuentes/graves es el punto de la ficha
  const ea = f.efectos_adversos;
  if (!ea || typeof ea !== 'object') err(f, 'falta el objeto "efectos_adversos"');
  else {
    if (!arrNoVacio(ea.frecuentes)) err(f, 'efectos_adversos.frecuentes vacío');
    if (!Array.isArray(ea.graves)) err(f, 'efectos_adversos.graves debe ser un array');
    else if (ea.graves.length === 0) avi(f, 'no declara ningún efecto adverso grave — revisar si es real');
  }

  if (!arrNoVacio(f.contraindicaciones)) err(f, 'contraindicaciones vacío (usar ["Hipersensibilidad al fármaco"] como mínimo)');
  if (!arrNoVacio(f.perlas)) err(f, 'perlas vacío — toda ficha debe aportar al menos una característica singular');

  if (esPediatria) {
    for (const c of ['dosis_pediatrica_base', 'dosis_maxima', 'edad_minima', 'peculiaridad_pediatrica']) {
      if (!noVacio(f[c])) err(f, `ficha pediátrica: falta ${c}`);
    }
    // Hay farmacos pediatricos que NO se dosifican por peso sino en dosis FIJA (la vitamina D
    // profilactica) o por FRANJA DE EDAD (montelukast, inhalados). Obligar a escribir mg/kg ahi
    // seria falsear el dato. La excepcion se admite solo si la ficha lo DECLARA expresamente,
    // de modo que sea deliberada y auditable, y no una dosis que se quedo sin poner (hallazgo #29).
    if (noVacio(f.dosis_pediatrica_base) && !/kg/i.test(f.dosis_pediatrica_base) && !DOSIS_NO_PONDERAL.test(f.dosis_pediatrica_base)) {
      avi(f, `dosis_pediatrica_base no está expresada por kg → "${f.dosis_pediatrica_base}"`);
    }
  }

  if (f.micro_relacionado && !Array.isArray(f.micro_relacionado)) err(f, 'micro_relacionado debe ser un array');

  // vs_clase: lo que distingue a este fármaco de los demás de su clase. Opcional en sí,
  // pero se exige (como aviso) cuando la clase tiene más de un miembro: ahí es donde el
  // lector necesita saber qué es propio de cada uno (ver hallazgo #30).
  if ('vs_clase' in f && !arrNoVacio(f.vs_clase)) err(f, 'vs_clase debe ser un array de textos no vacío');
  revisarMarcado(f);
}

// El resaltado **...** debe ir siempre por pares: uno impar deja el resto del texto en negrita.
function revisarMarcado(ficha) {
  const recorrer = (v, ruta) => {
    if (typeof v === 'string') {
      if ((v.match(/\*\*/g) || []).length % 2) err(ficha, `resaltado ** desemparejado en ${ruta}`);
    } else if (Array.isArray(v)) v.forEach((x, i) => recorrer(x, `${ruta}[${i}]`));
    else if (v && typeof v === 'object') for (const k of Object.keys(v)) if (k !== '_archivo') recorrer(v[k], ruta ? `${ruta}.${k}` : k);
  };
  recorrer(ficha, '');
}

// Ficha de patología: el tratamiento de un cuadro clínico, con cada fármaco en una fila
// con dosis, vía, intervalo y duración, y enlazado (ref) a su ficha completa.
function validarPatologia(p, idsFarmacoTodos) {
  for (const campo of ['id', 'nombre', 'area', 'resumen', 'fuente']) {
    if (!noVacio(p[campo])) err(p, `campo obligatorio ausente o vacío: ${campo}`);
  }
  if (!AREAS[p.area]) err(p, `área desconocida: ${p.area}`);
  if (p.id && !p.id.startsWith('PAT-')) err(p, 'el id de una patología debe empezar por "PAT-"');
  if (!Array.isArray(p.escenarios) || !p.escenarios.length) { err(p, 'debe tener al menos un escenario de tratamiento'); return; }
  p.escenarios.forEach((e, i) => {
    if (!noVacio(e.titulo)) err(p, `escenarios[${i}]: falta titulo`);
    if (!Array.isArray(e.farmacos) || !e.farmacos.length) { err(p, `escenarios[${i}] ("${e.titulo}"): sin fármacos`); return; }
    e.farmacos.forEach((x, j) => {
      const donde = `escenarios[${i}].farmacos[${j}] ("${x.nombre || '¿?'}")`;
      for (const c of ['nombre', 'dosis', 'via', 'intervalo', 'duracion']) {
        if (!noVacio(x[c])) err(p, `${donde}: falta ${c}`);
      }
      if (noVacio(x.dosis) && !TIENE_UNIDAD.test(x.dosis) && !noVacio(x.dosis_objetivo)) {
        avi(p, `${donde}: la dosis no incluye cantidad con unidad → "${x.dosis}"`);
      }
      if (noVacio(x.via) && !VIAS.some(v => x.via.toLowerCase().includes(v.toLowerCase()))) {
        avi(p, `${donde}: vía no reconocida → "${x.via}"`);
      }
      if (x.ref) {
        if (!idsFarmacoTodos.has(x.ref)) err(p, `${donde}: ref apunta a un fármaco inexistente "${x.ref}"`);
        // Enlazar a la ficha de la otra población es a veces lo correcto (la SRO solo tiene ficha
        // pediátrica); se admite si la fila lo declara con "otra_poblacion": true.
        else if (esPoblacionPediatrica(e) !== x.ref.startsWith('PED-') && !x.otra_poblacion) {
          avi(p, `${donde}: escenario ${esPoblacionPediatrica(e) ? 'pediátrico' : 'de adulto'} enlazado a una ficha ${x.ref.startsWith('PED-') ? 'pediátrica' : 'de adulto'}`);
        }
      } else if (!x.sin_ficha) {
        // Un fármaco sin ficha es deuda de contenido; si es deliberado se declara con sin_ficha: true.
        avi(p, `${donde}: sin "ref" a una ficha (declarar "sin_ficha": true si es deliberado)`);
      }
    });
  });
  revisarMarcado(p);
}
const esPoblacionPediatrica = e => /pedi|niñ|lactante|neonat/i.test(e.poblacion || '');

function validarPatogeno(p) {
  for (const campo of ['id', 'nombre', 'grupo', 'clasificacion', 'morfologia_tincion', 'fuente']) {
    if (!noVacio(p[campo])) err(p, `campo obligatorio ausente o vacío: ${campo}`);
  }
  if (!GRUPOS[p.grupo]) err(p, `grupo desconocido: ${p.grupo}`);
  if (p.id && !p.id.startsWith(p.grupo + '-')) err(p, `el id debería empezar por "${p.grupo}-"`);
  if (![1, 2, 3].includes(p.nivel)) err(p, `nivel debe ser 1, 2 o 3 (recibido: ${JSON.stringify(p.nivel)})`);

  if (!arrNoVacio(p.mecanismo_patogenia)) err(p, 'mecanismo_patogenia vacío');
  if (!arrNoVacio(p.caracteristicas_clave)) err(p, 'caracteristicas_clave vacío');

  if (!Array.isArray(p.patologias) || p.patologias.length === 0) {
    err(p, 'debe declarar al menos una patología');
  } else {
    p.patologias.forEach((pt, i) => {
      for (const c of ['cuadro', 'clinica']) if (!noVacio(pt[c])) err(p, `patologias[${i}]: falta ${c}`);
      if (!noVacio(pt.lesiones)) avi(p, `patologias[${i}] ("${pt.cuadro}"): sin descripción de lesiones/cuadro`);
    });
  }

  const d = p.diagnostico;
  if (!d || typeof d !== 'object') err(p, 'falta el objeto "diagnostico"');
  else {
    if (!noVacio(d.muestra)) err(p, 'diagnostico: falta muestra');
    if (!arrNoVacio(d.pruebas)) err(p, 'diagnostico: pruebas vacío');
  }

  const t = p.tratamiento;
  if (!t || typeof t !== 'object') err(p, 'falta el objeto "tratamiento"');
  else {
    for (const c of ['eleccion', 'duracion']) if (!noVacio(t[c])) err(p, `tratamiento: falta ${c}`);
    if (!noVacio(t.resistencias)) avi(p, 'tratamiento: sin nota de resistencias');
  }

  if (!Array.isArray(p.farmacos_relacionados)) err(p, 'farmacos_relacionados debe ser un array');
}

// ---------------------------------------------------------------- ejecución
const { farmacos, pediatria, microbiologia, patologias } = cargarTodo();

// ids duplicados
const vistos = new Map();
for (const f of [...farmacos, ...pediatria, ...microbiologia, ...patologias]) {
  if (!f.id) continue;
  if (vistos.has(f.id)) errores.push(`id duplicado "${f.id}" en ${vistos.get(f.id)} y ${f._archivo}`);
  else vistos.set(f.id, f._archivo);
}

farmacos.forEach(f => validarFarmaco(f, { esPediatria: false }));
pediatria.forEach(f => validarFarmaco(f, { esPediatria: true }));
microbiologia.forEach(validarPatogeno);

// Integridad referencial y simetría de la correlación
const idsFarmaco = new Set([...farmacos, ...pediatria].map(f => f.id));
patologias.forEach(p => validarPatologia(p, idsFarmaco));

// Cada clase de adulto debe tener al menos 3 fármacos INDIVIDUALES (las fichas
// "vision_clase", que resumen una familia entera, no cuentan). Se admite una clase
// con menos solo si sus fichas lo justifican con "clase_unica" (fármaco sin hermanos
// de uso clínico real, como el litio): la excepción queda escrita y es auditable.
{
  const porClase = new Map();
  for (const f of farmacos) {
    if (!porClase.has(f.clase)) porClase.set(f.clase, []);
    porClase.get(f.clase).push(f);
  }
  for (const [clase, miembros] of porClase) {
    const individuales = miembros.filter(f => !f.vision_clase);
    if (individuales.length >= 3 || individuales.length === 0) continue;
    if (miembros.every(f => noVacio(f.clase_unica) || f.vision_clase) && individuales.some(f => noVacio(f.clase_unica))) continue;
    avisos.push(`[clase] «${clase}»: ${individuales.length} fármaco(s) individual(es) — mínimo 3 (o justificar con "clase_unica") → ${miembros.map(f => f.id).join(', ')}`);
  }
}

// Clases con varios miembros: cada uno debe decir qué lo distingue de los demás.
for (const grupo of [farmacos, pediatria]) {
  const porClase = new Map();
  for (const f of grupo) porClase.set(f.clase, (porClase.get(f.clase) || 0) + 1);
  for (const f of grupo) {
    if (porClase.get(f.clase) > 1 && !arrNoVacio(f.vs_clase)) {
      avi(f, `su clase («${f.clase}») tiene ${porClase.get(f.clase)} fármacos y la ficha no declara vs_clase`);
    }
  }
}
const idsMicro = new Set(microbiologia.map(p => p.id));

for (const f of [...farmacos, ...pediatria]) {
  for (const ref of f.micro_relacionado || []) {
    if (!idsMicro.has(ref)) err(f, `micro_relacionado apunta a un patógeno inexistente: "${ref}"`);
    else {
      const p = microbiologia.find(x => x.id === ref);
      if (!(p.farmacos_relacionados || []).includes(f.id)) {
        avi(f, `correlación asimétrica: cita a "${ref}" pero ese patógeno no lo cita de vuelta`);
      }
    }
  }
}
for (const p of microbiologia) {
  for (const ref of p.farmacos_relacionados || []) {
    if (!idsFarmaco.has(ref)) err(p, `farmacos_relacionados apunta a un fármaco inexistente: "${ref}"`);
    else {
      const f = [...farmacos, ...pediatria].find(x => x.id === ref);
      if (!(f.micro_relacionado || []).includes(p.id)) {
        avi(p, `correlación asimétrica: cita a "${ref}" pero ese fármaco no lo cita de vuelta`);
      }
    }
  }
}

// Patógeno de nivel 1-2 sin ningún antimicrobiano enlazado: hueco de cobertura.
// Se exceptúan los que NO tienen tratamiento etiológico: muchos virus se tratan solo
// con soporte, y ahí la ausencia de fármaco correlacionado es el dato correcto, no una
// laguna. Se reconoce por cómo empieza el tratamiento de elección de la ficha.
const SIN_TRATAMIENTO_ETIOLOGICO = /^(sintom[áa]tico|soporte|rehidrataci[óo]n)/i;
for (const p of microbiologia) {
  if (p.nivel <= 2 && (p.farmacos_relacionados || []).length === 0) {
    const eleccion = (p.tratamiento && p.tratamiento.eleccion) || '';
    if (!SIN_TRATAMIENTO_ETIOLOGICO.test(eleccion.trim())) {
      avi(p, 'patógeno prioritario sin ningún fármaco correlacionado');
    }
  }
}

console.log('=== VALIDACIÓN DE FICHAS ===');
console.log(`Fármacos (adulto): ${farmacos.length} · Pediatría: ${pediatria.length} · Patógenos: ${microbiologia.length} · Patologías: ${patologias.length}`);
console.log(`Errores: ${errores.length} · Avisos: ${avisos.length}\n`);

if (errores.length) {
  console.log('--- ERRORES ---');
  errores.forEach(e => console.log('  ✗ ' + e));
  console.log('');
}
if (avisos.length) {
  console.log('--- AVISOS ---');
  avisos.slice(0, 400).forEach(a => console.log('  ! ' + a));
  if (avisos.length > 400) console.log(`  … y ${avisos.length - 400} avisos más.`);
}
if (!errores.length && !avisos.length) console.log('Todo correcto.');

process.exit(errores.length ? 1 : 0);
