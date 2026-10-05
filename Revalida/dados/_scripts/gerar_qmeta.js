// Gera dados/_hub_qmeta.json — indice compacto de metadados por questao, para os filtros da aba
// "Questoes" do Hub. Formato: { id: [especialidade, ano, edicao, numero, competencia, dificuldade, anulada] }
// Rodar sempre que mapa_mestre.json mudar; depois rodar injetar_no_hub.js.
const fs=require('fs'), path=require('path');
const DADOS=path.join(__dirname,'..');
const mm=JSON.parse(fs.readFileSync(path.join(DADOS,'mapa_mestre.json'),'utf8'));
const NORM={'Medicina Preventiva e Social':'Preventiva'};
const meta={};
for(const q of mm){
  const esp=NORM[q.especialidade_primaria]||q.especialidade_primaria||'Indeterminado';
  meta[q.id]=[esp, q.ano, q.edicao, q.numero, q.competencia||'', q.dificuldade_estimada||0, q.anulada?1:0];
}
fs.writeFileSync(path.join(DADOS,'_hub_qmeta.json'), JSON.stringify(meta),'utf8');
const esp=[...new Set(Object.values(meta).map(m=>m[0]))].sort();
console.log('QMETA:',Object.keys(meta).length,'questoes |',esp.length,'especialidades');
