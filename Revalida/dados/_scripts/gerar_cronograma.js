// Gera dados/cronograma.json seguindo as regras do PROMPT 4 do .MD, adaptado para a
// janela real: hoje -> pré-temporada (15/12/2026) -> ciclo principal -> reta final ->
// Revalida 2028.1 (data estimada, ver ⚠️ no relatório).
const fs = require('fs');
const path = require('path');
const DADOS = path.join(__dirname, '..');

const HOJE = new Date('2026-07-29T00:00:00');
const INICIO_CICLO_PRINCIPAL = new Date('2026-12-15T00:00:00');
const DATA_PROVA_ESTIMADA = new Date('2028-04-09T00:00:00'); // ⚠️ VERIFICAR: data real do Revalida 2028.1 ainda não divulgada pelo INEP; estimativa por padrão histórico (edições ".1" costumam ocorrer em março/abril)
const INICIO_RETA_FINAL = addDays(DATA_PROVA_ESTIMADA, -21);

const modulos = JSON.parse(fs.readFileSync(path.join(DADOS, 'modulos.json'), 'utf8'));

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function iso(d) { return d.toISOString().slice(0, 10); }
function diffDays(a, b) { return Math.round((b - a) / 86400000); }
function diaSemana(d) { return d.getDay(); } // 0=dom .. 6=sab

