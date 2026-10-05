#!/usr/bin/env node
// data/**/*.json -> hub/data.js (datos incrustados como window.FARMACO_HUB_DATA).
// Se incrustan en un .js en lugar de leerse con fetch() para que el Hub funcione abriendo
// index.html con doble clic (file://), donde fetch() de JSON local está bloqueado por CORS.
// Uso: node scripts/generar-hub-data.js

const fs = require('fs');
const path = require('path');
const { ROOT, AREAS, GRUPOS, cargarTodo } = require('./lib-fichas');

const HUB = path.join(ROOT, 'hub');
if (!fs.existsSync(HUB)) fs.mkdirSync(HUB, { recursive: true });

const { farmacos, pediatria, microbiologia, patologias } = cargarTodo();

const limpiar = f => { const c = { ...f }; delete c._archivo; return c; };

const fArr = farmacos.map(limpiar);
const pArr = pediatria.map(limpiar);
const mArr = microbiologia.map(limpiar);
const patArr = patologias.map(limpiar);

// --- índice inverso fármaco -> patologías en las que aparece (para enlazar desde la ficha) ---
const pat_por_farmaco = {};
for (const p of patArr) {
  for (const e of p.escenarios || []) {
    for (const x of e.farmacos || []) {
      if (!x.ref) continue;
      if (!pat_por_farmaco[x.ref]) pat_por_farmaco[x.ref] = [];
      if (!pat_por_farmaco[x.ref].includes(p.id)) pat_por_farmaco[x.ref].push(p.id);
    }
  }
}

// --- agregados por área / grupo, para el panel y los filtros ---
const areas = Object.keys(AREAS)
  .map(cod => ({
    codigo: cod,
    nombre: AREAS[cod],
    n_farmacos: fArr.filter(f => f.area === cod).length,
    n_pediatria: pArr.filter(f => f.area === cod).length,
    clases: [...new Set(fArr.filter(f => f.area === cod).map(f => f.clase))].sort()
  }))
  .filter(a => a.n_farmacos > 0 || a.n_pediatria > 0);

const grupos = Object.keys(GRUPOS)
  .map(cod => ({
    codigo: cod,
    nombre: GRUPOS[cod],
    n_patogenos: mArr.filter(p => p.grupo === cod).length
  }))
  .filter(g => g.n_patogenos > 0);

// --- índice de correlación fármaco <-> patógeno, precalculado ---
const correlacion = {
  por_patogeno: {},
  por_farmaco: {}
};
for (const p of mArr) {
  correlacion.por_patogeno[p.id] = (p.farmacos_relacionados || []).slice();
}
for (const f of [...fArr, ...pArr]) {
  if ((f.micro_relacionado || []).length) correlacion.por_farmaco[f.id] = f.micro_relacionado.slice();
}
// completar la correlación en ambos sentidos aunque una de las dos fichas lo omita
for (const f of [...fArr, ...pArr]) {
  for (const pid of f.micro_relacionado || []) {
    if (!correlacion.por_patogeno[pid]) correlacion.por_patogeno[pid] = [];
    if (!correlacion.por_patogeno[pid].includes(f.id)) correlacion.por_patogeno[pid].push(f.id);
  }
}
for (const p of mArr) {
  for (const fid of p.farmacos_relacionados || []) {
    if (!correlacion.por_farmaco[fid]) correlacion.por_farmaco[fid] = [];
    if (!correlacion.por_farmaco[fid].includes(p.id)) correlacion.por_farmaco[fid].push(p.id);
  }
}

const payload = {
  generado: new Date().toISOString().slice(0, 10),
  farmacos: fArr,
  pediatria: pArr,
  microbiologia: mArr,
  patologias: patArr,
  pat_por_farmaco,
  areas,
  grupos,
  correlacion,
  nombres_area: AREAS,
  nombres_grupo: GRUPOS
};

const js = `// Generado automáticamente por scripts/generar-hub-data.js — NO editar a mano.
window.FARMACO_HUB_DATA = ${JSON.stringify(payload)};
`;
fs.writeFileSync(path.join(HUB, 'data.js'), js);

console.log('--- hub/data.js generado ---');
console.log(`Tamaño: ${(js.length / 1024).toFixed(1)} KB`);
console.log(`Fármacos: ${fArr.length} · Pediatría: ${pArr.length} · Patógenos: ${mArr.length} · Patologías: ${patArr.length}`);
console.log(`Áreas con contenido: ${areas.length} · Grupos micro: ${grupos.length}`);
console.log(`Enlaces de correlación: ${Object.values(correlacion.por_patogeno).reduce((a, b) => a + b.length, 0)}`);
