// reextrair.js ED NUM [NUM...] [--aplicar]
// Reconstroi enunciado + alternativas de uma questao a partir do texto de coluna preservada
// (dados/raw_text_layout). Sem --aplicar apenas propoe; com --aplicar grava em raw/ED.json e
// mapa_mestre.json e registra em dados/_scripts/_log_reextracao.json.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const DIR=path.join(ROOT,'dados','raw_text_layout');

const ARQ={
 '2011.1':'2011__Prova_objetiva_cinza_2011.txt','2012.1':'2012__prova.txt','2013.1':'2013__prova.txt',
 '2014.1':'2014__prova.txt','2015.1':'2015__prova.txt','2016.1':'2016__prova.txt','2017.1':'2017__prova.txt',
 '2020.1':'2020__prova.txt','2021.1':'2021__prova.txt','2022.1':'2022.1__prova_sp.txt','2022.2':'2022.2__prova.txt',
 '2023.1':'2023.1__prova.txt','2023.2':'2023.2__prova.txt','2024.1':'2024.1__prova.txt','2024.2':'2024.2__prova.txt',
 '2025.1':'2025.1__prova.txt','2025.2':'2025.2__prova.txt','2026.1':'2026.1__prova.txt'
};

const RE_Q=/(?:^| )(?:QUEST[AÃ]O|Quest[aã]o|quest[aã]o) *([0-9]{1,3})(?![0-9])/g;
// dois estilos de marcador: '(A) texto'  e  'A   texto'
const ALT_PAREN=/^ *\(([A-E])\) *(?=[^ ])/;
const ALT_NUA=/^ *([A-E])[ .\u00a0]+(?=[^ ])/;

// linhas de rodape / cabecalho institucional que nunca fazem parte da questao
const LIXO=[
 /EXAME NACIONAL DE REVALID/i, /DIPLOMAS M[EÉ]DICOS/i, /INSTITUI[ÇC][ÕO]ES DE EDUCA[ÇC][ÃA]O SUPERIOR/i,
 /^ *Prova (Cinza|Vermelha|Amarela|Verde|Branca)/i, /^ *REVALIDA *[0-9]{4}/i,
 /^ *[0-9]{4} *(PRIMEIRA|SEGUNDA) EDI[ÇC][ÃA]O/i, /^ *(PRIMEIRA|SEGUNDA) EDI[ÇC][ÃA]O/i,
 /[ÁA]REA LIVRE/i, /QUESTION[ÁA]RIO DE PERCEP[ÇC][ÃA]O/i, /^ *PERGUNTA *[0-9]/i,
 /CART[ÃA]O-RESPOSTA/i, /^ *CADERNO/i, /^ *[0-9]{1,3} *$/, /^ *PROVA *$/,
 /^ *Revalida *[0-9]{4}/i, /^ *INEP *$/i
];
const ehLixo = l => LIXO.some(r=>r.test(l));

function descobrirCorte(linhas){
  const larg=Math.max(...linhas.map(l=>l.length));
  if(larg<70) return null;
  const cheias=linhas.filter(l=>l.trim().length>=25);
  const n=cheias.length;
  if(n<6) return null;
  const cont=new Array(larg).fill(0);
  for(const l of cheias) for(let i=0;i<larg;i++) if((l[i]||' ')===' ') cont[i]++;
  // do mais exigente ao mais tolerante: colunas bem alinhadas primeiro
  for(const lim of [0.92, 0.86, 0.75, 0.68]){
    let melhor=null;
    for(let i=Math.floor(larg*0.28); i<Math.floor(larg*0.75); i++){
      if(cont[i]<n*lim) continue;
      let j=i; while(j<larg && cont[j]>=n*lim) j++;
      // descarta a margem em branco do fim da linha: so vale vao que tenha texto depois
      const temTextoADireita = cheias.filter(l=>l.slice(j).trim().length>0).length / n;
      if(temTextoADireita < 0.25) { i=j; continue; }
      const w=j-i, centro=Math.abs((i+j)/2 - larg*0.5);
      if(!melhor || w>melhor.w+2 || (Math.abs(w-melhor.w)<=2 && centro<melhor.centro)) melhor={i,j,w,centro};
      i=j;
    }
    if(melhor && melhor.w>=3) return Math.floor((melhor.i+melhor.j)/2);
  }
  return null;
}


