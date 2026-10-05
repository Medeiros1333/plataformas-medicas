// inserir_multi.js ARQ.txt — arquivo com seções "@@CODIGO" (uma por módulo); insere cada seção via inserir.js
// Seções cujos blocos JÁ estão TODOS no módulo são puladas (permite reexecutar o lote com segurança).
// Se uma seção falhar (gabarito diferente do oficial, cabeçalho repetido...), as demais continuam
// e o erro é listado no fim (código de saída 1).
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const R=path.resolve(__dirname,'..','..');const src=process.argv[2];
const partes=fs.readFileSync(src,'utf8').split(/^@@/m).filter(s=>s.trim());
const files=fs.readdirSync(R+'/modulos');const falhas=[];
for(const p of partes){const nl=p.indexOf('\n');const cod=p.slice(0,nl).trim();const corpo=p.slice(nl+1).trim().replace(/\n---\s*$/,'');
 const f=files.find(x=>x.startsWith(cod+'_'));if(!f){falhas.push(cod+': MODULO NAO ENCONTRADO');continue;}
 const atual=fs.readFileSync(R+'/modulos/'+f,'utf8');
 const cabs=corpo.match(/\*\*\[INEP \d{4} · Edição \d · Questão \d+\]\*\*/g)||[];
 if(cabs.length&&cabs.every(c=>atual.includes(c))){console.log('= '+cod+': ja inserido (pulado)');continue;}
 const tmp=path.join(path.dirname(src),'_tmp_'+cod+'.txt');fs.writeFileSync(tmp,corpo);
 try{process.stdout.write(execFileSync('node',[R+'/dados/_ferramentas/inserir.js',f,tmp],{stdio:['ignore','pipe','pipe']}).toString());}
 catch(e){falhas.push(cod+': '+String(e.stderr||e.message).trim().split('\n').slice(0,4).join(' | '));}
 fs.unlinkSync(tmp);}
if(falhas.length){console.error('\nFALHAS ('+falhas.length+'):\n  '+falhas.join('\n  '));process.exitCode=1;}
