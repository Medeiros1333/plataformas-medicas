// Compara la letra "Respuesta correcta" mostrada en cada modulos/*.md contra
// el campo respuesta_correcta oficial en data/preguntas_{año}.json.
// Uso: node scripts/verificar-respuestas-modulos.js
// Detecta bugs de transcripción propios (nunca debe haber discrepancias:
// la clave oficial siempre debe mostrarse tal cual, el razonamiento
// divergente va en una nota aparte, nunca en el campo principal).

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const anos = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const lookup = {};
for (const a of anos) {
  const file = path.join(root, 'data', `preguntas_${a}.json`);
  if (!fs.existsSync(file)) continue;
  const qs = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const q of qs) lookup[`${a}-${q.numero_pregunta}`] = q.respuesta_correcta;
}

const modDir = path.join(root, 'modulos');
const files = fs.readdirSync(modDir).filter((f) => f.endsWith('.md'));
// Cada bloque va desde "### MIR-..." hasta el siguiente encabezado (## o ###), para no "heredar"
// la clave de la pregunta siguiente cuando un bloque no la tiene (p. ej. preguntas anuladas).
const reBloque = /^### MIR-(\d{4})-0*(\d+)[^\n]*\n([\s\S]*?)(?=^##+ |(?![\s\S]))/gm;
const reClave = /\*\*Respuesta correcta:\s*([A-E])\*\*/;

let checked = 0;
let mismatches = 0;

for (const f of files) {
  const text = fs.readFileSync(path.join(modDir, f), 'utf8');
  let m;
  reBloque.lastIndex = 0;
  while ((m = reBloque.exec(text))) {
    const key = `${m[1]}-${parseInt(m[2], 10)}`;
    const official = lookup[key];
    const k = m[3].match(reClave);
    const anulada = /\*\*Pregunta anulada\*\*/.test(m[3]);
    if (!k && !anulada) continue; // bloque sin clave mostrada (referencia en prosa)
    checked++;
    if (anulada) {
      if (official !== null && official !== undefined) {
        console.log(`MISMATCH: MIR-${key} en ${f} -> módulo dice anulada, oficial es ${official}`);
        mismatches++;
      }
      continue;
    }
    const shown = k[1];
    if (official === undefined) {
      console.log(`SIN DATO EN JSON: MIR-${key} en ${f}`);
      continue;
    }
    if (official !== shown) {
      console.log(`MISMATCH: MIR-${key} en ${f} -> módulo muestra ${shown}, oficial es ${official}`);
      mismatches++;
    }
  }
}

console.log(`\nPreguntas verificadas: ${checked}. Discrepancias de transcripción: ${mismatches}.`);
if (mismatches > 0) process.exitCode = 1;
