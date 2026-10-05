// Lê um módulo .md e extrai teoria_md, pratica_md, resumo_md, flashcards_tsv e questoes[]
// para injetar em CONTEUDO_MODULOS no Hub.
const fs = require('fs');
const path = require('path');

const codigo = process.argv[2];
const arquivo = process.argv[3];
const raw = fs.readFileSync(arquivo, 'utf8');

function secaoPorIndice(headerExato) {
  const linhas = raw.split('\n');
  const startIdx = linhas.findIndex(l => l.trim() === headerExato);
  if (startIdx === -1) return '';
  let endIdx = linhas.length;
  for (let i = startIdx + 1; i < linhas.length; i++) {
    if (/^## \d/.test(linhas[i].trim()) || linhas[i].trim() === '---') { endIdx = i; break; }
  }
  return linhas.slice(startIdx + 1, endIdx).join('\n').trim();
}

const teoria = secaoPorIndice('## 1. TEORIA');
const pratica = secaoPorIndice('## 2. PRÁTICA CLÍNICA REAL');
const resumo = secaoPorIndice('## 5. RESUMO DE FIXAÇÃO (1 página)');

// flashcards: bloco ```...``` dentro da seção 4
const flashRe = /## 4\. FLASHCARDS[\s\S]*?```([\s\S]*?)```/;
const flashMatch = raw.match(flashRe);
const flashcards_tsv = flashMatch ? flashMatch[1].trim() : '';

// questões: parse seção 3 em blocos por "**[INEP AAAA ...]**" no início de linha.
// Âncora em início de linha + ano de 4 dígitos logo após "INEP" para não confundir uma MENÇÃO
// em prosa ao formato (ex.: nota explicando por que uma questão NÃO virou bloco interativo,
// citando literalmente `**[INEP ...]**` como exemplo dentro de crase) com um cabeçalho real.
const secao3Match = raw.match(/## 3\. QUESTÕES DO INEP[\s\S]*?(?=\n## 4\.)/);
const secao3 = secao3Match ? secao3Match[0] : '';
const blocos = secao3.split(/\n(?=\*\*\[INEP\s+\d{4})/).filter(b => /^\*\*\[INEP\s+\d{4}/.test(b));
const questoes = blocos.map(b => {
  const cabecalho = b.split(']**')[0];
  const resto = b.split(']**').slice(1).join(']**');
  const anoM = cabecalho.match(/(\d{4})/);
  const edM = cabecalho.match(/Edição\s*(\d+)/);
  const qM = cabecalho.match(/Questão\s*n?º?\s*(\d+)/i);
  const gabM = resto.match(/\*\*Gabarito oficial:\s*([A-E])\*\*/);
  const anulada = /\*\*Gabarito oficial:\s*ANULADA/i.test(resto) || /ANULADA/i.test(cabecalho) || /QUEST[ÃA]O ANULADA/i.test(resto.split(/\n[A-E]\)/)[0]);
  const altMatches = [...resto.matchAll(/^([A-E])\)\s*(.+)$/gm)];
  const alternativas = {};
  altMatches.forEach(m => { alternativas[m[1]] = m[2].trim(); });
  const enunciadoM = resto.split(/\n[A-E]\)/)[0].trim()
    .replace(/^⚠️\s*\*\*QUEST[ÃA]O ANULADA[^*]*\*\*\s*/i, '').trim();
  const comentarioM = resto.split(/\*\*Por que /).slice(1).map(s => '**Por que ' + s).join('\n\n');
  return {
    id: `INEP${anoM ? anoM[1] : '????'}-${edM ? edM[1] : '1'}-Q${qM ? qM[1].padStart(3, '0') : '000'}`,
    enunciado: enunciadoM.replace(/\[Contexto:.*?\]\s*/, ''),
    alternativas,
    gabarito_oficial: gabM ? gabM[1] : null,
    anulada,
    comentario: comentarioM.trim()
  };
});

console.log(JSON.stringify({ [codigo]: { teoria_md: teoria, pratica_md: pratica, resumo_md: resumo, flashcards_tsv, questoes } }, null, 2));
