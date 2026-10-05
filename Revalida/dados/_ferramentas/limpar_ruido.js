// limpar_ruido.js [--aplicar]
// Remove restos de rodape colados no fim das alternativas e dos enunciados
// (ano da prova, "REVALIDA 20XX", "PRIMEIRA/SEGUNDA EDICAO", numero de pagina solto).
// Atua em dados/_banco_oficial.json, dados/raw/*.json e nas linhas de alternativa dos modulos.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');

const REGRAS=[
  /\s+REVALIDA\s*(19|20)\d{2}\s*$/i,
  /\s+(19|20)\d{2}\s*(PRIMEIRA|SEGUNDA)\s*EDI[ÇC][ÃA]O\s*$/i,
  /\s+(PRIMEIRA|SEGUNDA)\s*EDI[ÇC][ÃA]O\s*$/i,
  /\s+(19|20)\d{2}\s*$/,
  /(?<=\.)\s+\d{1,3}\s*$/,
  /\s+[ÁA]REA LIVRE\s*$/i
];
function limpar(s){
  if(typeof s!=='string') return s;
  let a=s, antes;
  do{ antes=a; for(const r of REGRAS) a=a.replace(r,''); } while(a!==antes);
  return a.trim();
}

let n=0;
// 1) banco oficial
const fB=path.join(ROOT,'dados','_banco_oficial.json');
const B=JSON.parse(fs.readFileSync(fB,'utf8'));
for(const ed of Object.keys(B)) for(const num of Object.keys(B[ed])){
  const q=B[ed][num];
  const e=limpar(q.enunciado); if(e!==q.enunciado){ q.enunciado=e; n++; }
  for(const L of Object.keys(q.alternativas||{})){
    const v=limpar(q.alternativas[L]);
    if(v!==q.alternativas[L]){ q.alternativas[L]=v; n++; }
  }
}
if(aplicar) fs.writeFileSync(fB, JSON.stringify(B,null,1),'utf8');
console.log('banco oficial: '+n+' campos limpos');

// 2) raw
let m=0;
for(const f of fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f))){
  const p=path.join(ROOT,'dados','raw',f);
  const d=JSON.parse(fs.readFileSync(p,'utf8'));
  const qs=d.questoes||d;
  let mudou=false;
  for(const q of qs){
    const e=limpar(q.enunciado); if(e!==q.enunciado){ q.enunciado=e; m++; mudou=true; }
    for(const L of Object.keys(q.alternativas||{})){
      const v=limpar(q.alternativas[L]);
      if(v!==q.alternativas[L]){ q.alternativas[L]=v; m++; mudou=true; }
    }
  }
  if(mudou && aplicar) fs.writeFileSync(p, JSON.stringify(d,null,1),'utf8');
}
console.log('raw/*.json: '+m+' campos limpos');

// 3) linhas de alternativa nos modulos
let k=0, arqs=0;
const RX=/^([A-E]\) )(.+)$/;
for(const f of fs.readdirSync(path.join(ROOT,'modulos')).filter(f=>f.endsWith('.md'))){
  const p=path.join(ROOT,'modulos',f);
  const linhas=fs.readFileSync(p,'utf8').split(/\r?\n/);
  let mudou=false;
  for(let i=0;i<linhas.length;i++){
    const mm=linhas[i].match(RX);
    if(!mm) continue;
    const v=limpar(mm[2]);
    if(v!==mm[2]){ linhas[i]=mm[1]+v; k++; mudou=true; }
  }
  if(mudou){ arqs++; if(aplicar) fs.writeFileSync(p, linhas.join('\n'),'utf8'); }
}
console.log('modulos: '+k+' alternativas limpas em '+arqs+' arquivos');
if(!aplicar) console.log('\n(nada gravado — use --aplicar)');
