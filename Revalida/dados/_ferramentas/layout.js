// layout.js ED NUM [NUM...]  -> texto oficial da questao, com as duas colunas do caderno ja separadas
// ex: node dados/_ferramentas/layout.js 2012.1 69
// ex: node dados/_ferramentas/layout.js 2023.2 99 100
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const DIR=path.join(ROOT,'dados','raw_text_layout');

const ARQ={
 '2011.1':'2011__Prova_objetiva_cinza_2011.txt','2012.1':'2012__prova.txt','2013.1':'2013__prova.txt',
 '2014.1':'2014__prova.txt','2015.1':'2015__prova.txt','2016.1':'2016__prova.txt','2017.1':'2017__prova.txt',
 '2020.1':'2020__prova.txt','2021.1':'2021__prova.txt','2022.1':'2022.1__prova.txt','2022.2':'2022.2__prova.txt',
 '2023.1':'2023.1__prova.txt','2023.2':'2023.2__prova.txt','2024.1':'2024.1__prova.txt','2024.2':'2024.2__prova.txt',
 '2025.1':'2025.1__prova.txt','2025.2':'2025.2__prova.txt','2026.1':'2026.1__prova.txt'
};

const RE=/(?:^| )(?:QUEST[AÃ]O|Quest[aã]o|quest[aã]o) *([0-9]{1,3})(?![0-9])/g;

// coluna de corte do caderno: faixa vertical de espacos presente na quase totalidade das linhas cheias
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

function marcar(linhas){
  const m=[];
  linhas.forEach((l,i)=>{ let r; RE.lastIndex=0; while((r=RE.exec(l))) m.push({n:+r[1], i}); });
  return m;
}

function trecho(linhas, marcas, num, limite){
  const saida=[];
  for(const mk of marcas.filter(x=>x.n===num)){
    const prox=marcas.map(x=>x.i).filter(i=>i>mk.i).sort((a,b)=>a-b)[0];
    const fim=Math.min(prox!==undefined?prox:linhas.length, mk.i+limite);
    saida.push({linha:mk.i+1, texto:linhas.slice(mk.i,fim).join('\n').replace(/\n{3,}/g,'\n\n').replace(/^\n+|\n+$/g,'')});
  }
  return saida;
}

const ed=process.argv[2], nums=process.argv.slice(3).map(Number);
const arq=ARQ[ed];
if(!arq){ console.error('edicao desconhecida: '+ed+'  (use: '+Object.keys(ARQ).join(', ')+')'); process.exit(1); }
const todas=fs.readFileSync(path.join(DIR,arq),'utf8').split(/\r?\n/);
// o "questionario de percepcao" no fim da prova tambem numera QUESTAO 1..9:
// tudo dali para frente e descartado, senao colide com as questoes reais
const iQuest=todas.reduce((acc,l,k)=>/^\s*QUESTION[ÁA]RIO DE PERCEP[ÇC][ÃA]O[^a-z]*$/.test(l)?k:acc,-1);
if(iQuest>0) todas.length=iQuest;
const c=descobrirCorte(todas);

let fluxos;
if(c===null){ fluxos=[{nome:'PAGINA INTEIRA', linhas:todas}]; }
else {
  fluxos=[
    {nome:'COLUNA ESQUERDA', linhas:todas.map(l=>l.slice(0,c).replace(/\s+$/,''))},
    {nome:'COLUNA DIREITA',  linhas:todas.map(l=>l.slice(c).replace(/\s+$/,''))}
  ];
}
for(const f of fluxos) f.marcas=marcar(f.linhas);

for(const num of nums){
  let achou=false;
  for(const f of fluxos){
    for(const t of trecho(f.linhas, f.marcas, num, 70)){
      achou=true;
      console.log('\n===================== '+ed+' · QUESTAO '+num+'  ['+f.nome+', linha '+t.linha+'] =====================');
      console.log(t.texto);
    }
  }
  if(!achou) console.log('\n##### QUESTAO '+num+' — marcador nao encontrado em '+arq);
}
