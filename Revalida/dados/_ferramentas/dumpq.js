const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const Q={};
for(const f of fs.readdirSync(ROOT+'/dados/raw').filter(f=>/^\d{4}\.\d\.json$/.test(f)))
  for(const q of JSON.parse(fs.readFileSync(ROOT+'/dados/raw/'+f,'utf8'))) Q[q.ano+'.'+q.edicao+'-'+q.numero]=q;
for(const k of process.argv.slice(2)){
  const q=Q[k];
  if(!q){console.log('### '+k+' AUSENTE');continue;}
  console.log('\n======== '+k+'  [gabarito oficial corrigido: '+(q.anulada?'ANULADA':q.gabarito_oficial)+'] ========');
  console.log('assunto:',q.assunto);
  console.log('ENUN:',(q.enunciado||'').replace(/\s+/g,' '));
  for(const L of ['A','B','C','D','E']) if(q.alternativas&&q.alternativas[L]!==undefined) console.log(' '+L+') '+q.alternativas[L]);
}
