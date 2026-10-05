// conferir_alternativas.js [--desde AAAA-MM-DD] — compara o texto das alternativas de cada bloco
// com o _banco_oficial.json e lista as que divergem (similaridade de palavras < limiar).
// Serve para pegar erro de transcricao ao escrever blocos. Divergencia pode ser legitima
// (banco com texto cortado/colado; bloco restaurado do caderno) — conferir no layout.js.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const B=JSON.parse(fs.readFileSync(R+'/dados/_banco_oficial.json','utf8'));
const LIM=parseFloat(process.argv[2]||'0.8');
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/⟪\?⟫/g,' ').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean);
const sim=(a,b)=>{const A=norm(a),Bb=norm(b);if(!A.length||!Bb.length)return 0;const sb=new Set(Bb);let c=0;A.forEach(w=>{if(sb.has(w))c++});const sa=new Set(A);let d=0;Bb.forEach(w=>{if(sa.has(w))d++});return Math.max(c/A.length,d/Bb.length);};
const re=/\*\*\[INEP (\d{4}) · Edição (\d) · Questão (\d+)\]\*\*([\s\S]*?)\*\*Gabarito oficial/g;
let n=0,prob=[];
for(const f of fs.readdirSync(R+'/modulos')){const t=fs.readFileSync(R+'/modulos/'+f,'utf8');let m;
 while((m=re.exec(t))){const ed=m[1]+'.'+m[2],num=m[3];const q=(B[ed]||{})[num];if(!q)continue;n++;
  const alts={};for(const l of m[4].split('\n')){const a=l.match(/^([A-E])\)\s+(.*)$/);if(a)alts[a[1]]=a[2];}
  for(const [k,v] of Object.entries(q.alternativas||{})){if(!alts[k])continue;const s=sim(alts[k],v);
   if(s<LIM)prob.push(`${f.split('_')[0]} ${ed}-Q${num} ${k} sim=${s.toFixed(2)}\n   bloco: ${alts[k].slice(0,110)}\n   banco: ${String(v).slice(0,110)}`);}}}
console.log('blocos comparados:',n,'| alternativas divergentes:',prob.length);prob.forEach(p=>console.log(p));
