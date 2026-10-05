// verificar_no_caderno.js — para cada alternativa apontada em _auditoria_alternativas.txt,
// verifica se o texto do BLOCO e o do BANCO aparecem no caderno original (saida do layout.js).
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');const R=path.resolve(__dirname,'..','..');
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/⟪\?⟫/g,' ').replace(/[^a-z0-9]/g,'');
const L=fs.readFileSync(R+'/dados/_auditoria_alternativas.txt','utf8').split('\n');const cache={};
const B=JSON.parse(fs.readFileSync(R+'/dados/_banco_oficial.json','utf8'));
const re=/\*\*\[INEP (\d{4}) · Edição (\d) · Questão (\d+)\]\*\*([\s\S]*?)\*\*Gabarito oficial/g;
const blocos={};for(const f of fs.readdirSync(R+'/modulos')){const t=fs.readFileSync(R+'/modulos/'+f,'utf8');let m;while((m=re.exec(t))){const a={};m[4].split('\n').forEach(l=>{const x=l.match(/^([A-E])\)\s+(.*)$/);if(x)a[x[1]]=x[2]});blocos[f.split('_')[0]+' '+m[1]+'.'+m[2]+'-Q'+m[3]]=a;}}
const res={};
for(const l of L){const m=l.match(/^(\S+) (\S+)-Q(\d+) ([A-E]) sim/);if(!m)continue;const [_,cod,ed,num,let_]=m;const k=ed+' '+num;
 if(!cache[k]){try{cache[k]=norm(execFileSync('node',[R+'/dados/_ferramentas/layout.js',ed,num]).toString()+fs.readFileSync(R+'/dados/raw_text/'+fs.readdirSync(R+'/dados/raw_text').filter(f=>f.startsWith(ed.split('.')[0])&&!/Gabarito|LAYOUT/.test(f)).join('\n'),'utf8').slice(0,0));}catch(e){cache[k]='';}}
 const cad=cache[k];const bl=norm((blocos[cod+' '+ed+'-Q'+num]||{})[let_]).slice(0,45);const bn=norm(((B[ed]||{})[num]||{}).alternativas?.[let_]).slice(0,45);
 const v=(bl&&cad.includes(bl)?'BLOCO_OK':'bloco?')+'/'+(bn&&cad.includes(bn)?'BANCO_OK':'banco?');
 (res[cod+' '+ed+'-Q'+num]=res[cod+' '+ed+'-Q'+num]||[]).push(let_+':'+v);}
for(const[k,v] of Object.entries(res))console.log(k.padEnd(22),v.join('  '));
