// auditar_conteudo.js
// Compara cada questao do banco antigo com o banco oficial (dados/_banco_oficial.json)
// e diz se ela esta guardada sob o numero certo.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const OFB=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_banco_oficial.json'),'utf8'));

const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,' ').trim();
function sim(a,b){
  const A=norm(a).split(' ').filter(w=>w.length>3);
  const B=new Set(norm(b).split(' ').filter(w=>w.length>3));
  if(!A.length||!B.size) return 0;
  let h=0; for(const w of A) if(B.has(w)) h++;
  return h/Math.max(A.length, B.size);
}
const txtOf = q => q.enunciado+' '+Object.values(q.alternativas).join(' ');

const eds=fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f)).map(f=>f.replace('.json',''));
const res=[]; let conf=0, desl=0, indef=0;
for(const ed of eds){
  const of=OFB[ed]; if(!of||!Object.keys(of).length){ console.log(ed.padEnd(8)+' sem oficial'); continue; }
  const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',ed+'.json'),'utf8'));
  const qs=d.questoes||d;
  const nums=Object.keys(of).map(Number);
  let c=0,x=0,i=0;
  for(const q of qs){
    const meu=(q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' ');
    const atual = of[q.numero] ? sim(txtOf(of[q.numero]), meu) : 0;
    let melhor={n:q.numero, s:atual};
    for(const n of nums){ const s=sim(txtOf(of[n]), meu); if(s>melhor.s) melhor={n,s}; }
    if(melhor.n===q.numero && atual>=0.40){ conf++; c++; res.push({ed,numero:q.numero,id:q.id,st:'confere',score:+atual.toFixed(2)}); }
    else if(melhor.n!==q.numero && melhor.s>=0.55 && (melhor.s-atual)>=0.12){
      desl++; x++; res.push({ed,numero:q.numero,id:q.id,st:'deslocada',real:melhor.n,score:+melhor.s.toFixed(2),score_no_lugar:+atual.toFixed(2)});
    } else { indef++; i++; res.push({ed,numero:q.numero,id:q.id,st:'indefinida',score:+atual.toFixed(2),melhor:melhor.n,melhor_score:+melhor.s.toFixed(2)}); }
  }
  console.log(ed.padEnd(8)+' banco '+String(qs.length).padStart(3)+'  confere '+String(c).padStart(3)+
              '  DESLOCADA '+String(x).padStart(3)+'  indefinida '+String(i).padStart(3));
}
console.log('\nTOTAL: confere '+conf+' | deslocada '+desl+' | indefinida '+indef);
fs.writeFileSync(path.join(ROOT,'dados','_auditoria_conteudo.json'), JSON.stringify(res,null,1),'utf8');
