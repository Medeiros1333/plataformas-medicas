// ============================================================================
// CORRECAO DE GABARITOS — auditoria de 2026-09-23
// ============================================================================
// Reatribui gabarito_oficial/anulada em dados/raw/*.json e dados/mapa_mestre.json a partir de
// dados/_gabaritos_oficiais.json (extraido dos PDFs oficiais, indexado por NUMERO de questao).
//
// MOTIVO: 206/1604 (12,8%) gabaritos do banco divergiam do PDF oficial. Causas confirmadas:
//   (a) 2011.1 Q61-110 — usou a chave da PROVA VERMELHA (bate 50/50) em vez da CINZA, que e'
//       a prova cujo texto foi realmente extraido;
//   (b) 2016.1 / 2022.2 / 2025.2 e outras — gabarito aplicado por POSICAO na lista, nao por
//       numero de questao, desalinhando a partir da 1a questao anulada;
//   (c) 2023.x / 2024.x / 2025.1 — o caractere de traco ("-", "—", "̶") do PDF foi gravado como
//       se fosse o gabarito, em vez de marcar anulada=true.
//
// NUMERACAO: validada de forma independente casando o enunciado de cada questao contra o texto
// oficial da prova (raw_text/*_Prova_LAYOUT_reordenado.txt). Resultado: 16/16 edicoes com ZERO
// divergencia de numeracao, EXCETO 2011.1, onde as questoes 7 e 8 estao TROCADAS no banco
// (banco Q7 = prova Q8 "anemia megaloblastica"; banco Q8 = prova Q7 "PAC na gestante").
// Essa troca e' desfeita aqui ANTES de aplicar o gabarito.
//
// Uso: node corrigir_gabaritos.js [--dry]
// ============================================================================
const fs=require('fs'), path=require('path');
const DADOS=path.join(__dirname,'..');
const OF=JSON.parse(fs.readFileSync(path.join(DADOS,'_gabaritos_oficiais.json'),'utf8'));
const dry=process.argv.includes('--dry');
const log=[];

// --- (0) desfaz a troca 7<->8 de 2011.1 ---------------------------------------------------
function destrocar2011(qs){
  const a=qs.find(q=>q.numero===7), b=qs.find(q=>q.numero===8);
  if(!a||!b) return false;
  const txt=q=>(q.enunciado||q.enunciado_resumo||'');   // mapa_mestre usa 'enunciado_resumo'
  const ehPAC=/gestante de 28 semanas/.test(txt(a));
  if(ehPAC) return false;                      // ja corrigido
  if(!/gestante de 28 semanas/.test(txt(b))) return false; // nao e' o caso esperado
  a.numero=8; b.numero=7;
  a.id='INEP2011-1-Q008'; b.id='INEP2011-1-Q007';
  log.push({ed:'2011.1', tipo:'renumeracao', de:'Q7<->Q8', para:'trocadas para casar com o texto oficial da prova'});
  return true;
}

function corrigir(q, ed){
  const o=OF[ed]?.[q.numero];
  if(o===undefined) return false;
  const antes = q.anulada ? 'ANULADA' : q.gabarito_oficial;
  let mudou=false;
  if(o==='ANULADA'){ if(!q.anulada||q.gabarito_oficial){ q.anulada=true; q.gabarito_oficial=null; mudou=true; } }
  else { if(q.gabarito_oficial!==o||q.anulada){ q.gabarito_oficial=o; q.anulada=false; mudou=true; } }
  if(mudou) log.push({ed, numero:q.numero, id:q.id, de:antes, para:o, assunto:q.assunto});
  return mudou;
}

let n=0;
for(const f of fs.readdirSync(path.join(DADOS,'raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f))){
  const ed=f.replace('.json','');
  const p=path.join(DADOS,'raw',f);
  const qs=JSON.parse(fs.readFileSync(p,'utf8'));
  if(ed==='2011.1') destrocar2011(qs);
  let c=0; qs.forEach(q=>{ if(corrigir(q,ed)) c++; });
  qs.sort((a,b)=>a.numero-b.numero);
  if(!dry) fs.writeFileSync(p, JSON.stringify(qs,null,2),'utf8');
  console.log(f.padEnd(14),'corrigidas:',c); n+=c;
}
const mmP=path.join(DADOS,'mapa_mestre.json');
const mm=JSON.parse(fs.readFileSync(mmP,'utf8'));
destrocar2011(mm.filter(q=>q.ano===2011&&q.edicao===1));
let cm=0; mm.forEach(q=>{ if(corrigir(q, q.ano+'.'+q.edicao)) cm++; });
mm.sort((a,b)=> a.ano-b.ano || a.edicao-b.edicao || a.numero-b.numero);
if(!dry) fs.writeFileSync(mmP, JSON.stringify(mm,null,2),'utf8');
console.log('mapa_mestre.json corrigidas:',cm);
if(!dry) fs.writeFileSync(path.join(__dirname,'_log_correcao_gabaritos.json'), JSON.stringify(log,null,1),'utf8');
console.log('\nTOTAL alteracoes em raw:',n,'| em mapa_mestre:',cm, dry?'(DRY RUN)':'(gravado)');
