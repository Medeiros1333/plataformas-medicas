// limpar_contaminacao.js [--aplicar]
// Quando o marcador da questao seguinte nao e detectado, o texto dela fica colado no fim da
// ultima alternativa (ou do enunciado) da questao anterior. Este script corta esse resto
// usando o proprio inicio da questao seguinte como referencia — nada e adivinhado.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const fB=path.join(ROOT,'dados','_banco_oficial.json');
const B=JSON.parse(fs.readFileSync(fB,'utf8'));

// normaliza guardando, para cada caractere normalizado, a posicao no texto original
function normMapa(s){
  let out='', idx=[];
  let espaco=false;
  for(let i=0;i<s.length;i++){
    const c=s[i].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(/^[a-z0-9]$/.test(c)){ out+=c; idx.push(i); espaco=false; }
    else if(!espaco && out.length){ out+=' '; idx.push(i); espaco=true; }
  }
  return {txt:out, idx};
}
// Duas quebras que denunciam texto da questao seguinte colado:
//  (a) a marca de colisao de colunas seguida de um rabo longo de texto;
//  (b) a lista de alternativas recomecando no meio da ultima alternativa.
function cortarPorSinal(texto){
  const i=texto.indexOf('⟪?⟫');
  if(i>40 && texto.length-i>150) return texto.slice(0,i).replace(/[\s\-–—;,.:]+$/,'').trim();
  const m=texto.slice(60).match(/\s(?:\(A\)|A)\s+[A-ZÀ-Ú][a-zà-ú]{3,}/);
  if(m && m.index!==undefined && (texto.length-(m.index+60))>120) return texto.slice(0, m.index+60).replace(/[\s\-–—;,.:]+$/,'').trim();
  return texto;
}

function cortar(texto, marcadores){
  const {txt, idx}=normMapa(texto);
  let corte=-1;
  for(const mk of marcadores){
    if(mk.length<25) continue;
    const i=txt.indexOf(mk);
    if(i>40 && (corte<0 || i<corte)) corte=i;
  }
  if(corte<0) return texto;
  return texto.slice(0, idx[corte]).replace(/[\s\-–—;,.:]+$/,'').trim();
}

let n=0, campos=0;
for(const ed of Object.keys(B)){
  const nums=Object.keys(B[ed]).map(Number).sort((a,b)=>a-b);
  for(const num of nums){
    const q=B[ed][num];
    // referencias: inicio das proximas 3 questoes existentes
    const marcadores=[];
    for(const d of [1,2,3]){
      const p=B[ed][num+d];
      if(p && p.enunciado) marcadores.push(normMapa(p.enunciado).txt.slice(0,60).trim());
    }
    if(!marcadores.length) continue;
    let mudouQ=false;
    const e=cortarPorSinal(cortar(q.enunciado, marcadores));
    if(e!==q.enunciado && e.length>60){ q.enunciado=e; campos++; mudouQ=true; }
    for(const L of Object.keys(q.alternativas||{})){
      const v=cortarPorSinal(cortar(q.alternativas[L], marcadores));
      if(v!==q.alternativas[L] && v.length>3){ q.alternativas[L]=v; campos++; mudouQ=true; }
    }
    if(mudouQ) n++;
  }
}
console.log('questoes com resto da seguinte removido: '+n+'  ('+campos+' campos)');
if(aplicar){ fs.writeFileSync(fB, JSON.stringify(B,null,1),'utf8'); console.log('gravado em dados/_banco_oficial.json'); }
else console.log('(nada gravado — use --aplicar)');
