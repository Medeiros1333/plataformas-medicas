// Insere novos blocos de questao no fim da secao 3 de um modulo (antes de "## 4. FLASHCARDS"),
// e atualiza o cabecalho (nº de questoes + nota de amostra parcial).
// Uso: node inserir.js <arquivo.md> <arquivo_com_blocos.txt>
const fs=require('fs');
const ROOT='c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida';
const [arq,blocosFile]=process.argv.slice(2);
const p=ROOT+'/modulos/'+arq;
let t=fs.readFileSync(p,'utf8');
const novos=fs.readFileSync(blocosFile,'utf8').trim();

// Guarda: todo bloco precisa ter a linha de gabarito, senao o Hub o importa sem resposta.
{
  const cabs=(novos.match(/\*\*\[INEP \d{4} · Edição \d · Questão \d+\]\*\*/g)||[]);
  const gabs=(novos.match(/\*\*Gabarito oficial[^\n]*/g)||[]);
  if(cabs.length!==gabs.length){
    console.error('ERRO: '+cabs.length+' blocos mas '+gabs.length+' linhas de gabarito — algum bloco está sem linha de gabarito. Nada foi inserido.');
    process.exit(1);
  }
}
// Guarda (2026-09-30): nunca inserir um cabecalho que o modulo ja tem — rodar o mesmo lote
// duas vezes duplicava blocos (ver RETOMADA, armadilha 16). Para trocar um bloco, use substituir_multi.js.
{
  const cabs=(novos.match(/\*\*\[INEP \d{4} · Edição \d · Questão \d+\]\*\*/g)||[]);
  const ja=cabs.filter(c=>t.includes(c));
  if(ja.length){
    console.error('ERRO: '+arq+' ja contem '+ja.join(', ')+' — nada foi inserido (use substituir_multi.js para trocar).');
    process.exit(1);
  }
}
// Guarda (2026-09-30): o gabarito escrito no bloco tem de ser o do PDF oficial
// (dados/_gabaritos_oficiais.json). Pegou 2 erros meus (2023.2-Q68, 2020.1-Q48) so depois de inseridos.
{
  const G=JSON.parse(fs.readFileSync(ROOT+'/dados/_gabaritos_oficiais.json','utf8'));
  const partes=novos.split(/(?=\*\*\[INEP \d{4} · Edição \d · Questão \d+\]\*\*)/);
  const erros=[];
  for(const p of partes){
    const h=p.match(/\*\*\[INEP (\d{4}) · Edição (\d) · Questão (\d+)\]\*\*/);if(!h)continue;
    const of=(G[h[1]+'.'+h[2]]||{})[h[3]];const g=(p.match(/\*\*Gabarito oficial: (ANULADA|[A-E])/)||[])[1];
    if(!of){continue;}
    const ofN=/ANUL/i.test(of)?'ANULADA':of;
    if(g!==ofN)erros.push(h[1]+'.'+h[2]+'-Q'+h[3]+': bloco diz '+g+', oficial é '+ofN);
  }
  if(erros.length){console.error('ERRO: gabarito diferente do oficial — nada foi inserido:\n  '+erros.join('\n  '));process.exit(1);}
}
const marca='\n## 4. FLASHCARDS';
const i=t.indexOf(marca);
if(i<0) throw new Error('secao 4 nao encontrada em '+arq);

// remove um "---" final solto imediatamente antes da secao 4, para reinseri-lo depois
let antes=t.slice(0,i).replace(/\n+---\s*$/,'');
t = antes + '\n\n' + novos + '\n\n---\n' + t.slice(i);

// ---- atualiza cabecalho: recalcula a lista de questoes do modulo ----
const reQ=/\*\*\[INEP\s+(\d{4})\s*[\u00b7.]\s*Edi\u00e7\u00e3o\s*(\d)\s*[\u00b7.]\s*Quest\u00e3o\s*n?\u00ba?\s*(\d+)\]\*\*/g;
const ids=[]; let m;
while((m=reQ.exec(t))) ids.push(m[1]+'.'+m[2]+'-Q'+m[3]);
const lista=ids.join(', ');
t=t.replace(/\*\*N\u00ba de quest\u00f5es hist\u00f3ricas do INEP sobre o assunto:\*\*[^·]*/,
  '**Nº de questões históricas do INEP sobre o assunto:** '+ids.length+' ('+lista+') — banco completo das 16 edições extraídas (2011.1 a 2025.2); faltam apenas 2022.1 e 2026.1, cujos PDFs têm encoding corrompido ');

// ---- remove a nota obsoleta de "amostra parcial" da secao 3 ----
t=t.replace(/^\u26a0\ufe0f Nota: este m\u00f3dulo foi gerado a partir de \d+ edi\u00e7[\u00f5o]es j\u00e1 processadas[^\n]*\n\n?/m,
  '📌 *Atualizado em 2026-09-23: este módulo passou a cobrir **todas as 16 edições já extraídas** do banco (2011.1–2025.2). Gabaritos conferidos um a um contra os PDFs oficiais do INEP na auditoria de 2026-09-23.*\n\n');

fs.writeFileSync(p,t,'utf8');
console.log('✓ inserido em '+arq+' — agora com '+ids.length+' questões');
