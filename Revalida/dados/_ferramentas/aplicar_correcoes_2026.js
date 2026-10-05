// aplicar_correcoes_2026.js [--aplicar] — aplica dados/_correcoes_2026.1_pdf.json em dados/raw/2026.1.json:
//  1) "_subs": substituicoes literais globais; 2) chaves numericas: enunciado/alternativas transcritos do PDF
//  (Provas_Revalida/2026/Prova objetiva 2026.1.pdf, leitura visual = fonte-ouro) -> reconstrucao_manual.
// Tambem remove o prefixo de item ("28. ITEM 169513 - V. 941379"), normaliza espacos e U+0003.
// Sequencia completa: decifrar_2026.js --aplicar -> aplicar_correcoes_2026.js --aplicar.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const C=JSON.parse(fs.readFileSync(R+'/dados/_correcoes_2026.1_pdf.json','utf8'));
const fr=R+'/dados/raw/2026.1.json';const raw=JSON.parse(fs.readFileSync(fr,'utf8'));const qs=raw.questoes||raw;
const subs=C._subs||[];
const sp=s=>s.split('\n').map(l=>l.replace(/\u0003/g,' ').replace(/ {2,}/g,' ').trim()).join('\n').trim();
// hifen de quebra de linha: "anti- hipertensivo" -> "anti-hipertensivo" (preserva "pré- e pós-", "micro- ou")
const hif=s=>s.replace(/([a-zà-ÿ])- (?!(?:e|ou|a)\b)(?=[a-zà-ÿ])/g,'$1-');
const limpa=s=>{for(const [a,b] of subs) s=s.split(a).join(b); return sp(hif(s).replace(/^\s*[A-Z]?\d+\.\s*ITEM \d+ - V\. \d+\s*/,''));};
let nSub=0,nMan=0;
for(const q of qs){
  const antes=JSON.stringify([q.enunciado,q.alternativas]);
  q.enunciado=limpa(q.enunciado); for(const k in q.alternativas) q.alternativas[k]=limpa(q.alternativas[k]);
  if(JSON.stringify([q.enunciado,q.alternativas])!==antes) nSub++;
  // "_porQuestao": {"N": [[de, para], ...]} — trocas pontuais conferidas no PDF (enunciado e alternativas)
  const pq=(C._porQuestao||{})[String(q.numero)];
  if(pq){ const t=s=>{for(const [a,b] of pq) s=s.split(a).join(b); return s;};
    q.enunciado=t(q.enunciado); for(const k in q.alternativas) q.alternativas[k]=t(q.alternativas[k]); }
  // "_conferidas": numeros ja lidos no PDF (com ou sem troca) -> conferido_pdf
  if((C._conferidas||[]).includes(q.numero)){ q.conferido_pdf=true; delete q.revisao_recomendada; }
  const c=C[String(q.numero)];
  if(c){ if(!c.e||!c.a||Object.keys(c.a).join('')!=='ABCD'){console.log(q.numero+': correcao malformada');continue;}
    q.enunciado=c.e;q.alternativas=c.a;q.reconstrucao_manual=true;q.status='transcrito_pdf';nMan++; }
}
console.log('questoes alteradas por substituicao: '+nSub+' | transcritas do PDF: '+nMan);
if(aplicar){fs.writeFileSync(fr,JSON.stringify(raw,null,1));console.log('gravado raw/2026.1.json');}
