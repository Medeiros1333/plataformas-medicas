// verificar_tudo.js — checagem unica de integridade da plataforma
const { execFileSync } = require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const roda=(s,a=[])=>{ try{ return execFileSync('node',[path.join(ROOT,s),...a],{encoding:'utf8',maxBuffer:64*1024*1024}); }catch(e){ return 'ERRO: '+(e.stderr||e.message||'').slice(0,200); } };
const linha=(t,re)=>{ const m=t.match(re); return m? m[0] : '(nao encontrado)'; };

console.log('== 1. gabaritos do banco vs PDF oficial ==');
console.log('   '+linha(roda('dados/_ferramentas/cmp.js'), /TOTAL comparado:.*/));
{
  // 2014.1 e 2020.1 foram extraidas do GABARITO PRELIMINAR do INEP, nao do
  // definitivo. Comparar o banco contra esse mesmo arquivo nao prova nada
  // sobre elas — e a mesma circularidade que invalidava o renum3.js.
  const B=JSON.parse(fs.readFileSync('dados/_banco_oficial.json','utf8'));
  let n=0; for(const ed of Object.keys(B)) for(const q of Object.keys(B[ed])) if(B[ed][q].gabarito_preliminar) n++;
}

console.log('== 2. blocos escritos vs caderno oficial ==');
const a=roda('dados/_ferramentas/auditar_modulos.js');
for(const l of a.split('\n').filter(l=>/blocos analisados|ja corretos|numero errado|gabarito errado|sem par/.test(l))) console.log('   '+l.trim());

console.log('== 2b. estrutura dos modulos (integridade.js) ==');
console.log('   '+linha(roda('dados/_ferramentas/integridade.js'), /modulos verificados:.*/));

console.log('== 3. hub ==');
const hub=fs.readFileSync(path.join(ROOT,'hub','revalida_hub.html'),'utf8');
console.log('   tamanho: '+(hub.length/1048576).toFixed(2)+' MB');
let sintaxe='OK';
const RE=/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g; let m;
while((m=RE.exec(hub))){ try{ new Function(m[1]); }catch(e){ sintaxe='ERRO: '+e.message.slice(0,80); } }
console.log('   JS: '+sintaxe);
console.log('   QMETA: '+(/const QMETA\s*=/.test(hub)?'sim':'NAO')+' | filtros: '+(/qfiltros/.test(hub)?'sim':'NAO')+' | simulado: '+(/renderSimuladoAtivo/.test(hub)?'sim':'NAO'));
const o=JSON.parse(hub.match(/const CONTEUDO_MODULOS = (\{[\s\S]*?\});/)[1]);
const B=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_banco_oficial.json'),'utf8'));
let tot=0, ok=0, dif=0, sem=0;
for(const k of Object.keys(o)) for(const q of (o[k].questoes||[])){
  tot++;
  const mm=(q.id||'').match(/^INEP(\d{4})-(\d)-Q(\d+)$/);
  const of=mm? (B[mm[1]+'.'+mm[2]]||{})[String(+mm[3])] : null;
  if(!of){ sem++; continue; }
  const certo=of.anulada?'ANULADA':of.gabarito_oficial;
  const meu=q.anulada?'ANULADA':q.gabarito_oficial;
  if(String(meu)===String(certo)) ok++; else dif++;
}
console.log('   modulos: '+Object.keys(o).length+' | questoes interativas: '+tot);
console.log('   gabaritos conferem: '+ok+' | DIVERGE: '+dif+' | sem referencia oficial: '+sem);

console.log('== 4. cobertura ==');
const mm=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','mapa_mestre.json'),'utf8'));
const escritos=new Set();
for(const f of fs.readdirSync(path.join(ROOT,'modulos')).filter(f=>f.endsWith('.md'))){
  const t=fs.readFileSync(path.join(ROOT,'modulos',f),'utf8');
  const re=/\*\*\[INEP (\d{4}) · Edição (\d) · Questão (\d+)\]\*\*/g; let x;
  while((x=re.exec(t))) escritos.add('INEP'+x[1]+'-'+x[2]+'-Q'+String(+x[3]).padStart(3,'0'));
}
console.log('   questoes no banco: '+mm.length+' | com justificativa escrita: '+escritos.size+
            '  ('+(100*escritos.size/mm.length).toFixed(1)+'%)');
const semMod=mm.filter(q=>!q.modulo_destino).length;
console.log('   sem modulo atribuido: '+semMod);
