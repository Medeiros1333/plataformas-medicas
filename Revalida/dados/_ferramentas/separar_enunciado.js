// separar_enunciado.js [--aplicar]
//
// Conserta 32 questoes em que a extracao em duas colunas deixou o ENUNCIADO
// dentro da alternativa A, e o campo enunciado vazio:
//
//   enunciado: ""
//   A: "febre amarela apresentou, no Brasil, dois picos epidemicos ...
//       ... em seu territorio, deve A notificar, semanalmente, todo caso
//       que preencha os criterios de suspeita de febre amarela."
//   B: "orientar a antecipacao da vacinacao ..."   <- 90 caracteres
//
// A alternativa A fica com 5 a 10 vezes o tamanho das irmas, porque carrega
// o caso clinico inteiro antes da propria resposta.
//
// COMO ACHAR O CORTE: o caderno imprime a letra da alternativa entre o fim do
// comando e o texto da resposta. Na extracao isso vira um " A " solto antes de
// uma palavra minuscula. O corte e a ultima ocorrencia desse padrao cujo resto
// tenha tamanho compativel com as alternativas irmas — e o resto so e aceito
// se couber nessa faixa, senao a questao fica como esta e entra no relatorio.
//
// Sem --aplicar apenas relata.

const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const APLICAR = process.argv.includes('--aplicar');

// " A " solto antes do texto da alternativa. Aceita minuscula ou maiuscula:
// ha alternativas que comecam com maiuscula ("Ela garante a saude ...").
const MARCA = /\s+A\s+(?=[A-Za-zÀ-ÿ])/g;

// Um " A " solto nao basta como criterio: a palavra "A" aparece dezenas de
// vezes num caso clinico ("... A radiografia mostra ..."), e cortar no lugar
// errado parte a questao ao meio — foi o que aconteceu na primeira versao
// deste script, que produziu alternativas como "para Cadastramento das
// Familias nao fosse preenchida". O corte so e aceito quando o texto que
// fica para tras TERMINA num comando de questao. Isso troca recall por
// precisao, que e a troca certa: uma questao nao separada continua legivel,
// uma questao partida no lugar errado vira lixo silencioso.
const COMANDOS = [
  /assinale a (?:op[çc][ãa]o|alternativa)[^.]*\.$/i,
  /[ée] correto afirmar que$/i,
  /(?:o|a) (?:m[ée]dic[oa]|profissional|enfermeir[oa]|equipe)[^.]{0,40}deve$/i,
  /(?:a )?conduta[^.]{0,60}(?:é|e|ser[áa])$/i,
  /(?:hip[óo]tese|diagn[óo]stico)[^.]{0,60}(?:é|e)$/i,
  /(?:qual|quais)[^.?]*\?$/i,
  /(?:deve|devem|deve-se|dever[áa])$/i,
  /(?:deve|dever[áa]) (?:ser|orientar|prescrever|solicitar|indicar|recomendar|realizar)$/i,
  /(?:respectivamente|respectivamente,)$/i,
  /(?:s[ãa]o|est[áa]|estava|seria|ser[áa])$/i,
  /(?:opç[ãa]o|alternativa) correta$/i,
  /:$/,
  /que$/i,
];
const terminaEmComando = s => COMANDOS.some(re => re.test(s.trim()));

const rel = { ok: [], recusadas: [] };

