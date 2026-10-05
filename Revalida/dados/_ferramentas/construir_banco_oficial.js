// construir_banco_oficial.js
// Monta dados/_banco_oficial.json a partir do caderno oficial (dados/raw_text_layout) +
// do gabarito oficial. E a fonte da verdade: numero, enunciado, alternativas e gabarito
// vem todos do mesmo lugar, sem depender do banco antigo.
const { execFileSync } = require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const RX_LINHA=/\r?\n/;
const RX_ALT=/^  ([A-E])\) (.*)$/;

const OF=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_gabaritos_oficiais.json'),'utf8'));
const EDS=['2011.1','2012.1','2013.1','2014.1','2015.1','2016.1','2017.1','2020.1','2021.1',
           '2022.1','2022.2','2023.1','2023.2','2024.1','2024.2','2025.1','2025.2','2026.1'];

const banco={};
let totQ=0, totGab=0;
for(const ed of EDS){
  const nums=[]; for(let i=1;i<=120;i++) nums.push(String(i));
  let saida;
  try{ saida=execFileSync('node',[path.join(ROOT,'dados','_ferramentas','reextrair.js'), ed, ...nums],
    {encoding:'utf8',maxBuffer:128*1024*1024}); }
  catch(e){ console.log(ed.padEnd(8)+' ERRO'); continue; }
  const m={};
  for(const b of saida.split('================ ').slice(1)){
    const mn=b.match(/· QUESTAO (\d+) =/); if(!mn) continue;
    const n=+mn[1];
    if(m[n]) continue;
    const mEn=b.match(/ENUNCIADO: ([\s\S]*?)(?:\n  A\)|\n\n)/); if(!mEn) continue;
    const alts={};
    for(const linha of b.split(RX_LINHA)){ const a=linha.match(RX_ALT); if(a) alts[a[1]]=a[2]; }
    if(Object.keys(alts).length<4) continue;
    const g=OF[ed]? OF[ed][n] : undefined;
    m[n]={numero:n, enunciado:mEn[1].trim(), alternativas:alts,
          gabarito_oficial: g==='ANULADA'? null : (g===undefined? null : g),
          anulada: g==='ANULADA',
          gabarito_conhecido: g!==undefined,
          duvida_extracao: /⟪\?⟫/.test(mEn[1]+Object.values(alts).join(' '))};
  }
  banco[ed]=m;
  const n=Object.keys(m).length;
  const comGab=Object.values(m).filter(q=>q.gabarito_conhecido).length;
  const duvida=Object.values(m).filter(q=>q.duvida_extracao).length;
  totQ+=n; totGab+=comGab;
  console.log(ed.padEnd(8)+' questoes '+String(n).padStart(3)+'  com gabarito '+String(comGab).padStart(3)+'  com duvida de extracao '+String(duvida).padStart(3));
}
fs.writeFileSync(path.join(ROOT,'dados','_banco_oficial.json'), JSON.stringify(banco,null,1),'utf8');
console.log('\nTOTAL: '+totQ+' questoes oficiais | com gabarito: '+totGab);
console.log('gravado em dados/_banco_oficial.json');
