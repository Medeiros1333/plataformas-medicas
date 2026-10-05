const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const ALVOS=[
 ['CIR-07_doenca-diverticular.md','2015','1',11],
 ['CIR-26_abdome-agudo-vascular.md','2015','1',1],
 ['DER-03_carcinoma-basocelular.md','2015','1',92],
 ['INF-15_hiv-gestacao.md','2011','1',94],
 ['OBS-33_exame-obstetrico.md','2016','1',29],
 ['PED-127_transtorno-espectro-autista.md','2025','2',85],
 ['PREV-08_saude-do-idoso.md','2015','1',58],
 ['PREV-09_niveis-de-prevencao.md','2015','1',44],
 ['PSI-12_depressao-pos-parto.md','2025','2',55],
];
const AVISO='⚠️ **QUESTÃO ANULADA PELO INEP** — anulada no gabarito definitivo desta edição; **não há resposta oficial**. O item é mantido aqui porque o conteúdo continua sendo cobrado, mas a alternativa discutida abaixo é a leitura técnica mais defensável, **não** um gabarito.';
let feitos=0;
for(const [arq,ano,ed,num] of ALVOS){
  const p=ROOT+'/modulos/'+arq;
  let t=fs.readFileSync(p,'utf8');
  const marcas=[...t.matchAll(/\*\*\[INEP\s+(\d{4})\s*[\u00b7.]\s*Edi\u00e7\u00e3o\s*(\d)\s*[\u00b7.]\s*Quest\u00e3o\s*n?\u00ba?\s*(\d+)\]\*\*/g)];
  const alvo=marcas.find(m=>m[1]===ano&&m[2]===ed&&+m[3]===num);
  if(!alvo){ console.log('✗ nao achou bloco:',arq,ano+'.'+ed+'-Q'+num); continue; }
  const prox=marcas.find(m=>m.index>alvo.index);
  const fimIdx=t.indexOf('\n## 4.',alvo.index);
  const fim=prox? prox.index : (fimIdx>-1?fimIdx:t.length);
  let bloco=t.slice(alvo.index,fim);
  if(bloco.includes('QUESTÃO ANULADA')){ console.log('· ja marcado:',arq); continue; }
  const gab=(bloco.match(/\*\*Gabarito oficial:\s*([A-E])\*\*/)||[])[1];
  // 1) insere aviso logo apos o cabecalho
  bloco=bloco.replace(alvo[0], alvo[0]+'\n\n'+AVISO);
  // 2) troca a linha de gabarito
  if(gab) bloco=bloco.replace(/\*\*Gabarito oficial:\s*[A-E]\*\*/,
    '**Gabarito oficial: ANULADA** — sem resposta oficial. Leitura técnica mais defensável: **'+gab+'**.');
  // 3) reformula o titulo da justificativa da correta
  bloco=bloco.replace(/\*\*Por que ([A-E])[^*]*est[áa] correta:\*\*/, '**Por que $1 é a leitura técnica mais defensável:**');
  bloco=bloco.replace(/\*\*Por que as demais est[ãa]o erradas:\*\*/, '**Por que as demais são menos sustentáveis:**');
  t=t.slice(0,alvo.index)+bloco+t.slice(fim);
  fs.writeFileSync(p,t,'utf8');
  console.log('✓ anulada marcada:',arq.replace('.md',''),ano+'.'+ed+'-Q'+num,'(era gabarito '+gab+')');
  feitos++;
}
console.log('\nblocos transformados:',feitos);
