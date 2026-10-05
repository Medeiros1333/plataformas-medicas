// corrigir_bloco.js ARQ.md ANO ED NUM_ATUAL NUM_CERTO GAB_CERTO NOVA.txt
//
// Conserta de uma vez os tres defeitos que andam juntos nos blocos herdados
// da numeracao antiga: numero errado no cabecalho, gabarito errado na linha
// de gabarito, e justificativa escrita para defender a alternativa errada.
//
// Corrigir so o numero e o gabarito seria pior do que nao mexer: o bloco
// passaria a exibir a letra certa com um texto que argumenta pela errada.
// Por isso a nova justificativa e obrigatoria.
//
// GAB_CERTO aceita uma letra (A-E) ou a palavra ANULADA.
// O enunciado e as alternativas ja escritos sao preservados — use
// reescrever_bloco.js quando tambem esses precisarem vir do banco oficial.

const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const [arq, ano, ed, numDe, numPara, gabCerto, novaJust] = process.argv.slice(2);

if (!novaJust) {
  console.error('uso: corrigir_bloco.js ARQ.md ANO ED NUM_ATUAL NUM_CERTO GAB_CERTO NOVA.txt');
  process.exit(1);
}
if (!/^([A-E]|ANULADA)$/.test(gabCerto)) {
  console.error('GAB_CERTO deve ser A-E ou ANULADA (recebido: ' + gabCerto + ')');
  process.exit(1);
}

// confere contra o banco oficial antes de gravar qualquer coisa
const B = JSON.parse(fs.readFileSync(path.join(ROOT, 'dados', '_banco_oficial.json'), 'utf8'));
const of = (B[ano + '.' + ed] || {})[numPara];
if (!of) { console.error('questao oficial inexistente: ' + ano + '.' + ed + ' Q' + numPara); process.exit(1); }
const gabOficial = of.anulada ? 'ANULADA' : of.gabarito_oficial;
if (gabOficial !== gabCerto) {
  console.error('DIVERGE do banco oficial: ' + ano + '.' + ed + ' Q' + numPara +
                ' tem gabarito ' + gabOficial + ', nao ' + gabCerto + '. Nada foi gravado.');
  process.exit(1);
}

const p = path.join(ROOT, 'modulos', arq);
let t = fs.readFileSync(p, 'utf8');

const cabDe = '**[INEP ' + ano + ' · Edição ' + ed + ' · Questão ' + numDe + ']**';
const i = t.indexOf(cabDe);
if (i < 0) { console.error('bloco nao encontrado: ' + cabDe); process.exit(1); }

let fim = t.length;
for (const c of [t.indexOf('**[INEP ', i + 10), t.indexOf('\n## ', i)]) if (c > i && c < fim) fim = c;
let bloco = t.slice(i, fim);

// 1. cabecalho: numero certo, sem os comentarios que vinham colados nele
bloco = bloco.replace(/^\*\*\[INEP [^\]]*\]\*\*[^\n]*/,
  '**[INEP ' + ano + ' · Edição ' + ed + ' · Questão ' + numPara + ']**');

// 2. linha de gabarito
const novaLinha = gabCerto === 'ANULADA'
  ? '**Gabarito oficial: ANULADA** — o INEP anulou esta questão; não há resposta oficial.'
  : '**Gabarito oficial: ' + gabCerto + '**';
const iGab = bloco.search(/\*\*Gabarito /);
if (iGab < 0) { console.error('bloco sem linha de gabarito — use inserir.js/reescrever_bloco.js'); process.exit(1); }
const fimLinha = bloco.indexOf('\n', iGab);
const cabeca = bloco.slice(0, iGab) + novaLinha;

// 3. justificativa nova no lugar de tudo o que vinha depois do gabarito
const texto = fs.readFileSync(novaJust, 'utf8').replace(/\s+$/, '');
bloco = cabeca + '\n\n' + texto + '\n\n---\n\n';

fs.writeFileSync(p, t.slice(0, i) + bloco + t.slice(fim), 'utf8');
console.log('ok: ' + arq + '  Q' + numDe + ' -> Q' + numPara + '  gabarito -> ' + gabCerto);
