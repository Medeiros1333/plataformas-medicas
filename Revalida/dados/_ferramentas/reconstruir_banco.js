// reconstruir_banco.js [--aplicar]
// Reconstroi dados/raw/*.json a partir de dados/_banco_oficial.json (numero, enunciado,
// alternativas e gabarito vindos todos do caderno oficial) e reata a classificacao
// (especialidade, tema, assunto, competencia, dificuldade, modulo) do banco antigo,
// casando por conteudo. Sem --aplicar apenas relata.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const LIMITE=0.40;   // confianca minima para herdar a classificacao

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
const CLASSIF=['especialidade_primaria','especialidade_secundaria','tema','assunto',
               'competencia','dificuldade_estimada','modulo_destino'];

const mapaIds={};     // id_antigo -> {novo_id, ed, de, para, gab_antes, gab_depois}
const orfas=[];       // registros antigos que nao casaram com nenhuma questao oficial
let novoTotal=0, herdou=0, pendente=0, mudouNum=0, mudouGab=0;

for(const ed of Object.keys(OFB)){
  const of=OFB[ed];
  const nums=Object.keys(of).map(Number).sort((a,b)=>a-b);
  if(!nums.length) continue;
  const fRaw=path.join(ROOT,'dados','raw',ed+'.json');
  let antigos=[];
  if(fs.existsSync(fRaw)){ const d=JSON.parse(fs.readFileSync(fRaw,'utf8')); antigos=(d.questoes||d).slice(); }

  // pontua todos os pares
  const pares=[];
  for(const n of nums){
    const t=of[n].enunciado+' '+Object.values(of[n].alternativas).join(' ');
    for(const a of antigos){
      const s=sim(t, (a.enunciado||'')+' '+Object.values(a.alternativas||{}).join(' '));
      if(s>=LIMITE) pares.push({n, a, s});
    }
  }
  pares.sort((x,y)=>y.s-x.s);
  const donoN={}, usado=new Set();
  for(const p of pares){
    if(donoN[p.n] || usado.has(p.a)) continue;
    donoN[p.n]=p; usado.add(p.a);
  }

  const novos=[];
  let edHerdou=0, edPend=0, edNum=0, edGab=0;
  for(const n of nums){
    const o=of[n];
    const q={
      numero:n,
      enunciado:o.enunciado,
      alternativas:o.alternativas,
      gabarito_oficial:o.gabarito_oficial,
      anulada:o.anulada,
      id:'INEP'+ed.replace('.','-')+'-Q'+String(n).padStart(3,'0'),
      ano:+ed.split('.')[0], edicao:+ed.split('.')[1],
      tipo:'objetiva',
      fonte:'caderno_oficial',
      duvida_extracao:!!o.duvida_extracao
    };
    const p=donoN[n];
    if(p){
      for(const c of CLASSIF) if(p.a[c]!==undefined) q[c]=p.a[c];
      // guarda o texto do banco antigo quando ele diverge, para nao perder nada na troca
      if(p.s<0.85) q.enunciado_banco_antigo=(p.a.enunciado||'').slice(0,1200);
      q.numero_banco_antigo=p.a.numero;
      q.classificacao='herdada';
      q.classificacao_score=+p.s.toFixed(2);
      herdou++; edHerdou++;
      const gabAntes = p.a.anulada?'ANULADA':p.a.gabarito_oficial;
      const gabDepois = o.anulada?'ANULADA':o.gabarito_oficial;
      if(p.a.numero!==n){ mudouNum++; edNum++; }
      if(String(gabAntes)!==String(gabDepois)){ mudouGab++; edGab++; }
      mapaIds[p.a.id]={novo_id:q.id, ed, de:p.a.numero, para:n,
        gab_antes:gabAntes, gab_depois:gabDepois, score:+p.s.toFixed(2),
        assunto:p.a.assunto, modulo:p.a.modulo_destino};
    } else { q.classificacao='pendente'; pendente++; edPend++; }
    novos.push(q); novoTotal++;
  }
  for(const a of antigos) if(!usado.has(a)) orfas.push({ed, numero:a.numero, id:a.id, assunto:a.assunto, modulo:a.modulo_destino});

  console.log(ed.padEnd(8)+' oficial '+String(nums.length).padStart(3)+
    '  classif herdada '+String(edHerdou).padStart(3)+
    '  pendente '+String(edPend).padStart(3)+
    '  mudou numero '+String(edNum).padStart(3)+
    '  mudou gabarito '+String(edGab).padStart(3)+
    '  orfas '+String(antigos.length-edHerdou).padStart(3));

  if(aplicar) fs.writeFileSync(fRaw, JSON.stringify(novos,null,1),'utf8');
}

console.log('\nTOTAL: '+novoTotal+' questoes oficiais | classificacao herdada '+herdou+' | pendente '+pendente);
console.log('mudaram de numero: '+mudouNum+' | mudaram de gabarito: '+mudouGab+' | orfas (registros antigos sem par): '+orfas.length);
fs.writeFileSync(path.join(ROOT,'dados','_mapa_ids.json'), JSON.stringify(mapaIds,null,1),'utf8');
fs.writeFileSync(path.join(ROOT,'dados','_orfas.json'), JSON.stringify(orfas,null,1),'utf8');
console.log('mapa de ids em dados/_mapa_ids.json | orfas em dados/_orfas.json');
if(!aplicar) console.log('\n(nada gravado — use --aplicar)');
