// ⚠️ OBSOLETO — NÃO USE PARA VALIDAR NUMERAÇÃO.
// Este script compara o banco com "*_Prova_LAYOUT_reordenado.txt", que é DERIVADO da
// mesma extração defeituosa que gerou o banco. É verificação circular: confirmava o banco
// contra ele mesmo e reportou "numeração validada" enquanto 140 questões estavam sob o
// número errado (ver RETOMADA.md §2).
// Use no lugar: dados/_ferramentas/auditar_conteudo.js, que compara com
// dados/raw_text_layout/ — fonte independente, com as colunas preservadas.

const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const LAY={ '2011.1':'2011__Prova_LAYOUT_reordenado.txt','2012.1':'2012__Prova_LAYOUT_reordenado.txt',
 '2013.1':'2013__Prova_LAYOUT_reordenado.txt','2014.1':'2014__Prova_LAYOUT_reordenado.txt',
 '2015.1':'2015__Prova_LAYOUT_reordenado.txt','2016.1':'2016__Prova_LAYOUT_reordenado.txt',
 '2017.1':'2017__Prova_LAYOUT_reordenado.txt','2020.1':'2020__Prova_LAYOUT_reordenado.txt',
 '2021.1':'2021__Prova_LAYOUT_reordenado.txt','2022.2':'2022.2__Prova_LAYOUT_reordenado.txt',
 '2023.1':'2023.1__Prova_LAYOUT_reordenado.txt','2023.2':'2023.2__Prova_LAYOUT_reordenado.txt',
 '2024.1':'2024.1__Prova_LAYOUT_reordenado.txt','2024.2':'2024.2__Prova_LAYOUT_reordenado.txt',
 '2025.1':'2025.1__Prova_LAYOUT_reordenado.txt','2025.2':'2025.2__Prova_LAYOUT_reordenado.txt'};
const N=s=>s.replace(/\s+/g,' ');
const out={};
for(const [ed,arq] of Object.entries(LAY)){
  const p=ROOT+'/dados/raw_text/'+arq;
  if(!fs.existsSync(p)){ console.log(ed,'SEM LAYOUT'); continue; }
  const txt=N(fs.readFileSync(p,'utf8'));
  const marks=[...txt.matchAll(/QUEST[\u00c3A\u00e3a]O\s*(\d{1,3})/gi)].map(m=>({n:+m[1],pos:m.index}));
  if(marks.length<50){ console.log(ed.padEnd(8),'marcadores insuficientes ('+marks.length+') — pulando'); continue; }
  const qs=JSON.parse(fs.readFileSync(ROOT+'/dados/raw/'+ed+'.json','utf8'));
  const mapa={}; let ig=0,dif=0,nao=0; const difs=[];
  for(const q of qs){
    const e=N(q.enunciado||'').trim();
    let achou=null;
    for(const len of [90,65,45]){
      for(let st=0; st+len<=Math.min(e.length,500); st+=13){
        const pos=txt.indexOf(e.slice(st,st+len));
        if(pos>-1){ let last=null; for(const mk of marks){ if(mk.pos<=pos) last=mk.n; else break; } if(last){achou=last;break;} }
      }
      if(achou) break;
    }
    if(achou===null){nao++; continue;}
    mapa[q.numero]=achou;
    if(achou===q.numero) ig++; else {dif++; difs.push(q.numero+'->'+achou);}
  }
  out[ed]=mapa;
  console.log(ed.padEnd(8),'n='+qs.length,'confirma='+ig,'DIFERE='+dif,'naoLocalizado='+nao, dif?('  '+difs.join(' ')):'');
}
fs.writeFileSync(ROOT+'/dados/_numeracao_real.json',JSON.stringify(out,null,1));
