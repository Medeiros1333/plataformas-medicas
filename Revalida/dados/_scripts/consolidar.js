// Consolida todos os dados/raw/*.json (finais, classificados) em:
//   dados/mapa_mestre.json  (índice compacto por questão)
//   dados/modulos.json      (lista de módulos derivada por especialidade+tema)
// Também imprime um relatório de distribuição por especialidade vs. peso histórico do Guia.

const fs = require('fs');
const path = require('path');
const RAW = path.join(__dirname, '..', 'raw');
const DADOS = path.join(__dirname, '..');

const CODIGO_POR_ESPECIALIDADE = {
  'Pediatria': 'PED', 'Cirurgia': 'CIR', 'Preventiva': 'PREV', 'Obstetrícia': 'OBS',
  'Ginecologia': 'GIN', 'Infectologia': 'INF', 'Gastroenterologia': 'GAS', 'Endocrinologia': 'END',
  'Psiquiatria': 'PSI', 'Cardiologia': 'CAR', 'Nefrologia': 'NEF', 'Neurologia': 'NEU',
  'Hematologia': 'HEM', 'Pneumologia': 'PNE', 'Ortopedia': 'ORT', 'Dermatologia': 'DER',
  'Reumatologia': 'REU', 'Hepatologia': 'HEP', 'Otorrinolaringologia': 'OTO', 'Oftalmologia': 'OFT'
};
const TIER_POR_ESPECIALIDADE = {
  'Pediatria': 'A', 'Cirurgia': 'A', 'Preventiva': 'A', 'Obstetrícia': 'A', 'Ginecologia': 'A', 'Infectologia': 'A',
  'Gastroenterologia': 'B', 'Endocrinologia': 'B', 'Psiquiatria': 'B', 'Cardiologia': 'B', 'Nefrologia': 'B',
  'Neurologia': 'B', 'Hematologia': 'B', 'Pneumologia': 'B',
  'Ortopedia': 'C', 'Dermatologia': 'C', 'Reumatologia': 'C', 'Hepatologia': 'C', 'Otorrinolaringologia': 'C', 'Oftalmologia': 'C'
};
// peso histórico aproximado (Guia Estatístico INEP 2011-2024, embutido no .MD do projeto)
const PESO_HISTORICO = {
  'Pediatria': 14.13, 'Cirurgia': 13.35, 'Preventiva': 11.08, 'Obstetrícia': 9.92, 'Ginecologia': 9.42, 'Infectologia': 8.81,
  'Gastroenterologia': 4.49, 'Endocrinologia': 4.04, 'Psiquiatria': 3.66, 'Cardiologia': 3.55, 'Nefrologia': 2.71,
  'Neurologia': 2.60, 'Hematologia': 2.33, 'Pneumologia': 2.05,
  'Ortopedia': 1.66, 'Dermatologia': 1.55, 'Reumatologia': 1.50, 'Hepatologia': 1.22, 'Otorrinolaringologia': 1.11, 'Oftalmologia': 0.83
};

function resumo25palavras(texto) {
  const palavras = texto.replace(/\s+/g, ' ').trim().split(' ');
  return palavras.slice(0, 25).join(' ') + (palavras.length > 25 ? '…' : '');
}

