// Extrai todas as questões (com texto completo) de um ou mais módulos, pelo campo
// modulo_destino (preenchido pelo consolidar.js), varrendo todos os dados/raw/*.json.
// Uso: node extrair_questoes_modulo.js CODIGO1 CODIGO2 ...
// Saída: JSON { CODIGO: { especialidade, tema, questoes: [...] } } no stdout.
const fs = require('fs');
const path = require('path');
const RAW = path.join(__dirname, '..', 'raw');

const codigos = process.argv.slice(2);
const arquivos = fs.readdirSync(RAW).filter(f => /^\d{4}\.\d\.json$/.test(f));

const out = {};
codigos.forEach(c => { out[c] = { especialidade: null, tema: null, questoes: [] }; });

for (const f of arquivos) {
  const qs = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
  for (const q of qs) {
    if (q.modulo_destino && codigos.includes(q.modulo_destino)) {
      out[q.modulo_destino].especialidade = q.especialidade_primaria;
      out[q.modulo_destino].tema = q.tema;
      out[q.modulo_destino].questoes.push({
        id: q.id, ano: q.ano, edicao: q.edicao, numero: q.numero,
        status: q.status, enunciado: q.enunciado, alternativas: q.alternativas,
        gabarito_oficial: q.gabarito_oficial, anulada: !!q.anulada,
        especialidade_secundaria: q.especialidade_secundaria || [],
        assunto: q.assunto, competencia: q.competencia, dificuldade_estimada: q.dificuldade_estimada
      });
    }
  }
}

console.log(JSON.stringify(out, null, 2));
