// Injeta MODULOS, CRONOGRAMA, MAPA_STATS (se existirem) e um ou mais CONTEUDO_MODULOS no Hub.
// Uso: node injetar_no_hub.js CODIGO1 CODIGO2 ...
// Requer que dados/_scripts/_conteudo_<CODIGO>.json já exista (gerado por preparar_conteudo_modulo.js)
const fs = require('fs');
const path = require('path');
const DADOS = path.join(__dirname, '..');
const HUB = path.join(DADOS, '..', 'hub', 'revalida_hub.html');

const codigos = process.argv.slice(2);
let hub = fs.readFileSync(HUB, 'utf8');

const modulos = JSON.parse(fs.readFileSync(path.join(DADOS, 'modulos.json'), 'utf8'));
const cronograma = JSON.parse(fs.readFileSync(path.join(DADOS, 'cronograma.json'), 'utf8'));
const mapaStats = JSON.parse(fs.readFileSync(path.join(DADOS, '_hub_mapastats.json'), 'utf8'));

// substitui os 3 arrays/objetos de dados (sempre, para refletir qualquer atualização)
hub = hub.replace(/const MODULOS = (\[.*?\]|\[\]);/s, 'const MODULOS = ' + JSON.stringify(modulos) + ';');
hub = hub.replace(/const CRONOGRAMA = (\[.*?\]|\[\]);/s, 'const CRONOGRAMA = ' + JSON.stringify(cronograma) + ';');
hub = hub.replace(/const MAPA_STATS = (\{.*?\}|\{[\s\S]*?\});(?=\s*\n)/, 'const MAPA_STATS = ' + JSON.stringify(mapaStats) + ';');

// carrega o CONTEUDO_MODULOS atual embutido no hub, mescla com os novos códigos, resalva
const atualMatch = hub.match(/const CONTEUDO_MODULOS = (\{[\s\S]*?\});/);
let atual = {};
try { atual = JSON.parse(atualMatch[1]); } catch (e) { atual = {}; }

for (const cod of codigos) {
  const arqConteudo = path.join(__dirname, `_conteudo_${cod}.json`);
  const novo = JSON.parse(fs.readFileSync(arqConteudo, 'utf8'));
  Object.assign(atual, novo);
}

hub = hub.replace(/const CONTEUDO_MODULOS = \{[\s\S]*?\};/, 'const CONTEUDO_MODULOS = ' + JSON.stringify(atual) + ';');

fs.writeFileSync(HUB, hub, 'utf8');
console.log('Hub atualizado com módulos:', Object.keys(atual).join(', '));
console.log('Tamanho do arquivo:', (hub.length / 1024).toFixed(0), 'KB');
