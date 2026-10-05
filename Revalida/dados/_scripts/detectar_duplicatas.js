// Detecta duplicatas SEMÂNTICAS de módulo por normalização de `tema` (remove acentos,
// stopwords PT-BR, ordena tokens em "bag of words") comparando GLOBALMENTE (todas as
// especialidades, não só a mesma) — resolve o ponto cego documentado no erro #54
// (PED-45/CAR-02, mesmo tema "Febre reumática" classificado em 2 especialidades diferentes).
//
// Uso:
//   node detectar_duplicatas.js                 -> varre TODOS os "nao_gerado" contra TODOS os "gerado" + entre si
//   node detectar_duplicatas.js CODIGO1 CODIGO2  -> restringe os candidatos checados (mas ainda compara contra TODOS os "gerado")
//
// Saída: relatório em texto. Não decide nada sozinho — sinaliza para revisão humana/agente,
// exatamente como o processo manual já fazia, só que sem depender de eyeballing.

const fs = require('fs');
const path = require('path');
const DADOS = path.join(__dirname, '..');
const { normalizar, overlapScore, classificar } = require('./_lib_normalizar_tema');

function main() {
  const modulos = JSON.parse(fs.readFileSync(path.join(DADOS, 'modulos.json'), 'utf8'));
  const gerados = modulos.filter(m => m.status_geracao === 'gerado');
  const argCodigos = process.argv.slice(2);
  const candidatos = argCodigos.length
    ? modulos.filter(m => argCodigos.includes(m.codigo))
    : modulos.filter(m => m.status_geracao === 'nao_gerado');

  const geradosNorm = gerados.map(m => ({ ...m, tok: normalizar(m.tema) }));

  const fortes = [];   // duplicata quase certa (overlap >= 0.85 ou tokens idênticos)
  const possiveis = []; // overlap 0.5-0.85, revisar manualmente
  const semDuplicata = [];

  for (const c of candidatos) {
    const tokC = normalizar(c.tema);
    let melhor = null;
    for (const g of geradosNorm) {
      const score = overlapScore(tokC, g.tok);
      if (!melhor || score.conteudo > melhor.score.conteudo) melhor = { score, alvo: g };
    }
    // também compara contra outros CANDIDATOS (duplicata nova-nova, não pega ainda em "gerado")
    let melhorEntreCandidatos = null;
    for (const c2 of candidatos) {
      if (c2.codigo === c.codigo) continue;
      const score = overlapScore(tokC, normalizar(c2.tema));
      if (!melhorEntreCandidatos || score.conteudo > melhorEntreCandidatos.score.conteudo) melhorEntreCandidatos = { score, alvo: c2 };
    }

    const entry = {
      codigo: c.codigo, especialidade: c.especialidade, tema: c.tema,
      n_questoes: c.n_questoes_historicas, prioridade: c.prioridade,
      melhorMatchGerado: melhor && melhor.score.conteudo > 0 ? { codigo: melhor.alvo.codigo, tema: melhor.alvo.tema, especialidade: melhor.alvo.especialidade, score: melhor.score.conteudo, classe: classificar(melhor.score) } : null,
      melhorMatchCandidato: melhorEntreCandidatos && melhorEntreCandidatos.score.conteudo > 0 ? { codigo: melhorEntreCandidatos.alvo.codigo, tema: melhorEntreCandidatos.alvo.tema, score: melhorEntreCandidatos.score.conteudo, classe: classificar(melhorEntreCandidatos.score) } : null,
    };

    const classeMax = [entry.melhorMatchGerado, entry.melhorMatchCandidato]
      .filter(Boolean).map(m => m.classe)
      .reduce((acc, c) => (c === 'forte' || acc === 'forte') ? 'forte' : (c === 'possivel' || acc === 'possivel') ? 'possivel' : 'nenhuma', 'nenhuma');
    if (classeMax === 'forte') fortes.push(entry);
    else if (classeMax === 'possivel') possiveis.push(entry);
    else semDuplicata.push(entry);
  }

  console.log(`=== DUPLICATAS FORTES (score >= 0.85) — ${fortes.length} candidato(s) ===`);
  console.log('Ação sugerida: NÃO gerar conteúdo novo. Mesclar dentro do código já "gerado" (ver PROCESSO_E_APRENDIZADO.md §3, padrão erro #53/#54).\n');
  fortes.forEach(e => {
    console.log(`  ${e.codigo} [${e.especialidade}] "${e.tema}" (${e.n_questoes}q)`);
    if (e.melhorMatchGerado) console.log(`    -> GERADO: ${e.melhorMatchGerado.codigo} [${e.melhorMatchGerado.especialidade}] "${e.melhorMatchGerado.tema}" (score ${e.melhorMatchGerado.score.toFixed(2)})`);
    if (e.melhorMatchCandidato) console.log(`    -> CANDIDATO IRMÃO: ${e.melhorMatchCandidato.codigo} "${e.melhorMatchCandidato.tema}" (score ${e.melhorMatchCandidato.score.toFixed(2)})`);
  });

  console.log(`\n=== POSSÍVEIS DUPLICATAS (score 0.5-0.85) — ${possiveis.length} candidato(s) ===`);
  console.log('Ação sugerida: revisar o conteúdo real das questões antes de decidir (pode ser complementar, não duplicado — ver INF-01/INF-04).\n');
  possiveis.forEach(e => {
    console.log(`  ${e.codigo} [${e.especialidade}] "${e.tema}" (${e.n_questoes}q)`);
    if (e.melhorMatchGerado) console.log(`    -> GERADO: ${e.melhorMatchGerado.codigo} [${e.melhorMatchGerado.especialidade}] "${e.melhorMatchGerado.tema}" (score ${e.melhorMatchGerado.score.toFixed(2)})`);
    if (e.melhorMatchCandidato) console.log(`    -> CANDIDATO IRMÃO: ${e.melhorMatchCandidato.codigo} "${e.melhorMatchCandidato.tema}" (score ${e.melhorMatchCandidato.score.toFixed(2)})`);
  });

  console.log(`\n=== SEM DUPLICATA DETECTADA — ${semDuplicata.length} candidato(s) livres para gerar ===`);

  // saída machine-readable também, para outros scripts consumirem (selecionar_lote.js)
  const out = { fortes, possiveis, livres: semDuplicata };
  fs.writeFileSync(path.join(__dirname, '_duplicatas_report.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('\n(relatório completo salvo em dados/_scripts/_duplicatas_report.json)');
}

main();
