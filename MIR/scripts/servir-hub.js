// Servidor estático mínimo para el Hub (necesario porque fetch() de JSON no funciona con file://).
// Uso: node scripts/servir-hub.js [puerto]
// Luego abrir http://localhost:PUERTO/hub/index.html

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUERTO = parseInt(process.argv[2], 10) || 8080;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/hub/index.html';
  const fullPath = path.join(ROOT, urlPath);

  if (!fullPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Prohibido');
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('No encontrado: ' + urlPath);
      return;
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PUERTO, () => {
  console.log(`MIR Hub disponible en http://localhost:${PUERTO}/hub/index.html`);
  console.log('Ctrl+C para detener.');
});
