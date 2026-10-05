// decifrar_trecho.js ARQUIVO_TXT TRECHO_CLARO [N_LINHAS]
// Ajuda a reconstruir manualmente questoes de 2022.1/2026.1 (fonte cifrada): procura no arquivo
// cifrado (dados/raw_text/...) a linha cujo texto DECIFRADO contem TRECHO_CLARO e imprime as
// N_LINHAS seguintes ja decifradas com dados/_mapa_cifra.json. Nao grava nada.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const [arq,trecho,nl]=process.argv.slice(2);
const mapa=JSON.parse(fs.readFileSync(R+'/dados/_mapa_cifra.json','utf8'));
// maiusculas da fonte (codigos ASCII/controle em ordem alfabetica)
const MAI={'\u0004':'A','\u0006':'Á','\u0005':'À','\u0011':'B','\u0012':'C','\u0018':'D','\u001C':'E','\u001E':'É','&':'F',"'":'G',',':'H','/':'I','<':'K','>':'L','D':'M','E':'N','K':'O','W':'P','Y':'Q','Z':'R','^':'S','d':'T','h':'U','s':'V'};
const dec=s=>{let o='';for(const c of s){o+= MAI[c]!==undefined? MAI[c] : (mapa[c]!==undefined && !/[\x00-\x7f]/.test(c)? mapa[c] : (c==='\u0003'?' ':c));}return o.replace(/ {2,}/g,' ');};
const L=fs.readFileSync(path.isAbsolute(arq)?arq:path.join(R,arq),'utf8').split(/\r?\n/);
const D=L.map(dec);
let i=L.findIndex(x=>x.trim()===trecho||x.includes(trecho+" ")||x.endsWith(trecho)); if(i<0) i=D.findIndex(x=>x.includes(trecho));
if(i<0){console.log('trecho nao encontrado');process.exit(1);}
for(let k=i;k<Math.min(D.length,i+(+nl||30));k++) console.log(k+': '+D[k]);
