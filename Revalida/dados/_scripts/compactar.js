// Dump compacto (texto simples, não JSON) de um .pre.json para eu ler e classificar
// gastando bem menos tokens do que ler o JSON pretty-printed inteiro.
const fs = require('fs');
const path = require('path');
const RAW_DIR = path.join(__dirname, '..', 'raw');

const chave = process.argv[2];
const questoes = JSON.parse(fs.readFileSync(path.join(RAW_DIR, `${chave}.pre.json`), 'utf8'));

for (const q of questoes) {
  const alt = Object.entries(q.alternativas || {}).map(([k, v]) => `${k}:${v}`).join(' | ');
  console.log(`### ${q.numero} [${q.status}]${q.gabarito_oficial ? ' GAB=' + q.gabarito_oficial : ''}${q.anulada ? ' ANULADA' : ''}`);
  console.log(q.enunciado);
  if (alt) console.log(alt);
  console.log('');
}
