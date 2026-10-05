/* =================================================================
   REVISAO-ESPACADA — persistência automática + revisão das questões erradas
   (injetado por dados/_ferramentas/patch_revisao_espacada.js; roda dentro do IIFE do hub)
   - Tudo que está em `state` (menos simulado e campos _temporarios) é salvo no localStorage.
   - O baralho de revisão (state.srs) espelha o caderno de erros (state.erros): errar uma
     questão a coloca nos dois; tirar da revisão tira do caderno.
   - Agendamento: SM-2 simplificado, o algoritmo clássico do Anki.
================================================================= */
const LOCAL_KEY = 'revalida-hub-v1';
const SRS_MAX_DIAS = 365;
const NOTA = { DE_NOVO:1, DIFICIL:2, BOM:3, FACIL:4 };
const NOTA_LABEL = {1:'De novo', 2:'Difícil', 3:'Bom', 4:'Fácil'};

function fmtLocal(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function hojeLocal(){ return fmtLocal(new Date()); }
function somarDias(iso,n){ const d=new Date(iso+'T12:00:00'); d.setDate(d.getDate()+n); return fmtLocal(d); }
function fmtIntervalo(d){
  if(d<30) return d+' d';
  if(d<365) return (d/30).toFixed(1).replace('.',',')+' m';
  return (d/365).toFixed(1).replace('.',',')+' a';
}

/* ---------- persistência ---------- */
let _avisoSemSalvar=false, _vindoDeOutraAba=false;
function salvarLocal(){
  if(_vindoDeOutraAba) return;
  try{
    const ui={...state.ui}; delete ui.qFiltros;
    localStorage.setItem(LOCAL_KEY, JSON.stringify({
      versao:1, ...coletarBackup(), ui, tema: document.documentElement.getAttribute('data-theme')
    }));
  }catch(e){
    if(!_avisoSemSalvar){ _avisoSemSalvar=true; toast('⚠️ Não consegui salvar neste navegador — exporte um backup em 💾.'); }
  }
}
function carregarLocal(comUi=true){
  let o=null;
  try{ o=JSON.parse(localStorage.getItem(LOCAL_KEY)||'null'); }catch(e){ return; }
  if(!o) return;
  ['progresso','realces','notas','respostasQuestoes','srs'].forEach(k=>{ if(o[k]) state[k]=o[k]; });
  ['erros','checklistExtra'].forEach(k=>{ if(Array.isArray(o[k])) state[k]=o[k]; });
  if(typeof o.streak==='number') state.streak=o.streak;
  if(typeof o.deslocamentoDias==='number') state.deslocamentoDias=o.deslocamentoDias;
  if(!comUi) return;
  if(o.ui){ ['aba','moduloAtual','subAbaModulo'].forEach(k=>{ if(o.ui[k]!==undefined) state.ui[k]=o.ui[k]; }); }
  if(o.tema) document.documentElement.setAttribute('data-theme',o.tema);
}
// Outra aba do hub salvou: adota o progresso dela, senão esta aba (desatualizada) o sobrescreveria ao fechar.
on(window,'storage',e=>{
  if(e.key!==LOCAL_KEY || !e.newValue || state._rev.ativa) return;
  carregarLocal(false);
  _vindoDeOutraAba=true;
  try{ renderAll(); } finally{ _vindoDeOutraAba=false; }
});

/* ---------- agendamento (SM-2) ---------- */
// "De novo" reinicia o cartão e o traz amanhã; cada acerto multiplica o intervalo pela
// facilidade (começa em 2,5; cai com Difícil/De novo, sobe com Fácil).
function srsCalcular(c,nota){
  let {ivl,ease,reps,lapses}=c;
  if(nota===NOTA.DE_NOVO) return {ivl:1, ease:Math.max(1.3,+(ease-0.2).toFixed(2)), reps:0, lapses:lapses+1};
  if(reps===0) ivl = nota===NOTA.DIFICIL? 2 : nota===NOTA.BOM? 3 : 5;
  else if(nota===NOTA.DIFICIL) ivl=Math.max(ivl+1, Math.round(ivl*1.2));
  else if(nota===NOTA.BOM) ivl=Math.max(ivl+1, Math.round(ivl*ease));
  else ivl=Math.max(ivl+2, Math.round(ivl*ease*1.3));
  if(nota===NOTA.DIFICIL) ease=Math.max(1.3, ease-0.15);
  if(nota===NOTA.FACIL) ease+=0.15;
  return {ivl:Math.min(SRS_MAX_DIAS,ivl), ease:+ease.toFixed(2), reps:reps+1, lapses};
}
function srsAplicar(id,nota){
  const c=state.srs[id]; if(!c) return;
  Object.assign(c, srsCalcular(c,nota));
  c.due=somarDias(hojeLocal(), c.ivl); c.ultimo=hojeLocal();
}
function srsNovo(desde){ return {ivl:0, ease:2.5, reps:0, lapses:0, due:somarDias(desde||hojeLocal(),1), alta:hojeLocal()}; }
// Errou fora da revisão: entra no caderno + baralho; se já estava longe, volta para amanhã.
function srsErrou(id){
  if(!state.erros.some(e=>e.questaoId===id)) state.erros.push({questaoId:id, quando:todayISO()});
  const amanha=somarDias(hojeLocal(),1), c=state.srs[id];
  if(!c) state.srs[id]=srsNovo();
  else if(c.due>amanha){ Object.assign(c, srsCalcular(c,NOTA.DE_NOVO)); c.due=amanha; }
}
// Mantém baralho = caderno de erros (o botão "Marquei errado" e o simulado mexem só em state.erros).
function srsSincronizar(){
  const ids=new Set(state.erros.map(e=>e.questaoId));
  state.erros.forEach(e=>{ if(!state.srs[e.questaoId]) state.srs[e.questaoId]=srsNovo(e.quando); });
  Object.keys(state.srs).forEach(id=>{ if(!ids.has(id)) delete state.srs[id]; });
}
let _qIdx=null;
function questaoPorId(id){ if(!_qIdx){ _qIdx={}; todasQuestoes().forEach(q=>_qIdx[q.id]=q); } return _qIdx[id]; }
function srsPendentes(esp){
  const hoje=hojeLocal();
  return Object.entries(state.srs)
    .filter(([id,c])=>c.due<=hoje && questaoPorId(id) && (!esp || (qm(id)||{}).esp===esp))
    .sort((a,b)=>a[1].due.localeCompare(b[1].due) || Math.random()-0.5)
    .map(([id])=>id);
}
function srsProxLabel(id){
  const c=state.srs[id]; if(!c) return '';
  const d=c.due<=hojeLocal()? 'hoje' : fmtDateBR(c.due).slice(0,5);
  return ' · '+d;
}
function marcarBadgeRevisao(){
  const n=srsPendentes().length;
  if(!n) return;
  $all('[data-tab="revisao"]').forEach(b=>{ b.insertAdjacentHTML('beforeend',` <span class="badge-rev">${n}</span>`); });
}
function bannerRevisao(){
  const n=srsPendentes().length;
  if(!n) return '';
  return `<div class="rev-aviso"><span>🧠 Você tem <b>${n}</b> questã${n===1?'o':'ões'} para revisar hoje.</span>
    <button class="btn btn-accent btn-sm" data-ir-revisao>Revisar agora</button></div>`;
}

/* ---------- aba Revisão ---------- */
function novaSessaoRev(){ return {ativa:false, fila:[], idx:0, escolhida:null, repetidas:[], feitas:0, acertos:0}; }
state._rev = novaSessaoRev();
function renderRevisao(){
  if(state._rev.ativa) return renderCartaoRevisao();
  const hoje=hojeLocal(), pend=srsPendentes();
  const cards=Object.values(state.srs);
  const maduras=cards.filter(c=>c.ivl>=21).length;
  const prox=[]; for(let i=1;i<=7;i++){ const d=somarDias(hoje,i); prox.push({d, n:cards.filter(c=>c.due===d).length}); }
  const maxP=Math.max(1,...prox.map(p=>p.n));
  const porEsp={}; pend.forEach(id=>{ const e=(qm(id)||{}).esp||'—'; porEsp[e]=(porEsp[e]||0)+1; });
  const seguinte=cards.map(c=>c.due).filter(d=>d>hoje).sort()[0];
  const diaSem=iso=>new Date(iso+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short', day:'2-digit'});
  const ultimo=state._revUltima; state._revUltima=null;

  $('#view').innerHTML=`
    ${ultimo? `<div class="rev-aviso"><span>✅ Sessão concluída: <b>${ultimo.acertos}/${ultimo.feitas}</b> acertadas.</span></div>`:''}
    <div class="card" style="margin-bottom:14px;">
      <div class="section-title" style="margin:0 0 6px;">🧠 Revisão espaçada das questões que você errou</div>
      <div class="text-muted" style="font-size:.85rem; max-width:75ch;">Toda questão que você erra (no banco, nos módulos ou no simulado) entra aqui e volta em
        intervalos crescentes, como no Anki: acertou, o intervalo aumenta; errou de novo, volta amanhã.</div>
      <div class="hero-stats">
        <div class="hero-stat"><b>${pend.length}</b><span>para hoje</span></div>
        <div class="hero-stat"><b>${prox[0].n}</b><span>amanhã</span></div>
        <div class="hero-stat"><b>${cards.length}</b><span>no baralho</span></div>
        <div class="hero-stat"><b>${maduras}</b><span>maduras (≥ 21 d)</span></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:14px;">
      ${pend.length? `<div class="rev-iniciar">
          <select id="revEsp"><option value="">Todas as especialidades (${pend.length})</option>
            ${Object.entries(porEsp).sort((a,b)=>b[1]-a[1]).map(([e,n])=>`<option value="${escapeHtml(e)}">${escapeHtml(e)} (${n})</option>`).join('')}
          </select>
          <button class="btn btn-accent" id="revIniciar">▶ Começar revisão</button>
        </div>`
      : `<div class="empty-hint">${cards.length? `✅ Nada para revisar hoje. Próxima revisão: <b>${seguinte? diaSem(seguinte):'—'}</b>.`
          : 'O baralho está vazio. As questões que você errar aparecerão aqui automaticamente.'}</div>`}
    </div>
    ${cards.length? `<div class="card">
      <div class="section-title">📅 Próximos 7 dias</div>
      <div class="rev-previsao">${prox.map(p=>`<div class="lin"><span class="d">${diaSem(p.d)}</span><div class="bar"><div style="width:${100*p.n/maxP}%"></div></div><span class="n mono">${p.n}</span></div>`).join('')}</div>
    </div>`:''}
  `;
  on($('#revIniciar'),'click',()=>{
    const fila=srsPendentes($('#revEsp').value);
    if(!fila.length) return;
    state._rev={...novaSessaoRev(), ativa:true, fila};
    renderAll(); window.scrollTo(0,0);
  });
}
function renderCartaoRevisao(){
  const r=state._rev;
  if(r.idx>=r.fila.length) return encerrarRevisao();
  const id=r.fila[r.idx], q=questaoPorId(id), c=state.srs[id], m=qm(id)||{};
  if(!q){ r.idx++; return renderCartaoRevisao(); }
  const repeticao=r.repetidas.includes(id) && r.fila.indexOf(id)<r.idx;
  const resp=r.escolhida!==null, ok=resp && r.escolhida===q.gabarito_oficial && !q.anulada;
  let pe='';
  if(resp){
    let botoes;
    if(repeticao || !c) botoes=`<button class="btn btn-accent" data-rev-continuar>Continuar ⏎</button>`;
    else if(!ok) botoes=`<div class="rev-nota">Volta <b>amanhã</b> e mais uma vez no fim desta sessão.</div><button class="btn btn-accent" data-rev-continuar>Continuar ⏎</button>`;
    else botoes=[1,2,3,4].map(n=>`<button class="rev-btn rev-${n}" data-rev-nota="${n}"><b>${NOTA_LABEL[n]}</b><span>${fmtIntervalo(srsCalcular(c,n).ivl)} · ${n}</span></button>`).join('');
    pe=`<div class="q-result ${ok?'ok':'fail'}">${ok?'✅ Você acertou.':'❌ Você errou.'} Gabarito oficial: <b>${q.gabarito_oficial||'—'}</b>${q.anulada?' (questão anulada)':''}</div>
      ${q.comentario? `<div class="q-explain">${mdToHtml(q.comentario)}</div>`:''}
      <div class="rev-botoes">${botoes}</div>`;
  }
  $('#view').innerHTML=`
    <div class="rev-topo">
      <span class="mono">Revisão ${Math.min(r.idx+1,r.fila.length)} / ${r.fila.length}${repeticao?' · repetição':''}</span>
      <progress class="bar" value="${r.idx}" max="${r.fila.length}"></progress>
    </div>
    <div class="card q-card">
      <div class="q-head">
        <span class="q-id">${q.id}${m.ano?` <span class="text-muted">· INEP ${m.ano}.${m.ed} · dif. ${m.dif||'—'}</span>`:''}</span>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <span class="pill pill-status">${escapeHtml(m.esp||'')}</span>
          ${c&&c.lapses? `<span class="pill pill-status" style="color:var(--error)">errada ${c.lapses+1}×</span>`:''}
        </div>
      </div>
      <p>${escapeHtml(q.enunciado)}</p>
      <div class="q-alts">
        ${Object.entries(q.alternativas||{}).map(([k,v])=>{
          if(!resp) return `<button class="q-alt q-alt-btn" data-rev-pick="${k}"><b>${k}</b> ${escapeHtml(v)}</button>`;
          const cls= k===q.gabarito_oficial? 'correct' : (k===r.escolhida? 'incorrect':'');
          return `<div class="q-alt ${cls}"><b>${k}</b> ${escapeHtml(v)}${k===r.escolhida?' <span class="q-tag">sua resposta</span>':''}${k===q.gabarito_oficial?' <span class="q-tag">✓ gabarito</span>':''}</div>`;
        }).join('')}
      </div>
      ${pe}
    </div>
    <div class="rev-rodape">
      <button class="btn btn-sm" id="revTirar" title="Tira do baralho e do caderno de erros">Tirar da revisão</button>
      <button class="btn btn-sm" id="revSair">Encerrar sessão</button>
    </div>
    <div class="text-muted" style="font-size:.75rem; margin-top:8px;">Atalhos: A–E responder · 1–4 avaliar · Enter continuar</div>
  `;
  $all('[data-rev-pick]').forEach(b=>on(b,'click',()=>responderRevisao(b.dataset.revPick)));
  $all('[data-rev-nota]').forEach(b=>on(b,'click',()=>avaliarRevisao(+b.dataset.revNota)));
  on($('[data-rev-continuar]'),'click',()=>avaliarRevisao(null));
  on($('#revSair'),'click',encerrarRevisao);
  on($('#revTirar'),'click',()=>{
    if(!confirm('Tirar esta questão da revisão? Ela continua no banco de questões.')) return;
    state.erros=state.erros.filter(e=>e.questaoId!==id); delete state.srs[id];
    r.fila=r.fila.filter((x,i)=>i<r.idx || x!==id); r.escolhida=null;
    renderAll();
  });
}
function responderRevisao(letra){
  const r=state._rev, id=r.fila[r.idx], q=questaoPorId(id);
  const repeticao=r.repetidas.includes(id) && r.fila.indexOf(id)<r.idx;
  r.escolhida=letra;
  if(!repeticao){
    const ok=letra===q.gabarito_oficial && !q.anulada;
    state.respostasQuestoes[id]={escolhida:letra, correta:ok};
    r.feitas++;
    if(ok) r.acertos++;
    else { srsAplicar(id,NOTA.DE_NOVO); r.repetidas.push(id); r.fila.push(id); }
  }
  renderAll();
}
function avaliarRevisao(nota){
  const r=state._rev, id=r.fila[r.idx];
  if(nota===NOTA.DE_NOVO && !r.repetidas.includes(id)){ r.repetidas.push(id); r.fila.push(id); }
  if(nota) srsAplicar(id,nota);
  r.idx++; r.escolhida=null;
  renderAll(); window.scrollTo(0,0);
}
function encerrarRevisao(){
  const r=state._rev;
  if(r.feitas) state._revUltima={feitas:r.feitas, acertos:r.acertos};
  state._rev=novaSessaoRev();
  renderAll();
}
on(document,'keydown',e=>{
  if(state.ui.aba!=='revisao' || !state._rev.ativa) return;
  if(/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
  if($('#cmdkOverlay').classList.contains('open') || $('#ioOverlay').classList.contains('open')) return;
  const k=e.key.toUpperCase(), r=state._rev;
  if(r.escolhida===null){
    const q=questaoPorId(r.fila[r.idx]);
    if(q && q.alternativas && q.alternativas[k]){ e.preventDefault(); responderRevisao(k); }
  } else if(/^[1-4]$/.test(k) && $(`[data-rev-nota="${k}"]`)){ e.preventDefault(); avaliarRevisao(+k); }
  else if(k==='ENTER' && $('[data-rev-continuar]')){ e.preventDefault(); avaliarRevisao(null); }
});
document.addEventListener('click',e=>{
  if(e.target.closest('[data-ir-revisao]')){ state.ui.aba='revisao'; renderAll(); window.scrollTo(0,0); }
});