// A fronteira entre as colunas oscila alguns caracteres de linha para linha.
// Para cada linha, procura o maior vao de espacos perto de 'cl' e corta no fim dele.
function dividir(linhas, cl){
  const esq=[], dir=[];
  for(const l of linhas){
    let ini=cl, fim=cl;
    if(l.length>cl-14){
      let melhor=null;
      const de=Math.max(0,cl-14), ate=Math.min(l.length, cl+14);
      for(let i=de;i<ate;i++){
        if(l[i]!==' ') continue;
        let j=i; while(j<l.length && l[j]===' ') j++;
        if(!melhor || (j-i)>melhor.w) melhor={i,j,w:j-i};
        i=j;
      }
      if(melhor && melhor.w>=3){ ini=melhor.i; fim=melhor.j; }
      else {
        // colunas coladas (so 1 espaco entre elas): usa o marcador '(A)' como fronteira
        const janela=l.slice(de,ate);
        const m=janela.match(/ \(([A-E])\) /);
        if(m){ ini=de+m.index; fim=de+m.index+1; }
        else if(melhor && melhor.w>=2){ ini=melhor.i; fim=melhor.j; }
      }
    }
    const duvida = (ini===cl && fim===cl && l.length>cl);   // nao houve vao: corte arbitrario
    const marca = duvida ? '⟪?⟫' : '';
    esq.push((l.slice(0,ini).replace(/\s+$/,''))+marca);
    dir.push(marca+(l.slice(fim).replace(/\s+$/,'')));
  }
  return {esq, dir};
}
// Ordem de leitura real do caderno: em cada PAGINA, a coluna esquerda inteira e so
// depois a coluna direita. Uma questao que comeca no pe da coluna esquerda continua
// no topo da direita da MESMA pagina — por isso o fluxo precisa ser montado por pagina.
function fluxosDe(ed){
  const bruto=fs.readFileSync(path.join(DIR,ARQ[ed]),'utf8');
  const paginas=bruto.split('\f');
  const todas=bruto.split(/\r?\n/);
  const corteGlobal=descobrirCorte(todas);
  const ordenado=[];
  for(const pg of paginas){
    const linhas=pg.split(/\r?\n/);
    const c = descobrirCorte(linhas) ?? corteGlobal;
    if(c===null){ ordenado.push(...linhas); continue; }
    const {esq,dir}=dividir(linhas,c);
    ordenado.push(...esq, ...dir);
  }
  // o questionario de percepcao repete a numeracao: corta a partir dele
  const iq=ordenado.reduce((a,l,k)=>/^\s*QUESTION[ÁA]RIO DE PERCEP[ÇC][ÃA]O[^a-z]*$/.test(l)?k:a,-1);
  if(iq>0) ordenado.length=iq;
  const f={nome:'leitura', linhas:ordenado, marcas:[]};
  ordenado.forEach((l,k)=>{ let r; RE_Q.lastIndex=0; while((r=RE_Q.exec(l))) f.marcas.push({n:+r[1], i:k}); });
  const fs_=[f];
  fs_.todas=todas;
  return fs_;
}

// junta linhas quebradas em paragrafos; corta na primeira alternativa
// terminadores fortes: nada depois deles pertence a questao
const FIM=[/[ÁA]REA LIVRE/i, /QUESTION[ÁA]RIO DE PERCEP/i, /^ *PERGUNTA *[0-9]/i,
           /(PRIMEIRA|SEGUNDA) EDI[ÇC][ÃA]O/i, /qualidade da prova/i, /Cart[ãa]o-Resposta/i];

function montar(linhas){
  let corte=linhas.length;
  for(let i=1;i<linhas.length;i++){ if(FIM.some(r=>r.test(linhas[i]))){ corte=i; break; } }
  const uteis=linhas.slice(0,corte).filter(l=>!ehLixo(l) && l.trim().length!==1 && l.trim().length!==2);
  // se o bloco usa '(A)', esse estilo manda; senao cai no marcador nu
  const usaParen = uteis.some(l=>ALT_PAREN.test(l));
  const RE_ALT = usaParen ? ALT_PAREN : ALT_NUA;
  const alts={}; const corpo=[];
  let atual=null, letraEsperada='A';
  for(const bruta of uteis){
    const l=bruta.replace(/\s+$/,'');
    if(!l.trim()){ if(atual) atual.push(''); else corpo.push(''); continue; }
    const m=l.match(RE_ALT);
    if(m && m[1]===letraEsperada){
      atual=[l.replace(RE_ALT,'')];
      alts[m[1]]=atual;
      letraEsperada=String.fromCharCode(m[1].charCodeAt(0)+1);
      continue;
    }
    if(atual) atual.push(l.trim()); else corpo.push(l.trim());
  }
  const junta = arr => arr.join(' ').replace(/-\s+(?=[a-zà-ú])/g,'-').replace(/\s{2,}/g,' ').trim();
  const out={};
  for(const k of Object.keys(alts)) out[k]=junta(alts[k]);
  return {enunciado: junta(corpo).replace(/^QUEST[AÃ]O *[0-9]+ */i,'').trim(), alternativas: out};
}


