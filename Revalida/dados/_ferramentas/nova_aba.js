function renderQuestoes(){
  if(state.simulado && !state.simulado.encerrado) return renderSimuladoAtivo();
  if(state.simulado && state.simulado.encerrado) return renderSimuladoResultado();

  const todas = todasQuestoes();
  const lista = filtrarQuestoes(todas);
  const d = desempenho(lista);
  const f = state.ui.qFiltros;

  const especialidades=[...new Set(todas.map(q=>(qm(q.id)||{}).esp).filter(Boolean))].sort();
  const anos=[...new Set(todas.map(q=>{const m=qm(q.id); return m? m.ano+'.'+m.ed : null;}).filter(Boolean))].sort().reverse();
  const comps=[...new Set(todas.map(q=>(qm(q.id)||{}).comp).filter(Boolean))].sort();
  const difs=[...new Set(todas.map(q=>(qm(q.id)||{}).dif).filter(Boolean))].sort();
  const opt=(v,l,sel)=>`<option value="${v}" ${sel===v?'selected':''}>${l}</option>`;

  $('#view').innerHTML = `
    <div class="card" style="margin-bottom:14px;">
      <div class="section-title" style="margin:0 0 10px;">❓ Banco de questões comentadas</div>
      <div class="qfiltros">
        <select id="fEsp" title="Especialidade">${opt('','Todas as especialidades',f.esp)}${especialidades.map(e=>opt(e,e,f.esp)).join('')}</select>
        <select id="fAno" title="Edição da prova">${opt('','Todas as edições',f.ano)}${anos.map(a=>opt(a,'INEP '+a,f.ano)).join('')}</select>
        <select id="fComp" title="Competência cobrada">${opt('','Todas as competências',f.comp)}${comps.map(c=>opt(c,COMP_LABEL[c]||c,f.comp)).join('')}</select>
        <select id="fDif" title="Dificuldade estimada">${opt('','Qualquer dificuldade',f.dif)}${difs.map(x=>opt(String(x),DIF_LABEL[x]||('Nível '+x),f.dif)).join('')}</select>
        <select id="fSit" title="Sua situação nesta questão">
          ${opt('','Todas as situações',f.situacao)}${opt('nao','Ainda não respondidas',f.situacao)}
          ${opt('errei','Que eu errei',f.situacao)}${opt('acertei','Que eu acertei',f.situacao)}
          ${opt('fila','Na fila de erros',f.situacao)}
        </select>
        <input type="search" id="fBusca" placeholder="Buscar palavra-chave no enunciado, alternativas ou comentário…" value="${escapeHtml(f.busca)}">
        <button class="btn btn-sm" id="fLimpar">Limpar</button>
      </div>
      <div class="qresumo">
        <span><b class="mono">${d.total}</b> questõe${d.total===1?'':'s'} no filtro</span>
        <span><b class="mono">${d.respondidas}</b> respondida${d.respondidas===1?'':'s'}</span>
        <span>Acerto: <b class="mono">${d.pct===null?'—':d.pct+'%'}</b>${d.respondidas?` <span class="text-muted">(${d.acertos}/${d.respondidas})</span>`:''}</span>
        ${d.respondidas? `<button class="btn btn-sm" id="fZerar">Zerar respostas do filtro</button>`:''}
      </div>
    </div>

    <div class="card sim-launch" style="margin-bottom:16px;">
      <div>
        <b>🎯 Modo simulado</b>
        <div class="text-muted" style="font-size:.85rem;">Sorteia questões do filtro atual, cronometra e só mostra o gabarito no fim.</div>
      </div>
      <div class="sim-controls">
        <label>Questões <input type="number" id="simN" min="1" max="${Math.max(1,d.total)}" value="${Math.min(20,Math.max(1,d.total))}" style="width:70px"></label>
        <label>Minutos <input type="number" id="simMin" min="1" max="360" value="${Math.min(300,Math.max(1,Math.min(20,d.total)*3))}" style="width:70px"></label>
        <button class="btn btn-accent" id="simIniciar" ${d.total?'':'disabled'}>▶ Iniciar</button>
      </div>
    </div>

    <div id="qList">${lista.length? lista.map(q=>renderQuestaoCard(q)).join('') : `<div class="card empty-hint">Nenhuma questão corresponde a esses filtros.</div>`}</div>
  `;

  function bindErrBtns(){
    $all('[data-err]').forEach(b=>on(b,'click',()=>{
      const qid=b.dataset.err;
      const i=state.erros.findIndex(e=>e.questaoId===qid);
      if(i>-1) state.erros.splice(i,1); else state.erros.push({questaoId:qid, quando:todayISO()});
      renderAll();
    }));
  }
  const set=(k,v)=>{ state.ui.qFiltros[k]=v; renderAll(); };
  on($('#fEsp'),'change',e=>set('esp',e.target.value));
  on($('#fAno'),'change',e=>set('ano',e.target.value));
  on($('#fComp'),'change',e=>set('comp',e.target.value));
  on($('#fDif'),'change',e=>set('dif',e.target.value));
  on($('#fSit'),'change',e=>set('situacao',e.target.value));
  on($('#fLimpar'),'click',()=>{ state.ui.qFiltros={esp:'',ano:'',dif:'',comp:'',situacao:'',busca:''}; renderAll(); });
  on($('#fBusca'),'input',debounce(e=>{
    state.ui.qFiltros.busca=e.target.value;
    const l=filtrarQuestoes(todasQuestoes());
    $('#qList').innerHTML = l.length? l.map(q=>renderQuestaoCard(q)).join('') : `<div class="card empty-hint">Nenhuma questão corresponde a esses filtros.</div>`;
    bindQuestaoCards(document); bindErrBtns();
  },200));
  on($('#fZerar'),'click',()=>{
    lista.forEach(q=>delete state.respostasQuestoes[q.id]);
    toast('Respostas do filtro atual apagadas.'); renderAll();
  });
  on($('#simIniciar'),'click',()=>{
    const n=Math.max(1,Math.min(+$('#simN').value||10, lista.length));
    const min=Math.max(1,+$('#simMin').value||30);
    const sorteadas=lista.slice().sort(()=>Math.random()-0.5).slice(0,n).map(q=>q.id);
    state.simulado={ ids:sorteadas, inicio:Date.now(), limiteMin:min, respostas:{}, encerrado:false };
    renderAll();
  });
  bindErrBtns();
  bindQuestaoCards(document);
}