function main() {
  const arquivos = fs.readdirSync(RAW).filter(f => /^\d{4}\.\d\.json$/.test(f));
  let todasQuestoes = [];
  const arquivosProcessados = [];
  for (const f of arquivos) {
    const questoes = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
    arquivosProcessados.push({ arquivo: f, n: questoes.length });
    todasQuestoes = todasQuestoes.concat(questoes);
  }

  // carrega códigos JÁ ATRIBUÍDOS em rodadas anteriores (chave: especialidade|||tema) para
  // NUNCA reatribuir o código de um módulo já existente (evita quebrar módulos já gerados/
  // referenciados no Hub). Só grupos novos ganham código novo.
  const modulosAntigoPath = path.join(DADOS, 'modulos.json');
  const codigoFixado = {}; // chave -> {codigo, status_geracao}
  if (fs.existsSync(modulosAntigoPath)) {
    const antigos = JSON.parse(fs.readFileSync(modulosAntigoPath, 'utf8'));
    for (const m of antigos) {
      const chave = m.especialidade + '|||' + m.tema;
      codigoFixado[chave] = { codigo: m.codigo, status_geracao: m.status_geracao || 'nao_gerado' };
    }
  }

  // agrupa por (especialidade_primaria, tema) para formar módulos
  const grupos = {}; // chave: especialidade|tema -> {questoes:[], especialidade, tema}
  for (const q of todasQuestoes) {
    if (!q.especialidade_primaria) continue;
    const chave = q.especialidade_primaria + '|||' + (q.tema || 'Geral');
    if (!grupos[chave]) grupos[chave] = { especialidade: q.especialidade_primaria, tema: q.tema || 'Geral', questoes: [] };
    grupos[chave].questoes.push(q.id);
  }

  // ordena módulos: por especialidade (na ordem de tier/peso), depois por nº de questões desc.
  // Códigos JÁ FIXADOS (de rodadas anteriores) são preservados; só grupos novos recebem código
  // novo, continuando a numeração a partir do maior código já usado naquela especialidade.
  const especialidadesOrdenadas = Object.keys(CODIGO_POR_ESPECIALIDADE).sort((a, b) => PESO_HISTORICO[b] - PESO_HISTORICO[a]);
  const contadorPorEspecialidade = {};
  // inicializa contador com o maior número já usado em códigos fixados, por especialidade
  for (const chave in codigoFixado) {
    const m = codigoFixado[chave].codigo.match(/-(\d+)$/);
    if (m) {
      const prefixo = codigoFixado[chave].codigo.split('-')[0];
      contadorPorEspecialidade[prefixo] = Math.max(contadorPorEspecialidade[prefixo] || 0, parseInt(m[1], 10));
    }
  }
  const modulos = [];
  for (const esp of especialidadesOrdenadas) {
    const gruposDaEsp = Object.values(grupos).filter(g => g.especialidade === esp)
      .sort((a, b) => b.questoes.length - a.questoes.length);
    for (const g of gruposDaEsp) {
      const codigoBase = CODIGO_POR_ESPECIALIDADE[esp];
      const chave = g.especialidade + '|||' + g.tema;
      let codigo, status_geracao;
      if (codigoFixado[chave]) {
        codigo = codigoFixado[chave].codigo;
        status_geracao = codigoFixado[chave].status_geracao;
      } else {
        contadorPorEspecialidade[codigoBase] = (contadorPorEspecialidade[codigoBase] || 0) + 1;
        codigo = `${codigoBase}-${String(contadorPorEspecialidade[codigoBase]).padStart(2, '0')}`;
        status_geracao = 'nao_gerado';
      }
      modulos.push({
        codigo,
        especialidade: esp,
        tema: g.tema,
        tier: TIER_POR_ESPECIALIDADE[esp],
        n_questoes_historicas: g.questoes.length,
        questoes_ids: g.questoes,
        prioridade: null, // preenchido abaixo
        status_geracao
      });
      // grava modulo_destino de volta nas questões
      for (const q of todasQuestoes) if (g.questoes.includes(q.id)) q.modulo_destino = codigo;
    }
  }

  // prioridade 1-5: baseada em tier + volume de questões (heurística simples)
  const maxQ = Math.max(...modulos.map(m => m.n_questoes_historicas));
  for (const m of modulos) {
    const tierScore = { A: 3, B: 2, C: 1 }[m.tier];
    const volScore = m.n_questoes_historicas / maxQ; // 0-1
    const score = tierScore + volScore * 2; // 1-5 aprox
    m.prioridade = Math.max(1, Math.min(5, Math.round(score)));
  }
  modulos.sort((a, b) => b.prioridade - a.prioridade || b.n_questoes_historicas - a.n_questoes_historicas);

  // mapa_mestre: índice compacto
  const mapaMestre = todasQuestoes.map(q => ({
    id: q.id, ano: q.ano, edicao: q.edicao, numero: q.numero,
    enunciado_resumo: resumo25palavras(q.enunciado || ''),
    gabarito_oficial: q.gabarito_oficial, anulada: !!q.anulada,
    especialidade_primaria: q.especialidade_primaria || null,
    especialidade_secundaria: q.especialidade_secundaria || [],
    tema: q.tema || null, assunto: q.assunto || null,
    competencia: q.competencia || null, dificuldade_estimada: q.dificuldade_estimada || null,
    modulo_destino: q.modulo_destino || null,
    status: q.status || 'ok'
  }));

  fs.writeFileSync(path.join(DADOS, 'mapa_mestre.json'), JSON.stringify(mapaMestre, null, 2), 'utf8');
  fs.writeFileSync(path.join(DADOS, 'modulos.json'), JSON.stringify(modulos, null, 2), 'utf8');

  // também resalva os arquivos raw/*.json com modulo_destino preenchido
  let idx = 0;
  for (const f of arquivos) {
    const questoes = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
    for (const q of questoes) {
      const atualizado = todasQuestoes.find(t => t.id === q.id);
      if (atualizado) q.modulo_destino = atualizado.modulo_destino;
    }
    fs.writeFileSync(path.join(RAW, f), JSON.stringify(questoes, null, 2), 'utf8');
  }

  // relatório
  console.log('=== ARQUIVOS PROCESSADOS ===');
  arquivosProcessados.forEach(a => console.log(`  ${a.arquivo}: ${a.n} questões`));
  console.log(`TOTAL: ${todasQuestoes.length} questões, ${modulos.length} módulos derivados\n`);

  console.log('=== DISTRIBUIÇÃO POR ESPECIALIDADE (amostra atual vs. peso histórico do Guia) ===');
  const porEsp = {};
  todasQuestoes.forEach(q => { if (q.especialidade_primaria) porEsp[q.especialidade_primaria] = (porEsp[q.especialidade_primaria] || 0) + 1; });
  const totalClassificadas = Object.values(porEsp).reduce((a, b) => a + b, 0);
  especialidadesOrdenadas.forEach(esp => {
    const n = porEsp[esp] || 0;
    const pctAmostra = totalClassificadas ? (100 * n / totalClassificadas).toFixed(1) : '0.0';
    const pctHist = PESO_HISTORICO[esp].toFixed(1);
    const desvio = (pctAmostra - pctHist).toFixed(1);
    console.log(`  ${esp.padEnd(24)} amostra=${String(n).padStart(3)} (${pctAmostra}%)  histórico=${pctHist}%  desvio=${desvio>0?'+':''}${desvio}pp`);
  });

  console.log('\n=== TOP 15 MÓDULOS POR PRIORIDADE ===');
  modulos.slice(0, 15).forEach(m => console.log(`  ${m.codigo} [Tier ${m.tier}, prio ${m.prioridade}] ${m.tema} (${m.n_questoes_historicas}q)`));

  console.log(`\nsalvo: dados/mapa_mestre.json (${mapaMestre.length} entradas)`);
  console.log(`salvo: dados/modulos.json (${modulos.length} módulos)`);
}

main();
