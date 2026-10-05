// marcar_texto_corrompido.js [--aplicar]
// Algumas provas foram extraidas com fonte simbolica e o texto saiu cifrado
// (ex.: "ŵƵůŚĞƌ" no lugar de "mulher"). Marca essas questoes para que nao entrem
// no banco de estudo nem nas estatisticas de cobertura.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
// caracteres tipicos da cifra: Latin Extended-A/B e Grego usados no lugar de letras comuns
const SUSPEITO=/[\u0100-\u024F\u0370-\u03FF]/g;
function proporcaoEstranha(s){
  if(!s) return 0;
  const letras=(s.match(/[A-Za-zÀ-ÿ\u0100-\u024F\u0370-\u03FF]/g)||[]).length;
  if(letras<40) return 0;
  return ((s.match(SUSPEITO)||[]).length)/letras;
}
let marcadas=0, total=0;
const porEd={};
for(const f of fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f))){
  const p=path.join(ROOT,'dados','raw',f);
  const d=JSON.parse(fs.readFileSync(p,'utf8'));
  const qs=d.questoes||d;
  let n=0;
  for(const q of qs){
    total++;
    const txt=(q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' ');
    const r=proporcaoEstranha(txt);
    if(r>0.12){ q.texto_corrompido=true; q.proporcao_cifrada=+r.toFixed(2); marcadas++; n++; }
    else if(q.texto_corrompido) delete q.texto_corrompido;
  }
  if(n) porEd[f.replace('.json','')]=n;
  if(aplicar) fs.writeFileSync(p, JSON.stringify(d,null,1),'utf8');
}
console.log('questoes com texto cifrado: '+marcadas+' de '+total);
for(const e of Object.keys(porEd).sort()) console.log('   '+e+': '+porEd[e]);
if(!aplicar) console.log('\n(nada gravado — use --aplicar)');
