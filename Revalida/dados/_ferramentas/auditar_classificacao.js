// auditar_classificacao.js
// Cada questao classificada e comparada, pelo TEXTO, com as questoes dos demais modulos.
// Se o conteudo dela casa muito melhor com outro modulo do que com o proprio, a atribuicao
// e suspeita — tipicamente resto da classificacao feita quando o texto estava contaminado.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');

const STOP=new Set(['paciente','anos','idade','caso','exame','apresenta','medico','medica','consulta','historia','relata','sobre','qual','deve','esse','essa','esta','este','para','com','que','uma','das','dos','nao','sem','mais','pelo','pela','seu','sua','foi','ser','tem','apos','entre','sendo','como','houve','refere','saude','unidade','atendimento','quadro','conduta','diagnostico','alternativa','opcao','considerando','assinale','correta','seguir','abaixo','realizado','realizada','apresentou','informa','sobre','alem','deve','cerca','durante','ainda','todos','todas']);
const tokens = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,' ').split(' ').filter(w=>w.length>4 && !STOP.has(w));

const cache={};
const raw=ed=>{ if(!cache[ed]){ const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',ed+'.json'),'utf8')); cache[ed]=d.questoes||d; } return cache[ed]; };
const eds=fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f)).map(f=>f.replace('.json',''));

const reg=[];
for(const ed of eds) for(const q of raw(ed)){
  if(!q.modulo_destino) continue;
  if(q.texto_corrompido) continue;
  const t=tokens((q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' '));
  if(t.length<15) continue;
  reg.push({q, ed, toks:new Set(t), n:t.length});
}
console.log('questoes classificadas e legiveis: '+reg.length);

const idx={};
reg.forEach((r,i)=>{ for(const w of r.toks) (idx[w]=idx[w]||[]).push(i); });

const suspeitas=[];
for(let i=0;i<reg.length;i++){
  const p=reg[i];
  const pontos={};
  for(const w of p.toks){ const l=idx[w]; if(!l||l.length>400) continue; for(const j of l){ if(j===i) continue; pontos[j]=(pontos[j]||0)+1; } }
  const cand=Object.entries(pontos).map(([j,h])=>({j:+j, s:h/Math.max(p.n, reg[+j].n)}))
    .sort((a,b)=>b.s-a.s).slice(0,15);
  if(cand.length<5) continue;
  const porMod={};
  for(const c of cand){ const m=reg[c.j].q.modulo_destino; porMod[m]=(porMod[m]||0)+c.s; }
  const rank=Object.entries(porMod).sort((a,b)=>b[1]-a[1]);
  const meu=porMod[p.q.modulo_destino]||0;
  if(rank[0][0]!==p.q.modulo_destino && rank[0][1] >= Math.max(meu*2.5, 0.6)){
    suspeitas.push({id:p.q.id, mod:p.q.modulo_destino, sugestao:rank[0][0],
      forca:+rank[0][1].toFixed(2), proprio:+meu.toFixed(2),
      assunto:(p.q.assunto||'').slice(0,60),
      ini:(p.q.enunciado||'').replace(/\s+/g,' ').slice(0,85)});
  }
}
console.log('atribuicoes suspeitas: '+suspeitas.length);
for(const s of suspeitas.slice(0,40))
  console.log('  '+s.id+'  '+String(s.mod).padEnd(9)+'-> '+String(s.sugestao).padEnd(9)+' ('+s.forca+' vs '+s.proprio+')  '+s.ini);
fs.writeFileSync(path.join(ROOT,'dados','_classificacao_suspeita.json'), JSON.stringify(suspeitas,null,1),'utf8');
console.log('\ndetalhe em dados/_classificacao_suspeita.json');
