// fidelidade_2022.js [LIMIAR] — mede quanto do texto de cada questao de raw/2022.1.json (decifrado) aparece
// literalmente no texto corrido decifrado do caderno (dados/raw_text/2022__Prova_objetiva_2022.1.txt).
// Lista as questoes abaixo do limiar (padrao 0.97) e os trechos nao encontrados.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const lim=+(process.argv[2]||0.97);
const mapa=JSON.parse(fs.readFileSync(R+'/dados/_mapa_cifra.json','utf8'));
const MAI={'\u0004':'A','\u0006':'Á','\u0005':'À','\u0011':'B','\u0012':'C','\u0018':'D','\u001C':'E','\u001E':'É','&':'F',"'":'G',',':'H','/':'I','<':'K','>':'L','D':'M','E':'N','K':'O','W':'P','Y':'Q','Z':'R','^':'S','d':'T','h':'U','s':'V'};
const cif=/[\u0100-\u024F\u0370-\u03FF\u0400-\u04FF]/;
const dec=s=>{if(!cif.test(s))return s;let o='';for(const c of s){o+= MAI[c]!==undefined? MAI[c] : (mapa[c]!==undefined && !/[\x00-\x7f]/.test(c)? mapa[c] : (c==='\u0003'?' ':c));}return o;};
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const corpo=norm(fs.readFileSync(R+'/dados/raw_text/2022__Prova_objetiva_2022.1.txt','utf8').split(/\r?\n/).map(dec).join(' '))
 +' '+norm(fs.readFileSync(R+'/dados/raw_text_layout/2022.1__prova_sp.txt','utf8').split(/\r?\n/).map(dec).join(' '));
const r=JSON.parse(fs.readFileSync(R+'/dados/raw/2022.1.json','utf8'));
for(const q of r){
  const segs=[q.enunciado.replace(/\|[^\n]*\|/g,' '),...Object.values(q.alternativas||{})];
  let ok=0,tot=0;const falta=[];
  for(const s of segs){const w=norm(s).split(' ');for(let i=0;i+5<=w.length;i++){const g=w.slice(i,i+5).join(' ');tot++;if(corpo.includes(g))ok++;else falta.push(g);}}
  const f=tot?ok/tot:1;
  if(f<lim) console.log(q.numero+': '+(100*f).toFixed(0)+'% | '+falta.slice(0,3).join(' ; '));
}
