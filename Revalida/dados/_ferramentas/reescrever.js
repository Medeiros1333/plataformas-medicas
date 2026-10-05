// Substitui a JUSTIFICATIVA de um bloco de questao (de "**Gabarito oficial:" ate o fim do bloco),
// preservando cabecalho, enunciado, alternativas e notas de extracao.
// Uso: node reescrever.js <arquivo.md> <ano> <edicao> <numero> <arquivo_com_texto_novo>
const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const [arq,ano,ed,num,txtFile]=process.argv.slice(2);
const p=ROOT+'/modulos/'+arq;
let t=fs.readFileSync(p,'utf8');
const novo=fs.readFileSync(txtFile,'utf8').trim();
const marcas=[...t.matchAll(/\*\*\[INEP\s+(\d{4})\s*[\u00b7.]\s*Edi\u00e7\u00e3o\s*(\d)\s*[\u00b7.]\s*Quest\u00e3o\s*n?\u00ba?\s*(\d+)\]\*\*/g)];
const alvo=marcas.find(m=>m[1]===ano&&m[2]===ed&&+m[3]===+num);
if(!alvo){ console.error('✗ bloco nao encontrado em '+arq); process.exit(1); }
const prox=marcas.find(m=>m.index>alvo.index);
const f4=t.indexOf('\n## 4.',alvo.index);
const fim=prox? prox.index : (f4>-1?f4:t.length);
const bloco=t.slice(alvo.index,fim);
const gi=bloco.indexOf('**Gabarito oficial:');
if(gi<0){ console.error('✗ sem linha de gabarito em '+arq); process.exit(1); }
const cabeca=bloco.slice(0,gi);
const rabo = /\n---\s*$/.test(bloco) ? '\n\n---\n\n' : '\n\n';
t = t.slice(0,alvo.index) + cabeca + novo + rabo + t.slice(fim);
fs.writeFileSync(p,t,'utf8');
console.log('✓ reescrito:', arq.replace('.md',''), ano+'.'+ed+'-Q'+num);
