// classificar_pendentes.js [--aplicar] [--limiar 0.28]
// Atribui especialidade/tema/modulo as questoes que estao sem classificacao, comparando o
// texto com as questoes JA classificadas. So atribui quando ha vencedor claro; o resto fica
// pendente para classificacao manual.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const li=process.argv.indexOf('--limiar');
const LIMIAR=li>=0? parseFloat(process.argv[li+1]) : 0.28;
const MARGEM=1.25;   // o melhor precisa ser 25% melhor que o segundo

const STOP=new Set(['paciente','anos','idade','caso','exame','apresenta','medico','medica','consulta','historia','relata','sobre','qual','deve','esse','essa','esta','este','para','com','que','uma','das','dos','nao','sem','mais','pelo','pela','seu','sua','foi','ser','tem','apos','entre','sendo','como','houve','refere','saude','unidade','atendimento','quadro','conduta','diagnostico','alternativa','opcao','considerando','assinale','correta','seguir','abaixo','realizado','realizada','apresentou','informa']);
const tokens = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,' ').split(' ').filter(w=>w.length>4 && !STOP.has(w));

const cache={};
const raw=ed=>{ if(!cache[ed]){ const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',ed+'.json'),'utf8')); cache[ed]=d.questoes||d; } return cache[ed]; };
const eds=fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f)).map(f=>f.replace('.json',''));

const classificadas=[], pendentes=[];
for(const ed of eds) for(const q of raw(ed)){
  const t=tokens((q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' '));
  const reg={ed, q, toks:new Set(t), n:t.length};
  if(q.modulo_destino) classificadas.push(reg); else pendentes.push(reg);
}
console.log('classificadas: '+classificadas.length+' | pendentes: '+pendentes.length);

// indice invertido para nao comparar tudo com tudo
const idx={};
classificadas.forEach((c,i)=>{ for(const w of c.toks) (idx[w]=idx[w]||[]).push(i); });

let atribuidas=0, semVencedor=0, soEsp=0;
const porModulo={};
for(const p of pendentes){
  const pontos={};
  for(const w of p.toks){ const l=idx[w]; if(!l||l.length>400) continue; for(const i of l) pontos[i]=(pontos[i]||0)+1; }
  const cand=Object.entries(pontos).map(([i,h])=>{
    const c=classificadas[i];
    return {i:+i, s: h/Math.max(p.n, c.n)};
  }).sort((a,b)=>b.s-a.s);
  if(!cand.length){ semVencedor++; continue; }
  // agrega os melhores vizinhos por modulo: um tema bem representado vence pelo conjunto,
  // nao por uma unica questao parecida
  const porMod={};
  for(const c of cand.slice(0,15)){
    const mod=classificadas[c.i].q.modulo_destino;
    if(!porMod[mod]) porMod[mod]={soma:0, melhor:c, mod};
    porMod[mod].soma+=c.s;
    if(c.s>porMod[mod].melhor.s) porMod[mod].melhor=c;
  }
  const rank=Object.values(porMod).sort((a,b)=>b.soma-a.soma);
  const campeao=rank[0];
  const vice=rank[1];
  if(campeao.melhor.s<LIMIAR || (vice && campeao.soma < vice.soma*MARGEM)){
    // sem modulo claro, mas talvez a ESPECIALIDADE esteja clara: agrega por especialidade
    const porEsp={};
    for(const c of cand.slice(0,25)){
      const e=classificadas[c.i].q.especialidade_primaria;
      if(!e) continue;
      porEsp[e]=(porEsp[e]||0)+c.s;
    }
    const re=Object.entries(porEsp).sort((a,b)=>b[1]-a[1]);
    if(re.length && (!re[1] || re[0][1] >= re[1][1]*1.15)){
      p.destino={esp:re[0][0], soEspecialidade:true, score:+re[0][1].toFixed(3)};
      soEsp++;
    } else semVencedor++;
    continue;
  }
  const fonte=classificadas[campeao.melhor.i].q;
  p.destino={modulo:fonte.modulo_destino, tema:fonte.tema, esp:fonte.especialidade_primaria,
             comp:fonte.competencia, score:+campeao.melhor.s.toFixed(3), fonte:fonte.id};
  atribuidas++;
  porModulo[fonte.modulo_destino]=(porModulo[fonte.modulo_destino]||0)+1;
}
console.log('com modulo atribuido: '+atribuidas+' | so com especialidade: '+soEsp+' | sem veredito: '+semVencedor);
const top=Object.entries(porModulo).sort((a,b)=>b[1]-a[1]).slice(0,15);
console.log('modulos que mais receberam: '+top.map(([k,v])=>k+'('+v+')').join(' '));

if(!aplicar){ console.log('\n(nada gravado — use --aplicar)'); process.exit(0); }
const porEd={};
for(const p of pendentes){ if(!p.destino) continue; (porEd[p.ed]=porEd[p.ed]||[]).push(p); }
for(const ed of Object.keys(porEd)){
  const lista=raw(ed);
  for(const p of porEd[ed]){
    const q=lista.find(x=>x.id===p.q.id);
    if(!q) continue;
    if(p.destino.soEspecialidade){
      q.especialidade_primaria=q.especialidade_primaria||p.destino.esp;
      q.classificacao='automatica_especialidade';
      q.classificacao_score=p.destino.score;
      continue;
    }
    q.modulo_destino=p.destino.modulo;
    q.tema=q.tema||p.destino.tema;
    q.especialidade_primaria=q.especialidade_primaria||p.destino.esp;
    q.competencia=q.competencia||p.destino.comp;
    q.classificacao='automatica';
    q.classificacao_score=p.destino.score;
    q.classificacao_fonte=p.destino.fonte;
  }
  fs.writeFileSync(path.join(ROOT,'dados','raw',ed+'.json'), JSON.stringify(lista,null,1),'utf8');
}
console.log('gravado em dados/raw/*.json');
if(process.argv.includes('--amostra')){
  const com=pendentes.filter(x=>x.destino);
  const passo=Math.max(1,Math.floor(com.length/20));
  for(const x of com.filter((_,k)=>k%passo===0).slice(0,20)){
    const d=x.destino;
    console.log('\n'+x.q.id+'  -> '+(d.soEspecialidade? ('[so especialidade] '+d.esp) : (d.modulo+' · '+d.tema))+'  (score '+d.score+')');
    console.log('   '+(x.q.enunciado||'').slice(0,190));
  }
}
