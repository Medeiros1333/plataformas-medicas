// Importa el contenido de las otras plataformas (carpeta Otras_plataformas_o_bancos y Plataforma_CONAREM):
//   - SimuResi (frontend/app.html): `var Q = [...]` (preguntas con explicación por alternativa) y
//     `var FLASHCARDS = [...]`. Se guardan en data/privado/ (uso personal: NUNCA se publican).
//   - CONAFLIX (CONAREM26-main, licencia Apache-2.0): `const TOPICS_DATA = [...]` con resúmenes,
//     puntos clave, mnemotecnias y preguntas. Se guarda en data/conaflix_temas.json.
//
// Los arrays se leen con un parser propio de literales JS (objetos/arrays/strings/números), sin
// ejecutar el código de esas plataformas.
//
// Uso: node scripts/importar-externos.js

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const ORIGEN = path.join(process.env.USERPROFILE || '', 'OneDrive', 'Área de Trabalho', 'CONAREM');
const SIMURESI = path.join(ORIGEN, 'Plataforma_CONAREM', 'frontend', 'app.html');
const CONAFLIX = path.join(ORIGEN, 'Otras_plataformas_o_bancos', 'CONAREM26-main', 'CONAFLIX (2).html');

// ---------------------------------------------------------------------------
// Parser de literales JS (subconjunto: {} [] "str" 'str' `str` números true/false/null, claves sin comillas,
// comas finales y comentarios). Lanza error ante cualquier otra cosa (p. ej. llamadas a funciones).
// ---------------------------------------------------------------------------
function parsearLiteral(src, inicio) {
  let i = inicio;
  const err = msg => { throw new Error(`${msg} en posición ${i}: «${src.slice(i, i + 60)}»`); };
  const espacios = () => {
    for (;;) {
      while (i < src.length && /\s/.test(src[i])) i++;
      if (src.startsWith('//', i)) { while (i < src.length && src[i] !== '\n') i++; continue; }
      if (src.startsWith('/*', i)) { i = src.indexOf('*/', i + 2) + 2; continue; }
      break;
    }
  };
  const cadena = () => {
    const q = src[i++];
    let s = '';
    while (i < src.length && src[i] !== q) {
      if (q === '`' && src.startsWith('${', i)) err('plantilla con expresión no soportada');
      if (src[i] === '\\') {
        const c = src[i + 1];
        const mapa = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', '0': '\0' };
        if (c === 'u') { s += String.fromCharCode(parseInt(src.substr(i + 2, 4), 16)); i += 6; continue; }
        if (c === 'x') { s += String.fromCharCode(parseInt(src.substr(i + 2, 2), 16)); i += 4; continue; }
        if (c === '\n') { i += 2; continue; }
        s += c in mapa ? mapa[c] : c;
        i += 2;
        continue;
      }
      s += src[i++];
    }
    if (src[i] !== q) err('cadena sin cerrar');
    i++;
    return s;
  };
  const valor = () => {
    espacios();
    const c = src[i];
    if (c === '{') {
      i++;
      const o = {};
      for (;;) {
        espacios();
        if (src[i] === '}') { i++; return o; }
        let clave;
        if (src[i] === '"' || src[i] === "'") clave = cadena();
        else {
          const m = /^[A-Za-z_$][\w$]*|^\d+/.exec(src.slice(i, i + 200));
          if (!m) err('clave inválida');
          clave = m[0];
          i += clave.length;
        }
        espacios();
        if (src[i] !== ':') err('se esperaba ":"');
        i++;
        o[clave] = valor();
        espacios();
        if (src[i] === ',') { i++; continue; }
        if (src[i] === '}') { i++; return o; }
        err('se esperaba "," o "}"');
      }
    }
    if (c === '[') {
      i++;
      const a = [];
      for (;;) {
        espacios();
        if (src[i] === ']') { i++; return a; }
        a.push(valor());
        espacios();
        if (src[i] === ',') { i++; continue; }
        if (src[i] === ']') { i++; return a; }
        err('se esperaba "," o "]"');
      }
    }
    if (c === '"' || c === "'" || c === '`') return cadena();
    const m = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(src.slice(i, i + 40));
    if (m) { i += m[0].length; return +m[0]; }
    for (const [lit, v] of [['true', true], ['false', false], ['null', null]]) {
      if (src.startsWith(lit, i)) { i += lit.length; return v; }
    }
    err('valor no soportado');
  };
  const v = valor();
  return { valor: v, fin: i };
}

function extraerArray(src, patron) {
  const m = patron.exec(src);
  if (!m) throw new Error('no encontrado: ' + patron);
  return parsearLiteral(src, m.index + m[0].length - 1).valor;
}

// ---------------------------------------------------------------------------
const AREA_SIMURESI = { CIR: 'CIR', GO: 'GO', SP: 'SP', MI: 'MI', PED: 'PED' };

