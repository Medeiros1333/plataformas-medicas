// patch_busca_areas.js — organiza a busca global (Ctrl+K) e o seletor de módulos por ÁREA (prefixo do código:
// CAR, CIR, GIN, PED, INF...), no mesmo espírito do filtro do banco de questões. Idempotente: se o hub já tiver
// o marcador BUSCA-POR-AREA, não faz nada. Rodar depois de reconstruir_hub.js/patch_hub.js se o hub for refeito
// a partir de um modelo antigo (o reconstruir_hub só reinjeta dados, então normalmente basta rodar uma vez).
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const F=process.argv[2]||path.join(R,'hub','revalida_hub.html');let h=fs.readFileSync(F,'utf8');
if(h.includes('BUSCA-POR-AREA')){console.log('ja aplicado');process.exit(0);}
const troca=(a,b,nome)=>{ if(!h.includes(a)) throw new Error('trecho nao encontrado: '+nome); h=h.replace(a,b); };

// 1) CSS
troca('.cmdk-result:hover{background:var(--surface-high);}',
`.cmdk-result:hover{background:var(--surface-high);}
/* BUSCA-POR-AREA */
#cmdkOverlay .modal{max-width:760px; width:100%; min-width:0; max-height:80vh; display:flex; flex-direction:column; padding:14px;}
#cmdkOverlay{padding:6vh 12px;}
.cmdk-result{min-width:0;}
.cmdk-result .t{flex:1;}
#cmdkResults{overflow:auto; flex:1; min-height:120px;}
.cmdk-chips{display:flex; gap:6px; flex-wrap:wrap; margin:0 0 8px;}
.cmdk-chip{border:1px solid var(--border); background:var(--surface-high); color:var(--text-secondary); border-radius:999px;
  padding:3px 10px; font-size:.75rem; font-weight:600; cursor:pointer; font-family:var(--font-mono); white-space:nowrap;}
.cmdk-chip small{font-weight:400; color:var(--text-muted); margin-left:4px;}
.cmdk-chip:hover{border-color:var(--accent); color:var(--text);}
.cmdk-chip.active{background:var(--accent); color:var(--accent-ink); border-color:var(--accent);}
.cmdk-chip.active small{color:var(--accent-ink);}
.cmdk-chip.zero{opacity:.4;}
.cmdk-tipos{display:flex; gap:6px; margin:0 0 10px; flex-wrap:wrap;}
.cmdk-group{margin-bottom:10px;}
.cmdk-group-h{position:sticky; top:0; z-index:1; display:flex; justify-content:space-between; align-items:center; gap:8px;
  background:var(--surface); padding:6px 4px; border-bottom:1px solid var(--border); font-size:.8rem; font-weight:700;}
.cmdk-group-h .ab{font-family:var(--font-mono); color:var(--accent); margin-right:6px;}
.cmdk-group-h .cnt{font-weight:400; color:var(--text-muted); font-size:.75rem;}
.cmdk-sub{font-size:.7rem; text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted); padding:6px 10px 2px;}
.cmdk-result .t{min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.cmdk-result .k{color:var(--text-muted); font-size:.75rem; white-space:nowrap; flex-shrink:0;}
.cmdk-result.sel{background:var(--surface-high); box-shadow:inset 2px 0 0 var(--accent);}
.cmdk-more{font-size:.78rem; color:var(--accent); padding:4px 10px 6px; cursor:pointer;}
.cmdk-more:hover{text-decoration:underline;}
.cmdk-hint{font-size:.72rem; color:var(--text-muted); margin-top:6px; display:flex; gap:12px; flex-wrap:wrap;}
@media (max-width:600px){ .cmdk-result{flex-direction:column; gap:2px;} .cmdk-result .t{white-space:normal; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;} .cmdk-hint{display:none;} #cmdkOverlay .modal{max-height:86vh;} }
@media (max-width:480px){ .brand span{display:none;} .topbar{gap:10px; padding:10px 12px;} }`,'css');

// 2) HTML do modal: chips de área e de tipo
troca(`<input type="text" id="cmdkInput" class="cmdk-input" placeholder="Buscar módulos, temas, questões, notas… (Esc fecha)">
    <div id="cmdkResults"></div>`,
`<input type="text" id="cmdkInput" class="cmdk-input" placeholder="Buscar módulos, temas, questões, notas… (Esc fecha)">
    <div class="cmdk-chips" id="cmdkAreas"></div>
    <div class="cmdk-tipos" id="cmdkTipos"></div>
    <div id="cmdkResults"></div>
    <div class="cmdk-hint"><span>↑ ↓ navegar</span><span>Enter abrir</span><span>Esc fechar</span><span>dica: digite a sigla (ex.: "gin sifilis")</span></div>`,'modal');

