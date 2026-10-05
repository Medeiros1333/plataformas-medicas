// Reconstrói ordem de leitura correta a partir do texto extraído com `pdftotext -layout`,
// que preserva a posição espacial das duas colunas. Estratégia: por página (separada por
// form-feed \f), cada linha é dividida em coluna esquerda / direita no maior espaçamento
// (>=3 espaços); concatena-se então TODA a coluna esquerda da página, seguida de TODA a
// coluna direita da página, o que reproduz a ordem de leitura humana (col. esq. de cima a
// baixo, depois col. dir.), evitando o embaralhamento visto na extração sem -layout.

const fs = require('fs');

function splitLineColumns(line) {
  // acha o maior "gap" de espaços (>=3) e usa como fronteira
  const re = /( {3,})/g;
  let m, best = null;
  while ((m = re.exec(line)) !== null) {
    if (!best || m[0].length > best[0].length) best = m;
  }
  if (!best) return [line.trim(), ''];
  const left = line.slice(0, best.index).trim();
  const right = line.slice(best.index + best[0].length).trim();
  return [left, right];
}

function reordenarPagina(pageText) {
  const lines = pageText.split('\n');
  const leftLines = [];
  const rightLines = [];
  for (const l of lines) {
    if (!l.trim()) { leftLines.push(''); rightLines.push(''); continue; }
    const [left, right] = splitLineColumns(l);
    leftLines.push(left);
    rightLines.push(right);
  }
  return leftLines.join('\n') + '\n' + rightLines.join('\n');
}

function reordenarDocumento(fullText) {
  const pages = fullText.split('\f');
  return pages.map(reordenarPagina).join('\n');
}

module.exports = { reordenarDocumento, splitLineColumns };

if (require.main === module) {
  const inFile = process.argv[2];
  const outFile = process.argv[3];
  const text = fs.readFileSync(inFile, 'utf8');
  const out = reordenarDocumento(text);
  fs.writeFileSync(outFile, out, 'utf8');
  console.log('escrito:', outFile);
}
