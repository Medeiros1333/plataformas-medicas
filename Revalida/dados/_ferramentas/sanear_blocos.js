// sanear_blocos.js [--aplicar] [ARQ.md ...]
// Substitui, em cada bloco de questao ja escrito, o enunciado e as alternativas pelo texto
// LIMPO do caderno oficial, corrige o numero no cabecalho e o gabarito.
// A justificativa (tudo que vem depois de "**Gabarito oficial:") nao e tocada.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const OFB=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_banco_oficial.json'),'utf8'));
const AUD=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','_auditoria_modulos.json'),'utf8'));
const aplicar=process.argv.includes('--aplicar');
const forcar=process.argv.includes('--forcar');   // ignora o criterio de qualidade (use so apos conferir a olho)
const sel=process.argv.slice(2).filter(a=>a.endsWith('.md'));

// indexa a auditoria por arquivo+numero declarado
const chave={};
for(const a of AUD) chave[a.arq+'|'+a.ed+'|'+a.num]=a;

// So troca o texto do bloco se a versao oficial for comprovadamente melhor.
// Extracao oficial tambem falha as vezes: nestes casos preserva-se o que ja estava escrito.
function normTxt(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim(); }
function overlap(a,b){
  const A=normTxt(a).split(' ').filter(w=>w.length>3);
  const B=new Set(normTxt(b).split(' ').filter(w=>w.length>3));
  if(!A.length||!B.size) return 1;
  let h=0; for(const w of A) if(B.has(w)) h++;
  return h/Math.max(A.length,B.size);
}

function oficialUtilizavel(of, corpoAntigo){
  const letras=Object.keys(of.alternativas||{});
  if(letras.length<4 || letras.length>5) return 'alternativas fora de 4-5';
  const ultimaPalavra=((of.enunciado||'').trim().match(/([A-Za-zÀ-ÿ0-9]+)\s*$/)||[,''])[1];
  if(ultimaPalavra && ultimaPalavra.length<=2 && !/[?.:,;]\s*$/.test(of.enunciado)) return 'enunciado termina no meio de uma palavra';
  for(const L2 of letras){
    const a=of.alternativas[L2]||'';
    if(a.length<8) return 'alternativa '+L2+' curta demais';
    if(/\s(?:\(A\)|A)\s+[A-ZÀ-Ú][a-zà-ú]{3,}/.test(a.slice(40))) return 'alternativa '+L2+' com outra lista embutida';
    if(/⟪\?⟫/.test(a)) return 'alternativa '+L2+' com corte duvidoso';
  }
  // nao pode encolher o enunciado de forma significativa
  const antigo=(corpoAntigo.match(/\n\n([\s\S]{80,}?)\n\nA\)/)||[,''])[1];
  if(antigo && of.enunciado.length < antigo.length*0.7) return 'enunciado oficial bem menor que o ja escrito';
  // as alternativas ja escritas foram conferidas a mao: se as oficiais nao tem nada a ver,
  // a extracao juntou duas questoes diferentes
  const antigasLinhas=(corpoAntigo.match(/^[A-E]\) .+$/gm)||[]).join(' ');
  if(antigasLinhas.length>80){
    const o=overlap(letras.map(x=>of.alternativas[x]).join(' '), antigasLinhas);
    if(o<0.35) return 'alternativas oficiais nao batem com as ja escritas ('+o.toFixed(2)+')';
  }
  // e o mesmo teste para o enunciado
  const antigoEnun=(corpoAntigo.match(/\*\*\n\n([\s\S]{80,}?)\n\n[A-E]\) /)||[,''])[1];
  if(antigoEnun && antigoEnun.length>150){
    const o2=overlap(of.enunciado, antigoEnun);
    if(o2<0.30) return 'enunciado oficial nao bate com o ja escrito ('+o2.toFixed(2)+')';
  }
  return null;
}

const CAB=/\*\*\[INEP (\d{4}) · Edição (\d) · Questão (\d+)\]\*\*/g;
let tocados=0, blocos=0, pulados=0, gabAlterado=0;
const alterados=[];
const recusados=[];
let minimos=0;

