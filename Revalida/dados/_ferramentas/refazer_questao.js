// refazer_questao.js ARQ_LOTE.txt
// Para cada secao "@@COD ANO ED NUM" do arquivo, troca TUDO entre o cabecalho do bloco e a
// linha "**Gabarito oficial" pelo texto da secao (enunciado + alternativas "A) ..." conferidos
// no caderno). A explicacao do bloco e mantida. Qualquer "Nota de extracao" que estava entre
// o enunciado e o gabarito some junto (era sobre o texto que foi refeito).
// Depois rode sincronizar_banco.js para levar o texto ao banco.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const arq=process.argv[2];if(!arq){console.error('uso: refazer_questao.js ARQ_LOTE.txt');process.exit(1);}
const secs=fs.readFileSync(arq,'utf8').split(/^@@/m).filter(s=>s.trim());
for(const s of secs){
  const nl=s.indexOf('\n');const [cod,ano,ed,num]=s.slice(0,nl).trim().split(/\s+/);const novo=s.slice(nl+1).trim();
  const nAlt=(novo.match(/^[A-E]\) /gm)||[]).length;
  if(nAlt<4){console.log('✗',cod,ano,ed,num,'secao com',nAlt,'alternativas');continue;}
  const f=fs.readdirSync(R+'/modulos').find(x=>x.startsWith(cod+'_'));const p=R+'/modulos/'+f;let t=fs.readFileSync(p,'utf8');
  const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';const i=t.indexOf(cab);
  if(i<0){console.log('✗',cod,cab,'nao achado');continue;}
  const g=t.indexOf('**Gabarito oficial',i);const prox=t.indexOf('**[INEP ',i+cab.length);
  if(g<0||(prox>0&&g>prox)){console.log('✗',cod,num,'gabarito nao achado no bloco');continue;}
  const velho=t.slice(i+cab.length,g);const tinhaNota=/Nota de extração/.test(velho);
  t=t.slice(0,i+cab.length)+'\n\n'+novo+'\n\n'+t.slice(g);
  fs.writeFileSync(p,t);console.log('✓',cod,ano+'.'+ed+'-Q'+num,nAlt,'alternativas'+(tinhaNota?' (nota de extracao removida)':''));
}
