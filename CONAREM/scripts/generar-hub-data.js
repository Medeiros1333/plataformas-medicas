// Genera los datos del CONAREM Hub:
//   hub/data.js          -> window.CONAREM_DATA   (se publica: exámenes oficiales, CONAFLIX, temario, bibliografía)
//   hub/data_privado.js  -> window.CONAREM_PRIVADO (uso personal, NO se publica: banco SimuResi + flashcards)
//
// Requiere antes: node scripts/parse-transcripciones.js  y  node scripts/importar-externos.js
// Uso: node scripts/generar-hub-data.js

const fs = require('fs');
const path = require('path');
const { firma, jaccard, letraEquivalente } = require('./lib-similitud');

const RAIZ = path.join(__dirname, '..');
const leer = (...p) => JSON.parse(fs.readFileSync(path.join(RAIZ, ...p), 'utf8'));
const existe = (...p) => fs.existsSync(path.join(RAIZ, ...p));

const AREAS = {
  CIR: { nombre: 'Cirugía General', corto: 'Cirugía' },
  GO: { nombre: 'Ginecología y Obstetricia', corto: 'Gineco-Obst.' },
  SP: { nombre: 'Salud Pública', corto: 'Salud Pública' },
  MI: { nombre: 'Medicina Interna', corto: 'Med. Interna' },
  PED: { nombre: 'Pediatría', corto: 'Pediatría' },
  CARDIO: { nombre: 'Cardiología', corto: 'Cardiología', sub: true },
  TRAUMA: { nombre: 'Traumatología', corto: 'Traumatología', sub: true },
  EM: { nombre: 'Emergentología', corto: 'Emergentología', sub: true },
  MF: { nombre: 'Medicina Familiar', corto: 'Med. Familiar', sub: true }
};

// Distribución del examen troncal según el formato más reciente (CONAREM 2026):
// Bloque I = Cirugía 30 + Medicina Interna 30 + Salud Pública 20; Bloque II = Pediatría 30 + Gineco-Obstetricia 30.
// (En 2022 y 2024 el Bloque I era CIR + GO + SP y el Bloque II MI + PED.)
const BLOQUES = {
  I: { nombre: 'Bloque I', partes: [['CIR', 30], ['MI', 30], ['SP', 20]] },
  II: { nombre: 'Bloque II', partes: [['PED', 30], ['GO', 30]] }
};

const PDF_OFICIAL = {
  '2022-TRO-I': 'https://www.ins.gov.py/wp-content/uploads/2022/03/CONAREM_2022_BLOQUE_I_FILA_1_opt.pdf',
  '2022-TRO-II': 'https://www.ins.gov.py/wp-content/uploads/2022/03/CONAREM_2022_BLOQUE_II_FILA_1_opt.pdf',
  '2024-TRO-I': 'https://www.ins.gov.py/wp-content/uploads/2024/03/BLOQUE-I-Fila-1_compressed.pdf',
  '2024-TRO-II': 'https://www.ins.gov.py/wp-content/uploads/2024/03/BLOQUE-II-Fila-1_compressed.pdf',
  '2026-TRO-I': 'https://ins.gov.py/wp-content/uploads/2026/03/bloque-1-fila-1.pdf',
  '2026-TRO-II': 'https://ins.gov.py/wp-content/uploads/2026/03/bloque-2-fila-1.pdf',
  '2024-SUB-CIR': 'https://www.ins.gov.py/wp-content/uploads/2024/03/SUB2024_MATRIZ_CX_opt.pdf',
  '2024-SUB-EM': 'https://www.ins.gov.py/wp-content/uploads/2024/03/SUB2024_MATRIZ_EM_opt.pdf',
  '2024-SUB-GO': 'https://www.ins.gov.py/wp-content/uploads/2024/03/SUB2024_MATRIZ_GO_opt.pdf',
  '2024-SUB-MF': 'https://www.ins.gov.py/wp-content/uploads/2024/03/SUB2024_MATRIZ_MF_opt.pdf',
  '2024-SUB-MI': 'https://www.ins.gov.py/wp-content/uploads/2024/03/SUB2024_MATRIZ_MI_opt.pdf',
  '2024-SUB-PED': 'https://www.ins.gov.py/wp-content/uploads/2024/03/SUB2024_MATRIZ_PED_opt.pdf',
  '2024-SUB-TRAUMA': 'https://www.ins.gov.py/wp-content/uploads/2024/03/SUB2024_MATRIZ_TR_opt.pdf',
  '2026-SUB-CARDIO': 'https://ins.gov.py/wp-content/uploads/2026/03/SUB2026_MATRIZ_CARDIO.pdf',
  '2026-SUB-CIR': 'https://ins.gov.py/wp-content/uploads/2026/03/SUB2026_MATRIZ_CIRUGIA.pdf',
  '2026-SUB-GO': 'https://ins.gov.py/wp-content/uploads/2026/03/SUB2026_MATRIZ_GINECO.pdf',
  '2026-SUB-MI': 'https://ins.gov.py/wp-content/uploads/2026/03/SUB2026_MATRIZ_M-INTERNA.pdf',
  '2026-SUB-PED': 'https://ins.gov.py/wp-content/uploads/2026/03/SUB2026_MATRIZ_PEDIATRIA.pdf',
  '2026-SUB-TRAUMA': 'https://ins.gov.py/wp-content/uploads/2026/03/SUB2026_MATRIZ_TRAUMATOLOGIA.pdf'
};

