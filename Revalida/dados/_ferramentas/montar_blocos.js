// montar_blocos.js EXPLICACOES.txt EDICAO SAIDA.txt — monta um arquivo @@COD (para inserir_multi.js) a partir de:
//  - texto literal da questao em dados/raw/EDICAO.json (enunciado, alternativas, modulo_destino)
//  - gabarito de dados/_gabaritos_oficiais.json (nunca do arquivo de explicacoes)
//  - explicacoes escritas a mao em EXPLICACOES.txt, secoes "##N" (N = numero da questao), contendo
//    "Por que X esta correta", demais, PEGADINHA e "O que a banca estava testando" (ou, se ANULADA, so a
//    linha "**Analise:** ..." e "O que a banca estava testando").
// Evita redigitar enunciado/alternativas (fonte unica = raw revisado contra o PDF).
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const [fExp,ed,fOut]=process.argv.slice(2);
if(!fOut){console.log('uso: node montar_blocos.js EXPLICACOES.txt EDICAO SAIDA.txt');process.exit(1);}
const [ano,num]=ed.split('.');
const OF=JSON.parse(fs.readFileSync(R+'/dados/_gabaritos_oficiais.json','utf8'))[ed];
const raw=JSON.parse(fs.readFileSync(R+'/dados/raw/'+ed+'.json','utf8'));const qs=raw.questoes||raw;
const secs=fs.readFileSync(fExp,'utf8').split(/^##(?=\d+\s*$)/m).filter(s=>s.trim());
const porMod={};const erros=[];
for(const s of secs){
  const nl=s.indexOf('\n');const n=+s.slice(0,nl).trim();const exp=s.slice(nl+1).trim().replace(/\n*---\s*$/,''); // o "---" entre secoes do arquivo nao entra no bloco
  const q=qs.find(x=>x.numero===n);if(!q){erros.push(n+': questao nao encontrada');continue;}
  const g=OF[n];if(g===undefined){erros.push(n+': sem gabarito oficial');continue;}
  if(g==='ANULADA'){ if(!/\*\*Análise:\*\*/.test(exp)) erros.push(n+': anulada sem **Análise:**'); }
  else { const m=exp.match(/\*\*Por que ([A-E]) está correta/); if(!m||m[1]!==g){erros.push(n+': explicacao defende '+(m&&m[1])+' mas gabarito oficial = '+g);continue;} }
  const alts=Object.entries(q.alternativas).map(([k,v])=>k+') '+v).join('\n');
  const gab= g==='ANULADA'? '**Gabarito oficial: ANULADA** — o INEP anulou esta questão; não há resposta oficial.' : '**Gabarito oficial: '+g+'**';
  const bloco='**[INEP '+ano+' · Edição '+num+' · Questão '+n+']**\n\n'+q.enunciado+'\n\n'+alts+'\n\n'+gab+'\n\n'+exp;
  (porMod[q.modulo_destino]=porMod[q.modulo_destino]||[]).push(bloco);
}
let out='';for(const [cod,bs] of Object.entries(porMod)) out+='@@'+cod+'\n'+bs.join('\n\n---\n\n')+'\n';
fs.writeFileSync(fOut,out);
console.log('blocos: '+Object.values(porMod).flat().length+' em '+Object.keys(porMod).length+' modulos -> '+fOut);
if(erros.length){console.log('ERROS:\n  '+erros.join('\n  '));process.exitCode=1;}
