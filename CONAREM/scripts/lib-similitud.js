// Utilidades para detectar la misma pregunta en distintos bancos (texto con pequeñas diferencias de
// redacción, tildes o puntuación).

function normalizar(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const VACIAS = new Set('de la el en los las un una y o a que es se por con del al para su sus lo como mas cual cuales siguiente siguientes correcto correcta afirmar marque senale'.split(' '));

function tokens(s) {
  return new Set(normalizar(s).split(' ').filter(t => t.length > 2 && !VACIAS.has(t)));
}

function firma(p) {
  return tokens(p.enunciado + ' ' + Object.values(p.alternativas).join(' '));
}

function jaccard(a, b) {
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

// Alternativa de `b` cuyo texto coincide con la alternativa correcta de `a` (las letras pueden variar
// entre filas del examen o entre bancos).
function letraEquivalente(a, b, letraA = a.respuesta_correcta) {
  const textoA = a.alternativas[letraA];
  const exacta = Object.entries(b.alternativas).find(([, t]) => normalizar(t) === normalizar(textoA));
  if (exacta) return exacta[0];
  const ta = tokens(textoA);
  let mejor = null, mejorS = 0;
  for (const [letra, texto] of Object.entries(b.alternativas)) {
    const s = jaccard(ta, tokens(texto));
    if (s > mejorS) { mejorS = s; mejor = letra; }
  }
  return mejorS >= 0.6 ? mejor : null;
}

module.exports = { normalizar, tokens, firma, jaccard, letraEquivalente };
