const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const lista=JSON.parse(fs.readFileSync(ROOT+'/dados/_worklist.json','utf8'));
const RAW=ROOT+'/dados/raw'; const Q={};
for(const f of fs.readdirSync(RAW).filter(f=>/^\d{4}\.\d\.json$/.test(f)))
  for(const q of JSON.parse(fs.readFileSync(RAW+'/'+f,'utf8'))) Q[q.id]=q;
for(const cod of process.argv.slice(2)){
  const l=lista.find(x=>x.cod===cod);
  if(!l){console.log('### '+cod+' — sem lacuna');continue;}
  console.log('\n===================== '+cod+' · '+l.tema+' ('+l.esp+', Tier '+l.tier+') =====================');
  console.log('arquivo: '+l.arquivo+' | escritas: '+l.escritas+' | faltam: '+l.faltam);
  for(const d of l.det){
    const q=Q[d.id];
    console.log('\n--- '+d.id+(d.ok?'':'  [PROBLEMA: '+d.motivo+']'));
    if(!q){console.log('(ausente)');continue;}
    console.log('gabarito='+q.gabarito_oficial+' anulada='+!!q.anulada+' | assunto: '+q.assunto+' | comp: '+q.competencia+' | dif: '+q.dificuldade_estimada);
    console.log('ENUNCIADO: '+(q.enunciado||'').replace(/\s+/g,' '));
    for(const k of ['A','B','C','D','E']) if(q.alternativas&&q.alternativas[k]!==undefined) console.log('  '+k+') '+q.alternativas[k]);
  }
}
