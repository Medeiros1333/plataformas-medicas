// limpar_rodapes.js [--aplicar]
//
// Remove do banco oficial e do raw os restos de diagramacao que a extracao
// em duas colunas arrastou para dentro do texto das questoes:
//
//   1. rodape de pagina colado na ultima alternativa
//      "... 26 EXAME NACIONAL DE REVALIDACAO DE DIPLOMAS MEDICOS"
//      "... INEP1602 | 001-ProvaObjetiva-V1-Manha 14"
//   2. serial de item no inicio do enunciado (edicao 2021.1 inteira)
//      "71. ITEM 138038 - V. 720632 Paciente de 40 anos..."
//   3. cabecalho "QUESTAO 86" embutido no meio do enunciado
//
// NAO toca em ⟪?⟫: esse marcador sinaliza corte irresoluvel e ja e tratado
// como lacuna conhecida pelo resto do pipeline.
//
// Sem --aplicar apenas relata. Com --aplicar grava _banco_oficial.json e
// dados/raw/*.json.

const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const APLICAR = process.argv.includes('--aplicar');

// --- padroes de rodape -------------------------------------------------
// Removem a FRASE do rodape onde quer que ela esteja, nao "dali ate o fim".
// O rodape costuma vir no fim, mas em algumas questoes a quebra de coluna o
// jogou para o comeco — e ali "apagar do rodape em diante" apagaria a
// questao inteira (2013.1-Q30 perdia 427 dos seus 427 caracteres).
const RODAPES = [
  // "26 EXAME NACIONAL DE REVALIDACAO DE DIPLOMAS MEDICOS"
  /\d{0,3}\s*EXAME\s+NACIONAL\s+DE\s+REVALIDA[ÇC][ÃA]O\s+DE\s+DIPLOMAS\s+M[ÉE]DICOS/gi,
  // mesma frase truncada pela quebra de coluna: "EXAME NACIONAL DE REV⟪?⟫"
  /\d{0,3}\s*EXAME\s+NACIONAL\s+DE\s+REV(?:ALIDA[ÇC]?[ÃA]?O?)?\s*⟪\?⟫/gi,
  // "INEP1602 | 001-ProvaObjetiva-V1-Manha 14"
  /INEP\s*\d{4}\s*\|\s*\d{0,3}-?\s*ProvaObjetiva-V\d[^|\n]{0,30}/gi,
  // "001-ProvaObjetiva-V1-Manha 14" sem o prefixo INEP
  /\d{0,3}-?\s*ProvaObjetiva-V\d(?:-\S+)?(?:\s+\d{1,3})?/gi,
];

// aplicado so no FIM: numero de pagina solto apos pontuacao terminal
const PAGINA_FINAL = /(?<=[.!?])\s+\d{1,3}\s*$/;

// serial de item no COMECO do enunciado: "71. ITEM 138038 - V. 720632 "
const SERIAL = /^\s*\d{1,3}\s*[.)]?\s*ITEM\s+\d{4,}\s*-?\s*V\.?\s*\d{4,}\s*/i;
// variante sem o numero de ordem
const SERIAL2 = /^\s*ITEM\s+\d{4,}\s*-?\s*V\.?\s*\d{4,}\s*/i;

// cabecalho de questao embutido no meio do enunciado
const CABECALHO = /\s*\bQUEST[ÃA]O\s+\d{1,3}\b\s*/g;

// Rede de seguranca. Os rodapes sao frases literais fixas, entao remove-los
// e seguro por construcao, por mais que a alternativa restante fique curta
// ("ancilostomíase." e a alternativa inteira, nao um resto mutilado).
// O unico desastre possivel e a limpeza zerar o texto — ai devolve o
// original e registra para inspecao manual.
const suspeitos = [];
function seguro(rot, antes, depois) {
  if (!antes) return antes;
  if (depois === antes) return antes;          // nada foi tentado
  if (depois.trim().length < 8) {
    suspeitos.push({ rot, de: antes.length, para: depois.length,
                     texto: antes.slice(0, 90) });
    return antes;
  }
  return depois;
}

