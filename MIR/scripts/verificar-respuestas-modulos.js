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
const re = /### MIR-(\d{4})-0*(\d+)[\s\S]*?\*\*Respuesta correcta:\s*([A-E])\*\*/g;

let checked = 0;
let mismatches = 0;

for (const f of files) {
  const text = fs.readFileSync(path.join(modDir, f), 'utf8');
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(text))) {
    const key = `${m[1]}-${parseInt(m[2], 10)}`;
    const shown = m[3];
    const official = lookup[key];
    checked++;
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
