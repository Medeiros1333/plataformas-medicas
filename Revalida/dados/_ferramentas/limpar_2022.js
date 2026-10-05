const fs=require('fs');const p='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida/dados/raw/2022.1.json';const r=JSON.parse(fs.readFileSync(p,'utf8'));
const limpa=s=>s.replace(/\s*\u0015\u0013\u0015\u0015\s*/g,' ').replace(/\s*Espaço livre\s*/g,' ').replace(/\s{2,}/g,' ').trim();
for(const q of r){q.enunciado=limpa(q.enunciado);for(const k in q.alternativas)q.alternativas[k]=limpa(q.alternativas[k]);}
fs.writeFileSync(p,JSON.stringify(r,null,1));