function limparRodape(s) {
  if (!s) return s;
  let out = s;
  for (const re of RODAPES) { re.lastIndex = 0; out = out.replace(re, ' '); }
  out = out.replace(PAGINA_FINAL, '');
  return out.replace(/\s{2,}/g, ' ').trim();
}

function limparEnunciado(s) {
  if (!s) return s;
  let out = s.replace(SERIAL, '').replace(SERIAL2, '');
  // so remove "QUESTAO NN" quando NAO esta no inicio (no inicio seria o
  // proprio cabecalho legitimo, que a extracao ja deveria ter tirado)
  out = out.replace(CABECALHO, (m, off) => (off === 0 ? m : ' '));
  out = limparRodape(out);
  return out.replace(/\s{2,}/g, ' ').trim();
}

// --- relatorio ---------------------------------------------------------
const rel = { enunciado: [], alternativa: [] };

function processarQ(rot, q) {
  let mudou = false;
  const e0 = q.enunciado || '';
  const e1 = seguro(rot + ' [enun]', e0, limparEnunciado(e0));
  if (e1 !== e0) {
    rel.enunciado.push({ rot, antes: e0.slice(0, 60), depois: e1.slice(0, 60),
                         cortou: e0.length - e1.length });
    q.enunciado = e1; mudou = true;
  }
  const alts = q.alternativas || {};
  for (const k of Object.keys(alts)) {
    const a0 = alts[k] || '';
    const a1 = seguro(rot + ' [' + k + ']', a0, limparRodape(a0));
    if (a1 !== a0) {
      rel.alternativa.push({ rot: rot + ' ' + k, cortou: a0.length - a1.length,
                             cauda: a0.slice(a1.length).trim().slice(0, 70) });
      alts[k] = a1; mudou = true;
    }
  }
  return mudou;
}

// --- banco oficial -----------------------------------------------------
const pBanco = path.join(ROOT, 'dados', '_banco_oficial.json');
const banco = JSON.parse(fs.readFileSync(pBanco, 'utf8'));
let nBanco = 0;
for (const ed of Object.keys(banco))
  for (const n of Object.keys(banco[ed]))
    if (processarQ(ed + '-Q' + n, banco[ed][n])) nBanco++;

// --- raw ---------------------------------------------------------------
const RAW = path.join(ROOT, 'dados', 'raw');
const tocados = [];
let nRaw = 0;
for (const f of fs.readdirSync(RAW).filter(f => /^\d{4}\.\d\.json$/.test(f))) {
  const p = path.join(RAW, f);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const qs = d.questoes || d;
  let mudouArq = false;
  for (const q of qs) if (processarQ(q.id, q)) { nRaw++; mudouArq = true; }
  if (mudouArq) tocados.push({ p, d });
}

// --- saida -------------------------------------------------------------
console.log('enunciados limpos : ' + rel.enunciado.length);
console.log('alternativas limpas: ' + rel.alternativa.length);
console.log('questoes afetadas  : banco ' + nBanco + ' | raw ' + nRaw);

console.log('\n--- amostra de enunciados ---');
for (const r of rel.enunciado.slice(0, 8))
  console.log('  ' + r.rot + '  (-' + r.cortou + ')\n     antes: ' + r.antes +
              '\n     agora: ' + r.depois);

console.log('\n--- amostra de caudas removidas ---');
for (const r of rel.alternativa.slice(0, 10))
  console.log('  ' + r.rot + '  (-' + r.cortou + ')  «' + r.cauda + '»');

if (suspeitos.length) {
  console.log('\n--- NAO limpos (a limpeza mutilaria o texto) : ' + suspeitos.length + ' ---');
  for (const s of suspeitos.slice(0, 15))
    console.log('  ' + s.rot + '  ' + s.de + '->' + s.para + '  «' + s.texto + '»');
  console.log('  estes ficaram como estavam; conferir com layout.js');
}

if (!APLICAR) { console.log('\n(simulacao — rode com --aplicar para gravar)'); process.exit(0); }

fs.writeFileSync(pBanco, JSON.stringify(banco, null, 1), 'utf8');
for (const t of tocados) fs.writeFileSync(t.p, JSON.stringify(t.d, null, 1), 'utf8');
console.log('\ngravado: _banco_oficial.json + ' + tocados.length + ' arquivos raw');
