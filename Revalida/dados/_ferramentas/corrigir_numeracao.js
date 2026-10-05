// corrigir_numeracao.js [--aplicar]
// Reatribui cada questao do banco ao numero que ela REALMENTE tem no caderno oficial,
// comparando o conteudo guardado com o texto reextraido de dados/raw_text_layout.
// Depois reaplica o gabarito oficial pelo numero corrigido.
// Sem --aplicar apenas relata.
const { execFileSync } = require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const RX_LINHA=/\r?\n/;
const RX_ALT=/^  ([A-E])\) (.*)$/;
const LIMITE=0.55;          // confianca minima para mover uma questao de numero
const MARGEM=0.12;          // vantagem minima sobre o numero atual

const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,' ').trim();
function sim(a,b){
  const A=norm(a).split(' ').filter(w=>w.length>3);
  const B=new Set(norm(b).split(' ').filter(w=>w.length>3));
  if(!A.length||!B.size) return 0;
  let h=0; for(const w of A) if(B.has(w)) h++;
  return h/Math.max(A.length, B.size);
}

const OF=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_gabaritos_oficiais.json'),'utf8'));
const eds=fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f)).map(f=>f.replace('.json',''));

function oficialDe(ed){
  const nums=[]; for(let i=1;i<=120;i++) nums.push(String(i));
  const saida=execFileSync('node',[path.join(ROOT,'dados','_ferramentas','reextrair.js'), ed, ...nums],
    {encoding:'utf8',maxBuffer:128*1024*1024});
  const of={};
  for(const b of saida.split('================ ').slice(1)){
    const m=b.match(/· QUESTAO (\d+) =/); if(!m) continue;
    const mEn=b.match(/ENUNCIADO: ([\s\S]*?)(?:\n  A\)|\n\n)/); if(!mEn) continue;
    const alts={};
    for(const linha of b.split(RX_LINHA)){ const a=linha.match(RX_ALT); if(a) alts[a[1]]=a[2]; }
    if(of[+m[1]]) continue;      // fica com a primeira ocorrencia
    of[+m[1]]={enunciado:mEn[1].trim(), alternativas:alts};
  }
  return of;
}

const relatorio=[];
let movidas=0, mantidas=0, semVeredito=0, gabMudou=0;

for(const ed of eds){
  let of;
  try{ of=oficialDe(ed); }catch(e){ console.log(ed+': ERRO reextracao'); continue; }
  const nums=Object.keys(of).map(Number);
  if(nums.length<40){ console.log(ed.padEnd(8)+' oficial insuficiente ('+nums.length+') — pulada'); continue; }
  const fRaw=path.join(ROOT,'dados','raw',ed+'.json');
  const dados=JSON.parse(fs.readFileSync(fRaw,'utf8'));
  const qs=dados.questoes||dados;

  // pontua cada questao do banco contra cada numero oficial
  const cand=[];
  for(const q of qs){
    const meu=(q.enunciado||'')+' '+Object.values(q.alternativas||{}).join(' ');
    const atual = of[q.numero] ? sim(of[q.numero].enunciado+' '+Object.values(of[q.numero].alternativas).join(' '), meu) : 0;
    let melhor={n:q.numero, s:atual};
    for(const n of nums){
      const s=sim(of[n].enunciado+' '+Object.values(of[n].alternativas).join(' '), meu);
      if(s>melhor.s) melhor={n,s};
    }
    cand.push({q, atual, melhor});
  }
  // resolve colisoes: quem tem score maior fica com o numero
  const dono={};
  for(const c of cand.sort((a,b)=>b.melhor.s-a.melhor.s)){
    const {q, atual, melhor}=c;
    const querMudar = melhor.n!==q.numero && melhor.s>=LIMITE && (melhor.s-atual)>=MARGEM;
    if(!querMudar){ c.destino=null; continue; }
    if(dono[melhor.n]){ c.destino=null; c.bloqueado=true; continue; }
    dono[melhor.n]=q; c.destino=melhor.n;
  }
  let edMov=0, edGab=0;
  for(const c of cand){
    const {q, atual, melhor}=c;
    if(c.destino===null){
      if(melhor.s<0.35 && atual<0.35) semVeredito++;
      else mantidas++;
      continue;
    }
    const antesNum=q.numero, antesGab=q.anulada?'ANULADA':q.gabarito_oficial;
    const novoGabBruto=OF[ed] ? OF[ed][c.destino] : undefined;
    const novoGab = novoGabBruto===undefined ? antesGab : novoGabBruto;
    relatorio.push({ed, de:antesNum, para:c.destino, id:q.id,
      score:+melhor.s.toFixed(2), score_antes:+atual.toFixed(2),
      gab_antes:antesGab, gab_depois:novoGab,
      mudou_gabarito: String(antesGab)!==String(novoGab),
      assunto:q.assunto});
    if(String(antesGab)!==String(novoGab)){ gabMudou++; edGab++; }
    movidas++; edMov++;
  }
  console.log(ed.padEnd(8)+' banco '+String(qs.length).padStart(3)+
    '  renumerar '+String(edMov).padStart(3)+'  (gabarito muda em '+String(edGab).padStart(3)+')');

  if(!aplicar) continue;

  // aplica: primeiro grava numeros novos em campo temporario, depois efetiva
  for(const c of cand) if(c.destino!==null) c.q.__novo=c.destino;
  for(const c of cand){
    const q=c.q;
    if(q.__novo===undefined) continue;
    q.numero=q.__novo; delete q.__novo;
    q.id='INEP'+ed.replace('.','-')+'-Q'+String(q.numero).padStart(3,'0');
    const g=OF[ed] ? OF[ed][q.numero] : undefined;
    if(g==='ANULADA'){ q.anulada=true; q.gabarito_oficial=null; }
    else if(g!==undefined){ q.gabarito_oficial=g; q.anulada=false; }
    q.numeracao_conferida=true;
    if(of[q.numero]){ q.enunciado=of[q.numero].enunciado; q.alternativas=of[q.numero].alternativas; }
  }
  qs.sort((a,b)=>a.numero-b.numero);
  fs.writeFileSync(fRaw, JSON.stringify(dados,null,1),'utf8');
}

console.log('\nTOTAL a renumerar: '+movidas+' | gabarito muda em '+gabMudou);
console.log('mantidas: '+mantidas+' | sem veredito: '+semVeredito);
fs.writeFileSync(path.join(ROOT,'dados','_plano_renumeracao.json'), JSON.stringify(relatorio,null,1),'utf8');
console.log('plano em dados/_plano_renumeracao.json');
if(!aplicar) console.log('\n(nada foi gravado — use --aplicar)');
