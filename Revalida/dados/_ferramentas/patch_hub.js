const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const P=ROOT+'/hub/revalida_hub.html';
let h=fs.readFileSync(P,'utf8');
const qmeta=fs.readFileSync(ROOT+'/dados/_hub_qmeta.json','utf8');

/* ---------- 1) injeta QMETA logo apos MAPA_STATS ---------- */
if(!/const QMETA =/.test(h)){
  const m=h.match(/const MAPA_STATS = [\s\S]*?;(?=\s*\n)/);
  if(!m) throw new Error('MAPA_STATS nao encontrado');
  h=h.replace(m[0], m[0]+'\nconst QMETA = '+qmeta+';');
} else {
  h=h.replace(/const QMETA = \{[\s\S]*?\};/, 'const QMETA = '+qmeta+';');
}

/* ---------- 2) estado dos filtros + simulado ---------- */
if(!/qFiltros:/.test(h)){
  h=h.replace(
    "ui:{ aba:'hoje', moduloAtual: null, subAbaModulo:'teoria', tema: null },",
    "ui:{ aba:'hoje', moduloAtual: null, subAbaModulo:'teoria', tema: null,\n       qFiltros:{ esp:'', ano:'', dif:'', comp:'', situacao:'', busca:'' } },\n  simulado:null,   // {ids:[], inicio:ts, limiteMin:int, respostas:{id:letra}, encerrado:bool}"
  );
}

/* ---------- 3) helpers de metadados e desempenho ---------- */
const HELPERS = `
/* =================================================================
   QUESTOES: metadados, filtros e desempenho  (aba "Questoes")
================================================================= */
function qm(id){ const m=QMETA[id]; return m? {esp:m[0],ano:m[1],ed:m[2],num:m[3],comp:m[4],dif:m[5],anulada:!!m[6]} : null; }
function todasQuestoes(){
  const out=[];
  Object.entries(CONTEUDO_MODULOS).forEach(([cod,c])=>(c.questoes||[]).forEach(q=>out.push({...q,_codigo:cod})));
  // remove duplicatas (a mesma questao pode estar citada em 2 modulos)
  const vistos=new Set();
  return out.filter(q=>{ if(vistos.has(q.id)) return false; vistos.add(q.id); return true; });
}
const COMP_LABEL={conduta_inicial:'Conduta inicial',diagnostico:'Diagnóstico',epidemiologia:'Epidemiologia',
  etica_gestao:'Ética e gestão',prevencao:'Prevenção',tratamento:'Tratamento'};
const DIF_LABEL={1:'1 — muito fácil',2:'2 — fácil',3:'3 — média',4:'4 — difícil',5:'5 — muito difícil'};

function filtrarQuestoes(lista){
  const f=state.ui.qFiltros;
  return lista.filter(q=>{
    const m=qm(q.id)||{};
    if(f.esp && m.esp!==f.esp) return false;
    if(f.ano && (m.ano+'.'+m.ed)!==f.ano) return false;
    if(f.dif && String(m.dif)!==f.dif) return false;
    if(f.comp && m.comp!==f.comp) return false;
    if(f.situacao){
      const r=state.respostasQuestoes[q.id];
      const naFila=state.erros.some(e=>e.questaoId===q.id);
      if(f.situacao==='nao' && r) return false;
      if(f.situacao==='acertei' && !(r&&r.correta)) return false;
      if(f.situacao==='errei' && !(r&&!r.correta)) return false;
      if(f.situacao==='fila' && !naFila) return false;
    }
    if(f.busca){
      const t=f.busca.toLowerCase();
      const alvo=(q.enunciado+' '+Object.values(q.alternativas||{}).join(' ')+' '+(q.comentario||'')+' '+(m.esp||'')+' '+q.id).toLowerCase();
      if(!alvo.includes(t)) return false;
    }
    return true;
  });
}
function desempenho(lista){
  let resp=0, ok=0;
  lista.forEach(q=>{ const r=state.respostasQuestoes[q.id]; if(r){ resp++; if(r.correta) ok++; } });
  return {total:lista.length, respondidas:resp, acertos:ok, pct: resp? Math.round(100*ok/resp) : null};
}
`;
if(!/function qm\(id\)/.test(h)){
  h=h.replace('function renderQuestaoCard(q){', HELPERS+'\nfunction renderQuestaoCard(q){');
}

/* ---------- 4) acertoEsp real ---------- */
h=h.replace(
  "function acertoEsp(cod){ return null; } // preenchido quando houver registro de simulados",
  `function acertoEsp(cod){
  // 'cod' e' o prefixo do modulo (ex.: 'CAR'); casa pela especialidade da questao via QMETA
  const espDoCod={}; MODULOS.forEach(m=>{ if(m.codigo) espDoCod[m.codigo.split('-')[0]]=m.especialidade; });
  const alvo=espDoCod[cod];
  if(!alvo) return null;
  let resp=0, ok=0;
  Object.entries(state.respostasQuestoes).forEach(([id,r])=>{
    const m=qm(id); if(!m) return;
    if(m.esp!==alvo && !(alvo==='Preventiva'&&m.esp==='Preventiva')) return;
    resp++; if(r.correta) ok++;
  });
  return resp? 100*ok/resp : null;
}`);

fs.writeFileSync(P,h,'utf8');
console.log('etapa 1-4 ok | tamanho:', (h.length/1024).toFixed(0),'KB');
console.log('QMETA presente:', /const QMETA =/.test(h), '| helpers:', /function qm\(id\)/.test(h), '| filtros no state:', /qFiltros:/.test(h));
