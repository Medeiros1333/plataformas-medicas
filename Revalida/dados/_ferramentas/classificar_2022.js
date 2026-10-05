// classificar_2022.js [ARQ_CLASSIF] [EDICAO] — aplica a classificacao manual (dados/_classificacao_2022.1.json)
// em dados/raw/<EDICAO>.json: modulo_destino, especialidade_primaria (pelo prefixo do modulo), tema (titulo do
// modulo), competencia, assunto (so o TEMA — o texto apos " - " e descartado para nao induzir gabarito).
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const arq=process.argv[2]||'dados/_classificacao_2022.1.json', ed=process.argv[3]||'2022.1';
const C=JSON.parse(fs.readFileSync(path.join(R,arq),'utf8'));
const ESP={CAR:'Cardiologia',CIR:'Cirurgia',DER:'Dermatologia',END:'Endocrinologia',GAS:'Gastroenterologia',GIN:'Ginecologia',
  HEM:'Hematologia',HEP:'Hepatologia',INF:'Infectologia',NEF:'Nefrologia',NEU:'Neurologia',OBS:'Obstetrícia',OFT:'Oftalmologia',
  ORT:'Ortopedia',OTO:'Otorrinolaringologia',PED:'Pediatria',PNE:'Pneumologia',PREV:'Preventiva',PSI:'Psiquiatria',REU:'Reumatologia'};
const COMP={d:'diagnostico',t:'tratamento',c:'conduta_inicial',p:'prevencao',e:'etica_gestao',x:'epidemiologia'};
const md=JSON.parse(fs.readFileSync(R+'/dados/modulos.json','utf8'));const lista=md.modulos||md;
const tit={};for(const m of lista)tit[m.codigo||m.id]=m.tema||m.titulo||null;
const fRaw=R+'/dados/raw/'+ed+'.json';const raw=JSON.parse(fs.readFileSync(fRaw,'utf8'));const qs=raw.questoes||raw;
let ok=0;const erros=[];
for(const q of qs){
  const c=C[String(q.numero)]; if(!c){erros.push(q.numero+': sem classificacao');continue;}
  const [mod,comp,ass]=c; const pre=mod.split('-')[0];
  if(!(mod in tit)){erros.push(q.numero+': modulo inexistente '+mod);continue;}
  q.modulo_destino=mod; q.especialidade_primaria=ESP[pre]; q.especialidade_secundaria=q.especialidade_secundaria||[];
  q.tema=tit[mod]; q.competencia=COMP[comp]; q.assunto=ass.split(' - ')[0].replace(/\s*\(ANULADA\)/,'');
  q.dificuldade_estimada=q.dificuldade_estimada||3; q.classificacao='manual'; ok++;
}
fs.writeFileSync(fRaw,JSON.stringify(raw,null,1));console.log('classificadas: '+ok);if(erros.length)console.log(erros.join('\n'));
