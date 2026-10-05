// sugerir_encaixe.js [PREFIXO|ESPECIALIDADE] [--json]
// Para cada questao sem justificativa que NAO esta num modulo com arquivo .md
// (modulo nao gerado ou sem modulo), sugere os 3 modulos existentes mais parecidos
// por TF-IDF (tema + assunto + texto das questoes ja escritas no modulo).
// Imprime um trecho do enunciado e o texto da alternativa correta, para decisao MANUAL.
// Sugestao e ponto de partida, nao decisao (RETOMADA, armadilha 9). Ignora 2026.1.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const filtro=process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2]:null;
const mods=JSON.parse(fs.readFileSync(ROOT+'/dados/modulos.json','utf8'));
const byCod={}; mods.forEach(m=>byCod[m.codigo]=m);
const Q={};
for(const f of fs.readdirSync(ROOT+'/dados/raw').filter(f=>/^\d{4}\.\d\.json$/.test(f)))
  for(const q of JSON.parse(fs.readFileSync(ROOT+'/dados/raw/'+f,'utf8'))) Q[q.id]=q;
const files={}; fs.readdirSync(ROOT+'/modulos').filter(f=>f.endsWith('.md')).forEach(f=>files[f.split('_')[0]]=f);

const reQ=/\[INEP\s+(\d{4})\s*[·.]\s*Edição\s*(\d)\s*[·.]\s*Questão\s*n?º?\s*(\d+)\]/g;
const escritas=new Set(), escritasPorMod={};
for(const [cod,f] of Object.entries(files)){
  const t=fs.readFileSync(ROOT+'/modulos/'+f,'utf8'); let m; escritasPorMod[cod]=[];
  while((m=reQ.exec(t))){const id='INEP'+m[1]+'-'+m[2]+'-Q'+String(m[3]).padStart(3,'0'); escritas.add(id); escritasPorMod[cod].push(id);}
}
const STOP=new Set('a o e de da do das dos em no na nos nas um uma com por para que se ao os as é ou mais foi há não sua seu ser como pelo pela anos idade paciente caso qual deve conduta sobre entre sem após este essa esse esta nesse nessa quadro exame ao à apresenta refere dias'.split(' '));
const tok=s=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>3&&!STOP.has(w));
const txtQ=q=>q?(q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' '):'';
// documentos dos modulos existentes
const docs={};
for(const cod of Object.keys(files)){
  const m=byCod[cod]||{};
  let s=((m.tema||'')+' ').repeat(3)+(m.assunto||'')+' '+cod.split('-')[0];
  for(const id of escritasPorMod[cod]) s+=' '+txtQ(Q[id]);
  const ft=fs.readFileSync(ROOT+'/modulos/'+files[cod],'utf8').split('\n').slice(0,4).join(' ');
  s+=' '+ft;
  docs[cod]=tok(s);
}
const df={}, N=Object.keys(docs).length;
for(const w of Object.values(docs)) for(const t of new Set(w)) df[t]=(df[t]||0)+1;
const vec=ws=>{const tf={}; ws.forEach(w=>tf[w]=(tf[w]||0)+1); const v={}; let n=0;
  for(const [w,c] of Object.entries(tf)){const x=(1+Math.log(c))*Math.log((N+1)/((df[w]||0)+1)); v[w]=x; n+=x*x;}
  n=Math.sqrt(n)||1; for(const w in v) v[w]/=n; return v;};
const V={}; for(const c in docs) V[c]=vec(docs[c]);
const cos=(a,b)=>{let s=0; for(const w in a) if(b[w]) s+=a[w]*b[w]; return s;};

const out=[];
for(const q of Object.values(Q)){
  if(escritas.has(q.id)||q.id.startsWith('INEP2026')) continue;
  const dest=q.modulo_destino;
  if(dest && files[dest]) continue; // ja em modulo com arquivo (worklist cuida)
  const esp=q.especialidade_primaria||'?';
  const destM=byCod[dest]||{};
  const pre=(dest||'').split('-')[0];
  if(filtro && !(pre===filtro || esp===filtro)) continue;
  const v=vec(tok(txtQ(q)+' '+(destM.tema||'')));
  const rank=Object.keys(V).map(c=>[c,cos(v,V[c])]).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const en=(q.enunciado||'').replace(/\s+/g,' ');
  const g=q.gabarito_oficial; const gt=g?(q.alternativas||{})[g]||'':'';
  out.push({id:q.id, esp, dest:dest||'-', destTema:destM.tema||'', anulada:!!q.anulada, gab:g||(q.anulada?'ANUL':'?'),
    sug:rank.map(([c,s])=>c+':'+s.toFixed(2)),
    trecho:en.length>330?en.slice(0,170)+' … '+en.slice(-150):en, gabTxt:gt.replace(/\s+/g,' ').slice(0,110)});
}
out.sort((a,b)=>(a.dest+a.id).localeCompare(b.dest+b.id));
if(process.argv.includes('--json')){console.log(JSON.stringify(out,null,1));process.exit(0);}
const curto=process.argv.includes('--curto');
for(const o of out){
  if(curto){const en=o.trecho.split(' … ');console.log(`${o.id.replace('INEP','')} [${o.dest}] ${o.sug[0]} | ${en[0].slice(0,80)} … ${(en[1]||'').slice(-120)} || ${o.gab}: ${o.gabTxt.slice(0,70)}`);continue;}
  console.log(`# ${o.id} [${o.esp}] antigo=${o.dest} ${o.destTema} | sug: ${o.sug.join(' ')}`);
  console.log(`  ${o.trecho}`);
  console.log(`  GAB ${o.gab}: ${o.gabTxt}`);
}
console.error('total: '+out.length);
