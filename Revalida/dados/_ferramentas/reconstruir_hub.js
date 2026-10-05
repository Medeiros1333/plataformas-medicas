// reconstruir_hub.js
// Regera o conteudo de TODOS os modulos .md e injeta tudo no hub de uma vez.
// Use sempre que os arquivos .md forem editados em lote.
const { execFileSync } = require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const PREP=path.join(ROOT,'dados','_scripts','preparar_conteudo_modulo.js');
const INJ=path.join(ROOT,'dados','_scripts','injetar_no_hub.js');
const MODS=path.join(ROOT,'modulos');

const arquivos=fs.readdirSync(MODS).filter(f=>f.endsWith('.md'));
const codigos=[], falhas=[];
for(const f of arquivos){
  const cod=f.split('_')[0];
  try{
    const saida=execFileSync('node',[PREP, cod, path.join(MODS,f)],{encoding:'utf8', maxBuffer:64*1024*1024});
    JSON.parse(saida);   // valida antes de gravar
    fs.writeFileSync(path.join(ROOT,'dados','_scripts','_conteudo_'+cod+'.json'), saida, 'utf8');
    codigos.push(cod);
  }catch(e){ falhas.push({cod, erro:(e.stderr||e.message||'').slice(0,120)}); }
}
console.log('conteudo regenerado: '+codigos.length+' modulos | falhas: '+falhas.length);
for(const f of falhas.slice(0,15)) console.log('   '+f.cod+': '+f.erro.replace(/\s+/g,' '));

// injeta em lotes para nao estourar a linha de comando
const LOTE=60;
for(let i=0;i<codigos.length;i+=LOTE){
  const parte=codigos.slice(i,i+LOTE);
  execFileSync('node',[INJ, ...parte],{encoding:'utf8', maxBuffer:64*1024*1024});
}
const hub=fs.readFileSync(path.join(ROOT,'hub','revalida_hub.html'),'utf8');
console.log('hub: '+(hub.length/1048576).toFixed(2)+' MB');
const m=hub.match(/const CONTEUDO_MODULOS = (\{[\s\S]*?\});/);
if(m){ try{ const o=JSON.parse(m[1]); 
  const nq=Object.values(o).reduce((a,x)=>a+((x.questoes||[]).length),0);
  console.log('modulos no hub: '+Object.keys(o).length+' | questoes interativas: '+nq);
}catch(e){ console.log('CONTEUDO_MODULOS nao parseavel: '+e.message.slice(0,80)); } }
