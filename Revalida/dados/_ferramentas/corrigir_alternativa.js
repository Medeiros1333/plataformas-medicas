// corrigir_alternativa.js COD ANO ED NUM LETRA "texto correto"
// Substitui SO a linha "X) ..." de uma alternativa dentro do bloco, preservando o resto.
// Use quando o bloco esta certo mas uma alternativa ficou cortada/com placeholder.
// Com LETRA = NOTA e texto vazio "", remove a primeira "Nota de extracao" do bloco.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const [cod,ano,ed,num,let_,txt]=process.argv.slice(2);
const f=fs.readdirSync(R+'/modulos').find(x=>x.startsWith(cod+'_'));const p=R+'/modulos/'+f;let t=fs.readFileSync(p,'utf8');
const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';const i=t.indexOf(cab);
if(i<0){console.error('bloco nao achado');process.exit(1);}
const fim=t.indexOf('\n---',i)>0?t.indexOf('\n---',i):t.length;
let seg=t.slice(i,fim);
if(let_==='NOTA'){
  const k=seg.search(/^⚠️ \*{1,2}Nota de extração/m);
  if(k<0){console.error('sem nota');process.exit(1);}
  const e=seg.indexOf('\n\n',k);seg=seg.slice(0,k)+seg.slice(e+2);
}else{
  const j=seg.indexOf('**Gabarito oficial');
  const re=new RegExp('^'+let_+'\\) .*$','m');
  const head=seg.slice(0,j);
  if(!re.test(head)){console.error('linha '+let_+') nao achada');process.exit(1);}
  seg=head.replace(re,let_+') '+txt)+seg.slice(j);
}
fs.writeFileSync(p,t.slice(0,i)+seg+t.slice(fim));console.log('ok '+cod+' '+ano+'.'+ed+'-Q'+num+' '+let_);
