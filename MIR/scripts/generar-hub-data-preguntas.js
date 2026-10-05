// Genera hub/data.js a partir de data/banco_preguntas/*.json (preguntas reales por especialidad->tema,
// según el índice de la bibliografía) y data/calendario_estudio.json.
// Reemplaza el pipeline anterior (basado en modulos/*.md con teoría+flashcards+inéditas): el Hub ahora
// es solo banco de preguntas por tema + calendario de estudio + simulacro.
// Uso: node scripts/generar-hub-data-preguntas.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BANK_DIR = path.join(ROOT, 'data', 'banco_preguntas');
const HUB_DIR = path.join(ROOT, 'hub');

const NOMBRES_ESPECIALIDAD = {
  CAR: 'Cardiología y Cirugía Cardiovascular', DER: 'Dermatología', DIG: 'Digestivo y Cirugía General',
  END: 'Endocrinología', EST: 'Epidemiología y Estadística', GIN: 'Ginecología y Obstetricia',
  HEM: 'Hematología', INF: 'Infecciosas y Microbiología', IMN: 'Inmunología', NEF: 'Nefrología',
  NML: 'Neumología y Cirugía Torácica', NEU: 'Neurología y Neurocirugía', OFT: 'Oftalmología',
  ORL: 'Otorrinolaringología', PED: 'Pediatría', PSQ: 'Psiquiatría', REU: 'Reumatología',
  TRA: 'Traumatología y Cirugía Ortopédica', URO: 'Urología', MISC: 'Miscelánea y Ciencias Básicas',
  ALG: 'Alergología', BIQ: 'Bioquímica', ONC: 'Oncología', URG: 'Urgencias y Cuidados Críticos',
  LEG: 'Medicina Legal'
};

// Agrupación en "troncales" para las pestañas principales del banco (coincide con calendario_estudio.json)
const TRONCAL_DE = {
  CAR: 'Cardiología y Cirugía Cardiovascular', NML: 'Neumología y Cirugía Torácica', DIG: 'Digestivo',
  END: 'Endocrinología', NEF: 'Nefrología', REU: 'Reumatología', INF: 'Infecciosas y Microbiología',
  HEM: 'Hematología', IMN: 'Inmunología', NEU: 'Neurología y Neurocirugía', PSQ: 'Psiquiatría',
  GIN: 'Ginecología y Obstetricia', PED: 'Pediatría', DER: 'Dermatología', OFT: 'Oftalmología',
  ORL: 'Otorrinolaringología', TRA: 'Traumatología y Cirugía Ortopédica', URO: 'Urología',
  EST: 'Epidemiología y Estadística',
  MISC: 'Miscelánea y Ciencias Básicas', ALG: 'Miscelánea y Ciencias Básicas', BIQ: 'Miscelánea y Ciencias Básicas',
  ONC: 'Miscelánea y Ciencias Básicas', URG: 'Miscelánea y Ciencias Básicas', LEG: 'Miscelánea y Ciencias Básicas'
};

const especialidades = [];
const preguntas = [];

const files = fs.readdirSync(BANK_DIR).filter(f => f.endsWith('.json')).sort();
for (const f of files) {
  const code = f.replace('.json', '');
  const d = JSON.parse(fs.readFileSync(path.join(BANK_DIR, f), 'utf8'));
  const nombre = NOMBRES_ESPECIALIDAD[code] || code;

  const grupos = d.temas
    ? d.temas.map(t => ({ numero: t.tema_numero, titulo: t.tema_titulo, preguntas: t.preguntas }))
    : (d.subsecciones || []).map((s, i) => ({ numero: i + 1, titulo: s.subseccion, preguntas: s.preguntas, subcodigo: s.codigo }));

  let nEsp = 0;
  const temasResumen = [];
  for (const g of grupos) {
    temasResumen.push({ numero: g.numero, titulo: g.titulo, n_preguntas: g.preguntas.length });
    for (const q of g.preguntas) {
      nEsp++;
      preguntas.push({
        id: q.id,
        año: q.año,
        numero_pregunta: q.numero_pregunta,
        especialidad: code,
        especialidad_nombre: nombre,
        troncal: TRONCAL_DE[code] || nombre,
        tema_numero: g.numero,
        tema_titulo: g.titulo,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        respuesta_correcta: q.respuesta_correcta,
        imagen_ref: q.imagen_ref || null,
        explicacion: q.explicacion || null,
        revision_incierta: q.revision_incierta || null,
        fuente: q.fuente,
        origen: 'real'
      });
    }
  }

  especialidades.push({
    codigo: code,
    nombre,
    fuente_indice: d.fuente_indice,
    n_preguntas: nEsp,
    temas: temasResumen.sort((a, b) => (a.numero ?? 999) - (b.numero ?? 999))
  });
}

especialidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
preguntas.sort((a, b) => a.especialidad.localeCompare(b.especialidad) || (a.tema_numero ?? 999) - (b.tema_numero ?? 999) || a.año - b.año || a.numero_pregunta - b.numero_pregunta);

// ---------- Calendario de estudio ----------
const calendarioPath = path.join(ROOT, 'data', 'calendario_estudio.json');
const calendario = fs.existsSync(calendarioPath) ? JSON.parse(fs.readFileSync(calendarioPath, 'utf8')) : null;

// ---------- Escribir hub/data.js ----------
const payload = { preguntas, especialidades, calendario };
const js = `// GENERADO AUTOMÁTICAMENTE por scripts/generar-hub-data-preguntas.js — no editar a mano.\nwindow.MIR_HUB_DATA = ${JSON.stringify(payload)};\n`;
fs.writeFileSync(path.join(HUB_DIR, 'data.js'), js);

const conExplicacion = preguntas.filter(p => p.explicacion && p.explicacion.trim().length > 5).length;
console.log('Especialidades:', especialidades.length);
console.log('Preguntas totales:', preguntas.length);
console.log('Con explicación:', conExplicacion, '/ Sin explicación:', preguntas.length - conExplicacion);
console.log('Calendario cargado:', !!calendario, calendario ? `(${calendario.calendario.length} semanas)` : '');