// ---------------------------------------------------------------------------
// Temario oficial (texto extraído con pdftotext -layout de los PDF de bibliografía del INS)
// ---------------------------------------------------------------------------
function lineasTemario(nombre) {
  const f = path.join(RAIZ, 'data', 'temario_txt', nombre + '.txt');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').replace(/\r/g, '').split('\n').map(l => l.trim())
    .filter(l => l && !/Avda\. Sant|Asunción, Paraguay|\(021\)/.test(l));
}
const limpiarTitulo = t => t.replace(/\s+/g, ' ').replace(/[.:;,]\s*$/, '').trim();

function temarioCapitulos(nombre) {           // CIR y GO: "Capítulo N: título"
  const out = [];
  let seccion = '';
  for (const l of lineasTemario(nombre)) {
    let m;
    if ((m = l.match(/^\d+\.\s*(SECCI[ÓO]N\s*\d+:\s*)?(.+)$/)) && !/Cap[ií]tulo/.test(l)) {
      seccion = limpiarTitulo(m[2]);
      continue;
    }
    if ((m = l.match(/Cap[ií]tulo\s*(\d+)\s*:\s*(.+)$/))) {
      out.push({ grupo: seccion, titulo: `Cap. ${m[1]}: ${limpiarTitulo(m[2])}` });
    }
  }
  return out;
}

function temarioNumerado(nombre, { profundidad = 2, excluir = /^$/ } = {}) {   // MI, PED, SP: "N.N. título"
  const out = [];
  let grupo = '';
  for (const l of lineasTemario(nombre)) {
    const m = l.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
    if (!m) continue;
    const nivel = m[1].split('.').length;
    const texto = limpiarTitulo(m[2].split(/:\s/)[0].split(/\.\s/)[0]);
    if (nivel === 1) { grupo = limpiarTitulo(m[2].replace(/^Módulo\s*\d+:\s*/i, '')); continue; }
    if (nivel > profundidad || excluir.test(texto) || texto.length < 3) continue;
    out.push({ grupo, titulo: texto });
  }
  return out;
}

const TEMARIO = {
  CIR: temarioCapitulos('CIRUGIA-GENERAL_Bibliografia_Temario_TRONCAL'),
  GO: temarioCapitulos('GINECOBSTETRICIA_Bibliografia_Temario_TRONCAL'),
  MI: temarioNumerado('MEDICINA-INTERNA_Bibliografia_Temario_TRONCAL'),
  PED: temarioNumerado('PEDIATRIA_Bibliografia_Temario_TRONCAL', { profundidad: 3 }),
  SP: temarioNumerado('SALUD-PUBLICA_Bibliografia_Temario_TRONCAL', { excluir: /^Referencias/i })
};

// ---------------------------------------------------------------------------
const oficiales = leer('data', 'preguntas_oficiales.json');
const conaflix = existe('data', 'conaflix_temas.json') ? leer('data', 'conaflix_temas.json') : [];

// Explicaciones propias (data/explicaciones/*.json: { id: { e: texto, r: referencia } })
const explicaciones = {};
if (existe('data', 'explicaciones')) {
  for (const f of fs.readdirSync(path.join(RAIZ, 'data', 'explicaciones')).filter(f => f.endsWith('.json'))) {
    Object.assign(explicaciones, leer('data', 'explicaciones', f));
  }
}
for (const p of oficiales) {
  const ex = explicaciones[p.id];
  if (ex) {
    p.explicacion = ex.e;
    if (ex.r) p.referencia = ex.r;
    if (ex.n) p.por_que_no = ex.n;
  }
}

// Preguntas que se repiten entre exámenes oficiales (alto rendimiento)
const firmasOf = oficiales.map(firma);
for (let i = 0; i < oficiales.length; i++) {
  for (let j = i + 1; j < oficiales.length; j++) {
    if (oficiales[i].examen === oficiales[j].examen) continue;
    if (jaccard(firmasOf[i], firmasOf[j]) >= 0.7) {
      (oficiales[i].repetida_en = oficiales[i].repetida_en || []).push(oficiales[j].examen);
      (oficiales[j].repetida_en = oficiales[j].repetida_en || []).push(oficiales[i].examen);
    }
  }
}

