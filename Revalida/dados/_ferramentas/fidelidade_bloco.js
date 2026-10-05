// fidelidade_bloco.js ANO.ED NUM [ANO.ED NUM ...]
// Mede se o texto de um bloco (enunciado + alternativas) e LITERAL do caderno: quebra o texto do
// bloco em sequencias de 5 palavras e procura cada uma no texto corrido de todos os arquivos
// dados/raw_text/ANO* e dados/raw_text_layout/ANO* (normalizados, quebras de linha unidas).
// Imprime % de 5-gramas encontrados e os trechos nao encontrados (possivel paráfrase/invencao).
// >= 95% = fiel (as faltas costumam ser hifenizacao/colunas). < 85% = revisar no layout.js.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9%]+/g,' ').trim();
const mods=fs.readdirSync(R+'/modulos').filter(f=>f.endsWith('.md')).map(f=>[f,fs.readFileSync(R+'/modulos/'+f,'utf8')]);
const cache={};
function corpus(ano){if(cache[ano])return cache[ano];let t='';
  for(const d of ['raw_text','raw_text_layout']){const dir=R+'/dados/'+d;if(!fs.existsSync(dir))continue;
    for(const f of fs.readdirSync(dir))if(f.startsWith(ano)&&!/gabarito/i.test(f))t+=' '+fs.readFileSync(dir+'/'+f,'utf8');}
  return cache[ano]=' '+norm(t)+' ';}
const a=process.argv.slice(2);
for(let i=0;i<a.length;i+=2){const [ano,ed]=a[i].split('.');const num=a[i+1];
  const cab='**[INEP '+ano+' · Edição '+ed+' · Questão '+num+']**';const m=mods.find(([f,t])=>t.includes(cab));
  if(!m){console.log(a[i]+'-Q'+num+': sem bloco');continue;}
  const t=m[1];const k=t.indexOf(cab)+cab.length;const g=t.indexOf('**Gabarito oficial',k);
  const bruto=t.slice(k,g).replace(/\*\[[^\]]*\]\*/g,' ').replace(/⚠️[^\n]*/g,' ');
  const segs=bruto.split(/\n(?=[A-E]\) )|\n\s*\n/).map(s=>s.replace(/^[A-E]\) /,''));
  const C=corpus(ano);let ok=0,tot=0;const faltas=[];
  for(const sg of segs){const w=norm(sg).split(' ').filter(Boolean);for(let j=0;j+5<=w.length;j++){tot++;const s=' '+w.slice(j,j+5).join(' ')+' ';if(C.includes(s))ok++;else faltas.push(w.slice(j,j+5).join(' '));}}
  const pct=tot?Math.round(100*ok/tot):0;
  // agrupa faltas consecutivas
  const trechos=[];for(const f of faltas){const l=trechos[trechos.length-1];if(l&&l.split(' ').slice(1).join(' ')===f.split(' ').slice(0,4).join(' ')||l&&l.endsWith(f.split(' ').slice(0,4).join(' ')))trechos[trechos.length-1]=l+' '+f.split(' ')[4];else trechos.push(f);}
  console.log(a[i]+'-Q'+num+' ('+m[0].split('_')[0]+'): '+pct+'% de '+tot+' 5-gramas'+(trechos.length?' | nao achados: '+trechos.slice(0,6).map(x=>'"'+x+'"').join(' ; '):''));
}