// --- reparo dos cortes duvidosos -------------------------------------------------
// Onde as colunas se colaram, dividir() deixa a marca ⟪?⟫ no ponto em que o texto
// pode ter perdido caracteres. O texto corrido da mesma prova (dados/raw_text) tem as
// palavras inteiras, ainda que fora de ordem: usamos ele so para recuperar o pedaco.
const PLANO={};
function textoCorrido(ed){
  if(PLANO[ed]!==undefined) return PLANO[ed];
  const dir=path.join(ROOT,'dados','raw_text');
  const ano=ed.split('.')[0];
  const cand=fs.readdirSync(dir).filter(f=>/Prova/i.test(f) && !/LAYOUT|Gabarito/i.test(f))
    .filter(f=>f.startsWith(ed+'__') || f.startsWith(ano+'__'))
    .filter(f=>f.includes(ed) || !/\d{4}\.\d/.test(f));
  if(!cand.length){ PLANO[ed]=null; return null; }
  const txt=fs.readFileSync(path.join(dir,cand[0]),'utf8').replace(/\s+/g,' ');
  PLANO[ed]=txt; return txt;
}
function reparar(texto, ed){
  if(!texto.includes('⟪?⟫')) return texto;
  const plano=textoCorrido(ed);
  if(!plano) return texto;
  return texto.replace(/⟪\?⟫(\S+(?: \S+){0,5})/g, (todo, frag)=>{
    const i=plano.indexOf(frag);
    if(i<0 || i===0 || frag.length<3) return todo;
    let k=i; while(k>0 && plano[k-1]!==' ') k--;
    const prefixo=plano.slice(k,i);
    // so aceita prefixo curto e alfabetico: e o comeco de uma palavra cortada
    if(!prefixo || prefixo.length>12 || !/^[A-Za-zÀ-ÿ()]+$/.test(prefixo)) return todo;
    if(plano.indexOf(frag, i+1)>=0 && plano.slice(0,i).lastIndexOf(frag)>=0) return todo;
    return prefixo+frag;
  });
}
const args=process.argv.slice(2);
const aplicar=args.includes('--aplicar');
const ed=args[0];
const nums=args.slice(1).filter(a=>a!=='--aplicar').map(Number);
if(!ARQ[ed]){ console.error('edicao desconhecida: '+ed); process.exit(1); }

