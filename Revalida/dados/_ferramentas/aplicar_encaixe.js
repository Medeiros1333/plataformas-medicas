// aplicar_encaixe.js [--aplicar] — aplica dados/_encaixe_decisoes.txt (vale a ULTIMA linha de cada ID)
// "COD" = modulo existente; "+COD" = modulo novo (a criar). Grava modulo_destino e classificacao='manual' no raw.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const ap=process.argv.includes('--aplicar');
const d={};fs.readFileSync(R+'/dados/_encaixe_decisoes.txt','utf8').split('\n').filter(l=>/^INEP/.test(l)).forEach(l=>{const[a,b]=l.trim().split(/\s+/);d[a]=b;});
const porEd={};for(const[id,dest] of Object.entries(d)){const m=id.match(/^INEP(\d{4})-(\d)/);(porEd[m[1]+'.'+m[2]]=porEd[m[1]+'.'+m[2]]||[]).push([id,dest]);}
let n=0,novos=0;
for(const[ed,lista] of Object.entries(porEd)){const p=R+'/dados/raw/'+ed+'.json';const qs=JSON.parse(fs.readFileSync(p,'utf8'));
 for(const[id,dest] of lista){const q=qs.find(x=>x.id===id);if(!q){console.log('?',id);continue;}
  const cod=dest.replace(/^\+/,'');if(dest.startsWith('+'))novos++;q.modulo_destino=cod;q.classificacao='manual';n++;}
 if(ap)fs.writeFileSync(p,JSON.stringify(qs,null,1));}
console.log((ap?'aplicado':'simulacao')+': '+n+' questoes | '+novos+' para modulos novos');