/* ============ MODO SIMULADO ============ */
function simQuestoes(){
  const idx={}; todasQuestoes().forEach(q=>idx[q.id]=q);
  return state.simulado.ids.map(id=>idx[id]).filter(Boolean);
}
function simTempoRestante(){
  const s=state.simulado;
  return s.limiteMin*60 - Math.floor((Date.now()-s.inicio)/1000);
}
function fmtMMSS(seg){
  const s=Math.max(0,seg);
  return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
}
function renderSimuladoAtivo(){
  const s=state.simulado;
  const qs=simQuestoes();
  const respondidas=Object.keys(s.respostas).length;
  $('#view').innerHTML=`
    <div class="card sim-bar">
      <div><b>🎯 Simulado em andamento</b> <span class="text-muted">· ${qs.length} questões</span></div>
      <div class="sim-bar-right">
        <span class="mono" id="simClock">${fmtMMSS(simTempoRestante())}</span>
        <span class="mono">${respondidas}/${qs.length}</span>
        <button class="btn btn-accent btn-sm" id="simFim">Finalizar</button>
        <button class="btn btn-sm" id="simCancelar">Cancelar</button>
      </div>
    </div>
    <div class="card empty-hint" style="margin-bottom:14px;">O gabarito e os comentários só aparecem ao finalizar. Você pode trocar de resposta até lá.</div>
    ${qs.map((q,i)=>renderQuestaoSimulado(q,i+1)).join('')}
    <div style="display:flex;justify-content:center;margin:18px 0;">
      <button class="btn btn-accent" id="simFim2">Finalizar simulado</button>
    </div>
  `;
  const encerrar=()=>{
    s.encerrado=true; s.fim=Date.now();
    qs.forEach(q=>{ const esc=s.respostas[q.id]; if(esc) state.respostasQuestoes[q.id]={escolhida:esc, correta: esc===q.gabarito_oficial && !q.anulada}; });
    clearInterval(state._simTimer); renderAll();
  };
  on($('#simFim'),'click',encerrar); on($('#simFim2'),'click',encerrar);
  on($('#simCancelar'),'click',()=>{ if(confirm('Cancelar o simulado? As respostas desta rodada serão descartadas.')){ clearInterval(state._simTimer); state.simulado=null; renderAll(); } });
  $all('[data-simpick]').forEach(b=>on(b,'click',()=>{ s.respostas[b.dataset.qid]=b.dataset.simpick; renderAll(); }));
  clearInterval(state._simTimer);
  state._simTimer=setInterval(()=>{
    const el=$('#simClock'); if(!el){ clearInterval(state._simTimer); return; }
    const r=simTempoRestante(); el.textContent=fmtMMSS(r);
    if(r<=0){ clearInterval(state._simTimer); toast('Tempo esgotado — simulado finalizado.'); encerrar(); }
  },1000);
}
function renderQuestaoSimulado(q,ordem){
  const esc=state.simulado.respostas[q.id];
  const m=qm(q.id)||{};
  return `<div class="card q-card">
    <div class="q-head">
      <span class="q-id">${ordem}. ${q.id}</span>
      <span class="pill pill-status">${m.esp||''}</span>
    </div>
    <p>${escapeHtml(q.enunciado)}</p>
    <div class="q-alts">
      ${Object.entries(q.alternativas||{}).map(([k,v])=>`<button class="q-alt q-alt-btn ${esc===k?'picked':''}" data-simpick="${k}" data-qid="${q.id}"><b>${k}</b> ${escapeHtml(v)}</button>`).join('')}
    </div>
  </div>`;
}
function renderSimuladoResultado(){
  const s=state.simulado;
  const qs=simQuestoes();
  let ok=0, err=0, branco=0;
  const porEsp={};
  qs.forEach(q=>{
    const esc=s.respostas[q.id];
    const m=qm(q.id)||{}; const e=m.esp||'—';
    porEsp[e]=porEsp[e]||{t:0,ok:0};
    porEsp[e].t++;
    if(!esc){ branco++; return; }
    if(esc===q.gabarito_oficial && !q.anulada){ ok++; porEsp[e].ok++; } else err++;
  });
  const respondidas=ok+err;
  const pct= respondidas? Math.round(100*ok/respondidas) : 0;
  const mins=Math.round(((s.fim||Date.now())-s.inicio)/60000);
  $('#view').innerHTML=`
    <div class="card" style="margin-bottom:14px;">
      <div class="section-title" style="margin:0 0 10px;">🎯 Resultado do simulado</div>
      <div class="sim-score">
        <div class="sim-big"><b class="mono">${pct}%</b><span>de acerto</span></div>
        <div class="sim-nums">
          <div>✅ Acertos <b class="mono">${ok}</b></div>
          <div>❌ Erros <b class="mono">${err}</b></div>
          <div>⬜ Em branco <b class="mono">${branco}</b></div>
          <div>⏱️ Tempo <b class="mono">${mins} min</b></div>
        </div>
      </div>
      <div class="section-title" style="margin:16px 0 8px;font-size:.9rem;">Desempenho por especialidade</div>
      ${Object.entries(porEsp).sort((a,b)=>b[1].t-a[1].t).map(([e,v])=>{
        const p=Math.round(100*v.ok/v.t);
        return `<div class="chart-row"><span class="lbl">${e}</span>
          <div class="track"><div class="fill" style="width:${p}%;background:${p>=70?'var(--success)':p>=50?'var(--warn)':'var(--error)'};"></div></div>
          <span class="chart-val">${v.ok}/${v.t}</span></div>`;
      }).join('')}
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
        <button class="btn btn-accent btn-sm" id="simErrosFila">Mandar os erros para a fila de erros</button>
        <button class="btn btn-sm" id="simNovo">Novo simulado</button>
        <button class="btn btn-sm" id="simSair">Voltar ao banco</button>
      </div>
    </div>
    <div class="section-title">Revisão questão a questão</div>
    ${qs.map((q,i)=>{
      const esc=s.respostas[q.id];
      const m=qm(q.id)||{};
      const acertou = esc && esc===q.gabarito_oficial && !q.anulada;
      return `<div class="card q-card">
        <div class="q-head">
          <span class="q-id">${i+1}. ${q.id}${q.anulada?' · <span style="color:var(--error)">ANULADA</span>':''}</span>
          <span class="pill pill-status">${m.esp||''}</span>
        </div>
        <p>${escapeHtml(q.enunciado)}</p>
        <div class="q-alts">
          ${Object.entries(q.alternativas||{}).map(([k,v])=>{
            const isC=k===q.gabarito_oficial, isE=k===esc;
            return `<div class="q-alt ${isC?'correct':(isE?'incorrect':'')}"><b>${k}</b> ${escapeHtml(v)}${isE?' <span class="q-tag">sua resposta</span>':''}${isC?' <span class="q-tag">✓ gabarito</span>':''}</div>`;
          }).join('')}
        </div>
        <div class="q-result ${acertou?'ok':'fail'}">${!esc?'⬜ Você deixou em branco.':(acertou?'✅ Você acertou.':'❌ Você errou.')} Gabarito oficial: <b>${q.gabarito_oficial||'—'}</b>${q.anulada?' (anulada — não conta ponto)':''}</div>
        ${q.comentario? `<div class="q-explain">${mdToHtml(q.comentario)}</div>`:''}
      </div>`;
    }).join('')}
  `;
  on($('#simErrosFila'),'click',()=>{
    let n=0;
    qs.forEach(q=>{
      const esc=s.respostas[q.id];
      const errou = !esc || esc!==q.gabarito_oficial;
      if(errou && !q.anulada && !state.erros.some(e=>e.questaoId===q.id)){ state.erros.push({questaoId:q.id,quando:todayISO()}); n++; }
    });
    toast(n? n+' questão(ões) adicionada(s) à fila de erros.' : 'Nada novo para adicionar.');
    renderAll();
  });
  on($('#simNovo'),'click',()=>{ state.simulado=null; renderAll(); });
  on($('#simSair'),'click',()=>{ state.simulado=null; renderAll(); });
}
