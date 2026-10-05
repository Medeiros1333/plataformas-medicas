// Verificação cruzada automática: gabarito_oficial ESCRITO em cada _conteudo_<CODIGO>.json
// (gerado por preparar_conteudo_modulo.js a partir do .md) vs. gabarito_oficial BRUTO em
// mapa_mestre.json (fonte, nunca tocada pela redação do módulo).
//
// Isso automatiza um passo que o log (PROCESSO_E_APRENDIZADO.md, erros #23/#29) já mostrou ser
// indispensável e que era feito manualmente/ad hoc ao fim de cada lote — aqui vira 1 comando.
// NÃO decide se o gabarito bruto está certo (isso é a "leitura crítica do raciocínio pedagógico",
// que continua sendo humana/do agente) — só pega erros de TRANSCRIÇÃO própria ao escrever o módulo.
//
// Uso: node verificar_gabaritos.js CODIGO1 CODIGO2 ...
//      (lê dados/_scripts/_conteudo_<CODIGO>.json de cada um; precisa já ter rodado
//       preparar_conteudo_modulo.js antes)

const fs = require('fs');
const path = require('path');
const DADOS = path.join(__dirname, '..');

const codigos = process.argv.slice(2);
if (codigos.length === 0) {
  console.error('Uso: node verificar_gabaritos.js CODIGO1 CODIGO2 ...');
  process.exit(1);
}

const mapaMestre = JSON.parse(fs.readFileSync(path.join(DADOS, 'mapa_mestre.json'), 'utf8'));
const porId = {};
mapaMestre.forEach(q => { porId[q.id] = q; });

let totalQuestoes = 0, totalMismatch = 0, totalNaoEncontrado = 0;
const mismatches = [];

for (const cod of codigos) {
  const arq = path.join(__dirname, `_conteudo_${cod}.json`);
  if (!fs.existsSync(arq)) {
    console.log(`⚠️  ${cod}: _conteudo_${cod}.json não encontrado (rode preparar_conteudo_modulo.js primeiro) — pulando.`);
    continue;
  }
  const conteudo = JSON.parse(fs.readFileSync(arq, 'utf8'))[cod];
  if (!conteudo || !conteudo.questoes) continue;

  for (const q of conteudo.questoes) {
    totalQuestoes++;
    const bruto = porId[q.id];
    if (!bruto) {
      totalNaoEncontrado++;
      console.log(`❓ ${cod} / ${q.id}: não encontrado em mapa_mestre.json (id incorreto/inventado?)`);
      continue;
    }
    // questão anulada não tem gabarito comparável
    if (bruto.anulada || q.anulada) continue;
    // módulo optou por não incluir gabarito interativo (nota de texto corrido) — nada a comparar
    if (!q.gabarito_oficial) continue;

    if (bruto.gabarito_oficial && q.gabarito_oficial !== bruto.gabarito_oficial) {
      totalMismatch++;
      const m = { codigo: cod, id: q.id, escrito: q.gabarito_oficial, bruto: bruto.gabarito_oficial, assunto: bruto.assunto };
      mismatches.push(m);
      console.log(`🔴 ${cod} / ${q.id}: módulo escreveu gabarito "${m.escrito}", banco bruto tem "${m.bruto}" (assunto do banco: "${m.assunto}")`);
    }
  }
}

console.log(`\n=== RESUMO ===`);
console.log(`Questões verificadas: ${totalQuestoes}`);
console.log(`IDs não encontrados no banco: ${totalNaoEncontrado}`);
console.log(`Mismatches gabarito escrito vs. bruto: ${totalMismatch}`);
if (totalMismatch > 0) {
  console.log(`\n⚠️ AÇÃO: para cada mismatch acima, decida se é erro de TRANSCRIÇÃO própria (corrigir o`);
  console.log(`.md antes de publicar, como erro #23/#29) ou se o gabarito bruto é que está errado`);
  console.log(`(nesse caso, o gabarito escrito deve ficar como está, e a questão precisa de nota`);
  console.log(`"🔴 DIVERGÊNCIA" explicando — nunca silenciar a discrepância).`);
  process.exitCode = 1;
} else {
  console.log(`✅ Nenhum mismatch — todos os gabaritos escritos batem com o banco bruto.`);
}