// 3) Lógica da busca
const ini=h.indexOf('function buildSearchIndex(){');
const fimMarca='$all(\'.cmdk-result\').forEach(el=>on(el,\'click\',()=>{ filtered[+el.dataset.i].ir(); closeCmdk(); renderAll(); }));\n}';
const fim=h.indexOf(fimMarca,ini);
if(ini<0||fim<0) throw new Error('bloco da busca nao encontrado');
const NOVO=`/* BUSCA-POR-AREA: áreas = prefixo do código do módulo (CAR, CIR, GIN, PED, INF...) */
const AREAS={CAR:'Cardiologia',CIR:'Cirurgia',DER:'Dermatologia',END:'Endocrinologia',GAS:'Gastroenterologia',
  GIN:'Ginecologia',HEM:'Hematologia',HEP:'Hepatologia',INF:'Infectologia',NEF:'Nefrologia',NEU:'Neurologia',
  OBS:'Obstetrícia',OFT:'Oftalmologia',ORT:'Ortopedia',OTO:'Otorrinolaringologia',PED:'Pediatria',PNE:'Pneumologia',
  PREV:'Medicina Preventiva',PSI:'Psiquiatria',REU:'Reumatologia'};
function areaDe(cod){ return String(cod||'').split('-')[0]; }
function nomeArea(p){ return AREAS[p]||p; }
function numCod(cod){ return +(String(cod||'').split('-')[1]||0); }
function ordenarModulos(lista){ return lista.slice().sort((a,b)=>areaDe(a.codigo).localeCompare(areaDe(b.codigo))||numCod(a.codigo)-numCod(b.codigo)); }
const semAcento=s=>String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
let _idxBase=null;
const cmdk={area:'', tipo:'', sel:0, itens:[]};
function buildSearchIndex(){
  if(!_idxBase){
    _idxBase=[];
    ordenarModulos(MODULOS.filter(m=>CONTEUDO_MODULOS[m.codigo])).forEach(m=>{
      const a=areaDe(m.codigo), tema=m.assunto||m.tema||'';
      const nq=((CONTEUDO_MODULOS[m.codigo]||{}).questoes||[]).length;
      _idxBase.push({tipo:'modulo', area:a, cod:m.codigo, titulo:m.codigo+' · '+tema, k:nq+' quest'+(nq===1?'ão':'ões'),
        alvo:semAcento(m.codigo+' '+a+' '+nomeArea(a)+' '+tema+' '+(m.especialidade||'')),
        ir:()=>{state.ui.moduloAtual=m.codigo; state.ui.aba='modulo';}});
    });
    const vistos=new Set();
    Object.keys(CONTEUDO_MODULOS).sort((x,y)=>areaDe(x).localeCompare(areaDe(y))||numCod(x)-numCod(y)).forEach(cod=>{
      (CONTEUDO_MODULOS[cod].questoes||[]).forEach(q=>{
        if(vistos.has(q.id)) return; vistos.add(q.id);
        const a=areaDe(cod), mm=qm(q.id);
        const ed=mm? 'INEP '+mm.ano+'.'+mm.ed+' · Q'+mm.num : q.id;
        _idxBase.push({tipo:'questao', area:a, cod, titulo:ed+' — '+(q.enunciado||'').replace(/\\s+/g,' ').slice(0,90)+'…', k:cod,
          alvo:semAcento(q.id+' '+ed+' '+cod+' '+a+' '+nomeArea(a)+' '+(q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' ')),
          ir:()=>{state.ui.aba='questoes'; state.ui.qFiltros={esp:'',ano:'',dif:'',comp:'',situacao:'',busca:q.id};}});
      });
    });
  }
  const notas=[];
  Object.entries(state.notas||{}).forEach(([cod,txt])=>{ if(txt&&txt.trim()){ const a=areaDe(cod);
    notas.push({tipo:'nota', area:a, cod, titulo:cod+': '+txt.replace(/\\s+/g,' ').slice(0,80)+'…', k:'nota',
      alvo:semAcento(cod+' '+a+' '+nomeArea(a)+' '+txt), ir:()=>{state.ui.moduloAtual=cod; state.ui.aba='notas';}}); }});
  return _idxBase.concat(notas);
}
function openCmdk(){
  $('#cmdkOverlay').classList.add('open');
  $('#cmdkInput').value=''; $('#cmdkInput').focus();
  cmdk.sel=0;
  renderCmdkResults('');
}
function closeCmdk(){ $('#cmdkOverlay').classList.remove('open'); }
const TIPO_LABEL={'':'Tudo',modulo:'Módulos',questao:'Questões',nota:'Notas'};
function renderCmdkResults(q){
  const termos=semAcento(q).split(/\\s+/).filter(Boolean);
  const idx=buildSearchIndex();
  // um termo igual a uma sigla de área vira filtro de área ("gin sifilis")
  let areaTermo='';
  const resto=termos.filter(t=>{ const up=t.toUpperCase(); if(!areaTermo && AREAS[up]){ areaTermo=up; return false; } return true; });
  const areaAtiva=cmdk.area||areaTermo;
  const casa=resto.length? idx.filter(i=>resto.every(t=>i.alvo.includes(t))) : idx;
  // contagens para os chips (consideram o texto e o tipo, não a área)
  const porTipo=casa.filter(i=>!cmdk.tipo||i.tipo===cmdk.tipo);
  const cont={}; porTipo.forEach(i=>{ cont[i.area]=(cont[i.area]||0)+1; });
  const areasTodas=[...new Set(idx.map(i=>i.area))].sort();
  const totalChips=Object.values(cont).reduce((a,b)=>a+b,0);
  $('#cmdkAreas').innerHTML=
    \`<button class="cmdk-chip \${!areaAtiva?'active':''}" data-area="">Todas<small>\${totalChips}</small></button>\`+
    areasTodas.map(a=>\`<button class="cmdk-chip \${areaAtiva===a?'active':''} \${cont[a]?'':'zero'}" data-area="\${a}" title="\${nomeArea(a)}">\${a}<small>\${cont[a]||0}</small></button>\`).join('');
  const naArea=casa.filter(i=>!areaAtiva||i.area===areaAtiva);
  const ct=t=>naArea.filter(i=>!t||i.tipo===t).length;
  $('#cmdkTipos').innerHTML=Object.entries(TIPO_LABEL).map(([t,l])=>
    \`<button class="cmdk-chip \${cmdk.tipo===t?'active':''}" data-tipo="\${t}">\${l}<small>\${ct(t)}</small></button>\`).join('');
  let lista=naArea.filter(i=>!cmdk.tipo||i.tipo===cmdk.tipo);
  // sem texto, sem área e sem tipo: mostra só os módulos, agrupados por área
  const soModulos=!resto.length && !areaAtiva && !cmdk.tipo;
  if(soModulos) lista=lista.filter(i=>i.tipo==='modulo');
  const grupos={}; lista.forEach(i=>{ (grupos[i.area]=grupos[i.area]||[]).push(i); });
  const LIM_Q = areaAtiva||cmdk.tipo==='questao' ? 150 : 6;
  cmdk.itens=[]; let html='';
  Object.keys(grupos).sort().forEach(a=>{
    const g=grupos[a];
    const mods=g.filter(i=>i.tipo==='modulo'), notas=g.filter(i=>i.tipo==='nota'), qs=g.filter(i=>i.tipo==='questao');
    const partes=[];
    if(mods.length) partes.push(mods.length+' módulo'+(mods.length>1?'s':''));
    if(qs.length) partes.push(qs.length+(qs.length>1?' questões':' questão'));
    if(notas.length) partes.push(notas.length+' nota'+(notas.length>1?'s':''));
    html+=\`<div class="cmdk-group"><div class="cmdk-group-h"><span><span class="ab">\${a}</span>\${escapeHtml(nomeArea(a))}</span><span class="cnt">\${partes.join(' · ')}</span></div>\`;
    const item=i=>{ const n=cmdk.itens.length; cmdk.itens.push(i);
      return \`<div class="cmdk-result" data-i="\${n}"><span class="t">\${escapeHtml(i.titulo)}</span><span class="k">\${escapeHtml(i.k)}</span></div>\`; };
    if(mods.length){ if(qs.length||notas.length) html+='<div class="cmdk-sub">Módulos</div>'; html+=mods.map(item).join(''); }
    if(notas.length){ html+='<div class="cmdk-sub">Notas</div>'+notas.map(item).join(''); }
    if(qs.length){ html+='<div class="cmdk-sub">Questões</div>'+qs.slice(0,LIM_Q).map(item).join('');
      if(qs.length>LIM_Q) html+= areaAtiva ? \`<div class="empty-hint" style="padding:4px 10px">+\${qs.length-LIM_Q} questões — refine a busca com mais palavras.</div>\`
        : \`<div class="cmdk-more" data-area-mais="\${a}">Ver as \${qs.length} questões de \${a} →</div>\`; }
    html+='</div>';
  });
  $('#cmdkResults').innerHTML = html || \`<div class="empty-hint">Nada encontrado\${areaAtiva?' em '+escapeHtml(nomeArea(areaAtiva)):''}.</div>\`;
  if(cmdk.sel>=cmdk.itens.length) cmdk.sel=0;
  marcarSelCmdk(false);
  $all('#cmdkResults .cmdk-result').forEach(el=>on(el,'click',()=>abrirItemCmdk(+el.dataset.i)));
  $all('#cmdkResults [data-area-mais]').forEach(el=>on(el,'click',()=>{ cmdk.area=el.dataset.areaMais; cmdk.sel=0; renderCmdkResults($('#cmdkInput').value); }));
  $all('#cmdkAreas [data-area]').forEach(el=>on(el,'click',()=>{ cmdk.area=el.dataset.area; cmdk.sel=0;
    if(!cmdk.area&&areaTermo){ $('#cmdkInput').value=resto.join(' '); }
    renderCmdkResults($('#cmdkInput').value); $('#cmdkInput').focus(); }));
  $all('#cmdkTipos [data-tipo]').forEach(el=>on(el,'click',()=>{ cmdk.tipo=el.dataset.tipo; cmdk.sel=0; renderCmdkResults($('#cmdkInput').value); $('#cmdkInput').focus(); }));
}
function marcarSelCmdk(rolar){
  $all('#cmdkResults .cmdk-result').forEach(el=>el.classList.toggle('sel', +el.dataset.i===cmdk.sel));
  if(rolar){ const el=$('#cmdkResults .cmdk-result.sel'); el && el.scrollIntoView({block:'nearest'}); }
}
function abrirItemCmdk(n){ const it=cmdk.itens[n]; if(!it) return; it.ir(); closeCmdk(); renderAll(); window.scrollTo(0,0); }`;
h=h.slice(0,ini)+NOVO+h.slice(fim+fimMarca.length);

