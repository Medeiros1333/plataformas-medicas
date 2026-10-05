// lacunas.js PREFIXO [--novos|--existentes] [--resumo]
// Lista as questoes (todas as edicoes; 2026.1 incluida desde o lote 15, texto conferido no PDF) com modulo_destino comecando por PREFIXO que ainda NAO tem
// bloco escrito no modulo de destino. Por padrao imprime enunciado + alternativas + gabarito
// oficial, agrupadas por modulo (pronto para escrever os blocos).
//   --existentes : so modulos que ja tem .md      --novos : so modulos sem .md (a criar)
//   --resumo     : so a contagem por modulo
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const a=process.argv.slice(2);const pref=a.find(x=>!x.startsWith('--'))||'';
const mods={};for(const f of fs.readdirSync(R+'/modulos'))if(f.endsWith('.md'))mods[f.split('_')[0]]=fs.readFileSync(R+'/modulos/'+f,'utf8');
const G=JSON.parse(fs.readFileSync(R+'/dados/_gabaritos_oficiais.json','utf8'));
const por={};
for(const f of fs.readdirSync(R+'/dados/raw').filter(x=>/^\d{4}\.\d\.json$/.test(x))){
  const ed=f.replace('.json','');const [ano,e]=ed.split('.');
  for(const q of JSON.parse(fs.readFileSync(R+'/dados/raw/'+f,'utf8'))){
    const m=q.modulo_destino;if(!m||!m.startsWith(pref))continue;
    if(a.includes('--novos')&&mods[m])continue;if(a.includes('--existentes')&&!mods[m])continue;
    const cab='**[INEP '+ano+' · Edição '+e+' · Questão '+q.numero+']**';if(mods[m]&&mods[m].includes(cab))continue;
    (por[m]=por[m]||[]).push({ed,q,gab:q.anulada?'ANULADA':((G[ed]||{})[q.numero]||q.gabarito_oficial)});
  }
}
const ks=Object.keys(por).sort((x,y)=>x.localeCompare(y,undefined,{numeric:true}));let tot=0;
for(const m of ks){tot+=por[m].length;
  if(a.includes('--resumo')){console.log(m.padEnd(9),String(por[m].length).padStart(3),mods[m]?'':'(novo)');continue;}
  const tit=mods[m]?(mods[m].match(/\*\*Tema:\*\* ([^·]+)/)||[])[1]:'(modulo a criar)';
  console.log('\n##### '+m+' — '+(tit||'').trim()+' ('+por[m].length+')');
  for(const {ed,q,gab} of por[m]){console.log('\n--- '+ed+'-Q'+q.numero+'  GAB '+gab);console.log(q.enunciado);
    for(const [L,t] of Object.entries(q.alternativas||{}))console.log('  '+L+') '+t);}
}
console.log('\nTOTAL',tot);
