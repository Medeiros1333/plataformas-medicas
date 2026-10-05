// decifrar.js [--aplicar] [EDICAO...]
// Algumas provas sairam da extracao com fonte simbolica: o texto virou uma substituicao
// 1:1 ("ŵƵůŚĞƌ" = "mulher"). Este script quebra a cifra usando como dicionario o proprio
// vocabulario das outras provas, ja legiveis — nenhuma palavra e inventada.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const eds=process.argv.slice(2).filter(a=>/^\d{4}\.\d$/.test(a));

const LETRA=/[A-Za-zÀ-ÿ\u0100-\u024F\u0370-\u03FF]/;
const CIFRA=/[A-Za-z\u00C0-\u00FF\u0100-\u024F\u0370-\u03FF^'&*+<>?@~]/;
const norm=s=>s.toLowerCase();

// 1) vocabulario das provas legiveis
const voc=new Map();   // palavra minuscula -> frequencia
for(const f of fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f))){
  const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',f),'utf8'));
  for(const q of (d.questoes||d)){
    if(q.texto_corrompido) continue;
    const t=(q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' ');
    for(const w of t.split(/[^A-Za-zÀ-ÿ]+/)){
      if(w.length<2) continue;
      const k=norm(w);
      voc.set(k,(voc.get(k)||0)+1);
    }
  }
}
console.log('vocabulario de referencia: '+voc.size+' palavras distintas');

// indexa o vocabulario por "padrao" (assinatura de letras repetidas) e comprimento
const padrao=w=>{ const m={}; let p='',n=0; for(const c of w){ if(!(c in m)) m[c]=n++; p+=String.fromCharCode(97+m[c]); } return p; };
const porPadrao=new Map();
for(const [w,freq] of voc){ const p=padrao(w); if(!porPadrao.has(p)) porPadrao.set(p,[]); porPadrao.get(p).push([w,freq]); }
for(const arr of porPadrao.values()) arr.sort((a,b)=>b[1]-a[1]);

