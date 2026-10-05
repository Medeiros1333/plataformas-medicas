// reescrever_bloco.js ARQ.md ANO ED NUM JUSTIFICATIVA.txt
// Reescreve o bloco inteiro: cabecalho + enunciado e alternativas OFICIAIS + gabarito oficial
// + a justificativa fornecida. Use quando o bloco antigo estava reconstruido/contaminado.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const B=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_banco_oficial.json'),'utf8'));
const [arq,ano,ed,num,just]=process.argv.slice(2);
if(!just){ console.error('uso: reescrever_bloco.js ARQ.md ANO ED NUM JUSTIFICATIVA.txt'); process.exit(1); }
const q=(B[ano+'.'+ed]||{})[num];
if(!q){ console.error('questao oficial nao encontrada: '+ano+'.'+ed+' Q'+num); process.exit(1); }
const p=path.join(ROOT,'modulos',arq);
let t=fs.readFileSync(p,'utf8');
const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';
const i=t.indexOf(cab);
if(i<0){ console.error('bloco nao encontrado: '+cab); process.exit(1); }
let fim=t.length;
for(const c of [t.indexOf('**[INEP ', i+10), t.indexOf('\n## ', i)]) if(c>i && c<fim) fim=c;
const alts=Object.keys(q.alternativas).sort().map(L=>L+') '+q.alternativas[L]).join('\n');
const gab=q.anulada ? '**Gabarito oficial: ANULADA** — o INEP anulou esta questão; não há resposta oficial.'
                    : '**Gabarito oficial: '+q.gabarito_oficial+'**';
const corpo=cab+'\n\n'+q.enunciado+'\n\n'+alts+'\n\n'+gab+'\n\n'+fs.readFileSync(just,'utf8').replace(/\s+$/,'')+'\n\n---\n\n';
t=t.slice(0,i)+corpo+t.slice(fim);
fs.writeFileSync(p,t,'utf8');
console.log('ok: '+arq+' · '+ano+'.'+ed+' Q'+num+' reescrito por inteiro');
