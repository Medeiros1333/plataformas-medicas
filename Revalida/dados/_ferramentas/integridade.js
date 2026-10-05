// integridade.js — confere a estrutura de todos os modulos .md:
//  - exatamente 1x "## 0." ... "## 5." e 1x "<!-- METADADOS -->", com JSON de metadados valido
//  - nenhum cabecalho **[INEP ...]** repetido no mesmo arquivo
//  - nenhum separador "---" duplicado em sequencia
//  - (se existir _conteudo_COD.json do ultimo reconstruir_hub) nenhum bloco que estava la e sumiu
// Sai com codigo 1 se houver problema. Rodar depois de qualquer edicao em massa.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const probs=[];let n=0;
for(const f of fs.readdirSync(R+'/modulos').filter(x=>x.endsWith('.md'))){
  n++;const cod=f.split('_')[0];const t=fs.readFileSync(R+'/modulos/'+f,'utf8');
  for(const s of ['## 0.','## 1.','## 2.','## 3.','## 4.','## 5.']){const c=(t.match(new RegExp('^'+s.replace('.','\\.'),'gm'))||[]).length;if(c!==1)probs.push(f+': "'+s+'" aparece '+c+'x');}
  const mc=t.split('<!-- METADADOS -->').length-1;if(mc!==1)probs.push(f+': METADADOS '+mc+'x');
  else{const m=t.split('<!-- METADADOS -->')[1].match(/```json\s*([\s\S]*?)```/);if(!m)probs.push(f+': bloco json de metadados ausente');else{try{JSON.parse(m[1])}catch(e){probs.push(f+': JSON de metadados invalido')}}}
  const heads=t.match(/^\*\*\[INEP \d{4} · Edição \d · Questão \d+\]\*\*/gm)||[];
  const vis=new Set();for(const h of heads){if(vis.has(h))probs.push(f+': cabecalho repetido '+h);vis.add(h);}
  if(/\n---[ \t]*\n\s*---[ \t]*\n/.test(t))probs.push(f+': separador --- duplicado');
  const cj=R+'/dados/_scripts/_conteudo_'+cod+'.json';
  if(fs.existsSync(cj)){try{const o=JSON.parse(fs.readFileSync(cj,'utf8'))[cod];
    for(const q of (o&&o.questoes)||[]){const m=q.id.match(/INEP(\d{4})-(\d)-Q0*(\d+)/);if(!m)continue;
      const cab='**[INEP '+m[1]+' · Edição '+m[2]+' · Questão '+m[3]+']**';if(!t.includes(cab))probs.push(f+': sumiu '+q.id+' (estava no ultimo hub)');}}catch(e){}}
}
console.log('modulos verificados: '+n+' | problemas: '+probs.length);
for(const p of probs.slice(0,40))console.log('   '+p);
if(probs.length)process.exitCode=1;
