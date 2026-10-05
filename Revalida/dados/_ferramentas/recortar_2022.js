// recortar_2022.js [--aplicar] — reconstroi enunciado + alternativas das questoes de 2022.1 a partir do
// texto corrido (dados/raw_text/2022__Prova_objetiva_2022.1.txt), que le cada coluna inteira com as linhas
// completas (a versao por layout perde palavras na borda das colunas). Ancora: as primeiras palavras do
// enunciado atual (raw/2022.1.json). Questoes com reconstrucao_manual sao preservadas.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const aplicar=process.argv.includes('--aplicar');
const mapa=JSON.parse(fs.readFileSync(R+'/dados/_mapa_cifra.json','utf8'));
const MAI={'\u0004':'A','\u0006':'Á','\u0005':'À','\u0011':'B','\u0012':'C','\u0018':'D','\u001C':'E','\u001E':'É','&':'F',"'":'G',',':'H','/':'I','<':'K','>':'L','D':'M','E':'N','K':'O','W':'P','Y':'Q','Z':'R','^':'S','d':'T','h':'U','s':'V'};
const cif=/[Ā-ɏͰ-ϿЀ-ӿ]/;
const dec=s=>{let o='';for(const c of s){o+= MAI[c]!==undefined? MAI[c] : (mapa[c]!==undefined && !/[\x00-\x7f]/.test(c)? mapa[c] : (c==='\u0003'?' ':c));}return o;};
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const L=fs.readFileSync(R+'/dados/raw_text/2022__Prova_objetiva_2022.1.txt','utf8').split(/\r?\n/);
const D=L.map(l=>cif.test(l)?dec(l):l);
const N=D.map(norm);
const ALT=/^\s*([ABCD])[ \u0003]+(?=\S)/;            // marcador em ASCII claro no texto bruto
const PARA=/^\s*(QUEST[AÃ]O \d+|Espaço livre|ÁREA LIVRE|QUESTIONÁRIO)/;
const limpa=s=>s.replace(/\s*\u0015\u0013\u0015\u0015\s*/g,' ').replace(/\s*Espaço livre\s*/g,' ').replace(/\s{2,}/g,' ').trim();
const r=JSON.parse(fs.readFileSync(R+'/dados/raw/2022.1.json','utf8'));
let feitos=0;const rel=[];
for(const q of r){
  if(q.reconstrucao_manual) continue;
  const ancora=norm(q.enunciado).split(' ').slice(0,6).join(' ');
  let i=N.findIndex(x=>x.startsWith(ancora));
  if(i<0){ // ancora pode cruzar a quebra de linha
    i=N.findIndex((x,k)=>(x+' '+(N[k+1]||'')).includes(ancora) && x.length && ancora.startsWith(x.split(' ').slice(0,2).join(' ')));
  }
  if(i<0){rel.push(q.numero+': ancora nao encontrada');continue;}
  let en=[],alts={},cur=null,k=i;
  for(;k<L.length;k++){
    const raw=L[k], d=D[k];
    if(k>i && PARA.test(raw)) break;
    const m=raw.match(ALT);
    if(m && (cur===null? m[1]==='A' : m[1].charCodeAt(0)===cur.charCodeAt(0)+1)){
      cur=m[1]; alts[cur]=dec(raw.slice(m[0].length)); continue; }
    if(!raw.trim()){ if(cur==='D') break; continue; }
    if(cur) alts[cur]+=' '+d; else en.push(d);
  }
  if(Object.keys(alts).length!==4){rel.push(q.numero+': '+Object.keys(alts).length+' alternativas');continue;}
  const novo={enunciado:limpa(en.join(' ')),alternativas:Object.fromEntries(Object.entries(alts).map(([a,b])=>[a,limpa(b)]))};
  const tamA=(q.enunciado+Object.values(q.alternativas).join('')).length, tamN=(novo.enunciado+Object.values(novo.alternativas).join('')).length;
  // MOSTRA=30,56 node recortar_2022.js  -> imprime versao atual e nova dessas questoes
  if(process.env.MOSTRA&&process.env.MOSTRA.split(',').includes(String(q.numero))){
    console.log('\n#'+q.numero+' ATUAL:\n'+q.enunciado+'\n'+JSON.stringify(q.alternativas)+'\nNOVO:\n'+novo.enunciado+'\n'+JSON.stringify(novo.alternativas));}
  if(tamN<0.85*tamA || tamN>1.3*tamA){rel.push(q.numero+': tamanho suspeito '+tamA+' -> '+tamN);continue;}
  // seguranca: a versao nova tem de CONTER a atual (>=85% dos 5-gramas) e cada alternativa tem de bater
  const g5=s=>{const w=norm(s).split(' ');const o=[];for(let i=0;i+5<=w.length;i++)o.push(w.slice(i,i+5).join(' '));return o;};
  const nTxt=' '+norm(novo.enunciado+' '+Object.values(novo.alternativas).join(' '))+' ';
  const gA=g5(q.enunciado+' '+Object.values(q.alternativas).join(' '));
  const cob=gA.length? gA.filter(g=>nTxt.includes(' '+g+' ')).length/gA.length : 1;
  const altOk=['A','B','C','D'].every(L=>{const a=norm(q.alternativas[L]||''), b=norm(novo.alternativas[L]||'');
    return a.split(' ').slice(0,3).join(' ')===b.split(' ').slice(0,3).join(' ') && b.length<=a.length*1.6+20;});
  if(cob<0.85||!altOk){rel.push(q.numero+': rejeitada (cobertura '+(100*cob).toFixed(0)+'%, alternativas '+(altOk?'ok':'diferem')+')');continue;}
  if(aplicar){q.enunciado=novo.enunciado;q.alternativas=novo.alternativas;q.status='recortado_texto_corrido';}
  feitos++;
}
if(aplicar) fs.writeFileSync(R+'/dados/raw/2022.1.json',JSON.stringify(r,null,1));
console.log((aplicar?'aplicado':'seriam refeitas')+': '+feitos);console.log(rel.join('\n'));