// 2) palavras cifradas
const alvoEds = eds.length? eds : fs.readdirSync(path.join(ROOT,'dados','raw'))
  .filter(f=>/^\d{4}\.\d\.json$/.test(f)).map(f=>f.replace('.json',''))
  .filter(ed=>{ const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',ed+'.json'),'utf8')); return (d.questoes||d).some(q=>q.texto_corrompido); });
if(!alvoEds.length){ console.log('nenhuma edicao com texto cifrado'); process.exit(0); }
console.log('edicoes a decifrar: '+alvoEds.join(', '));

const palCif=new Map();
const textos=[];
for(const ed of alvoEds){
  const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',ed+'.json'),'utf8'));
  for(const q of (d.questoes||d)){
    if(!q.texto_corrompido) continue;
    const t=(q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' ');
    textos.push(t);
    for(const w of t.split(/[^A-Za-zÀ-ÿ\u0100-\u024F\u0370-\u03FF'^&*+<>?@~]+/)){
      if(w.length<2 || !CIFRA.test(w)) continue;
      palCif.set(w,(palCif.get(w)||0)+1);
    }
  }
}
console.log('palavras cifradas distintas: '+palCif.size);

// 3) mapa inicial a partir das palavras cifradas mais comuns
let mapa={};          // cifra -> claro
// Sementes conferidas a olho contra palavras inequivocas do proprio caderno.
// As MAIUSCULAS desta fonte caem em caracteres de controle/ASCII, em ordem alfabetica:
// A=U+0004  B=U+0011  C=U+0012  D=U+0018  E=U+001C  G=U+0027  H=U+002C
// M=U+0044  N=U+0045  Q=U+0059  S=U+005E  U=U+0068
const SEMENTES={
  '\u0004':'a', '\u0011':'b', '\u0012':'c', '\u0018':'d', '\u001C':'e',
  "'":'g', 'D':'m', 'E':'n', 'Y':'q', '^':'s', 'h':'u',
  '\u0003':' ', '\u015A':'h'
};
const SEMENTES_MAIUSCULAS=new Set(['\u0004','\u0011','\u0012','\u0018','\u001C',"'",'D','E','Y','^','h']);
const usado=()=>new Set(Object.values(mapa));
// Um mesmo valor ('m') pode ser usado por dois simbolos: um para 'M' e outro para 'm'.
// Por isso a unicidade do mapa inverso e verificada por classe, nao globalmente.
const MAIUSC=/^[A-Z'^&*+<>?@~]$/;
let MAIUSCULAS=new Set();
const chaveInv=(c,v)=> (MAIUSC.test(c)?'U:':'l:')+v;

function compativel(cif, claro){
  if(cif.length!==claro.length) return false;
  const m={...mapa}, inv={}; for(const [k,v] of Object.entries(m)) inv[chaveInv(k,v)]=k;
  for(let i=0;i<cif.length;i++){
    const c=cif[i], p=norm(claro[i]);
    if(!CIFRA.test(c)){ if(norm(c)!==p) return false; continue; }
    if(m[c]!==undefined){ if(m[c]!==p) return false; }
    else { const ki=chaveInv(c,p); if(inv[ki]!==undefined && inv[ki]!==c) return false; m[c]=p; inv[ki]=c; }
  }
  return m;
}
// Em vez de apostar numa unica palavra candidata, so aceitamos as atribuicoes em que
// TODAS as candidatas compativeis concordam. E mais lento e muito mais seguro.
function tentar(){
  let ganhos=0;
  const ordem=[...palCif.entries()].sort((a,b)=>
    (b[0].length-a[0].length) || (b[1]-a[1]));
  for(const [cif] of ordem){
    if(cif.length<MINPAL) continue;
    const p=padrao(cif);
    const cands=[];
    for(const [w] of (porPadrao.get(p)||[])){
      const r=compativel(cif,w);
      if(r!==false) cands.push(r);
      if(cands.length>40) break;
    }
    if(!cands.length) continue;
    // interseccao: letra so entra se todas as candidatas derem o mesmo valor
    const base=Object.keys(mapa).length;
    const novoMapa={...mapa};
    const inv={}; for(const [kk,vv] of Object.entries(novoMapa)) inv[chaveInv(kk,vv)]=kk;
    for(const c of new Set(cif)){
      if(novoMapa[c]!==undefined || !CIFRA.test(c)) continue;
      const vals=new Set(cands.map(r=>r[c]));
      if(vals.size!==1) continue;
      const v=[...vals][0];
      if(v===undefined || inv[chaveInv(c,v)]!==undefined) continue;
      novoMapa[c]=v; inv[chaveInv(c,v)]=c;
    }
    mapa=novoMapa;
    ganhos+=Object.keys(mapa).length-base;
  }
  return ganhos;
}
let MINPAL=4;
for(const passo of [4,3,2]){ MINPAL=passo; for(let i=0;i<8;i++){ const g=tentar(); if(!g) break; } }
console.log('letras resolvidas: '+Object.keys(mapa).length);
const mapaSolver=new Set(Object.keys(mapa));   // resolvidas por restricao — nao se mexe

// 4) pontuacao e digitos: deslocamento fixo ja conhecido dos digitos (+0x3BC)
for(let d=0; d<=9; d++) mapa[String.fromCodePoint(0x30+d+0x3BC)]=String(d);
const PONT={'\u0355':',', '\u0358':'.', '\u0357':':', '\u0356':';', '\u035C':'>', '\u0353':'*', '\u0348':'(', '\u0349':')', '\u034D':'-', '\u034F':'/', '\u0352':'+', '\u035E':'?', '\u0342':'"', '\u0341':'!', '\u0350':'%', '\u0343':'#', '\u0346':'&'};
Object.assign(mapa, PONT);
// ligaduras tipograficas: um unico glifo que vale duas letras
mapa['\u019F']='ti';

const PREFIXO=/^\s*(?:\d{1,3}\s*\.\s*)?ITEM\s+\d+\s*-\s*V\.\s*\d+\s*/;

function decifrar(s){
  const pre=(s.match(PREFIXO)||[''])[0];
  if(pre) s=s.slice(pre.length);
  let out='';
  for(const c of s){
    if(mapa[c]!==undefined){
      const p=mapa[c];
      // simbolos ASCII maiusculos (e alguns sinais) representam letras MAIUSCULAS
      out += MAIUSCULAS.has(c) ? p.charAt(0).toUpperCase()+p.slice(1) : p;
    } else out+=c;
  }
  return out.replace(/\u0003/g,' ').replace(/\u0004/g,' ').replace(/ {2,}/g,' ');
}

// 4b) simbolos que sobraram: testa letra a letra e fica com a que mais faz o texto
//     bater com o vocabulario de referencia. Nenhuma palavra e inventada — o criterio
//     e sempre "quantas palavras passam a existir no vocabulario real".
function taxa(m){
  let ok=0, tot=0;
  for(const [cif,n] of palCif){
    let d='';
    for(const c of cif) d += (m[c]!==undefined? m[c] : c);
    tot+=n; if(voc.has(d.toLowerCase())) ok+=n;
  }
  return ok/tot;
}
{
  // a fonte tem glifos duplicados e ligaduras: 'fi' e 'ti' sao um unico simbolo
  const ALFA='abcdefghijklmnopqrstuvwxyzáàâãéêíóôõúçñ'.split('').concat(['fi','fl','ti','ff','ffi']);
  const freq={};
  for(const [cif,n] of palCif) for(const c of cif) if(mapa[c]===undefined && CIFRA.test(c)) freq[c]=(freq[c]||0)+n;
  const pendentes=Object.entries(freq).sort((a,b)=>b[1]-a[1]).map(([c])=>c);
  let base=taxa(mapa);
  for(const c of pendentes){
    let melhor=null, melhorTaxa=base;
    const usados=new Set();   // a fonte reaproveita letras em glifos diferentes
    for(const letra of ALFA){
      if(usados.has(letra)) continue;
      const m={...mapa}; m[c]=letra;
      const tx=taxa(m);
      if(tx>melhorTaxa+0.0005){ melhorTaxa=tx; melhor=letra; }
    }
    if(melhor){ mapa[c]=melhor; base=melhorTaxa; }
  }
    // quem aparece quase so em inicio de palavra, e divide a letra com outro glifo, e maiuscula
  const ini={}, tot={};
  for(const [cif,n] of palCif){
    for(let i2=0;i2<cif.length;i2++){ const c=cif[i2]; tot[c]=(tot[c]||0)+n; if(i2===0) ini[c]=(ini[c]||0)+n; }
  }
  MAIUSCULAS=new Set();
  const porLetra={};
  for(const [c,v] of Object.entries(mapa)) if(typeof v==='string' && /^[a-zà-ÿ]/.test(v)) (porLetra[v]=porLetra[v]||[]).push(c);
  for(const [c,v] of Object.entries(mapa)){
    if(!tot[c]) continue;
    const r=(ini[c]||0)/tot[c];
    if(r>0.75 && (porLetra[v]||[]).length>1) MAIUSCULAS.add(c);
    if(/^[A-Z'^&*+<>?@~]$/.test(c)) MAIUSCULAS.add(c);
  }
  // Passe final dedicado as INICIAIS: simbolos que so aparecem comecando palavra sao
  // letras maiusculas. Testa cada letra e fica com a que forma palavras reais.
  {
    const ini2={}, tot2={}, ocorr={};
    for(const [cif,n] of palCif){
      for(let k2=0;k2<cif.length;k2++){ const c=cif[k2]; tot2[c]=(tot2[c]||0)+n; if(k2===0){ ini2[c]=(ini2[c]||0)+n; (ocorr[c]=ocorr[c]||[]).push([cif,n]); } }
    }
    const LET='abcdefghijklmnopqrstuvwxyz'.split('');
    for(const c of Object.keys(tot2)){
      // nao mexe no que o solver ja resolveu com certeza
      if(mapaSolver.has(c)) continue;
      if((ini2[c]||0)/tot2[c] < 0.92) continue;
      const lista=ocorr[c]||[];
      if(lista.length<4) continue;
      const pontuar=(letra)=>{
        let p2=0;
        for(const [w,n] of lista){
          let d=letra;
          for(const ch of w.slice(1)) d += (mapa[ch]!==undefined? mapa[ch] : ch);
          if(voc.has(d.toLowerCase())) p2+=n;
        }
        return p2;
      };
      const base2 = mapa[c]!==undefined ? pontuar(mapa[c]) : 0;
      let melhor=mapa[c], pontos=base2;
      for(const letra of LET){
        const p2=pontuar(letra);
        if(p2>pontos){ pontos=p2; melhor=letra; }
      }
      if(pontos>base2 && melhor!==undefined){ mapa[c]=melhor; MAIUSCULAS.add(c); }
    }
  }
    // correcoes conferidas a olho: tem a ultima palavra
  Object.assign(mapa, SEMENTES);
  for(const c of SEMENTES_MAIUSCULAS) MAIUSCULAS.add(c);
  // 2022.1 (2026-10-01): a fonte desta prova usa mais maiusculas em ASCII/controle (mesma ordem
  // alfabetica) e outros simbolos de pontuacao. Conferidos a olho pelas palavras que iniciam.
  if(alvoEds.includes('2022.1')){
    const MAI22={'&':'f', ',':'h', '/':'i', ':':'j', '<':'k', '>':'l', 'K':'o', 'W':'p', 'Z':'r', 'd':'t', 's':'v', '\u007F':'z', '\u0006':'á',
      '\u0005':'à', '\u001E':'é'};
    Object.assign(mapa, {'Ǉ':'y', 'Ŭ':'k', 'ǁ':'w', 'ǐ':'ª', 'Ǒ':'º', 'ʹ':'–', 'ʹ':'–','Η':'"'});
    Object.assign(mapa, MAI22); for(const c of Object.keys(MAI22)) MAIUSCULAS.add(c);
    Object.assign(mapa, {'͍':'?', 'Ͳ':'-', 'ͳ':'-', 'ͬ':'/', ';':'(', 'Ϳ':')', '΀':'[', '΁':']',
      'й':'%', 'с':'=', 'н':'+', '͞':'“', '͟':'”', 'ȗ':'°', 'Σ':'°',
      'х':'>', 'ф':'<', 'ш':'≥', 'ч':'≤'});
  }
  console.log('apos o ajuste fino: '+Object.keys(mapa).length+' simbolos mapeados | maiusculas: '+MAIUSCULAS.size);
}
// 5) taxa de acerto: quantas palavras decifradas existem no vocabulario
let ok=0, tot=0;
for(const [cif,n] of palCif){ const d=decifrar(cif).toLowerCase(); tot+=n; if(voc.has(d)) ok+=n; }
console.log('palavras decifradas reconhecidas: '+(100*ok/tot).toFixed(1)+'%');
if(process.argv.includes('--falhas')){
  const ruins=[];
  for(const [cif,n] of palCif){ const d=decifrar(cif).toLowerCase(); if(!voc.has(d)) ruins.push([d,n,cif]); }
  ruins.sort((a,b)=>b[1]-a[1]);
  console.log('\npalavras que nao bateram (top 40):');
  console.log('  '+ruins.slice(0,40).map(r=>r[0]+'('+r[1]+')').join('  '));
}
if(process.argv.includes('--mapa')){
  const ent=Object.entries(mapa).filter(([k])=>/[\u0100-\u024F\u0370-\u03FF]/.test(k)).sort((a,b)=>a[0].codePointAt(0)-b[0].codePointAt(0));
  console.log('\nMAPA minusculas (por codepoint):');
  console.log('  '+ent.map(([k,v])=>k+'='+v).join('  '));
  const asc=Object.entries(mapa).filter(([k])=>/^[A-Z'^&*+<>?@~]$/.test(k)).sort();
  console.log('\nMAPA maiusculas: '+asc.map(([k,v])=>k+'='+String(v).toUpperCase()).join('  '));
}
console.log('\nAMOSTRA:');
for(const t of textos.slice(0,2)) console.log('  '+decifrar(t).slice(0,300)+'\n');

if(!aplicar){ console.log('(nada gravado — use --aplicar)'); process.exit(0); }
for(const ed of alvoEds){
  const p=path.join(ROOT,'dados','raw',ed+'.json');
  const d=JSON.parse(fs.readFileSync(p,'utf8'));
  for(const q of (d.questoes||d)){
    if(!q.texto_corrompido) continue;
    q.enunciado=decifrar(q.enunciado||'');
    for(const L of Object.keys(q.alternativas||{})) q.alternativas[L]=decifrar(q.alternativas[L]);
    q.decifrado=true;
    q.revisao_recomendada=true;   // a decifracao acerta ~85% das palavras: conferir antes de usar
    delete q.texto_corrompido;
  }
  fs.writeFileSync(p, JSON.stringify(d,null,1),'utf8');
}
fs.writeFileSync(path.join(ROOT,'dados','_mapa_cifra.json'), JSON.stringify(mapa,null,1),'utf8');
console.log('gravado; mapa da cifra em dados/_mapa_cifra.json');