const fluxos=fluxosDe(ed);
const propostas=[];
for(const num of nums){
  let feito=false;
  for(const f of fluxos){
    for(const mk of f.marcas.filter(x=>x.n===num)){
      const prox=f.marcas.map(x=>x.i).filter(i=>i>mk.i).sort((a,b)=>a-b)[0];
      const fim=Math.min(prox!==undefined?prox:f.linhas.length, mk.i+70);
      let janela;
      if(f.nome==='pagina'){
        // pagina sem corte global: pega uma janela larga, corta as colunas dentro dela
        // e so depois corta na proxima QUESTAO *da mesma coluna*
        const bruta=f.linhas.slice(mk.i, Math.min(f.linhas.length, mk.i+70));
        const cl=descobrirCorte(bruta);
        const marcador=new RegExp('QUEST[AÃ]O *'+num+'(?![0-9])','i');
        if(cl!==null){
          const {esq,dir}=dividir(bruta,cl);
          janela = marcador.test(dir[0]||'') ? dir : (marcador.test(esq[0]||'') ? esq : bruta);
        } else janela=bruta;
        let corta=janela.length;
        for(let k=1;k<janela.length;k++){ RE_Q.lastIndex=0; if(RE_Q.test(janela[k])){ corta=k; break; } }
        janela=janela.slice(0,corta);
      } else janela=f.linhas.slice(mk.i,fim);
      const r=montar(janela);
      const letras=Object.keys(r.alternativas);
      if(letras.length<4) continue;   // extracao incompleta: nao propoe
      r.enunciado=reparar(r.enunciado, ed);
      for(const k of Object.keys(r.alternativas)) r.alternativas[k]=reparar(r.alternativas[k], ed);
      propostas.push({numero:num, fluxo:f.nome, linha:mk.i+1, ...r});
      feito=true;
    }
  }
  if(!feito && fluxos.length>1){
    // o corte global nao serviu para esta questao: tenta com corte proprio da pagina
    const pg={nome:'pagina', linhas:fluxos.todas, marcas:[]};
    pg.linhas.forEach((l,k)=>{ let r; RE_Q.lastIndex=0; while((r=RE_Q.exec(l))) pg.marcas.push({n:+r[1], i:k}); });
    for(const mk of pg.marcas.filter(x=>x.n===num)){
      const bruta=pg.linhas.slice(mk.i, Math.min(pg.linhas.length, mk.i+80));
      const cl=descobrirCorte(bruta);
      const marcador=new RegExp('QUEST[AÃ]O *'+num+'(?![0-9])','i');
      let janela=bruta;
      if(cl!==null){
        const {esq,dir}=dividir(bruta,cl);
        janela = marcador.test(dir[0]||'') ? dir : (marcador.test(esq[0]||'') ? esq : bruta);
      }
      let corta=janela.length;
      for(let k=1;k<janela.length;k++){ RE_Q.lastIndex=0; if(RE_Q.test(janela[k])){ corta=k; break; } }
      const r=montar(janela.slice(0,corta));
      if(Object.keys(r.alternativas).length<4) continue;
      r.enunciado=reparar(r.enunciado, ed);
      for(const k2 of Object.keys(r.alternativas)) r.alternativas[k2]=reparar(r.alternativas[k2], ed);
      propostas.push({numero:num, fluxo:'pagina(fallback)', linha:mk.i+1, ...r});
      feito=true; break;
    }
  }
  if(!feito) propostas.push({numero:num, erro:'nao foi possivel montar (menos de 4 alternativas ou marcador ausente)'});
}

for(const p of propostas){
  console.log('\n================ '+ed+' · QUESTAO '+p.numero+' ================');
  if(p.erro){ console.log('!! '+p.erro); continue; }
  console.log('[fonte: coluna '+p.fluxo+', linha '+p.linha+']');
  console.log('ENUNCIADO: '+p.enunciado);
  for(const k of Object.keys(p.alternativas)) console.log('  '+k+') '+p.alternativas[k]);
}

if(!aplicar){ console.log('\n(proposta apenas — use --aplicar para gravar)'); process.exit(0); }

// grava
const fRaw=path.join(ROOT,'dados','raw',ed+'.json');
const raw=JSON.parse(fs.readFileSync(fRaw,'utf8'));
const rq=raw.questoes||raw;
const fMM=path.join(ROOT,'dados','mapa_mestre.json');
const mm=JSON.parse(fs.readFileSync(fMM,'utf8'));
const mq=mm.questoes||mm;
const logF=path.join(ROOT,'dados','_scripts','_log_reextracao.json');
const log=fs.existsSync(logF)? JSON.parse(fs.readFileSync(logF,'utf8')) : [];
let n=0;
for(const p of propostas){
  if(p.erro) continue;
  const q=rq.find(x=>x.numero===p.numero);
  if(!q){ console.log('!! '+p.numero+' ausente no raw'); continue; }
  log.push({data:new Date().toISOString().slice(0,10), edicao:ed, numero:p.numero, id:q.id,
            enunciado_antes:(q.enunciado||'').slice(0,160), alternativas_antes:Object.keys(q.alternativas||{}).length});
  q.enunciado=p.enunciado; q.alternativas=p.alternativas;
  if(q.status==='revisar_extracao') q.status='reextraido_layout';
  const m=mq.find(x=>x.id===q.id);
  if(m){ m.enunciado_resumo=p.enunciado.slice(0,150)+(p.enunciado.length>150?'…':''); if(m.status==='revisar_extracao') m.status='reextraido_layout'; }
  n++;
}
fs.writeFileSync(fRaw, JSON.stringify(raw,null,1),'utf8');
fs.writeFileSync(fMM, JSON.stringify(mm,null,1),'utf8');
fs.writeFileSync(logF, JSON.stringify(log,null,1),'utf8');
console.log('\nGRAVADO: '+n+' questoes em '+ed);
