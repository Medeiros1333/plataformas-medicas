// auditar_sem_par.js
//
// Os 38 blocos que auditar_modulos.js nao consegue casar caem em dois casos:
//
//   oficial_ausente — o numero declarado no bloco nao existe no caderno
//                     oficial daquela edicao (logo o numero esta errado, e
//                     com ele muito provavelmente o gabarito)
//   sem_par         — o bloco foi escrito a partir de uma extracao corrompida
//                     em que o ENUNCIADO se perdeu; sobrou so a pergunta final
//                     e as alternativas, e a similaridade de texto cheio
//                     despenca para 0,02-0,30
//
// Nos dois casos as ALTERNATIVAS sobreviveram quase intactas. Elas sao uma
// assinatura muito mais estavel que o enunciado: sao curtas, especificas e
// raramente se repetem entre questoes. Este script casa cada bloco orfao
// contra todas as questoes da mesma edicao usando SO as alternativas, e
// relata o numero e o gabarito oficiais do melhor candidato.
//
// So relata. Nada e gravado: a correcao de cada bloco passa por leitura
// humana (uma reatribuicao errada ja custou caro neste projeto).

const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const MODS = path.join(ROOT, 'modulos');

const banco = JSON.parse(fs.readFileSync(path.join(ROOT, 'dados', '_banco_oficial.json'), 'utf8'));
const audit = JSON.parse(fs.readFileSync(path.join(ROOT, 'dados', '_auditoria_modulos.json'), 'utf8'));

// --- similaridade por conjunto de palavras -----------------------------
const PARAR = new Set(('de da do das dos a o as os e ou em no na nos nas um uma' +
  ' para por com sem que se ao aos à às pelo pela e é ser sua seu').split(' '));

