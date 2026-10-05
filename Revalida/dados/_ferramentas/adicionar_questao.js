// adicionar_questao.js ANO.ED NUM MODULO [ESPECIALIDADE]
// Cria no raw/ANO.ED.json e no _banco_oficial.json a entrada de uma questao oficial que faltava
// no banco (gabarito vem de _gabaritos_oficiais.json). O texto fica vazio: preencha em seguida com
//   sincronizar_banco.js ANO.ED NUM --aplicar   (copia do bloco ja conferido no caderno)
// Nao faz nada se a questao ja existe.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const [ed,numS,mod,esp]=process.argv.slice(2);const num=+numS;
if(!mod){console.error('uso: adicionar_questao.js ANO.ED NUM MODULO [ESPECIALIDADE]');process.exit(1);}
const G=JSON.parse(fs.readFileSync(R+'/dados/_gabaritos_oficiais.json','utf8'))[ed]||{};
const gab=G[num];if(!gab){console.error('sem gabarito oficial para '+ed+'-Q'+num);process.exit(1);}
const anulada=/ANUL/i.test(gab);
const rp=R+'/dados/raw/'+ed+'.json';const a=JSON.parse(fs.readFileSync(rp,'utf8'));
const bp=R+'/dados/_banco_oficial.json';const B=JSON.parse(fs.readFileSync(bp,'utf8'));
if(a.find(q=>q.numero==num)){console.log('ja existe no raw: '+ed+'-Q'+num);process.exit(0);}
const modelo=a[0];const q={};for(const k of Object.keys(modelo))q[k]=null;
const [ano,e]=ed.split('.');
Object.assign(q,{numero:num,enunciado:'',alternativas:{},gabarito_oficial:anulada?null:gab,anulada,
  id:'INEP'+ano+'-'+e+'-Q'+String(num).padStart(3,'0'),ano:modelo.ano,edicao:modelo.edicao,tipo:modelo.tipo,
  fonte:'recuperada do caderno oficial em '+new Date().toISOString().slice(0,10),duvida_extracao:false,
  especialidade_primaria:esp||null,modulo_destino:mod,classificacao:'manual',classificacao_fonte:'manual'});
a.push(q);a.sort((x,y)=>x.numero-y.numero);
B[ed]=B[ed]||{};B[ed][String(num)]={numero:num,enunciado:'',alternativas:{},gabarito_oficial:anulada?null:gab,anulada,gabarito_conhecido:true,duvida_extracao:false};
const ord={};for(const k of Object.keys(B[ed]).sort((x,y)=>x-y))ord[k]=B[ed][k];B[ed]=ord;
fs.writeFileSync(rp,JSON.stringify(a,null,1));fs.writeFileSync(bp,JSON.stringify(B));
console.log('✓ criada '+q.id+' (gab '+(anulada?'ANULADA':gab)+') -> '+mod);
