// remover_bloco.js ARQ.md ANO ED NUM [--aplicar]
//
// Tira um bloco de questao inteiro de um modulo. Existe porque a correcao da
// numeracao revelou blocos escritos no modulo errado: uma pancreatite biliar
// alojada em "abdome agudo perfurativo", um cisto de mama em "rastreamento de
// cancer de mama". Mover a questao no raw (reatribuir.js) nao basta — o texto
// ja escrito continua no arquivo antigo, e o Hub passaria a mostrar a mesma
// questao em dois modulos.
//
// Sem --aplicar mostra o que sairia. Guarda o bloco removido em
// dados/_removidos/ para que nada se perca antes de ser reescrito no destino.

const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const [arq, ano, ed, num] = process.argv.slice(2);
const APLICAR = process.argv.includes('--aplicar');

if (!num) { console.error('uso: remover_bloco.js ARQ.md ANO ED NUM [--aplicar]'); process.exit(1); }

const p = path.join(ROOT, 'modulos', arq);
let t = fs.readFileSync(p, 'utf8');
const cab = '**[INEP ' + ano + ' · Edição ' + ed + ' · Questão ' + num + ']**';
const i = t.indexOf(cab);
if (i < 0) { console.error('bloco nao encontrado: ' + cab + '  em ' + arq); process.exit(1); }

// o bloco vai ate o proximo cabecalho de questao ou ate a proxima secao
let fim = t.length;
for (const c of [t.indexOf('**[INEP ', i + 10), t.indexOf('\n## ', i)]) if (c > i && c < fim) fim = c;
const bloco = t.slice(i, fim);

console.log('removendo de ' + arq + ':');
console.log('  ' + cab);
console.log('  ' + bloco.length + ' caracteres, ' + bloco.split('\n').length + ' linhas');
const lg = (bloco.match(/\*\*Gabarito[^\n]*/) || ['(sem linha de gabarito)'])[0];
console.log('  ' + lg);

if (!APLICAR) { console.log('\n(simulacao — rode com --aplicar para gravar)'); process.exit(0); }

const dirBk = path.join(ROOT, 'dados', '_removidos');
fs.mkdirSync(dirBk, { recursive: true });
const nomeBk = arq.replace(/\.md$/, '') + '__' + ano + '-' + ed + '-Q' + num + '.md';
fs.writeFileSync(path.join(dirBk, nomeBk), bloco, 'utf8');

fs.writeFileSync(p, t.slice(0, i) + t.slice(fim), 'utf8');
console.log('\nremovido. copia guardada em dados/_removidos/' + nomeBk);
console.log('lembre-se de rodar reconstruir_mapa.js para o cabecalho do modulo refletir a mudanca');
