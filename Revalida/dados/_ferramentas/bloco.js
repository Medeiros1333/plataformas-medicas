const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const [arq,ano,ed,num]=process.argv.slice(2);
const t=fs.readFileSync(ROOT+'/modulos/'+arq,'utf8');
const marcas=[...t.matchAll(/\*\*\[INEP\s+(\d{4})\s*[\u00b7.]\s*Edi\u00e7\u00e3o\s*(\d)\s*[\u00b7.]\s*Quest\u00e3o\s*n?\u00ba?\s*(\d+)\]\*\*/g)];
const alvo=marcas.find(m=>m[1]===ano&&m[2]===ed&&+m[3]===+num);
if(!alvo){ console.log('### NAO ENCONTRADO. Blocos no arquivo:', marcas.map(m=>m[1]+'.'+m[2]+'-Q'+m[3]).join(' ')); process.exit(0); }
const prox=marcas.find(m=>m.index>alvo.index);
const fim=prox?prox.index:(t.indexOf('\n## 4.',alvo.index)>-1?t.indexOf('\n## 4.',alvo.index):t.length);
console.log(t.slice(alvo.index,fim));