function importarSimuResi() {
  if (!fs.existsSync(SIMURESI)) { console.log('SimuResi no encontrado, se omite:', SIMURESI); return; }
  const html = fs.readFileSync(SIMURESI, 'utf8');
  const Q = extraerArray(html, /var Q\s*=\s*\[/);
  const FLASH = extraerArray(html, /var FLASHCARDS\s*=\s*\[/);

  const esCont = q => /caso anterior|continuaci[oó]n del caso/i.test(q);
  const preguntas = Q.map((q, idx) => {
    const alternativas = {};
    for (const [letra, texto] of q.opts) alternativas[letra] = texto;
    const area = AREA_SIMURESI[q.area];
    if (!area) throw new Error('área desconocida ' + q.area);
    return {
      id: `SR-${area}-${String(q.id).padStart(4, '0')}`,
      fuente: 'simuresi',
      area,
      orden: idx,
      enunciado: q.q,
      alternativas,
      respuesta_correcta: q.ans,
      explicacion: q.exp || '',
      por_que_no: q.wrong || {},
      ...(q.flag ? { revision_incierta: { alternativa_sugerida: null, nota: 'Marcada como dudosa en el banco de origen.' } } : {}),
      ...(esCont(q.q) ? { continuacion: true } : {})
    };
  });
  // Casos clínicos seriados: la continuación siempre va pegada a la pregunta que la precede.
  for (let k = 1; k < preguntas.length; k++) {
    if (preguntas[k].continuacion && preguntas[k - 1].area === preguntas[k].area) {
      preguntas[k].serie = preguntas[k - 1].serie || preguntas[k - 1].id;
      preguntas[k - 1].serie = preguntas[k].serie;
    }
  }
  const flashcards = FLASH.map(c => ({ id: 'SR-' + c.id, area: c.deck, frente: c.front, dorso: c.back, fuente: 'simuresi' }));

  const dir = path.join(RAIZ, 'data', 'privado');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'simuresi_preguntas.json'), JSON.stringify(preguntas, null, 1));
  fs.writeFileSync(path.join(dir, 'simuresi_flashcards.json'), JSON.stringify(flashcards, null, 1));
  console.log(`SimuResi: ${preguntas.length} preguntas, ${flashcards.length} flashcards -> data/privado/`);
}

const AREA_CONAFLIX = {
  'Medicina Interna': 'MI', 'Cardiología': 'MI', 'Neumología': 'MI', 'Nefrología': 'MI', 'Psiquiatría': 'MI',
  'Trastornos del ánimo': 'MI', 'Urgencias': 'MI', 'ACLS': 'MI',
  'Cirugía': 'CIR', 'Abdomen agudo': 'CIR',
  'Obstetricia': 'GO', 'Ginecología': 'GO',
  'Pediatría': 'PED', 'Neonatología': 'PED',
  'Salud Pública': 'SP'
};

function importarConaflix() {
  if (!fs.existsSync(CONAFLIX)) { console.log('CONAFLIX no encontrado, se omite:', CONAFLIX); return; }
  const html = fs.readFileSync(CONAFLIX, 'utf8');
  const temas = extraerArray(html, /const TOPICS_DATA\s*=\s*\[/);
  const salida = temas.map(t => {
    const area = AREA_CONAFLIX[t.subject] || AREA_CONAFLIX[t.subsubject] || 'MI';
    const preguntas = (t.questions || []).map((q, n) => {
      const alternativas = {};
      q.options.forEach((o, k) => {
        const letra = 'ABCDE'[k];
        alternativas[letra] = String(o).replace(/^[A-E]\)\s*/, '');
      });
      const ex = q.explanation || {};
      return {
        id: `CF-${t.id}-${n + 1}`,
        fuente: 'conaflix',
        area,
        tema_conaflix: t.id,
        enunciado: q.text,
        alternativas,
        respuesta_correcta: q.correct,
        explicacion: typeof ex === 'string' ? ex : (ex.correct || ''),
        por_que_no: typeof ex === 'string' ? {} : (ex.incorrect || {}),
        perla: ex.pearl || '',
        referencia: ex.reference || ''
      };
    });
    return {
      id: t.id,
      area,
      materia: t.subject,
      submateria: t.subsubject || '',
      titulo: t.title,
      icono: t.icon || '',
      dificultad: t.difficulty || '',
      frecuencia: t.frequency || null,
      minutos: t.studyTime || null,
      resumen_html: (t.summary || '').trim(),
      puntos_clave: t.keyPoints || [],
      mnemotecnia: t.mnemonics || '',
      bibliografia: t.bibliography || '',
      preguntas
    };
  });
  fs.writeFileSync(path.join(RAIZ, 'data', 'conaflix_temas.json'), JSON.stringify(salida, null, 1));
  const nq = salida.reduce((s, t) => s + t.preguntas.length, 0);
  console.log(`CONAFLIX: ${salida.length} temas, ${nq} preguntas -> data/conaflix_temas.json`);
}

importarSimuResi();
importarConaflix();
