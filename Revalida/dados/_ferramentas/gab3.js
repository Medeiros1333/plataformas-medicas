const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const RT=ROOT+'/dados/raw_text';
const ANUL='ANULADA';
const MAP={
 '2011.1':['2011__Gabarito_2011.txt',110],   '2012.1':['2012__Gabarito_prova_cinza_2012.txt',110],
 '2013.1':['2013__Gabarito_VISUAL.txt',110],  '2014.1':['2014__Gabarito_2014.txt',110],
 '2015.1':['2015__Gabarito_prova_objetiva_cinza_2015.txt',110],
 '2016.1':['2016__Gabarito_pronva_objetiva_cinza_2016.txt',100],
 '2017.1':['2017__Gabarito_VISUAL.txt',100],  '2020.1':['2020__Gabarito_VISUAL.txt',100],
 '2021.1':['2021__Gabarito_prova_objetiva_2021.txt',100],
 '2022.1':['2022__Gabarito_prova_objetiva_2022.1.txt',100],
 '2022.2':['2022__Gabarito_prova_objetiva_2022.2.txt',100],
 '2023.1':['2023__Gabarito_prova_objetiva_2023.1.txt',100],
 '2023.2':['2023__Gabarito_prova_objetiva_2023.2.txt',100],
 '2024.1':['2024__Gabarito_prova_objetiva_2024.1.txt',100],
 '2024.2':['2024__Gabarito_prova_objetiva_2024.2.txt',100],
 '2025.1':['2025__Gabarito_prova_objetiva_2025.1.txt',100],
 '2025.2':['2025__Gabarito_prova_objetiva_2025.2.txt',100],
 '2026.1':['2026__Gabarito_VISUAL.txt',100],
};
function limpar(txt){
  const cores=[...txt.matchAll(/PROVA\s+(CINZA|VERMELHA|AMARELA|ROSA|VERDE|AZUL|BRANCA)/gi)];
  if(cores.length>=2) txt=txt.slice(cores[0].index,cores[1].index);
  txt = txt.replace(/Legenda/gi, " ");
  return txt
    .replace(/\b0\d\s+CADERNO\b/gi,' ')              // "01 CADERNO" (2025)
    .replace(/Vers[ãa]o\s+\d+/gi,' ')                 // "Versão 1" (2016)
    .replace(/REVALIDA\s+\d{4}/gi,' ')
    .replace(/Ano:\s*\d{4}/gi,' ').replace(/BNI/g,' ')
    .replace(/Obs\.?:.*$/gim,' ')                     // legenda "( X ) questão anulada"
    .replace(/[-\u2013\u2014]\s*=?\s*Anulada?/gi,' ') // legenda "- Anulada" (2023/2025)
    .replace(/\b(19|20)\d{2}\s*\/\s*\d\b/g,' ')       // "2022/2"
    .replace(/(\d{1,3})\s*([A-E])(?=\s|$)/g,'$1 $2')  // "1B" colado (2012)
    .replace(/\bp[áa]gina\s+\d+/gi,' ');
}
function tok(t){
  t=t.trim(); if(!t) return null;
  if(/^\d{1,3}$/.test(t)){const n=+t; return (n>=1&&n<=120)?{k:'N',v:n}:null;}
  const u=t.toUpperCase().replace(/[.:,;()]/g,'');
  if(/^[A-E]$/.test(u)) return {k:'A',v:u};
  if(u===ANUL||u==='ANULADO'||u==='X') return {k:'A',v:ANUL};
  if(/^[\u0336\u2013\u2014\u2212\u00ad-]+$/.test(t)) return {k:'A',v:ANUL};
  return null;
}
function parse(txt,n){
  const toks=txt.split(/\s+/).map(tok).filter(Boolean);
  const g={}; const confl=[]; let i=0;
  while(i<toks.length){
    const ns=[]; while(i<toks.length&&toks[i].k==='N') ns.push(toks[i++].v);
    const as=[]; while(i<toks.length&&toks[i].k==='A') as.push(toks[i++].v);
    if(!ns.length||!as.length) { if(!ns.length&&!as.length) i++; continue; }
    if(ns.length!==as.length){ confl.push(ns.length+'N x '+as.length+'A ('+ns[0]+'..'+ns[ns.length-1]+')'); }
    const k=Math.min(ns.length,as.length);
    for(let j=0;j<k;j++){ const q=ns[j]; if(q>n) continue;
      if(g[q]!==undefined && g[q]!==as[j]) confl.push('Q'+q+' conflito '+g[q]+'/'+as[j]);
      if(g[q]===undefined) g[q]=as[j]; }
  }
  return {g,confl};
}
const out={}; let problemas=0;
for(const [ed,[arq,n]] of Object.entries(MAP)){
  const p=RT+'/'+arq;
  const {g,confl}=parse(limpar(fs.readFileSync(p,'utf8')),n);
  const faltam=[]; for(let k=1;k<=n;k++) if(g[k]===undefined) faltam.push(k);
  out[ed]=g;
  const anul=Object.values(g).filter(v=>v===ANUL).length;
  const ok=!faltam.length&&!confl.length;
  if(!ok) problemas++;
  console.log((ok?'✓ ':'⚠ ')+ed.padEnd(8),'lidos='+String(Object.keys(g).length).padStart(3)+'/'+n,
    'anul='+String(anul).padStart(2),
    faltam.length?('FALTAM: '+faltam.slice(0,10).join(',')):'',
    confl.length?('CONFLITOS: '+confl.slice(0,3).join(' | ')):'');
}
fs.writeFileSync(ROOT+'/dados/_gabaritos_oficiais.json', JSON.stringify(out,null,1));
console.log('\nedicoes com problema:',problemas);
