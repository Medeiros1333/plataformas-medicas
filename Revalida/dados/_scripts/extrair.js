// Extração MECÂNICA (sem LLM) das provas Revalida a partir do texto pré-extraído
// em dados/raw_text/*.txt. Gera dados/raw/{ano}.{edicao}.pre.json (sem classificação
// ainda — especialidade/tema/assunto ficam null, preenchidos na Fase B).
//
// Uso: node extrair.js <ano> <edicao> <arquivo_prova.txt> <arquivo_gabarito.txt> <n_esperado>
// Ex.:  node extrair.js 2011 1 "2011__Prova_objetiva_cinza_2011.txt" "2011__Gabarito_2011.txt" 110

const fs = require('fs');
const path = require('path');

const RAW_TEXT_DIR = path.join(__dirname, '..', 'raw_text');
const OUT_DIR = path.join(__dirname, '..', 'raw');

const DASH_CHARS = ['-', '—', '–', '̶', '−', '_'];

function isAnswerToken(tok) {
  return /^[A-Ea-e]$/.test(tok) || /^[Xx]$/.test(tok) || DASH_CHARS.includes(tok);
}
function isNumToken(tok) {
  return /^\d{1,3}$/.test(tok);
}

function parseGabarito(text, nEsperado) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const seq = []; // {type:'num'|'ans', val}
  const combinedRe = /^(\d{1,3})\s*([A-EXx])$/;
  for (const l of lines) {
    const cm = combinedRe.exec(l);
    if (cm) { seq.push({ type: 'num', val: parseInt(cm[1], 10) }); seq.push({ type: 'ans', val: cm[2].toUpperCase() }); continue; }
    if (isNumToken(l)) seq.push({ type: 'num', val: parseInt(l, 10) });
    else if (isAnswerToken(l)) seq.push({ type: 'ans', val: l.toUpperCase() });
    // outros tokens (cabeçalhos como "Questão", "Gabarito", "GAB", "DEFINITIVO") são ignorados
  }
  // percorre a sequência formando runs alternados de num...num, ans...ans
  const pares = {}; // numero -> letra ('X' se anulada)
  let i = 0;
  while (i < seq.length) {
    if (seq[i].type !== 'num') { i++; continue; }
    const numRun = [];
    while (i < seq.length && seq[i].type === 'num') { numRun.push(seq[i].val); i++; }
    const ansRun = [];
    while (i < seq.length && seq[i].type === 'ans') { ansRun.push(seq[i].val); i++; }
    const n = Math.min(numRun.length, ansRun.length);
    for (let k = 0; k < n; k++) {
      if (numRun[k] >= 1 && numRun[k] <= nEsperado) pares[numRun[k]] = ansRun[k];
    }
  }
  return pares;
}

function splitQuestionBlocks(text) {
  const headerRe = /QUEST[ÃA]O\s*N?º?\.?\s*0*(\d{1,3})\b/gi;
  const matches = [];
  let m;
  while ((m = headerRe.exec(text)) !== null) {
    matches.push({ num: parseInt(m[1], 10), start: m.index, end: headerRe.lastIndex });
  }
  const blocks = {}; // numero -> texto bruto (primeira ocorrência)
  for (let i = 0; i < matches.length; i++) {
    const numero = matches[i].num;
    const start = matches[i].end;
    const end = i + 1 < matches.length ? matches[i + 1].start : text.length;
    const raw = text.slice(start, end).trim();
    if (!(numero in blocks) && raw.length > 0) blocks[numero] = raw;
  }
  return blocks;
}

function tryParensFormat(block) {
  const re = /\(([A-E])\)\s*/g;
  const marks = [...block.matchAll(re)];
  return extractByMarks(block, marks, m => m[1], m => m.index, m => m.index + m[0].length);
}

function tryBareLineFormat(block) {
  const lines = block.split('\n');
  const marks = [];
  let offset = 0;
  const offsets = [];
  for (const l of lines) { offsets.push(offset); offset += l.length + 1; }
  lines.forEach((l, idx) => {
    const t = l.trim();
    if (/^[A-E]$/.test(t)) marks.push({ letter: t, idx });
  });
  if (!marks.length) return null;
  // exige sequência estritamente crescente A,B,C,D(,E) iniciando em A
  const expected = 'ABCDE';
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].letter !== expected[i]) return null;
  }
  const stemEndLine = marks[0].idx;
  const stem = lines.slice(0, stemEndLine).join('\n').trim();
  const alt = {};
  for (let i = 0; i < marks.length; i++) {
    const from = marks[i].idx + 1;
    const to = i + 1 < marks.length ? marks[i + 1].idx : lines.length;
    alt[marks[i].letter] = lines.slice(from, to).join(' ').replace(/\s+/g, ' ').trim();
  }
  if (!alt.A || !alt.B || !alt.C || !alt.D) return null;
  return { stem, alt };
}

