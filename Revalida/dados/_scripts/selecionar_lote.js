// Seleciona o próximo lote de módulos a gerar: pega os "nao_gerado" de maior prioridade/volume,
// já excluindo automaticamente os que `detectar_duplicatas.js` classificaria como "forte"
// (duplicata quase certa) — substitui a checagem manual "listar tudo e comparar por especialidade"
// que o log descreve repetir a cada lote (erros #53/#54).
//
// Uso: node selecionar_lote.js [N] [--especialidade "Pediatria"] [--tier A]
//   N default = 12

const fs = require('fs');
const path = require('path');
const DADOS = path.join(__dirname, '..');
const { normalizar, overlapScore, classificar } = require('./_lib_normalizar_tema');

function main() {
  const args = process.argv.slice(2);
  const N = parseInt(args.find(a => /^\d+$/.test(a)) || '12', 10);
  const espIdx = args.indexOf('--especialidade');
  const especialidadeFiltro = espIdx !== -1 ? args[espIdx + 1] : null;
  const tierIdx = args.indexOf('--tier');
  const tierFiltro = tierIdx !== -1 ? args[tierIdx + 1] : null;

  const modulos = JSON.parse(fs.readFileSync(path.join(DADOS, 'modulos.json'), 'utf8'));
  const gerados = modulos.filter(m => m.status_geracao === 'gerado').map(m => ({ ...m, tok: normalizar(m.tema) }));
  let candidatos = modulos.filter(m => m.status_geracao === 'nao_gerado');
  if (especialidadeFiltro) candidatos = candidatos.filter(m => m.especialidade === especialidadeFiltro);
  if (tierFiltro) candidatos = candidatos.filter(m => m.tier === tierFiltro);

  candidatos.sort((a, b) => b.prioridade - a.prioridade || b.n_questoes_historicas - a.n_questoes_historicas);

  const selecionados = [];
  const pulados = [];
  // percorre em ordem de prioridade; cada candidato aceito entra também no pool de comparação
  // (para pegar duplicata entre 2 candidatos do MESMO lote, não só contra já "gerado")
  const poolAceitos = [];
  for (const c of candidatos) {
    if (selecionados.length >= N) break;
    const tokC = normalizar(c.tema);
    let piorClasse = 'nenhuma';
    let matchInfo = null;
    for (const g of gerados) {
      const cl = classificar(overlapScore(tokC, g.tok));
      if (cl === 'forte') { piorClasse = 'forte'; matchInfo = { tipo: 'gerado', codigo: g.codigo, tema: g.tema }; break; }
    }
    if (piorClasse !== 'forte') {
      for (const a of poolAceitos) {
        const cl = classificar(overlapScore(tokC, a.tok));
        if (cl === 'forte') { piorClasse = 'forte'; matchInfo = { tipo: 'candidato_ja_selecionado', codigo: a.codigo, tema: a.tema }; break; }
      }
    }
    if (piorClasse === 'forte') {
      pulados.push({ codigo: c.codigo, tema: c.tema, motivo: matchInfo });
      continue;
    }
    selecionados.push(c);
    poolAceitos.push({ ...c, tok: tokC });
  }

  console.log(`=== LOTE SELECIONADO (${selecionados.length}/${N} pedidos) ===`);
  selecionados.forEach(m => console.log(`  ${m.codigo} [${m.especialidade} / Tier ${m.tier}] "${m.tema}" — ${m.n_questoes_historicas}q, prioridade ${m.prioridade}, ids: ${m.questoes_ids.join(', ')}`));

  console.log(`\n=== PULADOS POR DUPLICATA FORTE (${pulados.length}) ===`);
  pulados.forEach(p => console.log(`  ${p.codigo} "${p.tema}" -> ${p.motivo.tipo === 'gerado' ? 'já gerado como' : 'duplicata do candidato'} ${p.motivo.codigo} "${p.motivo.tema}"`));

  fs.writeFileSync(path.join(__dirname, '_lote_selecionado.json'), JSON.stringify({ selecionados, pulados }, null, 2), 'utf8');
  console.log(`\n(salvo em dados/_scripts/_lote_selecionado.json)`);
  console.log(`\nCódigos para extrair questões:\n  node dados/_scripts/extrair_questoes_modulo.js ${selecionados.map(m => m.codigo).join(' ')}`);
}

main();
