const fs=require('fs'), path=require('path');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const mods=JSON.parse(fs.readFileSync(ROOT+'/dados/modulos.json','utf8'));
const byCod={}; mods.forEach(m=>byCod[m.codigo]=m);
const files=fs.readdirSync(ROOT+'/modulos').filter(f=>f.endsWith('.md'));

// indexa TODAS as questoes do raw por id
const RAW=ROOT+'/dados/raw';
const Q={};
for(const f of fs.readdirSync(RAW).filter(f=>/^\d{4}\.\d\.json$/.test(f))){
  for(const q of JSON.parse(fs.readFileSync(RAW+'/'+f,'utf8'))) Q[q.id]=q;
}

// codigos consolidados: mapeia codigo-orfao -> arquivo que o absorveu
const codFile={}; files.forEach(f=>codFile[f.split('_')[0]]=f);
const absorvido={};
for(const f of files){
  const t=fs.readFileSync(ROOT+'/modulos/'+f,'utf8');
  for(const m of mods){
    if(codFile[m.codigo]) continue;
    if(m.status_geracao!=='gerado') continue;
    // limite de palavra: sem isto, CIR-12 casaria dentro de CIR-129
    const reCod=new RegExp(String.raw`(?<![A-Za-z0-9-])`+m.codigo+String.raw`(?![0-9])`);
    if(reCod.test(t)) absorvido[m.codigo]=f.split('_')[0];
  }
}

const reQ=/\[INEP\s+(\d{4})\s*[\u00b7.]\s*Edi\u00e7\u00e3o\s*(\d)\s*[\u00b7.]\s*Quest\u00e3o\s*n?\u00ba?\s*(\d+)\]/g;
const lista=[];
for(const f of files){
  const cod=f.split('_')[0];
  const t=fs.readFileSync(ROOT+'/modulos/'+f,'utf8');
  const escritas=new Set(); let m; reQ.lastIndex=0;
  while((m=reQ.exec(t))) escritas.add('INEP'+m[1]+'-'+m[2]+'-Q'+String(m[3]).padStart(3,'0'));
  // ids alvo = deste codigo + de todos os codigos absorvidos por ele
  const codigosAlvo=[cod, ...Object.keys(absorvido).filter(k=>absorvido[k]===cod)];
  const alvo=new Set();
  codigosAlvo.forEach(c=>(byCod[c]?.questoes_ids||[]).forEach(i=>alvo.add(i)));
  const faltam=[...alvo].filter(i=>!escritas.has(i));
  if(!faltam.length) continue;
  // avalia utilizabilidade do texto
  const det=faltam.map(id=>{
    const q=Q[id];
    if(!q) return {id, ok:false, motivo:'ausente no raw'};
    const a=q.alternativas||{};
    const letras=Object.keys(a).filter(k=>(a[k]||'').trim().length>3);
    const vazias=Object.keys(a).filter(k=>!(a[k]||'').trim());
    let motivo=null;
    if(letras.length<2) motivo='alternativas irrecuperaveis ('+letras.length+' com texto)';
    else if(vazias.length>0) motivo='alternativa(s) vazia(s): '+vazias.join(',');
    else if(!q.gabarito_oficial && !q.anulada) motivo='gabarito ausente';
    return {id, ok:!motivo, motivo, nAlt:letras.length,
      gab:q.gabarito_oficial, anulada:!!q.anulada,
      enunLen:(q.enunciado||'').length, assunto:q.assunto};
  });
  lista.push({cod, arquivo:f, tema:byCod[cod]?.tema, esp:byCod[cod]?.especialidade,
    tier:byCod[cod]?.tier, escritas:escritas.size, faltam:faltam.length,
    usaveis:det.filter(d=>d.ok).length, det});
}
lista.sort((a,b)=>b.faltam-a.faltam);
fs.writeFileSync(ROOT+'/dados/_worklist.json', JSON.stringify(lista,null,1));
const tot=lista.reduce((s,l)=>s+l.faltam,0), us=lista.reduce((s,l)=>s+l.usaveis,0);
console.log('modulos com lacuna:',lista.length,'| questoes faltando:',tot,'| com texto usavel:',us,'| problematicas:',tot-us);
console.log('\nTOP 30:');
lista.slice(0,30).forEach(l=>console.log(l.cod.padEnd(9), ('T'+l.tier).padEnd(3), (l.escritas+'->'+(l.escritas+l.faltam)).padEnd(10), 'usaveis '+l.usaveis+'/'+l.faltam, ' ', (l.tema||'').slice(0,45)));
