// aplicar_correcoes_2022.js [--aplicar] — aplica em dados/raw/2022.1.json as transcricoes feitas lendo o PDF
// do caderno (Provas_Revalida/2022/Prova objetiva 2022.1.pdf, leitura visual = fonte-ouro) guardadas em
// dados/_correcoes_2022.1_pdf.json  ({"N": {"e": enunciado, "a": {A..D}}}). Marca reconstrucao_manual e
// status 'transcrito_pdf'. Rodar por ultimo na sequencia de regeneracao de 2022.1 (ver RETOMADA.md §7).
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const C=JSON.parse(fs.readFileSync(R+'/dados/_correcoes_2022.1_pdf.json','utf8'));
const r=JSON.parse(fs.readFileSync(R+'/dados/raw/2022.1.json','utf8'));
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
for(const [n,c] of Object.entries(C)){
  const q=r.find(x=>x.numero==+n); if(!q){console.log(n+': questao inexistente');continue;}
  if(!c.e||!c.a||Object.keys(c.a).join('')!=='ABCD'){console.log(n+': correcao malformada');continue;}
  const vA=new Set(norm(q.enunciado+' '+Object.values(q.alternativas).join(' ')).split(' '));
  const wN=norm(c.e+' '+Object.values(c.a).join(' ')).split(' ');
  const novas=wN.filter(w=>!vA.has(w));
  console.log(n.padStart(3)+': '+novas.length+' palavras novas'+(novas.length?' ('+novas.slice(0,12).join(' ')+')':''));
  if(aplicar){q.enunciado=c.e;q.alternativas=c.a;q.reconstrucao_manual=true;q.status='transcrito_pdf';}
}
// limpeza geral: U+0003 (marcador da fonte) e espacos duplos fora de tabelas markdown
const sp=s=>s.split('\n').map(l=>l.replace(/\u0003/g,' ').replace(/(^|[\s(“"])\:(?=[a-zà-ÿ])/g,'$1J').replace(/\u007F/g,'Z').replace(/ {2,}/g,' ').trim()).join('\n').trim();
if(aplicar) for(const q of r){q.enunciado=sp(q.enunciado);for(const k in q.alternativas)q.alternativas[k]=sp(q.alternativas[k]);}
if(aplicar){fs.writeFileSync(R+'/dados/raw/2022.1.json',JSON.stringify(r,null,1));console.log('aplicado: '+Object.keys(C).length);}