// Exámenes oficiales (para el modo "rendir el examen tal cual")
const examenes = [];
for (const p of oficiales) {
  const clave = `${p.anio}-${p.tipo}-${p.tipo === 'TRO' ? p.bloque : p.area}`;
  let ex = examenes.find(e => e.id === clave);
  if (!ex) {
    ex = { id: clave, titulo: p.examen.replace(/\s*\(Fila 1\)/, ''), anio: p.anio, tipo: p.tipo, bloque: p.bloque, pdf: PDF_OFICIAL[clave] || null, preguntas: [] };
    examenes.push(ex);
  }
  ex.preguntas.push(p.id);
  p.examen_id = clave;
}
examenes.sort((a, b) => b.anio - a.anio || a.tipo.localeCompare(b.tipo) || a.id.localeCompare(b.id));

const preguntasConaflix = conaflix.flatMap(t => t.preguntas.map(q => ({ ...q, tema_titulo: t.titulo })));
const temas = conaflix.map(({ preguntas, ...t }) => ({ ...t, preguntas: preguntas.map(q => q.id) }));

const publico = {
  generado: new Date().toISOString().slice(0, 10),
  areas: AREAS,
  bloques: BLOQUES,
  examenes,
  preguntas: [...oficiales, ...preguntasConaflix],
  temas,
  temario: TEMARIO,
  bibliografia: leer('data', 'bibliografia.json')
};

const HUB = path.join(RAIZ, 'hub');
fs.mkdirSync(HUB, { recursive: true });
const cabecera = '// Generado por scripts/generar-hub-data.js — no editar a mano.\n';
fs.writeFileSync(path.join(HUB, 'data.js'), cabecera + 'window.CONAREM_DATA = ' + JSON.stringify(publico) + ';\n');

// ---------------------------------------------------------------------------
// Banco privado (SimuResi): se quitan las preguntas que ya están como oficiales y se aprovechan sus
// explicaciones para esas oficiales (remapeando letras, que pueden cambiar entre bancos).
// ---------------------------------------------------------------------------
let resumenPrivado = 'sin banco privado';
if (existe('data', 'privado', 'simuresi_preguntas.json')) {
  const sr = leer('data', 'privado', 'simuresi_preguntas.json');
  const flash = existe('data', 'privado', 'simuresi_flashcards.json') ? leer('data', 'privado', 'simuresi_flashcards.json') : [];
  const firmasSr = sr.map(firma);
  const usadas = new Set();
  const explicacionesOficiales = {};
  let discrepancias = 0;
  oficiales.forEach((p, i) => {
    let mejor = -1, mejorS = 0;
    for (let k = 0; k < sr.length; k++) {
      if (p.tipo === 'TRO' && sr[k].area !== p.area) continue;
      const s = jaccard(firmasOf[i], firmasSr[k]);
      if (s > mejorS) { mejorS = s; mejor = k; }
    }
    if (mejorS < 0.6) return;
    const q = sr[mejor];
    usadas.add(q.id);
    const letraSr = letraEquivalente(p, q);
    if (letraSr && letraSr !== q.respuesta_correcta) { discrepancias++; return; } // gabarito distinto: no mezclar
    const porQueNo = {};
    for (const [letraSrMal, texto] of Object.entries(q.por_que_no || {})) {
      const letraOf = letraEquivalente(q, p, letraSrMal);
      if (letraOf && letraOf !== p.respuesta_correcta) porQueNo[letraOf] = texto;
    }
    explicacionesOficiales[p.id] = { explicacion: q.explicacion, por_que_no: porQueNo };
  });
  const extra = sr.filter(q => !usadas.has(q.id));
  // si una pregunta de una serie quedó sin su enunciado base, la serie se rompe: se quita la marca
  const ids = new Set(extra.map(q => q.id));
  for (const q of extra) if (q.serie && !ids.has(q.serie) && !extra.some(o => o !== q && o.serie === q.serie)) delete q.serie;
  const privado = { preguntas: extra, flashcards: flash, explicaciones_oficiales: explicacionesOficiales };
  fs.writeFileSync(path.join(HUB, 'data_privado.js'), cabecera + '// USO PERSONAL — no se publica (ver publicar_github.ps1).\nwindow.CONAREM_PRIVADO = ' + JSON.stringify(privado) + ';\n');
  resumenPrivado = `${extra.length} preguntas SimuResi extra, ${flash.length} flashcards, ${Object.keys(explicacionesOficiales).length} explicaciones para oficiales (${discrepancias} con gabarito distinto, ignoradas)`;
}

const conExpl = oficiales.filter(p => p.explicacion).length;
const rep = oficiales.filter(p => p.repetida_en).length;
console.log(`hub/data.js: ${oficiales.length} oficiales (${conExpl} con explicación propia, ${rep} repetidas entre años), ${preguntasConaflix.length} CONAFLIX, ${temas.length} temas, ${examenes.length} exámenes`);
console.log('Temario:', Object.entries(TEMARIO).map(([a, t]) => `${a} ${t.length}`).join(', '));
console.log('hub/data_privado.js:', resumenPrivado);
