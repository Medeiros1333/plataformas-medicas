// reextrair_lote.js [--aplicar]
// Varre TODO o banco, acha as questoes com alternativas incompletas (<4) e tenta reconstrui-las
// a partir de dados/raw_text_layout. Sem --aplicar so relata.
const { execFileSync } = require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');

const mm=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','mapa_mestre.json'),'utf8'));
const mq=mm.questoes||mm;
const cache={};
const raw=ed=>{ if(!cache[ed]){ const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',ed+'.json'),'utf8')); cache[ed]=d.questoes||d; } return cache[ed]; };

const alvo={};
for(const q of mq){
  const ed=q.ano+'.'+q.edicao;
  let r; try{ r=raw(ed).find(x=>x.numero===q.numero); }catch(e){ continue; }
  const n=r&&r.alternativas? Object.keys(r.alternativas).length:0;
  if(n<4) (alvo[ed]=alvo[ed]||[]).push(q.numero);
}

let ok=0, falha=0;
const detalhe=[];
for(const ed of Object.keys(alvo).sort()){
  const nums=alvo[ed].sort((a,b)=>a-b).map(String);
  const args=[path.join(ROOT,'dados','_ferramentas','reextrair.js'), ed, ...nums];
  if(aplicar) args.push('--aplicar');
  let saida;
  try{ saida=execFileSync('node', args, {encoding:'utf8', maxBuffer:64*1024*1024}); }
  catch(e){ console.log(ed+': ERRO '+e.message.slice(0,120)); continue; }
  const blocos=saida.split(/={5,} /).slice(1);
  let o=0,f=0;
  for(const n of nums){
    const re=new RegExp('QUESTAO '+n+' =');
    const idx=saida.indexOf('· QUESTAO '+n+' =');
    if(idx<0){ f++; detalhe.push({ed,n,st:'ausente'}); continue; }
    const trecho=saida.slice(idx, idx+400);
    if(/!! /.test(trecho)){ f++; detalhe.push({ed,n,st:'incompleta'}); }
    else { o++; detalhe.push({ed,n,st:'ok'}); }
    void re; void blocos;
  }
  ok+=o; falha+=f;
  console.log(ed.padEnd(8)+' alvo '+String(nums.length).padStart(3)+'  recuperadas '+String(o).padStart(3)+'  falharam '+String(f).padStart(3));
}
console.log('\nTOTAL: alvo '+(ok+falha)+' | recuperadas '+ok+' ('+(100*ok/(ok+falha)).toFixed(1)+'%) | falharam '+falha);
fs.writeFileSync(path.join(ROOT,'dados','_reextracao_status.json'), JSON.stringify(detalhe,null,1),'utf8');
console.log('detalhe em dados/_reextracao_status.json');
