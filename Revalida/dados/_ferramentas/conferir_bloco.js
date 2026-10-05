// conferir_bloco.js ARQ.md ANO ED NUM
// Mostra o enunciado do bloco escrito e os 3 melhores candidatos no caderno oficial.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const OFB=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_banco_oficial.json'),'utf8'));
const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function sim(a,b){
  const A=norm(a).split(' ').filter(w=>w.length>3);
  const B=new Set(norm(b).split(' ').filter(w=>w.length>3));
  if(!A.length||!B.size) return 0;
  let h=0; for(const w of A) if(B.has(w)) h++;
  return h/Math.max(A.length,B.size);
}
const [arq,ano,ed,num]=process.argv.slice(2);
const t=fs.readFileSync(path.join(ROOT,'modulos',arq),'utf8');
const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';
const i=t.indexOf(cab);
if(i<0){ console.error('bloco nao encontrado'); process.exit(1); }
const resto=t.slice(i+cab.length);
const fim=resto.indexOf('**Gabarito oficial');
const corpo=resto.slice(0, fim>0?fim:1800);
console.log('=========== BLOCO ESCRITO ('+arq+') ===========');
console.log(corpo.trim().slice(0,1400));
const of=OFB[ano+'.'+ed];
const pont=Object.keys(of).map(Number).map(n=>({n, s:sim(of[n].enunciado+' '+Object.values(of[n].alternativas).join(' '), corpo)}))
  .sort((a,b)=>b.s-a.s).slice(0,3);
for(const c of pont){
  const q=of[c.n];
  console.log('\n=========== OFICIAL Q'+c.n+'  (score '+c.s.toFixed(2)+')  gabarito='+(q.anulada?'ANULADA':q.gabarito_oficial)+' ===========');
  console.log(q.enunciado.slice(0,700));
  for(const k of Object.keys(q.alternativas)) console.log('  '+k+') '+q.alternativas[k].slice(0,200));
}
