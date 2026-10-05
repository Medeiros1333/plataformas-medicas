// sync_meta_nq.js [PREFIXO] — acerta "n_questoes" do JSON de METADADOS de cada modulo para o numero real
// de blocos "**[INEP ...]**" da secao 3 (o inserir.js so atualiza o cabecalho). Uso apos criar modulos novos.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const pref=process.argv[2]||'';let n=0;
for(const f of fs.readdirSync(R+'/modulos').filter(x=>x.endsWith('.md')&&x.startsWith(pref))){
  const p=R+'/modulos/'+f;let t=fs.readFileSync(p,'utf8');
  const s3=t.indexOf('\n## 3.'),s4=t.indexOf('\n## 4.');if(s3<0||s4<0)continue;
  const q=(t.slice(s3,s4).match(/\*\*\[INEP \d{4} · Edição \d · Questão \d+\]\*\*/g)||[]).length;
  const novo=t.replace(/("n_questoes":\s*)\d+/,'$1'+q);
  if(novo!==t){fs.writeFileSync(p,novo,'utf8');n++;console.log(f+' -> n_questoes '+q);}
}
console.log('arquivos ajustados: '+n);
