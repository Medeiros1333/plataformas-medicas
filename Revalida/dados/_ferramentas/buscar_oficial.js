// buscar_oficial.js "texto" [EDICAO]
// Procura uma expressao no caderno oficial e diz em que edicao/questao ela esta.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const B=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_banco_oficial.json'),'utf8'));
const alvo=(process.argv[2]||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const edFiltro=process.argv[3];
if(!alvo){ console.error('uso: buscar_oficial.js "texto" [EDICAO]'); process.exit(1); }
const n=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
let achou=0;
for(const ed of Object.keys(B)){
  if(edFiltro && ed!==edFiltro) continue;
  for(const num of Object.keys(B[ed])){
    const q=B[ed][num];
    const txt=n(q.enunciado+' '+Object.values(q.alternativas).join(' '));
    if(txt.includes(alvo)){
      achou++;
      console.log('=== '+ed+' Q'+num+'  gab='+(q.anulada?'ANULADA':q.gabarito_oficial));
      console.log('   '+q.enunciado.slice(0,220));
      for(const k of Object.keys(q.alternativas)) console.log('     '+k+') '+q.alternativas[k].slice(0,150));
      console.log();
    }
  }
}
if(!achou) console.log('nada encontrado');