function main() {
  const cronograma = [];

  // ---------- FASE 0: PRÉ-TEMPORADA (hoje -> início do ciclo principal) ----------
  // Sem cronograma diário rígido: um marco semanal para construção do banco de módulos.
  let cursor = new Date(HOJE);
  let semanaPre = 1;
  while (cursor < INICIO_CICLO_PRINCIPAL) {
    if (diaSemana(cursor) === 1) { // toda segunda-feira, um marco de pré-temporada
      cronograma.push({
        data: iso(cursor), dia_n: null, semana: `pré-temporada-${semanaPre}`,
        tipo_dia: 'pre_temporada',
        modulos_novos: [], revisoes: [], flashcards_estimados: 0, simulado: false,
        carga_horaria_min: 60,
        observacao: 'Pré-temporada: construção e revisão do banco de módulos e do mapa mestre. Sem cronograma diário fixo — ritmo livre até 15/12/2026.'
      });
      semanaPre++;
    }
    cursor = addDays(cursor, 1);
  }

  // ---------- FASE 1: CICLO PRINCIPAL ----------
  // ordena módulos por prioridade desc, depois intercalando especialidades diferentes
  const filaModulos = [...modulos].sort((a, b) => b.prioridade - a.prioridade);
  // separa por tier para respeitar proporção A~65% B~26% C~9% dos SLOTS de conteúdo novo
  const porTier = { A: filaModulos.filter(m => m.tier === 'A'), B: filaModulos.filter(m => m.tier === 'B'), C: filaModulos.filter(m => m.tier === 'C') };
  const ordemTier = []; // sequência de letras respeitando proporção 65/26/9
  {
    const totalSlots = 100;
    const seqA = Math.round(totalSlots * 0.65), seqB = Math.round(totalSlots * 0.26), seqC = totalSlots - seqA - seqB;
    let counters = { A: 0, B: 0, C: 0 };
    const alvo = { A: seqA, B: seqB, C: seqC };
    for (let i = 0; i < totalSlots; i++) {
      // escolhe a letra mais "atrasada" em relação à proporção alvo
      const letra = ['A', 'B', 'C'].sort((x, y) => (counters[x] / alvo[x]) - (counters[y] / alvo[y]))[0];
      ordemTier.push(letra);
      counters[letra]++;
    }
  }
  let ponteiroTier = { A: 0, B: 0, C: 0 };
  let ultimaEspecialidade = null;
  function proximoModulo() {
    for (let tent = 0; tent < ordemTier.length * 2; tent++) {
      const letra = ordemTier[(ponteiroTier.A + ponteiroTier.B + ponteiroTier.C) % ordemTier.length];
      const lista = porTier[letra];
      let cand = lista[ponteiroTier[letra] % Math.max(1, lista.length)];
      if (!cand) { ponteiroTier[letra]++; continue; }
      if (cand.especialidade === ultimaEspecialidade && lista.length > 1) {
        // tenta pular pra evitar 2 módulos seguidos da mesma especialidade
        const alt = lista[(ponteiroTier[letra] + 1) % lista.length];
        if (alt && alt.especialidade !== ultimaEspecialidade) cand = alt;
      }
      ponteiroTier[letra]++;
      ultimaEspecialidade = cand.especialidade;
      return cand;
    }
    return null;
  }

  const historicoConclusao = {}; // codigo -> data de estudo (para calcular revisões)
  const revisoesAgendadas = {}; // data-iso -> [strings]

  function agendarRevisoes(codigo, dataEstudo) {
    const offsets = [[1, 'R1'], [7, 'R2'], [21, 'R3'], [60, 'R4']];
    for (const [off, tag] of offsets) {
      const d = iso(addDays(dataEstudo, off));
      revisoesAgendadas[d] = revisoesAgendadas[d] || [];
      if (revisoesAgendadas[d].length < 3) revisoesAgendadas[d].push(`${codigo}:${tag}`);
    }
  }

  cursor = new Date(INICIO_CICLO_PRINCIPAL);
  let diaN = 1;
  let semanaN = 1;
  let diaDaSemanaCiclo = 0; // 0-6 dentro do ciclo de 7 (seg=0)
  let semanasDesdeBuffer = 0;
  let ultimoSimuladoSemana = -1;
  let moduloIdx = 0;
  const totalModulos = modulos.length;

  while (cursor <= DATA_PROVA_ESTIMADA) {
    const emRetaFinal = cursor >= INICIO_RETA_FINAL;
    const diaSemanaISO = (diaSemana(cursor) + 6) % 7; // 0=seg .. 6=dom
    const ehSegunda = diaSemanaISO === 0;
    if (ehSegunda) { semanaN++; semanasDesdeBuffer++; }

    let tipo_dia = 'conteudo_novo';
    let modulosNovos = [];
    let simulado = false;

    const ehSemanaBuffer = semanasDesdeBuffer >= 8 && diaSemanaISO === 6;
    if (ehSemanaBuffer) { tipo_dia = 'semana_tampao'; semanasDesdeBuffer = 0; }
    else if (emRetaFinal) {
      tipo_dia = diaSemanaISO === 6 ? 'simulado' : (diaSemanaISO === 5 ? 'consolidacao' : 'revisao_reta_final');
      simulado = diaSemanaISO === 6;
    } else if (diaSemanaISO === 5) { tipo_dia = 'consolidacao'; }
    else if (diaSemanaISO === 6) {
      tipo_dia = 'leve';
      // simulados: a cada 3 semanas a partir da semana 6; semanal nas últimas 6 semanas do ciclo principal
      const semanasParaProva = diffDays(cursor, DATA_PROVA_ESTIMADA) / 7;
      if (semanaN >= 6 && (semanaN - ultimoSimuladoSemana >= 3)) { simulado = true; tipo_dia = 'simulado'; ultimoSimuladoSemana = semanaN; }
    } else if (moduloIdx < totalModulos) {
      // 2 módulos novos por dia de conteúdo
      const m1 = proximoModulo(); const m2 = proximoModulo();
      if (m1) { modulosNovos.push(m1.codigo); historicoConclusao[m1.codigo] = new Date(cursor); agendarRevisoes(m1.codigo, cursor); moduloIdx++; }
      if (m2) { modulosNovos.push(m2.codigo); historicoConclusao[m2.codigo] = new Date(cursor); agendarRevisoes(m2.codigo, cursor); moduloIdx++; }
      if (!m1 && !m2) tipo_dia = 'revisao_geral';
    } else {
      tipo_dia = 'revisao_geral'; // banco de módulos esgotado, só revisão
    }

    const revisoesHoje = revisoesAgendadas[iso(cursor)] || [];
    const cargaMin = tipo_dia === 'leve' ? 40 : (diaSemanaISO === 6 ? 360 : 210); // ~3-4h dia útil, 6h+ fim de semana (conforme informado pelo usuário)

    cronograma.push({
      data: iso(cursor), dia_n: diaN, semana: semanaN, tipo_dia,
      modulos_novos: modulosNovos, revisoes: revisoesHoje,
      flashcards_estimados: modulosNovos.length * 22,
      simulado,
      carga_horaria_min: cargaMin
    });

    diaN++;
    cursor = addDays(cursor, 1);
  }

  fs.writeFileSync(path.join(DADOS, 'cronograma.json'), JSON.stringify(cronograma, null, 2), 'utf8');
  console.log('dias totais gerados:', cronograma.length);
  console.log('primeiro dia do ciclo principal:', iso(INICIO_CICLO_PRINCIPAL));
  console.log('início da reta final:', iso(INICIO_RETA_FINAL));
  console.log('data da prova (estimada):', iso(DATA_PROVA_ESTIMADA));
  console.log('módulos alocados:', moduloIdx, 'de', totalModulos);
  console.log('salvo: dados/cronograma.json');
}

main();
