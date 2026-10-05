// auditar_modulos.js
// Para cada bloco de questao ja escrito nos modulos, casa o TEXTO DO PROPRIO BLOCO com o
// caderno oficial (dados/_banco_oficial.json) e diz qual e o numero e o gabarito corretos.
// Nao depende do banco antigo. Saida: dados/_auditoria_modulos.json
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const OFB=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_banco_oficial.json'),'utf8'));
// Segunda fonte, independente do texto: a folha de respostas oficial.
// 129 questoes tem gabarito conhecido mas perderam o texto na extracao —
// sem consultar esta folha elas apareciam como 'sem par', como se o bloco
// estivesse errado, quando o que falta e a referencia de texto.
const GAB=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_gabaritos_oficiais.json'),'utf8'));
function gabFolha(ed,num){ const g=(GAB[ed]||{})[num]; return g===undefined?null:String(g); }
function viaFolha(f,ed,num,gabDeclarado,res){
  const g=gabFolha(ed,num);
  if(g===null) return false;
  const confere=String(gabDeclarado)===g;
  res.push({arq:f, ed, num, st:confere?'ok_por_folha':'gabarito_diverge_folha',
            num_certo:num, gab_declarado:gabDeclarado, gab_certo:g,
            muda_numero:false, muda_gabarito:!confere, fonte:'folha de respostas'});
  return true;
}

const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,' ').trim();
function sim(a,b){
  const A=norm(a).split(' ').filter(w=>w.length>3);
  const B=new Set(norm(b).split(' ').filter(w=>w.length>3));
  if(!A.length||!B.size) return 0;
  let h=0; for(const w of A) if(B.has(w)) h++;
  return h/Math.max(A.length, B.size);
}
const txtOf = q => q.enunciado+' '+Object.values(q.alternativas).join(' ');

const CAB=/\*\*\[INEP (\d{4}) · Edição (\d) · Questão (\d+)\]\*\*/g;
const res=[];
let okTudo=0, mudaNum=0, mudaGab=0, semPar=0;

for(const f of fs.readdirSync(path.join(ROOT,'modulos')).filter(f=>f.endsWith('.md'))){
  const t=fs.readFileSync(path.join(ROOT,'modulos',f),'utf8');
  const marcas=[]; let m; CAB.lastIndex=0;
  while((m=CAB.exec(t))) marcas.push({ano:+m[1], ed:+m[2], num:+m[3], i:m.index});
  for(let k=0;k<marcas.length;k++){
    const ini=marcas[k].i;
    const fim = k+1<marcas.length ? marcas[k+1].i : t.length;
    const bloco=t.slice(ini,fim);
    // texto util: do cabecalho ate "Gabarito oficial"
    const corte=bloco.search(/\*\*Gabarito /);
    const corpo=bloco.slice(0, corte>0?corte:Math.min(bloco.length,2500));
    const linhaGab=(bloco.match(/\*\*Gabarito [^\n]*/)||[''])[0];
    let gabDeclarado=null;
    if(/anulad/i.test(linhaGab)) gabDeclarado='ANULADA';
    else { const gm=linhaGab.match(/:\s*\**([A-E])\b/); if(gm) gabDeclarado=gm[1]; }
    if(gabDeclarado===null && /QUEST[ÃA]O ANULADA/i.test(bloco)) gabDeclarado='ANULADA';
    const edStr=marcas[k].ano+'.'+marcas[k].ed;
    const of=OFB[edStr];
    if(!of){ res.push({arq:f, ed:edStr, num:marcas[k].num, st:'edicao_sem_oficial'}); semPar++; continue; }
    const nums=Object.keys(of).map(Number);
    // se o numero declarado nem existe no caderno oficial extraido, nao ha o que comparar
    if(!of[marcas[k].num]){
      if(viaFolha(f,edStr,marcas[k].num,gabDeclarado,res)) continue;
      res.push({arq:f, ed:edStr, num:marcas[k].num, st:'oficial_ausente', gab_declarado:gabDeclarado});
      semPar++; continue;
    }
    const sNoLugar=sim(txtOf(of[marcas[k].num]), corpo);
    let melhor={n:null,s:0};
    for(const n of nums){ const s=sim(txtOf(of[n]), corpo); if(s>melhor.s) melhor={n,s}; }
    // so move de numero com folga clara sobre o numero declarado
    const move = melhor.n!==marcas[k].num && melhor.s>=0.65 && (melhor.s-sNoLugar)>=0.20;
    const alvo = move ? melhor.n : marcas[k].num;
    const scoreAlvo = move ? melhor.s : sNoLugar;
    if(scoreAlvo<0.30 && viaFolha(f,edStr,marcas[k].num,gabDeclarado,res)) continue;
    if(scoreAlvo<0.30){ res.push({arq:f, ed:edStr, num:marcas[k].num, st:'sem_par', score:+scoreAlvo.toFixed(2), melhor:melhor.n, melhor_score:+melhor.s.toFixed(2)}); semPar++; continue; }
    const o=of[alvo];
    const gabCerto = o.anulada ? 'ANULADA' : o.gabarito_oficial;
    const numMuda = alvo!==marcas[k].num;
    const gabMuda = String(gabDeclarado)!==String(gabCerto);
    if(numMuda) mudaNum++;
    if(gabMuda) mudaGab++;
    if(!numMuda && !gabMuda) okTudo++;
    res.push({arq:f, ed:edStr, num:marcas[k].num, st:(numMuda||gabMuda)?'corrigir':'ok',
      num_certo:alvo, gab_declarado:gabDeclarado, gab_certo:gabCerto,
      muda_numero:numMuda, muda_gabarito:gabMuda, score:+scoreAlvo.toFixed(2)});
  }
}
console.log('blocos analisados: '+res.length);
console.log('  ja corretos            : '+okTudo);
console.log('  numero errado          : '+mudaNum);
console.log('  gabarito errado        : '+mudaGab);
console.log('  sem par no oficial     : '+semPar);
fs.writeFileSync(path.join(ROOT,'dados','_auditoria_modulos.json'), JSON.stringify(res,null,1),'utf8');
console.log('\ndetalhe em dados/_auditoria_modulos.json');
