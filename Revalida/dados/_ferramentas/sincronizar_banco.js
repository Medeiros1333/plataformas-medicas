// sincronizar_banco.js ANO.ED NUM [ANO.ED NUM ...] [--aplicar]
// Copia enunciado + alternativas do BLOCO do modulo (texto ja conferido no caderno)
// para dados/raw/ANO.ED.json e dados/_banco_oficial.json.
// Use quando o banco esta danificado (capitular "A partir..." lida como alternativa A,
// enunciado truncado etc.) e o bloco esta correto. Sem --aplicar, so mostra o diff.
// Marcadores de imagem "*[... nao reproduzid...]*" viram "[imagem]" no banco.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const args=process.argv.slice(2);const aplicar=args.includes('--aplicar');
const pares=[];const a2=args.filter(x=>x!=='--aplicar');
for(let i=0;i<a2.length;i+=2)pares.push([a2[i],+a2[i+1]]);
if(!pares.length){console.error('uso: sincronizar_banco.js 2014.1 24 [2024.2 28 ...] [--aplicar]');process.exit(1);}
const mods=fs.readdirSync(R+'/modulos').filter(f=>f.endsWith('.md')).map(f=>[f,fs.readFileSync(R+'/modulos/'+f,'utf8')]);
const bp=R+'/dados/_banco_oficial.json';const B=JSON.parse(fs.readFileSync(bp,'utf8'));
const raws={};let mudou=0;
for(const [ae,num] of pares){
  const [ano,ed]=ae.split('.');const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';
  const m=mods.find(([f,t])=>t.includes(cab));if(!m){console.log('✗',ae,num,'sem bloco');continue;}
  const t=m[1];const i=t.indexOf(cab)+cab.length;const g=t.indexOf('**Gabarito oficial',i);
  const corpo=t.slice(i,g).trim().split('\n');
  const alts={};const enun=[];
  for(const l of corpo){const mm=l.match(/^([A-E])\) (.*)$/);if(mm)alts[mm[1]]=mm[2].trim();else if(!Object.keys(alts).length)enun.push(l);}
  let e=enun.join('\n').replace(/\*\[[^\]]*não reproduzid[^\]]*\]\*/g,'[imagem]').replace(/\n{2,}/g,' ').replace(/\n/g,' ').trim();
  if(!e||Object.keys(alts).length<4){console.log('✗',ae,num,'bloco sem enunciado/alternativas completos');continue;}
  if(!raws[ae])raws[ae]=JSON.parse(fs.readFileSync(R+'/dados/raw/'+ae+'.json','utf8'));
  const q=raws[ae].find(x=>x.numero==num);const b=B[ae]&&B[ae][String(num)];
  if(!q||!b){console.log('✗',ae,num,'nao esta no raw/banco');continue;}
  const antes=JSON.stringify([q.enunciado,q.alternativas]);
  console.log('—',ae,'Q'+num,'('+m[0].split('_')[0]+')');
  if(q.enunciado!==e)console.log('   enunciado: "'+String(q.enunciado).slice(0,70)+'…" → "'+e.slice(0,70)+'…"');
  for(const L of Object.keys(alts))if((q.alternativas||{})[L]!==alts[L])console.log('   '+L+': "'+String((q.alternativas||{})[L]).slice(0,50)+'" → "'+alts[L].slice(0,50)+'"');
  for(const L of Object.keys(q.alternativas||{}))if(!(L in alts))console.log('   '+L+': removida');
  q.enunciado=e;q.alternativas=alts;b.enunciado=e;b.alternativas=alts;
  if(JSON.stringify([q.enunciado,q.alternativas])!==antes)mudou++;
}
if(aplicar&&mudou){
  for(const ae in raws)fs.writeFileSync(R+'/dados/raw/'+ae+'.json',JSON.stringify(raws[ae],null,1));
  fs.writeFileSync(bp,JSON.stringify(B));console.log('✓ aplicado em',mudou,'questoes');
}else console.log(mudou+' questoes seriam alteradas'+(aplicar?'':' (use --aplicar)'));
