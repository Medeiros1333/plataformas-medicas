// Genera los datos del CONAREM Hub:
//   hub/data.js          -> window.CONAREM_DATA   (se publica: exámenes oficiales, CONAFLIX, temario, bibliografía)
//   hub/data_privado.js  -> window.CONAREM_PRIVADO (uso personal, NO se publica: banco SimuResi + flashcards)
//
// Requiere antes: node scripts/parse-transcripciones.js  y  node scripts/importar-externos.js
// Uso: node scripts/generar-hub-data.js

const fs = require('fs');
const path = require('path');
const { firma, jaccard, letraEquivalente } = require('./lib-similitud');
const { AREAS: TAXO, ORDEN_TRONCALES } = require('./taxonomia');
const { clasificar } = require('./lib-clasificar');

const RAIZ = path.join(__dirname, '..');
const leer = (...p) => JSON.parse(fs.readFileSync(path.join(RAIZ, ...p), 'utf8'));
const existe = (...p) => fs.existsSync(path.join(RAIZ, ...p));

// El Hub se organiza solo en las 5 troncales; las preguntas de subespecialidades se reparten entre ellas
// por contenido y conservan su origen (area_origen) para poder filtrarlas aparte.
const AREAS = {
  MI: { nombre: 'Medicina Interna', corto: 'Med. Interna', clinica: 'Clínica Médica' },
  PED: { nombre: 'Pediatría', corto: 'Pediatría' },
  CIR: { nombre: 'Cirugía General', corto: 'Cirugía', clinica: 'Clínica Quirúrgica' },
  GO: { nombre: 'Ginecología y Obstetricia', corto: 'Gineco-Obst.' },
  SP: { nombre: 'Salud Pública', corto: 'Salud Pública' }
};
const AREAS_ORIGEN = {
  CIR: 'Cirugía General', GO: 'Gineco-Obstetricia', MI: 'Medicina Interna', PED: 'Pediatría', SP: 'Salud Pública',
  CARDIO: 'Cardiología', TRAUMA: 'Traumatología', EM: 'Emergentología', MF: 'Medicina Familiar'
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
// Índice de los libros (data/privado/indice_libros.json, generado por indice-libros.js desde los PDF)
// y capítulos por tema (data/referencias_libros.json)
// ---------------------------------------------------------------------------
const INDICE = existe('data', 'privado', 'indice_libros.json') ? leer('data', 'privado', 'indice_libros.json') : {};
const REFS = existe('data', 'referencias_libros.json') ? leer('data', 'referencias_libros.json') : {};
const LIBRO_CORTO = {
  HARRISON20: 'Harrison 20ª ed.', SCHWARTZ11: 'Schwartz 11ª ed.', WILLIAMS_OBS26: 'Williams Obstetricia 26ª ed.',
  WILLIAMS_GIN4: 'Williams Gynecology 4ª ed.', NELSON22: 'Nelson 22ª ed.', JOHNS_HOPKINS6: 'Manual Johns Hopkins 6ª ed.'
};
function capitulo(libro, n) {
  const c = INDICE[libro] && INDICE[libro].capitulos.find(x => x.n === n);
  return c ? { n, titulo: c.titulo, pagina: c.pagina } : { n };
}
function refsTema(clave) {
  return (REFS[clave] || []).map(([libro, caps]) => ({ libro, caps: caps.map(n => capitulo(libro, n)) }));
}
// ítems del edital de CIR y GO que citan un capítulo ("Cap. 7: ...", "Ginecología cap. 37: ...")
const SUB_GINECO = new Set(['GINEBEN', 'ENDOREP', 'UROGINE', 'ONCOGIN']);
function refItem(area, sub, texto) {
  const m = texto.match(/^(Ginecología )?[Cc]ap\. (\d+)/);
  if (!m || !['CIR', 'GO'].includes(area)) return null;
  const libro = area === 'CIR' ? 'SCHWARTZ11' : (m[1] || SUB_GINECO.has(sub) ? 'WILLIAMS_GIN4' : 'WILLIAMS_OBS26');
  return { libro, cap: capitulo(libro, +m[2]) };
}

// ---------------------------------------------------------------------------
const oficiales = leer('data', 'preguntas_oficiales.json');
const conaflix = existe('data', 'conaflix_temas.json') ? leer('data', 'conaflix_temas.json') : [];
const simuresi = existe('data', 'privado', 'simuresi_preguntas.json') ? leer('data', 'privado', 'simuresi_preguntas.json') : [];

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

// ---------------------------------------------------------------------------
// Clasificación troncal -> contenido -> tema (todas las preguntas juntas: los vecinos ayudan a las dudosas)
// ---------------------------------------------------------------------------
const preguntasConaflixRaw = conaflix.flatMap(t => t.preguntas.map(q => ({ ...q, tema_titulo: t.titulo })));
const manual = existe('data', 'clasificacion_manual.json') ? leer('data', 'clasificacion_manual.json') : {};
const clasif = clasificar([...oficiales, ...preguntasConaflixRaw, ...simuresi], manual);
function aplicarClasif(q) {
  const c = clasif.get(q.id);
  if (!c) return q;
  if (q.area !== c.area) q.area_origen = q.area;
  else if (q.tipo === 'SUB') q.area_origen = q.area;
  q.area = c.area; q.sub = c.sub;
  if (c.tema) q.tema = c.tema;
  return q;
}
oficiales.forEach(aplicarClasif);
preguntasConaflixRaw.forEach(aplicarClasif);
simuresi.forEach(aplicarClasif);

// Taxonomía pública con la frecuencia de cada contenido/tema en los exámenes oficiales
const ANIOS = [...new Set(oficiales.map(p => p.anio))].sort();
const taxonomia = {};
for (const area of ORDEN_TRONCALES) {
  const T = TAXO[area];
  const delArea = oficiales.filter(p => p.area === area);
  const tro = delArea.filter(p => p.tipo === 'TRO');
  taxonomia[area] = {
    nombre: T.nombre, libro: T.libro, total_tro: tro.length, total_sub: delArea.length - tro.length,
    subareas: T.subareas.map(s => {
      const qs = tro.filter(p => p.sub === s.id);
      const porAnio = {};
      ANIOS.forEach(a => { const n = qs.filter(p => p.anio === a).length; if (n) porAnio[a] = n; });
      return {
        id: s.id, nombre: s.nombre, ref: s.ref,
        tro: qs.length, sub: delArea.filter(p => p.tipo === 'SUB' && p.sub === s.id).length, por_anio: porAnio,
        edital: s.edital.map(t => { const r = refItem(area, s.id, t); return r ? { t, ref: r } : { t }; }),
        temas: s.temas.map(t => ({
          id: t.id, nombre: t.nombre,
          tro: qs.filter(p => p.tema === t.id).length,
          sub: delArea.filter(p => p.tipo === 'SUB' && p.sub === s.id && p.tema === t.id).length,
          libros: refsTema(`${area}-${s.id}-${t.id}`)
        }))
      };
    })
  };
}

// Exámenes oficiales (para el modo "rendir el examen tal cual")
const examenes = [];
for (const p of oficiales) {
  const clave = `${p.anio}-${p.tipo}-${p.tipo === 'TRO' ? p.bloque : (p.area_origen || p.area)}`;
  let ex = examenes.find(e => e.id === clave);
  if (!ex) {
    ex = { id: clave, titulo: p.examen.replace(/\s*\(Fila 1\)/, ''), anio: p.anio, tipo: p.tipo, bloque: p.bloque, pdf: PDF_OFICIAL[clave] || null, preguntas: [] };
    examenes.push(ex);
  }
  ex.preguntas.push(p.id);
  p.examen_id = clave;
}
examenes.sort((a, b) => b.anio - a.anio || a.tipo.localeCompare(b.tipo) || a.id.localeCompare(b.id));

const preguntasConaflix = preguntasConaflixRaw;
const temas = conaflix.map(({ preguntas, ...t }) => ({ ...t, preguntas: preguntas.map(q => q.id) }));

const publico = {
  generado: new Date().toISOString().slice(0, 10),
  areas: AREAS,
  areas_origen: AREAS_ORIGEN,
  orden: ORDEN_TRONCALES,
  bloques: BLOQUES,
  examenes,
  preguntas: [...oficiales, ...preguntasConaflix],
  temas,
  taxonomia,
  libros: Object.fromEntries(Object.entries(LIBRO_CORTO).map(([id, corto]) => [id, { corto, titulo: INDICE[id] ? INDICE[id].titulo : corto }])),
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
if (simuresi.length) {
  const sr = simuresi;
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
  // enlaces a los PDF locales de los libros (el Hub abierto desde esta computadora los abre en el capítulo)
  const libros = {};
  for (const [id, lib] of Object.entries(INDICE)) {
    if (id.startsWith('_') || !INDICE._carpeta) continue;
    const ruta = path.join(INDICE._carpeta, lib.archivo);
    if (fs.existsSync(ruta)) libros[id] = 'file:///' + encodeURI(ruta.replace(/\\/g, '/')).replace(/#/g, '%23');
  }
  const privado = { preguntas: extra, flashcards: flash, explicaciones_oficiales: explicacionesOficiales, libros };
  fs.writeFileSync(path.join(HUB, 'data_privado.js'), cabecera + '// USO PERSONAL — no se publica (ver publicar_github.ps1).\nwindow.CONAREM_PRIVADO = ' + JSON.stringify(privado) + ';\n');
  resumenPrivado = `${extra.length} preguntas SimuResi extra, ${flash.length} flashcards, ${Object.keys(explicacionesOficiales).length} explicaciones para oficiales (${discrepancias} con gabarito distinto, ignoradas)`;
}

const conExpl = oficiales.filter(p => p.explicacion).length;
const rep = oficiales.filter(p => p.repetida_en).length;
console.log(`hub/data.js: ${oficiales.length} oficiales (${conExpl} con explicación propia, ${rep} repetidas entre años), ${preguntasConaflix.length} CONAFLIX, ${temas.length} temas, ${examenes.length} exámenes`);
console.log('Contenidos:', ORDEN_TRONCALES.map(a => `${a} ${taxonomia[a].subareas.length} (${taxonomia[a].subareas.reduce((s, x) => s + x.edital.length, 0)} ítems del edital)`).join(', '));
const metodos = {};
for (const c of clasif.values()) metodos[c.metodo] = (metodos[c.metodo] || 0) + 1;
console.log('Clasificación:', JSON.stringify(metodos));
console.log('hub/data_privado.js:', resumenPrivado);
