// decifrar_2026.js [--aplicar] — re-decifra as 100 questoes de 2026.1 a partir do texto CIFRADO guardado em
// _banco_oficial.json['2026.1'] (ou do backup _banco_oficial_pre_2022.1.json), POR PALAVRA:
//  - o caderno mistura trechos em texto claro e trechos na fonte simbolica; na fonte simbolica o espaco e U+0003;
//  - so se decifra a palavra que contem U+0003 ou caractere cifrado (Ā-ӿ); palavra em ASCII puro fica como esta
//    (a decifragem antiga aplicava a tabela de maiusculas ao texto claro: "Mulher" virava "MulUer").
// Mapa: o de 2022.1 (dados/_mapa_cifra.json — mesma fonte) + simbolos/ligaduras conferidos no PDF de 2026.1.
// Sem --aplicar: mostra estatistica de palavras desconhecidas. Com --aplicar: grava enunciado/alternativas em
// dados/raw/2026.1.json (backup antes!).
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const m22=JSON.parse(fs.readFileSync(R+'/dados/_mapa_cifra.json','utf8'));
const MAI={'\u0004':'A','\u0006':'Á','\u0005':'À','\u0011':'B','\u0012':'C','\u0018':'D','\u001C':'E','\u001E':'É','&':'F',"'":'G',',':'H','/':'I',':':'J','<':'K','>':'L','D':'M','E':'N','K':'O','W':'P','Y':'Q','Z':'R','^':'S','d':'T','h':'U','s':'V','\u007F':'Z'};
const EXTRA={'Ж':'₂','Ϲ':'³','С':'³','ϸ':'²','Р':'²','ͻ':'•','Ύ':'*','ǡ':'°','ђ':'µ',
  'ǐ':'ª','Ǒ':'º','п':'x','Ƃ':'ö','ƞ':'tf','Ō':'ft','Ň':'fl','ơ':'tí','Į':'fi','İ':'fí','į':'fi','Ɵ':'ti'};
const cif=/[\u0003Ā-ӿ]/;
const decTok=t=>{let o='';for(const c of t){o+= MAI[c]!==undefined? MAI[c] : EXTRA[c]!==undefined? EXTRA[c] : (m22[c]!==undefined && !/[\x00-\x7f]/.test(c)? m22[c] : (c==='\u0003'?' ':c));}return o;};
const dec=s=>s.split(/( +)/).map(t=>cif.test(t)?decTok(t):t).join('').replace(/ {2,}/g,' ').replace(/^\d+\.\s*ITEM \d+ - V\. \d+\s*/,'').trim();
let B=JSON.parse(fs.readFileSync(R+'/dados/_banco_oficial.json','utf8'))['2026.1'];
if(!B||!Object.keys(B).length||!cif.test(JSON.stringify(B))) B=JSON.parse(fs.readFileSync(R+'/dados/_backup_lote5_20260929/_banco_oficial_pre_2022.1.json','utf8'))['2026.1'];
// vocabulario de referencia: as outras 17 edicoes
const vocab=new Set();for(const f of fs.readdirSync(R+'/dados/raw').filter(f=>/^\d{4}\.\d\.json$/.test(f)&&f!=='2026.1.json')){
  const d=JSON.parse(fs.readFileSync(R+'/dados/raw/'+f,'utf8'));for(const q of (d.questoes||d))for(const w of (q.enunciado+' '+Object.values(q.alternativas||{}).join(' ')).toLowerCase().match(/[a-zà-ÿ]+/g)||[])vocab.add(w);}
const out={};let desc=0,tot=0;const rel=[];
for(const [n,q] of Object.entries(B)){
  const e=dec(q.enunciado), a=Object.fromEntries(Object.entries(q.alternativas).map(([k,v])=>[k,dec(v)]));out[n]={e,a};
  const ws=(e+' '+Object.values(a).join(' ')).toLowerCase().match(/[a-zà-ÿ]+/g)||[];const un=ws.filter(w=>!vocab.has(w)&&w.length>2);
  tot+=ws.length;desc+=un.length;if(un.length)rel.push(n.padStart(3)+': '+un.slice(0,10).join(' '));
}
console.log('palavras: '+tot+' | fora do vocabulario: '+desc+' ('+(100*desc/tot).toFixed(1)+'%)');console.log(rel.join('\n'));
if(aplicar){const fr=R+'/dados/raw/2026.1.json';const raw=JSON.parse(fs.readFileSync(fr,'utf8'));const qs=raw.questoes||raw;
  for(const q of qs){const o=out[q.numero];if(!o)continue;q.enunciado=o.e;q.alternativas=o.a;q.status='redecifrado_por_palavra';}
  fs.writeFileSync(fr,JSON.stringify(raw,null,1));console.log('gravado raw/2026.1.json');}
