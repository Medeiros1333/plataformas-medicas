// Genera data/hub/*.json a partir de data/preguntas_*.json (reales) y modulos/*.md (inéditas + flashcards + metadatos)
// Uso: node scripts/generar-hub-data.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MOD_DIR = path.join(ROOT, 'modulos');
const DATA_DIR = path.join(ROOT, 'data');
const HUB_DIR = path.join(DATA_DIR, 'hub');
const HUB_APP_DIR = path.join(ROOT, 'hub');
if (!fs.existsSync(HUB_DIR)) fs.mkdirSync(HUB_DIR, { recursive: true });

const NOMBRES_ESPECIALIDAD = {
  DIG: 'Digestivo', GIN: 'Ginecología y Obstetricia', NEU: 'Neurología', NML: 'Neumología',
  CAR: 'Cardiología', INF: 'Infecciosas', REU: 'Reumatología', PED: 'Pediatría',
  END: 'Endocrinología', TRA: 'Traumatología', HEM: 'Hematología', PSQ: 'Psiquiatría',
  ONC: 'Oncología', ORL: 'Otorrinolaringología', DER: 'Dermatología', EST: 'Estadística/Metodología',
  GER: 'Geriatría', IMN: 'Inmunología', URO: 'Urología', OFT: 'Oftalmología', URG: 'Urgencias/Cuidados Críticos',
  ANE: 'Anestesiología', GEN: 'Genética', BIE: 'Bioética/Legislación', ALG: 'Alergología',
  MFC: 'Medicina Familiar y Comunitaria', BIQ: 'Bioquímica', PREV: 'Medicina Preventiva',
  FAR: 'Farmacología', ANP: 'Anatomía Patológica', FIS: 'Fisiología', LEG: 'Medicina Legal',
  NFR: 'Nefrología'
};

// ---------- 0. Mapa código corto -> slug completo de archivo (p.ej. "HEM-07" -> "HEM-07_leucemias-agudas") ----------
// El campo modulo_asociado en preguntas_*.json es inconsistente históricamente: a veces guarda el slug
// completo con .md, a veces solo el código corto "XXX-NN". Se normaliza aquí contra los archivos reales.
const modFilesForMap = fs.readdirSync(MOD_DIR).filter(f => f.endsWith('.md'));
const codeToSlug = {};
for (const file of modFilesForMap) {
  const slug = file.replace(/\.md$/, '');
  const code = slug.split('_')[0];
  codeToSlug[code] = slug;
}
function normalizarModulo(valor) {
  if (!valor) return null;
  const limpio = valor.replace(/\.md$/, '');
  if (limpio.includes('_')) return limpio; // ya es slug completo
  return codeToSlug[limpio] || limpio;
}

// ---------- 1. Preguntas reales desde data/preguntas_*.json ----------
const añoFiles = fs.readdirSync(DATA_DIR).filter(f => /^preguntas_\d{4}\.json$/.test(f));
let reales = [];
for (const f of añoFiles) {
  const arr = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
  reales = reales.concat(arr);
}

// Solo preguntas con módulo asociado, clave real (no anuladas, no pendientes) son aptas para el Hub
const realesHub = reales
  .filter(q => q.modulo_asociado && q.respuesta_correcta && !q.anulada && !q.pendiente_verificacion)
  .map(q => ({
    id: q.id,
    origen: 'real',
    especialidad: q.especialidad,
    modulo_asociado: normalizarModulo(q.modulo_asociado),
    enunciado: q.enunciado,
    alternativas: q.alternativas,
    respuesta_correcta: q.respuesta_correcta,
    fuente: q.fuente,
    nota_verificacion: null // se completa más abajo tras parsear los módulos
  }));

// ---------- 2. Inéditas + flashcards + metadatos + notas desde modulos/*.md ----------
const modFiles = fs.readdirSync(MOD_DIR).filter(f => f.endsWith('.md'));
let ineditas = [];
let flashcards = [];
let modulos = [];
const notasReales = {}; // id -> texto de nota de verificación (⚠️), si existe

