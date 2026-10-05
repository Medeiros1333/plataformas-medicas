// Utilidades compartidas: carga de fichas desde data/ y taxonomías.
// Usado por validar-fichas.js, generar-hub-data.js y exportar-anki.js.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');

const AREAS = {
  CAR: 'Cardiovascular',
  NML: 'Neumología y vía aérea',
  DIG: 'Digestivo y hepatología',
  INF: 'Antiinfecciosos',
  END: 'Endocrinología y metabolismo',
  NEU: 'Neurología',
  PSQ: 'Psiquiatría',
  NFR: 'Nefrología, diuréticos e hidroelectrolítico',
  HEM: 'Hematología y antitrombóticos',
  REU: 'Reumatología, analgesia y antiinflamatorios',
  INM: 'Inmunosupresores, biológicos y vacunas',
  ONC: 'Oncología',
  DER: 'Dermatología',
  GIN: 'Ginecología y obstetricia',
  URG: 'Urgencias, críticos y toxicología',
  ANE: 'Anestesia y sedoanalgesia',
  OFT: 'Oftalmología y ORL'
};

const GRUPOS = {
  BGP: 'Bacterias grampositivas',
  BGN: 'Bacterias gramnegativas',
  ANA: 'Anaerobios',
  MYC: 'Micobacterias',
  ATI: 'Atípicas, intracelulares y espiroquetas',
  VIR: 'Virus',
  HON: 'Hongos',
  PAR: 'Parásitos'
};

function leerDir(sub) {
  const dir = path.join(DATA, sub);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const full = path.join(dir, f);
    let arr;
    try {
      arr = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      throw new Error(`JSON inválido en ${sub}/${f}: ${e.message}`);
    }
    if (!Array.isArray(arr)) throw new Error(`${sub}/${f} debe contener un array de fichas.`);
    for (const ficha of arr) out.push({ ...ficha, _archivo: `${sub}/${f}` });
  }
  return out;
}

function cargarTodo() {
  return {
    farmacos: leerDir('farmacos'),
    pediatria: leerDir('pediatria'),
    microbiologia: leerDir('microbiologia'),
    patologias: leerDir('patologias')
  };
}

module.exports = { ROOT, DATA, AREAS, GRUPOS, cargarTodo, leerDir };