function tryInlineFormat(block) {
  // Opções inline sem quebra de linha própria, ex.: "...quadro clínico A é crônico... B requer..."
  // Marcador = letra maiúscula isolada entre espaços (fronteira de palavra), não necessariamente
  // seguida de maiúscula (o texto da opção pode continuar a frase do enunciado em minúscula).
  const re = /(^|\s)([A-E])(\s)/g;
  const raw = [...block.matchAll(re)].map(m => ({
    letter: m[2],
    // posição do próprio caractere da letra
    index: m.index + m[1].length,
    end: m.index + m[1].length + 1
  }));
  if (raw.length < 4) return null;
  // procura a ÚLTIMA sequência ascendente maximal A,B,C,D(,E) com espaçamento mínimo entre marcas
  const expected = 'ABCDE';
  let bestRun = null;
  for (let start = 0; start < raw.length; start++) {
    if (raw[start].letter !== 'A') continue;
    const run = [raw[start]];
    let letterIdx = 1;
    for (let j = start + 1; j < raw.length && letterIdx < 5; j++) {
      if (raw[j].letter === expected[letterIdx] && raw[j].index - run[run.length - 1].index > 8) {
        run.push(raw[j]);
        letterIdx++;
      }
    }
    if (run.length >= 4) bestRun = run; // mantém a última (mais próxima do fim) válida
  }
  if (!bestRun) return null;
  const marks = bestRun.map(r => ({ 1: r.letter, index: r.index }));
  return extractByMarks(block, marks, m => m[1], m => m.index, m => m.index + 2);
}

function extractByMarks(block, marks, letterOf, startOf, endOf) {
  if (marks.length < 4) return null;
  const expected = 'ABCDE';
  const letters = marks.map(letterOf);
  // valida prefixo estritamente crescente A,B,C,D(,E) — permite parar em D (4 alternativas)
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] !== expected[i]) {
      marks = marks.slice(0, i);
      break;
    }
  }
  if (marks.length < 4) return null;
  const stem = block.slice(0, startOf(marks[0])).trim();
  const alt = {};
  for (let i = 0; i < marks.length; i++) {
    const from = endOf(marks[i]);
    const to = i + 1 < marks.length ? startOf(marks[i + 1]) : block.length;
    alt[letterOf(marks[i])] = block.slice(from, to).replace(/\s+/g, ' ').trim();
  }
  return { stem, alt };
}

function parseQuestion(numero, block) {
  let parsed = tryParensFormat(block) || tryBareLineFormat(block) || tryInlineFormat(block);
  const temFigura = /\[?IMG|figura|imagem a seguir|reproduz-se|radiografia a seguir|ECG a seguir|eletrocardiograma a seguir/i.test(block.slice(0, 300));
  if (!parsed) {
    return {
      numero,
      enunciado: block.replace(/\s+/g, ' ').trim(),
      alternativas: {},
      status: 'revisar_extracao',
      _motivo: 'nao_foi_possivel_separar_alternativas'
    };
  }
  const status = temFigura ? 'revisar_extracao' : 'ok';
  const out = {
    numero,
    enunciado: parsed.stem.replace(/\s+/g, ' ').trim(),
    alternativas: parsed.alt,
    status
  };
  if (temFigura) out._motivo = 'possivel_figura_nao_descrita';
  return out;
}

function main() {
  const [ano, edicao, provaFile, gabaritoFile, nEsperadoStr] = process.argv.slice(2);
  const nEsperado = parseInt(nEsperadoStr, 10);
  const provaText = fs.readFileSync(path.join(RAW_TEXT_DIR, provaFile), 'utf8');
  const gabaritoText = fs.readFileSync(path.join(RAW_TEXT_DIR, gabaritoFile), 'utf8');

  const gabaritoMap = parseGabarito(gabaritoText, nEsperado);
  const blocks = splitQuestionBlocks(provaText);

  const questoes = [];
  const faltando = [];
  for (let n = 1; n <= nEsperado; n++) {
    if (!(n in blocks)) { faltando.push(n); continue; }
    const q = parseQuestion(n, blocks[n]);
    const gab = gabaritoMap[n];
    q.gabarito_oficial = (gab && gab !== 'X') ? gab : null;
    q.anulada = gab === 'X';
    q.id = `INEP${ano}-${edicao}-Q${String(n).padStart(3, '0')}`;
    q.ano = parseInt(ano, 10);
    q.edicao = parseInt(edicao, 10);
    q.tipo = 'objetiva';
    if (!q.gabarito_oficial && !q.anulada) { q.status = 'revisar_extracao'; q._motivo = (q._motivo ? q._motivo + '+' : '') + 'gabarito_nao_encontrado'; }
    questoes.push(q);
  }

  const nOk = questoes.filter(q => q.status === 'ok').length;
  const nRevisar = questoes.filter(q => q.status === 'revisar_extracao').length;
  const nGabaritoOk = Object.keys(gabaritoMap).length;

  console.log(`${ano}.${edicao}: esperado=${nEsperado} blocos_encontrados=${Object.keys(blocks).length} gabarito_pares=${nGabaritoOk} ok=${nOk} revisar=${nRevisar} faltando=[${faltando.join(',')}]`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${ano}.${edicao}.pre.json`);
  fs.writeFileSync(outPath, JSON.stringify(questoes, null, 2), 'utf8');
  console.log(`salvo: ${outPath}`);
}

main();
