const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const of=JSON.parse(fs.readFileSync(ROOT+'/dados/_gabaritos_oficiais.json','utf8'));
const files=fs.readdirSync(ROOT+'/modulos').filter(f=>f.endsWith('.md'));
const reBloco=/\*\*\[INEP\s+(\d{4})\s*[\u00b7.]\s*Edi\u00e7\u00e3o\s*(\d)\s*[\u00b7.]\s*Quest\u00e3o\s*n?\u00ba?\s*(\d+)\]\*\*([\s\S]*?)(?=\n\*\*\[INEP\s+\d{4}|\n## |$)/g;
let tot=0, ok=0, bad=0, semGab=0; const ruins=[];
for(const f of files){
  const t=fs.readFileSync(ROOT+'/modulos/'+f,'utf8');
  let m; reBloco.lastIndex=0;
  while((m=reBloco.exec(t))){
    const ed=m[1]+'.'+m[2], n=+m[3], corpo=m[4];
    const g=(corpo.match(/\*\*Gabarito oficial:\s*([A-E])\*\*/)||[])[1];
    const anul=/QUEST[\u00c3A]O ANULADA/i.test(corpo);
    tot++;
    const o=of[ed]?.[n];
    if(o===undefined){semGab++;continue;}
    if(o==='ANULADA'){ if(anul)ok++; else {bad++; ruins.push([f,ed,n,g||'(sem)','ANULADA']);} continue; }
    if(!g){semGab++;continue;}
    if(g===o)ok++; else {bad++; ruins.push([f,ed,n,g,o]);}
  }
}
console.log('blocos de questao escritos:',tot);
console.log('gabarito CONFERE com oficial:',ok);
console.log('gabarito DIVERGE do oficial :',bad, '('+(bad/tot*100).toFixed(1)+'%)');
console.log('sem comparacao possivel     :',semGab);
const porEd={}; ruins.forEach(r=>porEd[r[1]]=(porEd[r[1]]||0)+1);
console.log('\npor edicao:',JSON.stringify(porEd));
console.log('\nMODULOS AFETADOS (arquivo, edicao, questao, escrito, oficial):');
ruins.sort().forEach(r=>console.log(' ',r[0].replace('.md','').padEnd(46),r[1],'Q'+String(r[2]).padStart(3,'0'),'escrito='+r[3],'oficial='+r[4]));
fs.writeFileSync(ROOT+'/dados/_impacto.json',JSON.stringify(ruins,null,1));
