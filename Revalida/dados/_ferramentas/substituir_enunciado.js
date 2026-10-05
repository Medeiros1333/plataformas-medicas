// substituir_enunciado.js COD ANO ED NUM ARQ_TEXTO
// Troca SO o enunciado de um bloco (entre o cabecalho e a primeira alternativa "A) ")
// pelo conteudo de ARQ_TEXTO (texto conferido no caderno). Use quando o bloco tem
// enunciado resumido/parafraseado ou com placeholder. Paragrafos: separe com linha em branco.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const [cod,ano,ed,num,arq]=process.argv.slice(2);
if(!arq){console.error('uso: substituir_enunciado.js COD ANO ED NUM ARQ_TEXTO');process.exit(1);}
const f=fs.readdirSync(R+'/modulos').find(x=>x.startsWith(cod+'_'));const p=R+'/modulos/'+f;let t=fs.readFileSync(p,'utf8');
const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';const i=t.indexOf(cab);
if(i<0){console.error('bloco nao achado');process.exit(1);}
const j=t.indexOf('\nA) ',i);const g=t.indexOf('**Gabarito oficial',i);
if(j<0||(g>0&&j>g)){console.error('alternativa A) nao achada no bloco');process.exit(1);}
const novo=fs.readFileSync(arq,'utf8').trim();
t=t.slice(0,i+cab.length)+'\n\n'+novo+'\n'+t.slice(j);
fs.writeFileSync(p,t);console.log('ok '+cod+' '+ano+'.'+ed+'-Q'+num+' ('+novo.length+' chars)');
