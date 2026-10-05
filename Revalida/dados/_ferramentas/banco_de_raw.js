// banco_de_raw.js EDICAO [--aplicar] — preenche _banco_oficial.json[EDICAO] a partir de dados/raw/EDICAO.json
// (usado para as provas de fonte cifrada, 2022.1 e 2026.1, cujo texto foi revisado contra o PDF no raw).
// Gabarito SEMPRE de dados/_gabaritos_oficiais.json. Nao toca nas outras edicoes.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const ed=process.argv[2];const aplicar=process.argv.includes('--aplicar');
if(!ed){console.log('uso: node banco_de_raw.js EDICAO [--aplicar]');process.exit(1);}
const OF=JSON.parse(fs.readFileSync(R+'/dados/_gabaritos_oficiais.json','utf8'))[ed]||{};
const raw=JSON.parse(fs.readFileSync(R+'/dados/raw/'+ed+'.json','utf8'));const qs=raw.questoes||raw;
const fB=R+'/dados/_banco_oficial.json';const B=JSON.parse(fs.readFileSync(fB,'utf8'));
const m={};let div=0;
for(const q of qs){
  const g=OF[q.numero]; const gab= g==='ANULADA'? null : (g===undefined? null : g);
  if((q.gabarito_oficial||null)!==gab){div++;console.log('Q'+q.numero+': raw='+q.gabarito_oficial+' oficial='+g);}
  m[q.numero]={numero:q.numero,enunciado:q.enunciado,alternativas:q.alternativas,gabarito_oficial:gab,
    anulada:g==='ANULADA',gabarito_conhecido:g!==undefined,duvida_extracao:false};
}
console.log(ed+': '+Object.keys(m).length+' questoes, '+div+' divergencias de gabarito raw x oficial');
if(aplicar){B[ed]=m;fs.writeFileSync(fB,JSON.stringify(B,null,1),'utf8');console.log('gravado em _banco_oficial.json['+ed+']');}
