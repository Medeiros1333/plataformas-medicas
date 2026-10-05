// Mescla um mapeamento compacto de classificação {numero: {...campos...}} no .pre.json,
// produzindo o .json final (sem _motivo, status normalizado para "ok" quando classificado
// com sucesso, a menos que explicitamente marcado revisar/ilegivel no próprio mapeamento).
//
// Uso: node mesclar_classificacao.js <ano.edicao> <arquivo_classificacao.json> [correcoes.json]
// arquivo_classificacao.json: { "1": {especialidade_primaria, especialidade_secundaria, tema, assunto, competencia, dificuldade_estimada, status?}, ... }
// correcoes.json (opcional): { "5": {enunciado, alternativas}, ... } para consertar revisar_extracao/faltando

const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'raw');

function main() {
  const [chave, classFile, correcoesFile] = process.argv.slice(2);
  const preFile = path.join(RAW_DIR, `${chave}.pre.json`);
  const outFile = path.join(RAW_DIR, `${chave}.json`);

  const questoes = JSON.parse(fs.readFileSync(preFile, 'utf8'));
  const classMap = JSON.parse(fs.readFileSync(classFile, 'utf8'));
  const correcoes = correcoesFile && fs.existsSync(correcoesFile) ? JSON.parse(fs.readFileSync(correcoesFile, 'utf8')) : {};

  let nClassificadas = 0, nCorrigidas = 0, nSemClass = 0;
  for (const q of questoes) {
    const key = String(q.numero);
    if (correcoes[key]) {
      if (correcoes[key].enunciado) q.enunciado = correcoes[key].enunciado;
      if (correcoes[key].alternativas) q.alternativas = correcoes[key].alternativas;
      nCorrigidas++;
    }
    const c = classMap[key];
    if (c) {
      q.especialidade_primaria = c.especialidade_primaria;
      q.especialidade_secundaria = c.especialidade_secundaria || [];
      q.tema = c.tema;
      q.assunto = c.assunto;
      q.competencia = c.competencia;
      q.dificuldade_estimada = c.dificuldade_estimada;
      if (c.status) q.status = c.status;
      else if (q.status === 'revisar_extracao' && correcoes[key]) q.status = 'ok';
      nClassificadas++;
    } else {
      nSemClass++;
    }
    delete q._motivo;
  }
  questoes.sort((a, b) => a.numero - b.numero);
  fs.writeFileSync(outFile, JSON.stringify(questoes, null, 2), 'utf8');
  console.log(`${chave}: total=${questoes.length} classificadas=${nClassificadas} corrigidas=${nCorrigidas} sem_classificacao=${nSemClass}`);
  console.log(`salvo: ${outFile}`);
}

main();
