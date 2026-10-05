// substituir_multi.js ARQ.txt — como inserir_multi.js, mas antes REMOVE do modulo os blocos
// existentes com os mesmos cabecalhos (via remover_bloco.js --aplicar, que guarda backup).
// Uso: corrigir blocos antigos cujo texto nao batia com o caderno. Se o bloco ainda nao
// existe no modulo, apenas insere.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const R=path.resolve(__dirname,'..','..');const src=process.argv[2];
const files=fs.readdirSync(R+'/modulos');
for(const p of fs.readFileSync(src,'utf8').split(/^@@/m).filter(s=>s.trim())){
  const cod=p.slice(0,p.indexOf('\n')).trim();
  const f=files.find(x=>x.startsWith(cod+'_'));
  if(!f){console.error('MODULO NAO ENCONTRADO '+cod);continue;}
  const re=/\*\*\[INEP (\d{4}) · Edição (\d) · Questão (\d+)\]\*\*/g;let m;
  while((m=re.exec(p))){
    const cab='**[INEP '+m[1]+' · Edição '+m[2]+' · Questão '+m[3]+']**';
    if(!fs.readFileSync(R+'/modulos/'+f,'utf8').includes(cab)){console.log('  (novo) '+cod+' '+m[1]+'.'+m[2]+'-Q'+m[3]);continue;}
    execFileSync('node',[R+'/dados/_ferramentas/remover_bloco.js',f,m[1],m[2],m[3],'--aplicar']);
    console.log('  removido '+cod+' '+m[1]+'.'+m[2]+'-Q'+m[3]);
  }
}
process.stdout.write(execFileSync('node',[R+'/dados/_ferramentas/inserir_multi.js',src]).toString());
