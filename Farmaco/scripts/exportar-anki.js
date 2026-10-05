#!/usr/bin/env node
// data/**/*.json -> anki/*.tsv (mazos de flashcards atómicas).
// Formato TSV: pregunta \t respuesta \t Mazo::Submazo  (igual que Flashcards_Anki/).
// Principio rector: UNA idea por tarjeta — nunca volcar la ficha entera en una tarjeta.
// Uso: node scripts/exportar-anki.js

const fs = require('fs');
const path = require('path');
const { ROOT, AREAS, GRUPOS, cargarTodo } = require('./lib-fichas');

const OUT = path.join(ROOT, 'anki');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// El TSV de Anki se rompe con tabuladores y saltos de línea dentro de un campo.
// El resaltado **...** de los datos (lo propio de un fármaco frente a su clase) pasa a <b> de Anki.
const limpio = s => String(s == null ? '' : s).replace(/[\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ')
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').trim();

const { farmacos, pediatria, microbiologia, patologias } = cargarTodo();

function tarjetasFarmaco(f, mazoBase) {
  const t = [];
  const n = f.nombre;
  const mazo = `${mazoBase}::${AREAS[f.area] || f.area}`;
  const add = (q, a) => t.push([limpio(q), limpio(a), mazo]);

  add(`¿A qué clase farmacológica pertenece ${n}?`, f.clase + (f.subclase ? ` (${f.subclase})` : ''));
  add(`¿Cuál es el mecanismo de acción de ${n}?`, f.mecanismo);
  for (const v of f.vs_clase || []) {
    add(`¿Qué distingue a ${n} de los demás fármacos de su clase (${f.clase})?`, v);
  }
  if (f.espectro) add(`¿Cuál es el espectro de ${n}?`, f.espectro);

  for (const ind of f.indicaciones || []) {
    add(`¿Cuál es la dosis de ${n} en ${ind.patologia}?`, `${ind.dosis} — ${ind.posologia}, vía ${ind.via}`);
    if (ind.dosis_objetivo) {
      add(`¿A qué objetivo se ajusta la dosis de ${n} en ${ind.patologia}?`, ind.dosis_objetivo);
    }
  }
  if (f.esquema) {
    add(`¿Cuánto dura el tratamiento con ${n}?`, f.esquema.duracion);
    add(`¿Cómo se suspende ${n}?`, f.esquema.fin);
    if (f.esquema.monitorizacion) add(`¿Qué hay que monitorizar durante el tratamiento con ${n}?`, f.esquema.monitorizacion);
  }
  const fc = f.farmacocinetica || {};
  if (fc.vida_media) add(`¿Cuál es la vida media de ${n}?`, fc.vida_media);
  if (fc.ajuste_renal) add(`¿Requiere ${n} ajuste en insuficiencia renal?`, fc.ajuste_renal);
  // Solo las interacciones de gravedad alta merecen tarjeta propia
  for (const it of (fc.interacciones || []).filter(i => i.gravedad === 'alta')) {
    add(`Interacción crítica de ${n} con ${it.con}: ¿qué ocurre y qué se hace?`, `${it.efecto}. Manejo: ${it.manejo}`);
  }
  for (const ea of (f.efectos_adversos || {}).graves || []) {
    add(`Efecto adverso grave de ${n}: ${ea.split(/[:(]/)[0].trim()} — ¿en qué consiste?`, ea);
  }
  for (const c of f.contraindicaciones || []) {
    add(`¿Está contraindicado ${n} en: ${c.split(/[:(]/)[0].trim()}?`, `Sí — ${c}`);
  }
  for (const p of f.perlas || []) {
    add(`Particularidad de ${n} que hay que tener en cuenta:`, p);
  }
  if (f.dosis_pediatrica_base) add(`¿Cuál es la dosis pediátrica de ${n}?`, `${f.dosis_pediatrica_base} (máx.: ${f.dosis_maxima})`);
  if (f.edad_minima) add(`¿A partir de qué edad puede usarse ${n}?`, f.edad_minima);
  if (f.peculiaridad_pediatrica) add(`¿Qué cambia en ${n} en el niño respecto al adulto?`, f.peculiaridad_pediatrica);
  return t;
}

function tarjetasPatogeno(p) {
  const t = [];
  const n = p.nombre;
  const mazo = `Microbiología::${GRUPOS[p.grupo] || p.grupo}`;
  const add = (q, a) => t.push([limpio(q), limpio(a), mazo]);

  add(`¿Cómo se clasifica ${n}?`, p.clasificacion);
  add(`¿Cómo se ve ${n} en la tinción de Gram / morfología?`, p.morfologia_tincion);
  for (const m of p.mecanismo_patogenia || []) add(`Mecanismo de patogenia de ${n}:`, m);
  for (const pt of p.patologias || []) {
    add(`¿Qué clínica produce ${n} en ${pt.cuadro}?`, pt.clinica);
    if (pt.lesiones) add(`¿Qué lesiones/hallazgos caracterizan ${pt.cuadro} por ${n}?`, pt.lesiones);
  }
  for (const c of p.caracteristicas_clave || []) add(`Característica clave de ${n}:`, c);
  if (p.diagnostico) {
    add(`¿Qué muestra se toma para diagnosticar ${n}?`, p.diagnostico.muestra);
    add(`¿Con qué pruebas se diagnostica ${n}?`, (p.diagnostico.pruebas || []).join('; '));
  }
  if (p.tratamiento) {
    add(`¿Cuál es el tratamiento de elección frente a ${n}?`, p.tratamiento.eleccion);
    if (p.tratamiento.alternativas) add(`¿Qué alternativas hay al tratamiento de elección de ${n}?`, p.tratamiento.alternativas);
    add(`¿Cuánto dura el tratamiento de la infección por ${n}?`, p.tratamiento.duracion);
    if (p.tratamiento.resistencias) add(`¿Qué resistencias hay que tener en cuenta en ${n}?`, p.tratamiento.resistencias);
  }
  return t;
}

function tarjetasPatologia(p) {
  const t = [];
  const mazo = `Patologías::${AREAS[p.area] || p.area}`;
  const add = (q, a) => t.push([limpio(q), limpio(a), mazo]);
  for (const e of p.escenarios || []) {
    const ctx = `${p.nombre} — ${e.titulo}${e.poblacion ? ` (${e.poblacion})` : ''}`;
    add(`¿Con qué fármacos se trata: ${ctx}?`, (e.farmacos || []).map(x => x.nombre).join(' · '));
    for (const x of e.farmacos || []) {
      add(`${ctx}: ¿pauta de ${x.nombre}?`, `${x.dosis} ${x.via}, ${x.intervalo}, durante ${x.duracion}${x.nota ? ` — ${x.nota}` : ''}`);
    }
  }
  if (p.objetivo) add(`¿Cuál es el objetivo terapéutico en ${p.nombre}?`, p.objetivo);
  for (const c of p.claves || []) add(`Clave en el tratamiento de ${p.nombre}:`, c);
  return t;
}

const grupos = new Map(); // nombre de archivo -> filas
function acumular(nombreArchivo, filas) {
  if (!grupos.has(nombreArchivo)) grupos.set(nombreArchivo, []);
  grupos.get(nombreArchivo).push(...filas);
}

for (const f of farmacos) acumular(`Farmacoterapia_${f.area}.tsv`, tarjetasFarmaco(f, 'Farmacoterapia'));
for (const f of pediatria) acumular(`Pediatria_${f.area}.tsv`, tarjetasFarmaco(f, 'Farmacoterapia::Pediatría'));
for (const p of microbiologia) acumular(`Microbiologia_${p.grupo}.tsv`, tarjetasPatogeno(p));
for (const p of patologias) acumular(`Patologias_${p.area}.tsv`, tarjetasPatologia(p));

let total = 0;
for (const [archivo, filas] of [...grupos.entries()].sort()) {
  // deduplicar por pregunta+mazo
  const vistas = new Set();
  const unicas = filas.filter(r => {
    const k = r[0] + '||' + r[2];
    if (vistas.has(k) || !r[1]) return false;
    vistas.add(k);
    return true;
  });
  fs.writeFileSync(path.join(OUT, archivo), unicas.map(r => r.join('\t')).join('\n') + '\n', 'utf8');
  console.log(`${archivo}: ${unicas.length} tarjetas`);
  total += unicas.length;
}
console.log(`\nTotal: ${total} tarjetas en ${grupos.size} mazos → anki/`);
console.log('Importar en Anki: Archivo → Importar → seleccionar el .tsv → separador tabulador → 3.ª columna = mazo.');
