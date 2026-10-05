// renumerar_bloco.js ARQ.md ANO ED NUM_ATUAL NUM_CERTO
// Troca o numero no cabecalho de um bloco de questao ja escrito e registra a correcao.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const [arq, ano, ed, de, para]=process.argv.slice(2);
if(!para){ console.error('uso: renumerar_bloco.js ARQ.md ANO ED NUM_ATUAL NUM_CERTO'); process.exit(1); }
const p=path.join(ROOT,'modulos',arq);
let t=fs.readFileSync(p,'utf8');
const alvo='**[INEP '+ano+' · Edição '+ed+' · Questão '+de+']**';
if(!t.includes(alvo)){ console.error('bloco nao encontrado: '+alvo); process.exit(1); }
const novo='**[INEP '+ano+' · Edição '+ed+' · Questão '+para+']**';
t=t.replace(alvo, novo);
// atualiza tambem a lista de ids do cabecalho do modulo, se citada
const velhoId=ano+'.'+ed+'-Q'+String(de).padStart(2,'0');
const novoId=ano+'.'+ed+'-Q'+String(para).padStart(2,'0');
t=t.split(velhoId).join(novoId);
t=t.split(ano+'.'+ed+'-Q'+de).join(ano+'.'+ed+'-Q'+para);
fs.writeFileSync(p,t,'utf8');
console.log('ok: '+arq+'  Q'+de+' -> Q'+para);
