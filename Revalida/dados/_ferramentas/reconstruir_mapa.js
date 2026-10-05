// reconstruir_mapa.js
// Regera dados/mapa_mestre.json a partir de dados/raw/*.json e ressincroniza
// dados/modulos.json (questoes_ids) pelo modulo_destino.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..','..');
const arquivos=fs.readdirSync(path.join(ROOT,'dados','raw')).filter(f=>/^\d{4}\.\d\.json$/.test(f)).sort();
const mapa=[];
for(const f of arquivos){
  const d=JSON.parse(fs.readFileSync(path.join(ROOT,'dados','raw',f),'utf8'));
  const qs=d.questoes||d;
  for(const q of qs){
    const e=(q.enunciado||'').trim();
    mapa.push({
      id:q.id, ano:q.ano, edicao:q.edicao, numero:q.numero,
      enunciado_resumo: e.length>150 ? e.slice(0,150)+'…' : e,
      gabarito_oficial:q.gabarito_oficial, anulada:!!q.anulada,
      especialidade_primaria:q.especialidade_primaria||null,
      especialidade_secundaria:q.especialidade_secundaria||[],
      tema:q.tema||null, assunto:q.assunto||null,
      competencia:q.competencia||null,
      dificuldade_estimada:q.dificuldade_estimada||null,
      modulo_destino:q.modulo_destino||null,
      classificacao:q.classificacao||'herdada',
      duvida_extracao:!!q.duvida_extracao,
      status:q.classificacao==='pendente'?'sem_classificacao':'ok'
    });
  }
}
fs.writeFileSync(path.join(ROOT,'dados','mapa_mestre.json'), JSON.stringify(mapa,null,1),'utf8');
console.log('mapa_mestre.json: '+mapa.length+' questoes');

// ressincroniza modulos.json
const fMod=path.join(ROOT,'dados','modulos.json');
const md=JSON.parse(fs.readFileSync(fMod,'utf8'));
const lista=md.modulos||md;
const porModulo={};
for(const q of mapa) if(q.modulo_destino) (porModulo[q.modulo_destino]=porModulo[q.modulo_destino]||[]).push(q.id);
let mudou=0;
for(const m of lista){
  const cod=m.codigo||m.id;
  const novos=(porModulo[cod]||[]).sort();
  const antes=JSON.stringify((m.questoes_ids||[]).slice().sort());
  if(antes!==JSON.stringify(novos)){ m.questoes_ids=novos; mudou++; }
  m.n_questoes=novos.length;
}
fs.writeFileSync(fMod, JSON.stringify(md,null,1),'utf8');
console.log('modulos.json: '+mudou+' modulos com lista de questoes atualizada (de '+lista.length+')');
const semMod=mapa.filter(q=>!q.modulo_destino).length;
console.log('questoes sem modulo_destino: '+semMod);
