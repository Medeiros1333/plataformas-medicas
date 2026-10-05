// marcar_gabarito_preliminar.js [--aplicar]
//
// O INEP publica DOIS gabaritos por edição: o PRELIMINAR, logo após a prova, e
// o DEFINITIVO, depois da análise dos recursos. Entre um e outro, questões
// mudam de resposta e outras são anuladas.
//
// Duas edições deste banco foram extraídas do gabarito PRELIMINAR:
//
//   dados/raw_text/2014__Gabarito_2014.txt          -> "GABARITO PRELIMINAR"
//   dados/raw_text/2020__Gabarito_prova_objetiva... -> "GABARITO PRELIMINAR"
//
// São 208 questões, 12% do banco. A verificação "1721/1721 gabaritos conferem"
// NÃO as protege: ela compara o banco contra esse mesmo arquivo preliminar —
// é circular, exatamente como era o renum3.js.
//
// O sinal que levantou a suspeita: 2020.1-Q8 descreve uma fístula perianal de
// livro (abscesso drenado há 1 ano, orifício cutâneo a 2 cm da borda anal com
// saída de secreção fecaloide à compressão) e o gabarito preliminar aponta
// "fissura anal crônica" — diagnóstico incompatível com o enunciado. É o
// padrão típico de questão corrigida ou anulada em recurso.
//
// Este script marca as questões dessas edições com `gabarito_preliminar: true`
// para que o Hub e os módulos possam exibir o aviso, e lista as que já têm
// justificativa escrita (que precisarão de reconferência quando o gabarito
// definitivo for obtido).

const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const APLICAR = process.argv.includes('--aplicar');

const PRELIMINARES = ['2014.1', '2020.1'];

const pB = path.join(ROOT, 'dados', '_banco_oficial.json');
const banco = JSON.parse(fs.readFileSync(pB, 'utf8'));

// --- quais ja tem justificativa escrita --------------------------------
const RE = /\*\*\[INEP\s+(\d{4})\s*·\s*Edição\s*(\d)\s*·\s*Questão\s*(\d+)\]\*\*/g;
const escritas = {};
const MODS = path.join(ROOT, 'modulos');
for (const f of fs.readdirSync(MODS).filter(f => f.endsWith('.md'))) {
  const t = fs.readFileSync(path.join(MODS, f), 'utf8');
  let m; RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    const ed = m[1] + '.' + m[2];
    (escritas[ed] = escritas[ed] || {})[+m[3]] = f;
  }
}

let marcadas = 0;
const comJustificativa = [];
for (const ed of PRELIMINARES) {
  for (const n of Object.keys(banco[ed] || {})) {
    banco[ed][n].gabarito_preliminar = true;
    marcadas++;
    const arq = (escritas[ed] || {})[+n];
    if (arq) comJustificativa.push({ ed, n: +n, arq, gab: banco[ed][n].gabarito_oficial });
  }
}

console.log('edicoes com gabarito PRELIMINAR: ' + PRELIMINARES.join(', '));
console.log('questoes marcadas               : ' + marcadas);
console.log('destas, com justificativa escrita: ' + comJustificativa.length + '\n');

comJustificativa.sort((a, b) => a.ed.localeCompare(b.ed) || a.n - b.n);
for (const c of comJustificativa)
  console.log('  ' + c.ed + '-Q' + String(c.n).padStart(3) + '  gab ' + c.gab + '   ' + c.arq);

console.log('\nEstas justificativas foram escritas defendendo o gabarito PRELIMINAR.');
console.log('Quando o gabarito definitivo for obtido, rodar auditar_modulos.js');
console.log('novamente: as que divergirem precisam ser reescritas.');

if (!APLICAR) { console.log('\n(simulacao — rode com --aplicar para gravar)'); process.exit(0); }

fs.writeFileSync(pB, JSON.stringify(banco, null, 1), 'utf8');

// marca tambem no raw, para o Hub poder exibir o aviso
const RAW = path.join(ROOT, 'dados', 'raw');
let nRaw = 0;
for (const ed of PRELIMINARES) {
  const p = path.join(RAW, ed + '.json');
  if (!fs.existsSync(p)) continue;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const q of (d.questoes || d)) { q.gabarito_preliminar = true; nRaw++; }
  fs.writeFileSync(p, JSON.stringify(d, null, 1), 'utf8');
}
console.log('\ngravado: _banco_oficial.json + ' + nRaw + ' questoes no raw');
