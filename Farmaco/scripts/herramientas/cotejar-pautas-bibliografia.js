// Bloque B: cruza cada fila de pauta de las patologías con el texto de Harrison (pt) y Katzung (es).
// Para cada fila: busca el nombre del fármaco en la fuente y, en una ventana de ±450 caracteres,
// la cifra principal de la dosis. Resultado por fila: H (Harrison), K (Katzung), N (nombre sin cifra), 0 (no localizado).
// Uso: node scripts/herramientas/cotejar-pautas-bibliografia.js . <carpeta con harrison.txt y katzung.txt> > informe.json
// (los .txt se obtienen con pdftotext de 01_Bibliografia/ y se guardan FUERA del repositorio: no se publican)
const fs = require('fs'), path = require('path');
const [ROOT, TXT] = process.argv.slice(2);
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const H = norm(fs.readFileSync(path.join(TXT, 'harrison.txt'), 'utf8')).replace(/\s+/g, ' ');
const K = norm(fs.readFileSync(path.join(TXT, 'katzung.txt'), 'utf8')).replace(/\s+/g, ' ');
// variantes pt/es de nombres frecuentes
const PT = { 'acido acetilsalicilico': 'aspirina', 'metamizol': 'dipirona', 'paracetamol': 'acetaminofeno', 'cloxacilina': 'oxacilina', 'enoxaparina': 'enoxaparina', 'noradrenalina': 'norepinefrina', 'adrenalina': 'epinefrina', 'tiamazol': 'metimazol', 'acenocumarol': 'acenocumarol', 'ondansetron': 'ondansetrona', 'omeprazol': 'omeprazol', 'salbutamol': 'albuterol', 'levotiroxina': 'levotiroxina' };
function nombres(fila, ficha) {
  const base = norm(fila.nombre).replace(/\(.*?\)/g, ' ').split(/[+\/,]| o | y /)[0].trim().split(' ').slice(0, 2).join(' ');
  const out = new Set([base, base.split(' ')[0]]);
  if (ficha) out.add(norm(ficha.nombre).replace(/\(.*?\)/g, ' ').trim().split(' ')[0]);
  for (const k of [...out]) if (PT[k]) out.add(PT[k]);
  return [...out].filter(x => x.length >= 4);
}
function cifra(dosis) {
  const m = norm(dosis).match(/(\d+(?:[.,]\d+)?)\s*(mg|g|µg|ug|mcg|ui|u|ml|meq|mmol|%)/);
  if (!m) return null;
  return [m[1].replace('.', ''), m[1].replace(',', '.').replace(/\.0+$/, ''), m[1]];
}
function buscar(T, ns, cf) {
  let nombreHallado = false;
  for (const n of ns) {
    let i = T.indexOf(n), vistos = 0;
    while (i >= 0 && vistos < 400) {
      nombreHallado = true;
      if (cf) {
        const w = T.slice(Math.max(0, i - 450), i + 450);
        if (cf.some(c => new RegExp('(^|[^0-9.,])' + c.replace('.', '[.,]') + '([^0-9]|$)').test(w))) return 2;
      }
      i = T.indexOf(n, i + n.length); vistos++;
    }
  }
  return nombreHallado ? 1 : 0;
}
const fichas = new Map();
for (const d of ['farmacos', 'pediatria']) for (const f of fs.readdirSync(path.join(ROOT, 'data', d))) for (const x of JSON.parse(fs.readFileSync(path.join(ROOT, 'data', d, f)))) fichas.set(x.id, x);
const informe = [];
for (const f of fs.readdirSync(path.join(ROOT, 'data/patologias'))) {
  for (const p of JSON.parse(fs.readFileSync(path.join(ROOT, 'data/patologias', f)))) {
    p.escenarios.forEach((e, i) => e.farmacos.forEach((x, j) => {
      const ns = nombres(x, fichas.get(x.ref)), cf = cifra(x.dosis);
      const h = buscar(H, ns, cf), k = buscar(K, ns, cf);
      const res = h === 2 ? 'H' : k === 2 ? 'K' : (h || k) ? 'N' : '0';
      informe.push({ pat: p.id, archivo: f, esc: i, fila: j, nombre: x.nombre, dosis: x.dosis, via: x.via, intervalo: x.intervalo, duracion: x.duracion, res });
    }));
  }
}
const c = informe.reduce((a, r) => (a[r.res] = (a[r.res] || 0) + 1, a), {});
console.error('Filas:', informe.length, JSON.stringify(c));
process.stdout.write(JSON.stringify(informe));