const arquivos = sel.length? sel : fs.readdirSync(path.join(ROOT,'modulos')).filter(f=>f.endsWith('.md'));
for(const f of arquivos){
  const p=path.join(ROOT,'modulos',f);
  let t=fs.readFileSync(p,'utf8');
  const marcas=[]; let m; CAB.lastIndex=0;
  while((m=CAB.exec(t))) marcas.push({ano:+m[1], ed:+m[2], num:+m[3], i:m.index, cab:m[0]});
  if(!marcas.length) continue;
  let mudouArq=false;
  // percorre de tras para frente para nao invalidar indices
  for(let k=marcas.length-1;k>=0;k--){
    const mk=marcas[k];
    const edStr=mk.ano+'.'+mk.ed;
    const a=chave[f+'|'+edStr+'|'+mk.num];
    blocos++;
    if(!a || (a.st!=='ok' && a.st!=='corrigir')){ pulados++; continue; }
    // texto muito ruidoso pontua baixo justamente porque precisa ser limpo:
    // aceita score baixo desde que NAO haja mudanca de numero (so limpeza no mesmo lugar)
    const alvoPrev = a.num_certo!==undefined? a.num_certo : mk.num;
    const seguro = (a.score===undefined) || a.score>=0.55 || (a.score>=0.28 && alvoPrev===mk.num);
    if(!seguro){ pulados++; continue; }
    const alvo=a.num_certo!==undefined? a.num_certo : mk.num;
    const of=OFB[edStr] && OFB[edStr][alvo];
    if(!of){ pulados++; continue; }
    const blocoAntigoTmp = t.slice(mk.i, (k+1<marcas.length? marcas[k+1].i : t.length));
    const motivo = forcar ? null : oficialUtilizavel(of, blocoAntigoTmp);
    if(motivo){
      // texto oficial nao confiavel: preserva o texto ja escrito, mas ainda assim
      // corrige o numero no cabecalho e a linha do gabarito, que vem do gabarito oficial
      pulados++; recusados.push({arq:f, ed:edStr, num:mk.num, motivo});
      const fimB = k+1<marcas.length ? marcas[k+1].i : t.length;
      let b=t.slice(mk.i, fimB);
      const iG=b.search(/\*\*Gabarito /);
      if(iG<0) continue;
      const fL=b.indexOf('\n', iG);
      const gCerto = of.anulada ? 'ANULADA' : of.gabarito_oficial;
      const lNova = gCerto==='ANULADA'
        ? '**Gabarito oficial: ANULADA** — o INEP anulou esta questão; não há resposta oficial.'
        : '**Gabarito oficial: '+gCerto+'**';
      const cabN='**[INEP '+mk.ano+' · Edição '+mk.ed+' · Questão '+alvo+']**';
      const bNovo = cabN + b.slice(mk.cab.length, iG) + lNova + b.slice(fL<0?b.length:fL);
      if(bNovo!==b){
        t = t.slice(0,mk.i) + bNovo + t.slice(fimB);
        mudouArq=true; minimos++;
        if(a.muda_gabarito) alterados.push({arq:f, ed:edStr, de:mk.num, para:alvo, gab_antes:a.gab_declarado, gab_depois:gCerto, so_cabecalho:true});
      }
      continue;
    }
    const fimBloco = k+1<marcas.length ? marcas[k+1].i : t.length;
    const bloco=t.slice(mk.i, fimBloco);
    const iGab=bloco.search(/\*\*Gabarito /);
    if(iGab<0){ pulados++; continue; }
    // linha inteira do gabarito
    const fimLinhaGab = bloco.indexOf('\n', iGab);
    const linhaGabAntiga = bloco.slice(iGab, fimLinhaGab<0?bloco.length:fimLinhaGab);
    const gabCerto = of.anulada ? 'ANULADA' : of.gabarito_oficial;

    // monta o corpo novo
    const letras=Object.keys(of.alternativas).sort();
    const alts=letras.map(L=>L+') '+of.alternativas[L]).join('\n');
    const temDuvida=/⟪\?⟫/.test(of.enunciado+letras.map(L=>of.alternativas[L]).join(' '));
    const nota = temDuvida
      ? '\n\n⚠️ *Nota de extração: os trechos marcados com ⟪?⟫ são pontos em que as duas colunas do caderno se encostaram e alguns caracteres não puderam ser recuperados com segurança. Nada foi inventado para preencher.*'
      : '';
    const cabNovo='**[INEP '+mk.ano+' · Edição '+mk.ed+' · Questão '+alvo+']**';
    const linhaGabNova = gabCerto==='ANULADA'
      ? '**Gabarito oficial: ANULADA** — o INEP anulou esta questão; não há resposta oficial.'
      : '**Gabarito oficial: '+gabCerto+'**';
    const corpoNovo = cabNovo+'\n\n'+of.enunciado+'\n\n'+alts+nota+'\n\n'+linhaGabNova;
    const blocoNovo = corpoNovo + bloco.slice(fimLinhaGab<0?bloco.length:fimLinhaGab);
    if(blocoNovo===bloco){ continue; }
    const mudouGab = !linhaGabAntiga.startsWith(linhaGabNova.slice(0,28));
    t = t.slice(0,mk.i) + blocoNovo + t.slice(fimBloco);
    mudouArq=true; tocados++;
    if(a.muda_gabarito){ gabAlterado++; alterados.push({arq:f, ed:edStr, de:mk.num, para:alvo, gab_antes:a.gab_declarado, gab_depois:gabCerto}); }
    void mudouGab;
  }
  if(mudouArq && aplicar) fs.writeFileSync(p,t,'utf8');
}
console.log('blocos varridos: '+blocos+' | saneados: '+tocados+' | pulados (sem par confiavel): '+pulados);
console.log('entre os saneados, com GABARITO alterado: '+gabAlterado);
for(const x of alterados) console.log('   '+x.arq.replace('.md','').padEnd(46)+x.ed+' Q'+x.de+(x.de!==x.para?(' -> Q'+x.para):'')+'   '+x.gab_antes+' -> '+x.gab_depois);
if(!aplicar) console.log('\n(nada gravado — use --aplicar)');
if(recusados.length){
  console.log('\nblocos preservados porque a extracao oficial nao passou no criterio de qualidade: '+recusados.length);
  for(const r of recusados) console.log('   '+r.arq.replace('.md','').padEnd(46)+r.ed+' Q'+r.num+'  — '+r.motivo);
}
