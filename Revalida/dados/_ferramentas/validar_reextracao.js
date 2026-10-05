// validar_reextracao.js [N]
// Roda o reextrator sobre questoes que JA estao integras no banco e compara.
// E o teste de confianca do parser: se ele reproduz o que ja esta certo, pode ser aplicado
// nas questoes quebradas.
const { execFileSync } = require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const N=+(process.argv[2]||12);   // quantas questoes integras por edicao

const RX_LINHA=/\r?\n/;
const RX_ALT=/^  ([A-E])\) (.*)$/;
const norm = s => (s||'').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,' ').trim();

function sim(a,b){
  a=norm(a); b=norm(b);
  if(!a||!b) return 0;
  const A=a.split(' '), B=new Set(b.split(' '));
  let h=0; for(const w of A) if(B.has(w)) h++;
  return h/Math.max(A.length, b.split(' ').length);
}

const mm=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','mapa_mestre.json'),'utf8'));
const mq=mm.questoes||mm;
const cache={};
const raw=ed=>{ if(!cache[ed]){ const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',ed+'.json'),'utf8')); cache[ed]=d.questoes||d; } return cache[ed]; };

const eds=[...new Set(mq.map(q=>q.ano+'.'+q.edicao))].sort();
let tot=0, bons=0, medios=0, ruins=0;
const piores=[];
for(const ed of eds){
  let lista;
  try{ lista=raw(ed); }catch(e){ continue; }
  const integras=lista.filter(q=>q.alternativas && Object.keys(q.alternativas).length>=4 && (q.enunciado||'').length>120);
  if(!integras.length) continue;
  const passo=Math.max(1, Math.floor(integras.length/N));
  const amostra=integras.filter((_,i)=>i%passo===0).slice(0,N);
  const nums=amostra.map(q=>String(q.numero));
  let saida;
  try{ saida=execFileSync('node',[path.join(ROOT,'dados','_ferramentas','reextrair.js'), ed, ...nums],{encoding:'utf8',maxBuffer:64*1024*1024}); }
  catch(e){ console.log(ed+': ERRO'); continue; }
  let edBons=0, edTot=0;
  for(const q of amostra){
    const i=saida.indexOf('· QUESTAO '+q.numero+' =');
    if(i<0) continue;
    const j=saida.indexOf('================', i+20);
    const bloco=saida.slice(i, j<0?saida.length:j);
    const mEn=bloco.match(/ENUNCIADO: ([\s\S]*?)\n  A\)/);
    if(!mEn) continue;
    const sEn=sim(mEn[1], q.enunciado);
    // alternativas
    let sAlt=0, nAlt=0;
    const props={};
    for(const linha of bloco.split(RX_LINHA)){
      const mm2=linha.match(RX_ALT);
      if(mm2) props[mm2[1]]=mm2[2];
    }
    for(const L2 of ['A','B','C','D','E']){
      if(!q.alternativas[L2] || !props[L2]) continue;
      sAlt+=sim(props[L2], q.alternativas[L2]); nAlt++;
    }
    const score=(sEn + (nAlt? sAlt/nAlt : 0))/(nAlt?2:1);
    tot++; edTot++;
    if(score>=0.92){ bons++; edBons++; }
    else if(score>=0.75) medios++;
    else { ruins++; piores.push({ed, num:q.numero, score:+score.toFixed(2)}); }
  }
  console.log(ed.padEnd(8)+' amostra '+String(edTot).padStart(3)+'  identicas '+String(edBons).padStart(3));
}
console.log('\nTOTAL comparado: '+tot);
console.log('  identicas (>=0.92): '+bons+'  ('+(100*bons/tot).toFixed(1)+'%)');
console.log('  proximas (0.75-0.92): '+medios);
console.log('  divergentes (<0.75): '+ruins);
if(piores.length) console.log('\ndivergentes: '+piores.map(p=>p.ed+'-Q'+p.num+' ('+p.score+')').join(', '));
