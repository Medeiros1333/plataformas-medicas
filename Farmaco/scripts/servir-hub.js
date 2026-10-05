// Servidor estático mínimo para el Hub. No es necesario para usarlo (hub/data.js hace que
// index.html funcione con file://), pero es útil para probarlo en un navegador móvil de la red local.
// Uso: node scripts/servir-hub.js [puerto]

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUERTO = parseInt(process.argv[2], 10) || 8090;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.tsv': 'text/tab-separated-values; charset=utf-8'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/hub/index.html';
  const fullPath = path.join(ROOT, urlPath);

  if (!fullPath.startsWith(ROOT)) { res.writeHead(403); res.end('Prohibido'); return; }

  fs.readFile(fullPath, (err, data) => {
    if (err) { res.writeHead(404); res.end('No encontrado: ' + urlPath); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fullPath)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PUERTO, () => {
  console.log(`Farmaco Hub disponible en http://localhost:${PUERTO}/hub/index.html`);
  console.log('Ctrl+C para detener.');
});
