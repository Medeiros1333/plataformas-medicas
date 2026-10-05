// caderno.js ANO.ED NUM [--enunciado]
// Imprime o texto da questao a partir dos arquivos de dados/raw_text (extracao "corrida",
// sem colunas), que costuma ter as linhas inteiras quando o layout.js corta a margem.
// Procura em todos os arquivos do ano cujo nome contenha "Prova" (exceto LAYOUT/Gabarito).
// --enunciado: devolve so o enunciado em um paragrafo (ate a alternativa A), pronto para
// substituir_enunciado.js. Confira sempre o resultado: rodapes e a questao vizinha podem vazar.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const [ae,num,flag]=process.argv.slice(2);const ano=ae.split('.')[0];const ed=ae.split('.')[1]||'1';
const dir=R+'/dados/raw_text';
let arqs=fs.readdirSync(dir).filter(f=>f.startsWith(ano)&&/Prova/i.test(f)&&!/LAYOUT|Gabarito/i.test(f));
if(ed==='2')arqs=arqs.filter(f=>/\.2|_2\b|2\.2|segunda/i.test(f)).concat(arqs.filter(f=>!/\.1/.test(f)));
else arqs=arqs.filter(f=>!/\.2\b|\.2_|_2\.txt/.test(f));
const RODAPE=/^(EXAME NACIONAL DE REVALIDA|Prova Cinza|REVALIDA\s*\d{4}|EXAME\s+NACIONAL|DE\s+DIPLOMAS|\d{1,2}$|ÁREA LIVRE)/i;
for(const f of arqs){
  const L=fs.readFileSync(dir+'/'+f,'utf8').split(/\r?\n/);
  const re=new RegExp('^\\s*quest[ãa]o\\s+0*'+num+'\\s*$','i');const re2=/^\s*quest[ãa]o\s+\d+\s*$/i;
  const i=L.findIndex(l=>re.test(l));if(i<0)continue;
  let j=i+1;while(j<L.length&&!re2.test(L[j]))j++;
  const bloco=L.slice(i+1,j).filter(l=>!RODAPE.test(l.trim()));
  console.log('### '+f+' (linhas '+(i+1)+'-'+j+')');
  if(flag==='--enunciado'){
    const k=bloco.findIndex(l=>/^\s*\(?A\)?\s/.test(l));
    console.log(bloco.slice(0,k<0?bloco.length:k).join(' ').replace(/\s+/g,' ').trim());
  }else console.log(bloco.join('\n'));
}
