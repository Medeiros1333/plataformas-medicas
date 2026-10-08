// Clasifica preguntas en troncal -> contenido (subárea) -> tema usando las palabras clave de taxonomia.js.
// 1) puntaje por palabras clave (enunciado y respuesta correcta pesan más que las otras alternativas);
// 2) las que no tienen ninguna coincidencia se asignan por vecinos más parecidos ya clasificados;
// 3) data/clasificacion_manual.json manda sobre todo lo anterior ({ id: "MI-CARDIO-ISQ" } o "MI-CARDIO").

const { AREAS, ORDEN_TRONCALES } = require('./taxonomia');
const { firma, jaccard } = require('./lib-similitud');

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9°\-/.' ]+/g, ' ').replace(/\s+/g, ' ');

// Índice de temas con sus expresiones ya compiladas
const TEMAS = [];
for (const area of ORDEN_TRONCALES) {
  for (const sub of AREAS[area].subareas) {
    for (const t of sub.temas) {
      TEMAS.push({
        area, sub: sub.id, tema: t.id, clave: `${area}-${sub.id}-${t.id}`,
        kws: t.kw.map(k => {
          const entera = k.endsWith('$');
          const base = norm(entera ? k.slice(0, -1) : k).trim();
          return {
            base,
            peso: base.includes(' ') ? 1.5 : 1,
            re: new RegExp('(?:^|[^a-z0-9])' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (entera ? '(?![a-z0-9])' : ''))
          };
        })
      });
    }
  }
}

// Área(s) troncal(es) candidatas según el origen de la pregunta
function areasCandidatas(q) {
  if (ORDEN_TRONCALES.includes(q.area)) return [q.area];
  if (q.area === 'CARDIO') return ['MI'];
  if (q.area === 'TRAUMA') return ['CIR'];
  return ORDEN_TRONCALES;   // EM, MF: se decide por contenido
}

function puntajes(q, candidatas) {
  const correcta = q.alternativas ? q.alternativas[q.respuesta_correcta] : '';
  const otras = q.alternativas ? Object.entries(q.alternativas).filter(([l]) => l !== q.respuesta_correcta).map(([, t]) => t).join(' | ') : '';
  const campos = [[norm(q.enunciado), 2], [norm(correcta), 1.5], [norm(otras), 0.4], [norm(q.explicacion), 0.8]];
  const out = [];
  for (const t of TEMAS) {
    if (!candidatas.includes(t.area)) continue;
    let s = 0;
    for (const k of t.kws) {
      for (const [txt, w] of campos) {
        if (txt && txt.includes(k.base) && k.re.test(txt)) s += w * k.peso;
      }
    }
    if (s > 0) out.push([t, s]);
  }
  return out.sort((a, b) => b[1] - a[1]);
}

function clasificar(preguntas, manual = {}) {
  const res = new Map();
  const sinDatos = [];
  for (const q of preguntas) {
    const cand = areasCandidatas(q);
    const p = puntajes(q, cand);
    if (p.length) {
      // en áreas inciertas (EM, MF) se elige el área por la suma de sus temas, luego el mejor tema de esa área
      let area = p[0][0].area;
      if (cand.length > 1) {
        const porArea = {};
        p.forEach(([t, s]) => { porArea[t.area] = (porArea[t.area] || 0) + s; });
        area = Object.entries(porArea).sort((a, b) => b[1] - a[1])[0][0];
      }
      const mejor = p.find(([t]) => t.area === area)[0];
      res.set(q.id, { area, sub: mejor.sub, tema: mejor.tema, metodo: 'kw', score: +p[0][1].toFixed(1) });
    } else sinDatos.push(q);
  }
  // vecinos más parecidos
  const firmas = new Map(preguntas.map(q => [q.id, firma(q)]));
  const clasificadas = preguntas.filter(q => res.has(q.id));
  for (const q of sinDatos) {
    const cand = areasCandidatas(q);
    const f = firmas.get(q.id);
    const vecinos = clasificadas.filter(o => cand.includes(res.get(o.id).area))
      .map(o => [o, jaccard(f, firmas.get(o.id))]).sort((a, b) => b[1] - a[1]).slice(0, 7);
    const votos = {};
    vecinos.forEach(([o, s]) => { const r = res.get(o.id); const k = `${r.area}|${r.sub}|${r.tema}`; votos[k] = (votos[k] || 0) + s + 0.01; });
    const ganador = Object.entries(votos).sort((a, b) => b[1] - a[1])[0];
    if (ganador) {
      const [area, sub, tema] = ganador[0].split('|');
      res.set(q.id, { area, sub, tema, metodo: 'vecinos', score: 0 });
    } else {
      const area = cand[0];
      res.set(q.id, { area, sub: AREAS[area].subareas[0].id, tema: null, metodo: 'defecto', score: 0 });
    }
  }
  // correcciones manuales
  for (const [id, clave] of Object.entries(manual)) {
    if (!res.has(id) || id.startsWith('_')) continue;
    const [area, sub, tema] = clave.split('-');
    const subObj = AREAS[area] && AREAS[area].subareas.find(s => s.id === sub);
    if (!subObj) { console.warn('Clasificación manual inválida:', id, clave); continue; }
    if (tema && !subObj.temas.some(t => t.id === tema)) { console.warn('Tema manual inválido:', id, clave); continue; }
    res.set(id, { area, sub, tema: tema || (subObj.temas.length === 1 ? subObj.temas[0].id : null), metodo: 'manual', score: 0 });
  }
  return res;
}

module.exports = { clasificar, norm, TEMAS };
