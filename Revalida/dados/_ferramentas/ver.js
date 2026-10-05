// ver.js ID [ID...] — mostra enunciado, alternativas e gabarito de questoes do raw
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','raw');
for(const id of process.argv.slice(2)){const m=id.match(/^INEP(\d{4})-(\d)/);const qs=JSON.parse(fs.readFileSync(R+'/'+m[1]+'.'+m[2]+'.json','utf8'));
const q=qs.find(x=>x.id===id);if(!q){console.log(id,'?');continue}
console.log('## '+id+' gab='+(q.gabarito_oficial||(q.anulada?'ANULADA':'?'))+' dest='+q.modulo_destino);console.log((q.enunciado||'').replace(/\s+/g,' '));
for(const [k,v] of Object.entries(q.alternativas||{}))console.log('  '+k+') '+String(v).replace(/\s+/g,' '));}
