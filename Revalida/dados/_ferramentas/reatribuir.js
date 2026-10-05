// reatribuir.js ID MODULO [TEMA]
// Move uma questao para outro modulo (corrige classificacao errada).
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const [id, modulo, tema]=process.argv.slice(2);
if(!modulo){ console.error('uso: reatribuir.js INEPAAAA-E-QNNN MODULO [TEMA]'); process.exit(1); }
const m=id.match(/^INEP(\d{4})-(\d)-Q(\d+)$/);
if(!m){ console.error('id invalido'); process.exit(1); }
const ed=m[1]+'.'+m[2];
const p=path.join(ROOT,'dados','raw',ed+'.json');
const d=JSON.parse(fs.readFileSync(p,'utf8'));
const qs=d.questoes||d;
const q=qs.find(x=>x.id===id);
if(!q){ console.error('questao nao encontrada'); process.exit(1); }
const antes=q.modulo_destino;
q.modulo_destino=modulo;
if(tema) q.tema=tema;
q.classificacao='manual';
fs.writeFileSync(p, JSON.stringify(d,null,1),'utf8');
console.log('ok: '+id+'  '+antes+' -> '+modulo+(tema?('  ('+tema+')'):''));
