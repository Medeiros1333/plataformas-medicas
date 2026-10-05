#!/usr/bin/env node
// Hace SIMÉTRICA la correlación fármaco <-> patógeno en los archivos fuente de data/.
// Si un patógeno cita a un fármaco (o al revés) y el otro no lo cita de vuelta, añade el enlace que falta.
// Es idempotente: ejecutarlo dos veces no cambia nada. Trabajo puramente mecánico → script, no modelo.
// Uso: node scripts/sincronizar-correlacion.js [--dry]

const fs = require('fs');
const path = require('path');
const { DATA } = require('./lib-fichas');

const DRY = process.argv.includes('--dry');

function cargarArchivos(sub) {
  const dir = path.join(DATA, sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => {
    const ruta = path.join(dir, f);
    return { sub, nombre: f, ruta, fichas: JSON.parse(fs.readFileSync(ruta, 'utf8')) };
  });
}

const archivosFarmaco = [...cargarArchivos('farmacos'), ...cargarArchivos('pediatria')];
const archivosMicro = cargarArchivos('microbiologia');

const farmacos = new Map(); // id -> ficha
const patogenos = new Map();
for (const a of archivosFarmaco) for (const f of a.fichas) farmacos.set(f.id, f);
for (const a of archivosMicro) for (const p of a.fichas) patogenos.set(p.id, p);

let añadidosAFarmaco = 0;
let añadidosAPatogeno = 0;
const detalles = [];

// patógeno -> fármaco: si el patógeno lo cita, el fármaco debe citarlo de vuelta
for (const p of patogenos.values()) {
  for (const fid of p.farmacos_relacionados || []) {
    const f = farmacos.get(fid);
    if (!f) continue; // referencia rota: la reporta el validador, aquí no se inventa nada
    if (!Array.isArray(f.micro_relacionado)) f.micro_relacionado = [];
    if (!f.micro_relacionado.includes(p.id)) {
      f.micro_relacionado.push(p.id);
      añadidosAFarmaco++;
      detalles.push(`  + ${f.id}.micro_relacionado += ${p.id}`);
    }
  }
}

// fármaco -> patógeno: simétrico
for (const f of farmacos.values()) {
  for (const pid of f.micro_relacionado || []) {
    const p = patogenos.get(pid);
    if (!p) continue;
    if (!Array.isArray(p.farmacos_relacionados)) p.farmacos_relacionados = [];
    if (!p.farmacos_relacionados.includes(f.id)) {
      p.farmacos_relacionados.push(f.id);
      añadidosAPatogeno++;
      detalles.push(`  + ${p.id}.farmacos_relacionados += ${f.id}`);
    }
  }
}

// Ordenar las listas para que los diffs sean estables entre ejecuciones
for (const f of farmacos.values()) if (f.micro_relacionado) f.micro_relacionado.sort();
for (const p of patogenos.values()) if (p.farmacos_relacionados) p.farmacos_relacionados.sort();

if (!DRY) {
  for (const a of [...archivosFarmaco, ...archivosMicro]) {
    fs.writeFileSync(a.ruta, JSON.stringify(a.fichas, null, 2) + '\n', 'utf8');
  }
}

console.log('--- Sincronización de correlación ---');
if (detalles.length) detalles.forEach(d => console.log(d));
console.log(`Enlaces añadidos a fichas de fármaco: ${añadidosAFarmaco}`);
console.log(`Enlaces añadidos a fichas de patógeno: ${añadidosAPatogeno}`);
console.log(DRY ? 'Modo --dry: no se ha escrito nada.' : 'Archivos de data/ actualizados.');
