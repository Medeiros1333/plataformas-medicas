// ver_bloco.js ARQ.md ANO ED NUM  -> imprime o bloco inteiro
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const [arq,ano,ed,num]=process.argv.slice(2);
const t=fs.readFileSync(path.join(ROOT,'modulos',arq),'utf8');
const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';
const i=t.indexOf(cab);
if(i<0){ console.error('bloco nao encontrado: '+cab); process.exit(1); }
const prox=t.indexOf('**[INEP ', i+10);
const fimSecao=t.indexOf('\n## ', i);
let fim=t.length;
for(const c of [prox, fimSecao]) if(c>i && c<fim) fim=c;
console.log(t.slice(i,fim).trim());
