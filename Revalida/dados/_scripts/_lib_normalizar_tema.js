// Lib compartilhada por detectar_duplicatas.js e selecionar_lote.js — normalização de `tema`
// para comparação semântica (bag-of-words sem acento/stopword) e classificação de similaridade.
const STOPWORDS = new Set(['de','do','da','dos','das','em','na','no','nas','nos','e','a','o','as','os',
  'à','ao','aos','para','com','por','um','uma','uns','umas','ou']);

function normalizar(tema) {
  const semAcento = (tema || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .trim();
  const tokens = semAcento.split(/\s+/).filter(t => t && !STOPWORDS.has(t));
  tokens.sort();
  return tokens;
}

function overlapScore(tokA, tokB) {
  if (tokA.length === 0 || tokB.length === 0) return { conteudo: 0, jaccard: 0 };
  const setA = new Set(tokA), setB = new Set(tokB);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  const uniao = new Set([...setA, ...setB]).size;
  return { conteudo: inter / Math.min(setA.size, setB.size), jaccard: inter / uniao };
}

function classificar(score) {
  if (score.conteudo >= 0.85 && score.jaccard >= 0.5) return 'forte';
  if (score.conteudo >= 0.5) return 'possivel';
  return 'nenhuma';
}

module.exports = { normalizar, overlapScore, classificar };
