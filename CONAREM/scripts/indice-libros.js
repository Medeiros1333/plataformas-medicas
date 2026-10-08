// Lee el índice (marcadores) de los PDF de los libros de la bibliografía y guarda número de capítulo,
// título y página de inicio en data/privado/indice_libros.json (uso local: el Hub abre el PDF en el capítulo).
// Requiere pdftohtml (poppler). Uso: node scripts/indice-libros.js ["carpeta de los libros"]

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const CARPETA = process.argv[2] ||
  path.join(process.env.USERPROFILE || '', 'OneDrive', 'Área de Trabalho', 'CONAREM', 'Bibliografia_CONAREM', 'Livros');

const LIBROS = {
  HARRISON20: { archivo: 'Harrison_Medicina_Interna_20ed.pdf', titulo: 'Harrison. Medicina Interna, 20ª ed. (portugués)', re: /^(\d+)\.\s+(.+)$/ },
  SCHWARTZ11: { archivo: 'Schwartz_Principios_de_Cirugia_11ed.pdf', titulo: 'Schwartz. Principios de Cirugía, 11ª ed.', re: /^CAP[IÍ]TULO\s+(\d+)_\s*(.+?)(?:\s*\(\d+\))?\.pdf$/i },
  WILLIAMS_OBS26: { archivo: 'Williams_Obstetricia_26ed.pdf', titulo: 'Williams Obstetricia, 26ª ed.', re: /^(\d+)\s+(.+)$/ },
  WILLIAMS_GIN4: { archivo: 'Williams_Gynecology_4ed_EN.pdf', titulo: 'Williams Gynecology, 4th ed. (inglés)', re: /^(\d+)\s+(.+)$/ },
  NELSON22: { archivo: 'Nelson_Pediatrics_22ed_EN.pdf', titulo: 'Nelson Textbook of Pediatrics, 22nd ed. (inglés)', re: /^(\d+)\s+-\s+(.+)$/, partes: /^([IVXL]+)\s+-\s+(.+)$/ },
  JOHNS_HOPKINS6: { archivo: 'Manual_Johns_Hopkins_Gineco_Obstetricia_6ed.pdf', titulo: 'Manual Johns Hopkins de Ginecología y Obstetricia, 6ª ed.', re: /^(\d+)\s+(.+)$/ }
};

const entidades = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const salida = {};
for (const [id, lib] of Object.entries(LIBROS)) {
  const pdf = path.join(CARPETA, lib.archivo);
  if (!fs.existsSync(pdf)) { console.log(`(falta ${lib.archivo})`); continue; }
  const xml = execFileSync('pdftohtml', ['-xml', '-i', '-q', '-f', '1', '-l', '1', '-stdout', pdf], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const items = [...xml.matchAll(/<item page="(\d+)">([\s\S]*?)<\/item>/g)].map(m => ({ pagina: +m[1], texto: entidades(m[2]).replace(/\s+/g, ' ').trim() }));
  const capitulos = [], partes = [];
  const vistos = new Set();
  for (const it of items) {
    let m;
    if (lib.partes && (m = it.texto.match(lib.partes))) { partes.push({ id: m[1], titulo: m[2], pagina: it.pagina }); continue; }
    if ((m = it.texto.match(lib.re)) && !vistos.has(+m[1])) {
      vistos.add(+m[1]);
      capitulos.push({ n: +m[1], titulo: m[2].trim(), pagina: it.pagina });
    }
  }
  capitulos.sort((a, b) => a.n - b.n);
  salida[id] = { archivo: lib.archivo, titulo: lib.titulo, capitulos, partes };
  console.log(`${id}: ${capitulos.length} capítulos${partes.length ? `, ${partes.length} partes` : ''}`);
}
salida._carpeta = CARPETA;
fs.mkdirSync(path.join(RAIZ, 'data', 'privado'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'data', 'privado', 'indice_libros.json'), JSON.stringify(salida, null, 1));