function separar(rot, q) {
  const e = (q.enunciado || '').trim();
  const alts = q.alternativas || {};
  const A = alts.A || '';
  const irmas = Object.keys(alts).filter(k => k !== 'A').map(k => (alts[k] || '').length);
  if (!irmas.length) return false;
  const media = irmas.reduce((a, c) => a + c, 0) / irmas.length;
  const maxIrma = Math.max(...irmas);
  const minIrma = Math.min(...irmas);

  // O sintoma nao e "enunciado curto" — e "alternativa A desproporcional".
  // Ha casos em que o enunciado sobreviveu quase inteiro e so o ultimo
  // paragrafo foi para dentro de A (2024.1-Q8), e casos em que o enunciado
  // ficou vazio. O que os une e a alternativa A inchada. Exigir enunciado
  // curto perdia a primeira metade dos casos.
  // A razao 2.2 supunha que o enunciado inteiro tivesse ido para dentro de A.
  // Ha casos em que so a FRASE DE COMANDO migrou (2014.1-Q33: "a investigacao
  // complementar indicada e o diagnostico sao" = 53 caracteres), e ai A fica
  // apenas ~1,5x as irmas. O filtro de comando ao fim da cabeca e que garante
  // a precisao; a razao so precisa ser alta o bastante para nao testar
  // alternativas de tamanho normal.
  if (!(A.length > 150 && A.length > media * 1.3)) return false;

  // candidatos de corte, do fim para o comeco
  const cortes = [];
  let m; MARCA.lastIndex = 0;
  while ((m = MARCA.exec(A))) cortes.push({ i: m.index, fim: m.index + m[0].length });
  cortes.reverse();

  for (const c of cortes) {
    const cabeca = A.slice(0, c.i).trim();     // vira (parte do) enunciado
    const resto = A.slice(c.fim).trim();       // vira a alternativa A de verdade
    // o resto tem de parecer uma alternativa: nem minusculo nem maior que a
    // maior das irmas com folga
    const plausivel = resto.length >= Math.max(15, minIrma * 0.4) &&
                      resto.length <= Math.max(maxIrma * 1.8, maxIrma + 80) &&
                      // A cabeca e grande quando o enunciado inteiro migrou, e
                      // pequena quando so a frase de comando migrou — neste
                      // caso o enunciado ja esta cheio e basta exigir pouco.
                      (cabeca.length >= 150 || (e.length >= 300 && cabeca.length >= 20)) &&
                      terminaEmComando(cabeca);
    if (!plausivel) continue;
    rel.ok.push({ rot, enunNovo: (e ? e + ' ' : '') + cabeca, altNova: resto,
                  de: A.length, para: resto.length, irmas: Math.round(media) });
    q.enunciado = (e ? e + ' ' : '') + cabeca;
    alts.A = resto;
    return true;
  }
  rel.recusadas.push({ rot, A: A.slice(0, 80), tam: A.length, irmas: Math.round(media),
                       cortes: cortes.length });
  return false;
}

// --- banco oficial -----------------------------------------------------
const pB = path.join(ROOT, 'dados', '_banco_oficial.json');
const banco = JSON.parse(fs.readFileSync(pB, 'utf8'));
for (const ed of Object.keys(banco))
  for (const n of Object.keys(banco[ed])) separar(ed + '-Q' + n, banco[ed][n]);

// --- raw ---------------------------------------------------------------
const RAW = path.join(ROOT, 'dados', 'raw');
const tocados = [];
for (const f of fs.readdirSync(RAW).filter(f => /^\d{4}\.\d\.json$/.test(f))) {
  const p = path.join(RAW, f);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  let mudou = false;
  for (const q of (d.questoes || d)) if (separar(q.id, q)) mudou = true;
  if (mudou) tocados.push({ p, d });
}

// --- relatorio ---------------------------------------------------------
console.log('separadas : ' + rel.ok.length);
console.log('recusadas : ' + rel.recusadas.length + '  (corte nao encontrado ou implausivel)\n');

for (const r of rel.ok.slice(0, 10)) {
  console.log('  ' + r.rot + '   A: ' + r.de + ' -> ' + r.para + ' car. (irmas ~' + r.irmas + ')');
  console.log('     enunciado: ' + r.enunNovo.slice(0, 95) + '...');
  console.log('     alt A    : ' + r.altNova.slice(0, 95));
}
if (rel.recusadas.length) {
  console.log('\n--- recusadas (ficaram como estavam) ---');
  for (const r of rel.recusadas)
    console.log('  ' + r.rot + '  A=' + r.tam + ' car., irmas ~' + r.irmas +
                ', ' + r.cortes + ' candidatos  «' + r.A + '»');
}

if (!APLICAR) { console.log('\n(simulacao — rode com --aplicar para gravar)'); process.exit(0); }

fs.writeFileSync(pB, JSON.stringify(banco, null, 1), 'utf8');
for (const t of tocados) fs.writeFileSync(t.p, JSON.stringify(t.d, null, 1), 'utf8');
console.log('\ngravado: _banco_oficial.json + ' + tocados.length + ' arquivos raw');