// 4) teclado no campo de busca (setas + Enter)
troca(`on($('#cmdkInput'),'input',debounce(e=>renderCmdkResults(e.target.value),120));`,
`on($('#cmdkInput'),'input',debounce(e=>{ cmdk.sel=0; renderCmdkResults(e.target.value); },120));
on($('#cmdkInput'),'keydown',e=>{
  if(e.key==='ArrowDown'){ e.preventDefault(); if(cmdk.itens.length){ cmdk.sel=(cmdk.sel+1)%cmdk.itens.length; marcarSelCmdk(true); } }
  else if(e.key==='ArrowUp'){ e.preventDefault(); if(cmdk.itens.length){ cmdk.sel=(cmdk.sel-1+cmdk.itens.length)%cmdk.itens.length; marcarSelCmdk(true); } }
  else if(e.key==='Enter'){ e.preventDefault(); abrirItemCmdk(cmdk.sel); }
});`,'teclado');

// 5) seletor de módulos com <optgroup> por área, em ordem numérica
troca("const opts = MODULOS.map(x=>`<option value=\"${x.codigo}\" ${x.codigo===state.ui.moduloAtual?'selected':''}>${x.codigo} · ${x.assunto||x.tema}</option>`).join('');",
"const _gr={}; ordenarModulos(MODULOS.filter(x=>CONTEUDO_MODULOS[x.codigo]||x.codigo===state.ui.moduloAtual)).forEach(x=>{ (_gr[areaDe(x.codigo)]=_gr[areaDe(x.codigo)]||[]).push(x); });\n"+
"  const opts = Object.keys(_gr).sort().map(a=>`<optgroup label=\"${a} · ${nomeArea(a)} (${_gr[a].length})\">`+_gr[a].map(x=>`<option value=\"${x.codigo}\" ${x.codigo===state.ui.moduloAtual?'selected':''}>${x.codigo} · ${x.assunto||x.tema}</option>`).join('')+'</optgroup>').join('');",'seletor');

// 6) modulo padrao = primeiro modulo COM conteudo, na ordem por area
troca("if(!state.ui.moduloAtual && MODULOS.length) state.ui.moduloAtual = MODULOS[0].codigo;","if((!state.ui.moduloAtual || !CONTEUDO_MODULOS[state.ui.moduloAtual]) && MODULOS.length){ const _p=ordenarModulos(MODULOS.filter(x=>CONTEUDO_MODULOS[x.codigo]))[0]; state.ui.moduloAtual=(_p||MODULOS[0]).codigo; }",'padrao');

fs.writeFileSync(F,h);console.log('busca por area aplicada');
