// Convierte las transcripciones de los exámenes oficiales (data/transcripciones/*.txt) en
// data/preguntas_oficiales.json.
//
// Formato de cada .txt (escrito a mano a partir de los PDF del INS, con el gabarito circulado):
//   @examen / @anio / @tipo (TRO|SUB) / @bloque   -> cabecera
//   == AREA                                        -> área de las preguntas siguientes
//   # N                                            -> número original de la pregunta
//   enunciado (una o más líneas)
//   *A) opción correcta   /   B) opción            -> alternativas, * marca el gabarito oficial
//   !? X | nota                                    -> gabarito oficial dudoso: X = alternativa sugerida
//                                                     ("-" si solo es un matiz), nota explicativa
//
// Uso: node scripts/parse-transcripciones.js

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const DIR = path.join(RAIZ, 'data', 'transcripciones');

function parsearArchivo(nombre) {
  const lineas = fs.readFileSync(path.join(DIR, nombre), 'utf8').replace(/\r/g, '').split('\n');
  const meta = {};
  const preguntas = [];
  let area = null;
  let actual = null;

  const cerrar = () => {
    if (!actual) return;
    const letras = Object.keys(actual.alternativas);
    if (!actual.enunciado || letras.length < 2 || !actual.respuesta_correcta) {
      throw new Error(`${nombre} #${actual.numero}: pregunta incompleta (enunciado/alternativas/gabarito)`);
    }
    preguntas.push(actual);
    actual = null;
  };

  for (const cruda of lineas) {
    const l = cruda.trim();
    if (!l) continue;
    let m;
    if ((m = l.match(/^@(\w+)\s+(.+)$/))) { meta[m[1]] = m[2].trim(); continue; }
    if ((m = l.match(/^==\s*(\w+)/))) { cerrar(); area = m[1]; continue; }
    if ((m = l.match(/^#\s*(\d+)$/))) {
      cerrar();
      actual = { numero: +m[1], area, enunciado: '', alternativas: {}, respuesta_correcta: null };
      continue;
    }
    if (!actual) throw new Error(`${nombre}: texto fuera de una pregunta: "${l}"`);
    if ((m = l.match(/^!\?\s*([A-E-])\s*\|\s*(.+)$/))) {
      actual.revision_incierta = { alternativa_sugerida: m[1] === '-' ? null : m[1], nota: m[2] };
      continue;
    }
    if ((m = l.match(/^(\*?)([A-E])\)\s*(.+)$/))) {
      actual.alternativas[m[2]] = m[3];
      if (m[1]) {
        if (actual.respuesta_correcta) throw new Error(`${nombre} #${actual.numero}: dos gabaritos`);
        actual.respuesta_correcta = m[2];
      }
      continue;
    }
    if (Object.keys(actual.alternativas).length) {
      throw new Error(`${nombre} #${actual.numero}: línea tras las alternativas: "${l}"`);
    }
    actual.enunciado += (actual.enunciado ? ' ' : '') + l;
  }
  cerrar();

  for (const k of ['examen', 'anio', 'tipo', 'bloque']) {
    if (!meta[k]) throw new Error(`${nombre}: falta @${k}`);
  }
  return preguntas.map(p => {
    const idBloque = meta.tipo === 'TRO' ? meta.bloque : p.area;
    return {
      id: `${meta.anio}-${meta.tipo}-${idBloque}-${String(p.numero).padStart(2, '0')}`,
      fuente: 'oficial',
      examen: meta.examen,
      anio: +meta.anio,
      tipo: meta.tipo,
      bloque: meta.bloque,
      ...p
    };
  });
}

const archivos = fs.readdirSync(DIR).filter(f => f.endsWith('.txt')).sort();
const todas = [];
for (const f of archivos) {
  const ps = parsearArchivo(f);
  console.log(`${f.padEnd(22)} ${String(ps.length).padStart(3)} preguntas`);
  todas.push(...ps);
}
const ids = new Set();
for (const p of todas) {
  if (ids.has(p.id)) throw new Error('id repetido: ' + p.id);
  ids.add(p.id);
}
fs.writeFileSync(path.join(RAIZ, 'data', 'preguntas_oficiales.json'), JSON.stringify(todas, null, 1));
console.log(`Total: ${todas.length} preguntas oficiales -> data/preguntas_oficiales.json`);
