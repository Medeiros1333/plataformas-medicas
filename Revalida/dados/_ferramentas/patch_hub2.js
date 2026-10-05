const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const P=ROOT+'/hub/revalida_hub.html';
let h=fs.readFileSync(P,'utf8');
const nova=fs.readFileSync(__dirname+'/nova_aba.js','utf8');

/* ---------- 5) substitui renderQuestoes (ate o comentario de ESTATISTICAS) ---------- */
const ini=h.indexOf('function renderQuestoes(){');
if(ini<0) throw new Error('renderQuestoes nao encontrada');
const marcaFim='/* =================================================================\n   RENDER: ESTATISTICAS';
let fim=h.indexOf(marcaFim, ini);
if(fim<0){ fim=h.indexOf('RENDER: ESTATISTICAS', ini); fim=h.lastIndexOf('/* ===', fim); }
if(fim<0||fim<ini) throw new Error('fim de renderQuestoes nao localizado');
h = h.slice(0,ini) + nova + '\n' + h.slice(fim);

/* ---------- 6) card usa QMETA para a pill de especialidade ---------- */
h = h.replace(
  '<span class="pill pill-status">${q.especialidade_primaria||\'\'}</span>',
  '<span class="pill pill-status">${(qm(q.id)||{}).esp||\'\'}</span>'
);
/* mostra tambem edicao e dificuldade no cabecalho do card */
h = h.replace(
  '<span class="q-id">${q.id}${q.anulada?\' · <span style="color:var(--error)">ANULADA</span>\':\'\'}</span>',
  '<span class="q-id">${q.id}${q.anulada?\' · <span style="color:var(--error)">ANULADA</span>\':\'\'}${(()=>{const m=qm(q.id);return m?` <span class="text-muted">· INEP ${m.ano}.${m.ed} · dif. ${m.dif||\'—\'}</span>`:\'\';})()}</span>'
);

/* ---------- 7) CSS da aba ---------- */
const CSS = `
/* ============ ABA QUESTOES: filtros, resumo e simulado ============ */
.qfiltros{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
.qfiltros select, .qfiltros input[type="search"]{
  background:var(--surface-high); color:var(--text); border:1px solid var(--border);
  border-radius:8px; padding:7px 10px; font-family:inherit; font-size:.86rem; max-width:100%;
}
.qfiltros input[type="search"]{ flex:1 1 260px; min-width:0; }
.qresumo{ display:flex; flex-wrap:wrap; gap:16px; align-items:center; margin-top:12px;
  padding-top:10px; border-top:1px solid var(--border); font-size:.88rem; color:var(--text-secondary); }
.qresumo b{ color:var(--text); }
.sim-launch{ display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between; }
.sim-controls{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.sim-controls label{ font-size:.82rem; color:var(--text-secondary); display:flex; gap:6px; align-items:center; }
.sim-controls input[type="number"]{
  background:var(--surface-high); color:var(--text); border:1px solid var(--border);
  border-radius:8px; padding:6px 8px; font-family:var(--font-mono); font-size:.86rem;
}
.sim-bar{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between;
  position:sticky; top:56px; z-index:10; margin-bottom:12px; }
.sim-bar-right{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.sim-bar-right .mono{ background:var(--surface-high); border:1px solid var(--border);
  border-radius:8px; padding:5px 10px; font-size:.9rem; }
.q-alt-btn.picked{ border-color:var(--accent); background:color-mix(in srgb, var(--accent) 16%, transparent); }
.sim-score{ display:flex; flex-wrap:wrap; gap:24px; align-items:center; }
.sim-big{ display:flex; flex-direction:column; align-items:center; min-width:120px; }
.sim-big b{ font-size:2.6rem; line-height:1; color:var(--accent); }
.sim-big span{ font-size:.78rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em; }
.sim-nums{ display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:8px 20px; flex:1; font-size:.9rem; }
.text-muted{ color:var(--text-muted); }
@media (max-width:640px){
  .qfiltros select, .qfiltros input[type="search"]{ flex:1 1 100%; }
  .sim-launch, .sim-bar{ flex-direction:column; align-items:stretch; }
  .sim-bar{ position:static; }
}
`;
if(!/ABA QUESTOES: filtros/.test(h)){
  const i=h.lastIndexOf('</style>');
  if(i<0) throw new Error('</style> nao encontrado');
  h = h.slice(0,i) + CSS + '\n' + h.slice(i);
}

fs.writeFileSync(P,h,'utf8');
console.log('patch aplicado | tamanho:', (h.length/1024).toFixed(0),'KB');
for(const [nome,re] of [['renderQuestoes',/function renderQuestoes\(\)\{/],['renderSimuladoAtivo',/function renderSimuladoAtivo\(\)/],
  ['renderSimuladoResultado',/function renderSimuladoResultado\(\)/],['CSS',/ABA QUESTOES: filtros/],
  ['pill via QMETA',/\(qm\(q\.id\)\|\|\{\}\)\.esp/],['renderEstatisticas intacta',/function renderEstatisticas\(\)/]])
  console.log((re.test(h)?'  ✓ ':'  ✗ ')+nome);
