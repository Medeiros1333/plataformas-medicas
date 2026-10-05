// trocar_justificativa.js ARQ.md ANO ED NUM NOVA.txt
// Substitui tudo o que vem DEPOIS da linha "**Gabarito oficial: X**" dentro de um bloco,
// preservando cabecalho, enunciado, alternativas e a propria linha do gabarito.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const [arq,ano,ed,num,novoArq]=process.argv.slice(2);
if(!novoArq){ console.error('uso: trocar_justificativa.js ARQ.md ANO ED NUM NOVA.txt'); process.exit(1); }
const p=path.join(ROOT,'modulos',arq);
let t=fs.readFileSync(p,'utf8');
const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';
const i=t.indexOf(cab);
if(i<0){ console.error('bloco nao encontrado: '+cab); process.exit(1); }
let fim=t.length;
for(const c of [t.indexOf('**[INEP ', i+10), t.indexOf('\n## ', i)]) if(c>i && c<fim) fim=c;
const bloco=t.slice(i,fim);
const iGab=bloco.search(/\*\*Gabarito /);
let cabecaDoBloco;
if(iGab<0){
  // bloco sem linha de gabarito: insere uma, usando o 6o argumento
  const gab=process.argv[7];
  if(!gab){ console.error('bloco sem linha de gabarito — passe a letra como 6o argumento'); process.exit(1); }
  const alts=[...bloco.matchAll(/^[A-E]\) .*$/gm)];
  if(!alts.length){ console.error('nao achei as alternativas para ancorar o gabarito'); process.exit(1); }
  const ultima=alts[alts.length-1];
  const corte=ultima.index+ultima[0].length;
  const linha = gab==='ANULADA'
    ? '**Gabarito oficial: ANULADA** — o INEP anulou esta questão; não há resposta oficial.'
    : '**Gabarito oficial: '+gab+'**';
  cabecaDoBloco = bloco.slice(0,corte)+'\n\n'+linha;
}
if(iGab>=0){ const fimLinha=bloco.indexOf('\n', iGab); cabecaDoBloco=bloco.slice(0, fimLinha<0?bloco.length:fimLinha); }
const novo=fs.readFileSync(novoArq,'utf8').replace(/\s+$/,'');
const blocoNovo=cabecaDoBloco+'\n\n'+novo+'\n\n---\n\n';
t=t.slice(0,i)+blocoNovo+t.slice(fim);
fs.writeFileSync(p,t,'utf8');
console.log('ok: '+arq+' · '+ano+'.'+ed+' Q'+num+'  ('+novo.length+' caracteres de justificativa)');
