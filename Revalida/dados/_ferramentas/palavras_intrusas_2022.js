// palavras_intrusas_2022.js — procura palavras soltas inseridas por engano (ex.: "Cerca de tireoide 4 horas") nas
// questoes de raw/2022.1.json que NAO foram transcritas do PDF: lista trigramas ausentes do texto corrido
// decifrado (dados/raw_text/2022__Prova_objetiva_2022.1.txt). Conferir cada achado no PDF.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const mapa=JSON.parse(fs.readFileSync(R+'/dados/_mapa_cifra.json','utf8'));
const MAI={'\u0004':'A','\u0006':'Á','\u0005':'À','\u0011':'B','\u0012':'C','\u0018':'D','\u001C':'E','\u001E':'É','&':'F',"'":'G',',':'H','/':'I',':':'J','<':'K','>':'L','D':'M','E':'N','K':'O','W':'P','Y':'Q','Z':'R','^':'S','d':'T','h':'U','s':'V','\u007F':'Z'};
const cif=/[Ā-ɏͰ-ϿЀ-ӿ]/;
const dec=s=>{if(!cif.test(s))return s;let o='';for(const c of s){o+= MAI[c]!==undefined? MAI[c] : (mapa[c]!==undefined && !/[\x00-\x7f]/.test(c)? mapa[c] : (c==='\u0003'?' ':c));}return o;};
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const corpo=' '+norm(fs.readFileSync(R+'/dados/raw_text/2022__Prova_objetiva_2022.1.txt','utf8').split(/\r?\n/).map(dec).join(' '))+' ';
const r=JSON.parse(fs.readFileSync(R+'/dados/raw/2022.1.json','utf8'));
for(const q of r){ if(q.reconstrucao_manual) continue;
  const segs=[q.enunciado,...Object.values(q.alternativas||{})];const falta=[];
  for(const s of segs){const w=norm(s).split(' ');for(let i=0;i+3<=w.length;i++){const g=w.slice(i,i+3).join(' ');if(!corpo.includes(' '+g+' '))falta.push(g);}}
  if(falta.length) console.log(q.numero+' ('+falta.length+'): '+falta.slice(0,8).join(' ; '));
}