function palavras(s) {
  return new Set((s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/).filter(w => w.length > 2 && !PARAR.has(w)));
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

// --- le as alternativas escritas num bloco -----------------------------
const RE_BLOCO = /\*\*\[INEP\s+(\d{4})\s*·\s*Edição\s*(\d)\s*·\s*Questão\s*(\d+)\]\*\*([\s\S]*?)(?=\n\*\*\[INEP|\n## |$)/g;
const RE_ALT = /^([A-E])\)\s*(.+)$/gm;

function altsDoBloco(corpo) {
  // so as alternativas ANTES da linha de gabarito: depois dela vem a
  // secao "Por que as demais estao erradas", que repete as letras
  const corte = corpo.search(/\*\*Gabarito/);
  const area = corte > 0 ? corpo.slice(0, corte) : corpo;
  const out = {};
  let m; RE_ALT.lastIndex = 0;
  while ((m = RE_ALT.exec(area))) out[m[1]] = m[2].trim();
  return out;
}

// --- indexa os blocos problematicos ------------------------------------
const alvo = new Map();   // "arq|ed|num" -> registro da auditoria
for (const r of audit) if (r.st !== 'ok') alvo.set(r.arq + '|' + r.ed + '|' + r.num, r);

const achados = [];

for (const f of fs.readdirSync(MODS).filter(f => f.endsWith('.md'))) {
  const t = fs.readFileSync(path.join(MODS, f), 'utf8');
  let m; RE_BLOCO.lastIndex = 0;
  while ((m = RE_BLOCO.exec(t))) {
    const ed = m[1] + '.' + m[2], num = +m[3], corpo = m[4];
    const reg = alvo.get(f + '|' + ed + '|' + num);
    if (!reg) continue;

    const alts = altsDoBloco(corpo);
    const letras = Object.keys(alts).sort();

    // Assinatura preferencial: as alternativas. Sao curtas, especificas e
    // raramente se repetem entre questoes. Quando a extracao as destruiu
    // (restaram menos de duas, ou viraram "⚠️ VERIFICAR"), cai para o
    // enunciado — menos discriminante, porem melhor que desistir.
    // Descarta so os marcadores de extracao falha. Comprimento nao serve de
    // criterio: "I e II." e "III." sao alternativas legitimas e curtissimas.
    const altsUteis = letras.filter(k =>
      alts[k].length > 2 && !/VERIFICAR|não (foi )?(capturad|recuperad)/i.test(alts[k]));

    const corteG = corpo.search(/\*\*Gabarito/);
    const enunBloco = (corteG > 0 ? corpo.slice(0, corteG) : corpo)
      .replace(/^\*\*\[INEP[^\n]*\n/, '')
      .replace(/⚠️[^\n]*\n/g, '')        // notas de extracao nao sao texto da questao
      .replace(/^[A-E]\)[^\n]*$/gm, '');

    const palAlt = palavras(altsUteis.map(k => alts[k]).join(' '));
    const palEnun = palavras(enunBloco);

    // As alternativas sao a assinatura mais discriminante, mas algumas quase
    // nao tem palavras de conteudo ("I e II.", "III."). Nesses casos o
    // enunciado entra — e quando nem ele basta, os dois juntos.
    let assinatura, via;
    if (altsUteis.length >= 2 && palAlt.size >= 5) { assinatura = palAlt; via = 'alt'; }
    else if (palEnun.size >= 5) { assinatura = palEnun; via = 'enun'; }
    else { assinatura = new Set([...palAlt, ...palEnun]); via = 'ambos'; }

    if (assinatura.size < 3) { achados.push({ f, ed, num, st: reg.st, erro: 'bloco sem texto legivel suficiente' }); continue; }

    // gabarito declarado no bloco
    const lg = (corpo.match(/\*\*Gabarito[^\n]*/) || [''])[0];
    const gabDecl = /anulad/i.test(lg) ? 'ANULADA' : ((lg.match(/:\s*\**([A-E])\b/) || [])[1] || null);

    // casa contra toda a edicao
    const edBanco = banco[ed] || {};
    const cand = [];
    for (const n of Object.keys(edBanco)) {
      const q = edBanco[n];
      const alvoTexto = via === 'alt' ? Object.values(q.alternativas || {}).join(' ')
                      : via === 'enun' ? (q.enunciado || '')
                      : (q.enunciado || '') + ' ' + Object.values(q.alternativas || {}).join(' ');
      const s = jaccard(assinatura, palavras(alvoTexto));
      cand.push({ n: +n, s, gab: q.gabarito_oficial, anulada: q.anulada });
    }
    cand.sort((a, b) => b.s - a.s);
    const top = cand[0], seg = cand[1];

    achados.push({
      f, ed, num, st: reg.st, gabDecl,
      via,
      melhorNum: top ? top.n : null,
      melhorS: top ? +top.s.toFixed(2) : 0,
      melhorGab: top ? (top.anulada ? 'ANULADA' : top.gab) : null,
      margem: top && seg ? +(top.s - seg.s).toFixed(2) : 0,
      numExiste: !!edBanco[num],
    });
  }
}

// --- relatorio ---------------------------------------------------------
achados.sort((a, b) => (b.melhorS || 0) - (a.melhorS || 0));

function classificar(a) {
  if (a.erro) return 'ILEGIVEL';
  if (a.melhorS < 0.35) return 'SEM CANDIDATO';
  if (a.margem < 0.12) return 'AMBIGUO';
  if (a.melhorNum === a.num) return a.gabDecl === a.melhorGab ? 'CONFERE' : 'GABARITO DIVERGE';
  return a.gabDecl === a.melhorGab ? 'SO O NUMERO' : 'NUMERO E GABARITO';
}

const por = {};
for (const a of achados) { const c = classificar(a); (por[c] = por[c] || []).push(a); }

console.log('blocos orfaos analisados: ' + achados.length + '\n');
for (const c of ['NUMERO E GABARITO', 'GABARITO DIVERGE', 'SO O NUMERO', 'CONFERE', 'AMBIGUO', 'SEM CANDIDATO', 'ILEGIVEL']) {
  const g = por[c]; if (!g) continue;
  console.log('== ' + c + '  (' + g.length + ') ==');
  for (const a of g) {
    if (a.erro) { console.log('   ' + a.ed + '-Q' + a.num + '  ' + a.erro + '   ' + a.f); continue; }
    console.log('   ' + a.ed + '-Q' + String(a.num).padStart(3) +
      (a.numExiste ? '' : ' (num inexistente)') +
      '  bloco diz gab ' + (a.gabDecl || '?') +
      '  ->  oficial Q' + a.melhorNum + ' gab ' + (a.melhorGab || '?') +
      '  [sim ' + a.melhorS + ', margem ' + a.margem + ']');
    console.log('        ' + a.f);
  }
  console.log('');
}
console.log('nada foi gravado — conferir cada caso com layout.js antes de corrigir');
