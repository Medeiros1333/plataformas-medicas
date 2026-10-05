// mostrar_2026.js N,M,... — imprime enunciado + alternativas atuais de raw/2026.1.json (para conferir com o PDF)
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const raw=JSON.parse(fs.readFileSync(R+'/dados/raw/2026.1.json','utf8'));const qs=raw.questoes||raw;
for(const n of process.argv[2].split(',').map(Number)){const q=qs.find(x=>x.numero===n);
  console.log('#'+n+' ['+(q.gabarito_oficial||'ANUL')+']'+(q.reconstrucao_manual?' (manual)':'')+'\n'+q.enunciado+'\n'+Object.entries(q.alternativas).map(([k,v])=>k+') '+v).join('\n')+'\n');}
