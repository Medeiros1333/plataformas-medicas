const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const of=JSON.parse(fs.readFileSync(ROOT+'/dados/_gabaritos_oficiais.json','utf8'));
let TOT=0,OK=0,DIF=0,SEM=0; const difs=[];
for(const f of fs.readdirSync(ROOT+'/dados/raw').filter(f=>/^\d{4}\.\d\.json$/.test(f))){
  const ed=f.replace('.json','');
  const g=of[ed]; if(!g||!Object.keys(g).length){console.log(ed.padEnd(8),'sem gabarito oficial parseado');continue;}
  const qs=JSON.parse(fs.readFileSync(ROOT+'/dados/raw/'+f,'utf8'));
  let ok=0,dif=0,sem=0;
  for(const q of qs){
    const o=g[q.numero];
    if(o===undefined){sem++;SEM++;continue;}
    TOT++;
    const oficialAnul = o==='ANULADA';
    const bancoAnul = !!q.anulada;
    if(oficialAnul||bancoAnul){ if(oficialAnul===bancoAnul) {ok++;OK++;} else {dif++;DIF++;difs.push([ed,q.numero,q.gabarito_oficial+(bancoAnul?'/anul':''),o,q.assunto]);} continue; }
    if(q.gabarito_oficial===o){ok++;OK++;} else {dif++;DIF++;difs.push([ed,q.numero,q.gabarito_oficial,o,q.assunto]);}
  }
  console.log(ed.padEnd(8),'n='+qs.length,'confere='+ok,'DIVERGE='+dif,'sem_ref='+sem);
}
console.log('\nTOTAL comparado:',TOT,'| confere:',OK,'| DIVERGE:',DIF,'('+(DIF/TOT*100).toFixed(1)+'%)','| sem referencia:',SEM);
fs.writeFileSync(ROOT+'/dados/_divergencias.json',JSON.stringify(difs,null,1));
console.log('\nPrimeiras 40 divergencias (edicao, questao, banco, oficial, assunto):');
difs.slice(0,40).forEach(d=>console.log(' ',d[0],'Q'+String(d[1]).padStart(3,'0'),'banco='+d[2],'oficial='+d[3],' ',(d[4]||'').slice(0,60)));