for (const file of modFiles) {
  const slug = file.replace(/\.md$/, '');
  const especialidad = slug.split('-')[0];
  const raw = fs.readFileSync(path.join(MOD_DIR, file), 'utf8');
  const lines = raw.split('\n');
  const titulo = (lines[0] || '').replace(/^#\s*/, '').trim();

  // --- reales: sección "## 3. Preguntas reales" hasta "## 4." — capturar notas ⚠️ ---
  const idxRealesSec = raw.indexOf('## 3. Preguntas reales');
  const idxInedSec = raw.indexOf('## 4. Preguntas inéditas');
  if (idxRealesSec !== -1 && idxInedSec !== -1) {
    const bloqueReales = raw.slice(idxRealesSec, idxInedSec);
    const partesR = bloqueReales.split(/\n(?=### MIR-\d{4}-\d+)/).slice(1);
    for (const p of partesR) {
      const idMatch = p.match(/^### (MIR-\d{4}-\d+)/);
      if (!idMatch) continue;
      const id = idMatch[1];
      const afterResp = p.split(/\*\*Respuesta correcta:\s*[A-D]\*\*/)[1];
      if (afterResp) {
        const nota = afterResp.split(/\n---/)[0].trim();
        if (nota && nota.includes('⚠️')) {
          notasReales[id] = nota.replace(/^>\s?/gm, '').trim();
        }
      }
    }
  }

  // --- inéditas: sección "## 4. Preguntas inéditas" hasta "## 5." ---
  const idxIned = raw.indexOf('## 4. Preguntas inéditas');
  const idxFlash = raw.indexOf('## 5. Flashcards del módulo');
  const idxRef = raw.indexOf('## 6. Referencias');
  if (idxIned !== -1 && idxFlash !== -1) {
    const bloque = raw.slice(idxIned, idxFlash);
    // cada pregunta inédita empieza con "### <SLUG>-INED-NN"
    const partes = bloque.split(/\n(?=### .*-INED-\d+)/).slice(1);
    for (const p of partes) {
      const idMatch = p.match(/^### (\S+)/);
      const id = idMatch ? idMatch[1] : null;
      if (!id) continue;
      // enunciado: desde después del header hasta la primera línea "A. "
      const optMatch = p.match(/\n([A-D])\.\s?(.+)/g);
      const enunciadoMatch = p.match(/^### \S+\s*\n+([\s\S]*?)\n\n?A\.\s/);
      const enunciado = enunciadoMatch ? enunciadoMatch[1].trim() : null;
      const alt = {};
      const altRegex = /\n([A-D])\.\s?(.+)/g;
      let m;
      while ((m = altRegex.exec(p)) !== null) {
        alt[m[1]] = m[2].trim();
      }
      const respMatch = p.match(/\*\*Respuesta correcta:\s*([A-D])\*\*/);
      const respuesta_correcta = respMatch ? respMatch[1] : null;
      if (!enunciado || Object.keys(alt).length < 2 || !respuesta_correcta) continue;
      const justMatch = p.match(/\*\*Justificación de incorrectas:\*\*\n([\s\S]*?)\n\*\*Origen:\*\*/);
      const justificacion = justMatch ? justMatch[1].trim() : null;
      ineditas.push({
        id,
        origen: 'inedita',
        especialidad,
        modulo_asociado: slug,
        enunciado,
        alternativas: alt,
        respuesta_correcta,
        justificacion
      });
    }
  }

  // --- flashcards: bloque ``` ... ``` dentro de la sección 5 ---
  if (idxFlash !== -1) {
    const finFlash = idxRef !== -1 ? idxRef : raw.length;
    const bloqueFlash = raw.slice(idxFlash, finFlash);
    const codeMatch = bloqueFlash.match(/```([\s\S]*?)```/);
    if (codeMatch) {
      const filas = codeMatch[1].split('\n').map(l => l.trim()).filter(Boolean);
      for (const fila of filas) {
        const cols = fila.split('\t');
        if (cols.length >= 2) {
          flashcards.push({
            modulo_asociado: slug,
            especialidad,
            pregunta: cols[0].trim(),
            respuesta: cols[1].trim(),
            deck: cols[2] ? cols[2].trim() : `MIR::${especialidad}`
          });
        }
      }
    }
  }

  const nReales = realesHub.filter(q => q.modulo_asociado === slug).length;
  const nIned = ineditas.filter(q => q.modulo_asociado === slug).length;
  const nFlash = flashcards.filter(f => f.modulo_asociado === slug).length;

  // --- teoría: todo el contenido desde el título hasta "## 3. Preguntas reales" (resumen clínico + puntos clave) ---
  const idxRealesTeo = raw.indexOf('## 3. Preguntas reales');
  const contenido_md = (idxRealesTeo !== -1 ? raw.slice(0, idxRealesTeo) : raw).trim();

  modulos.push({
    slug,
    especialidad,
    titulo,
    n_reales: nReales,
    n_ineditas: nIned,
    n_flashcards: nFlash,
    contenido_md
  });
}

// completar notas de verificación en preguntas reales
for (const q of realesHub) {
  if (notasReales[q.id]) q.nota_verificacion = notasReales[q.id];
}

// ---------- 3. Especialidades (agregado) ----------
const especialidadesSet = [...new Set(modulos.map(m => m.especialidad))].sort();
const especialidades = especialidadesSet.map(cod => {
  const mods = modulos.filter(m => m.especialidad === cod);
  return {
    codigo: cod,
    nombre: NOMBRES_ESPECIALIDAD[cod] || cod,
    n_modulos: mods.length,
    n_reales: mods.reduce((a, m) => a + m.n_reales, 0),
    n_ineditas: mods.reduce((a, m) => a + m.n_ineditas, 0),
    n_flashcards: mods.reduce((a, m) => a + m.n_flashcards, 0)
  };
});

// ---------- 4. Escribir salidas ----------
fs.writeFileSync(path.join(HUB_DIR, 'preguntas_reales.json'), JSON.stringify(realesHub, null, 2));
fs.writeFileSync(path.join(HUB_DIR, 'preguntas_ineditas.json'), JSON.stringify(ineditas, null, 2));
fs.writeFileSync(path.join(HUB_DIR, 'flashcards.json'), JSON.stringify(flashcards, null, 2));
fs.writeFileSync(path.join(HUB_DIR, 'modulos.json'), JSON.stringify(modulos, null, 2));
fs.writeFileSync(path.join(HUB_DIR, 'especialidades.json'), JSON.stringify(especialidades, null, 2));

// preguntas.json combinado (reales + inéditas) — el banco completo para el Hub
const todas = realesHub.concat(ineditas);
fs.writeFileSync(path.join(HUB_DIR, 'preguntas.json'), JSON.stringify(todas, null, 2));

// ---------- 5. hub/data.js — datos incrustados inline, para que el Hub funcione con file:// sin servidor ----------
// fetch() de JSON local está bloqueado por CORS al abrir el HTML con doble clic (file://). Se evita ese
// problema por completo incrustando los mismos datos como variable global, cargada con un <script> normal
// (nunca bloqueado por CORS). Ver hallazgo #232 en PROCESO_Y_APRENDIZAJE.md.
const dataJs = `// Generado automáticamente por scripts/generar-hub-data.js — NO editar a mano.
window.MIR_HUB_DATA = ${JSON.stringify({ preguntas: todas, flashcards, modulos, especialidades })};
`;
if (fs.existsSync(HUB_APP_DIR)) {
  fs.writeFileSync(path.join(HUB_APP_DIR, 'data.js'), dataJs);
  console.log('hub/data.js generado (' + (dataJs.length / 1024).toFixed(0) + ' KB).');
}

console.log('--- Generación de datos del Hub completa ---');
console.log('Preguntas reales aptas:', realesHub.length);
console.log('Preguntas inéditas parseadas:', ineditas.length);
console.log('Total banco de preguntas:', todas.length);
console.log('Flashcards parseadas:', flashcards.length);
console.log('Módulos:', modulos.length);
console.log('Especialidades:', especialidades.length);

// Aviso de calidad: módulos donde el conteo esperado de inéditas no coincide con headers INED en el texto
let avisos = 0;
for (const file of modFiles) {
  const slug = file.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(MOD_DIR, file), 'utf8');
  const headersInFile = (raw.match(/^### .*-INED-\d+/gm) || []).length;
  const parsed = ineditas.filter(q => q.modulo_asociado === slug).length;
  if (headersInFile !== parsed) {
    console.log(`AVISO: ${slug} — headers INED en archivo: ${headersInFile}, parseadas: ${parsed}`);
    avisos++;
  }
}
console.log('Avisos de parseo incompleto:', avisos);
