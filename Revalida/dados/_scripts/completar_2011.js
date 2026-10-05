const fs = require('fs');
const path = require('path');
const RAW = path.join(__dirname, '..', 'raw');

const existentes = JSON.parse(fs.readFileSync(path.join(RAW, '2011.1.json'), 'utf8')); // 60 já prontas
const pre = JSON.parse(fs.readFileSync(path.join(RAW, '2011.1.pre.json'), 'utf8')); // 110 mecânicas
const classe = JSON.parse(fs.readFileSync(path.join(__dirname, '_class_2011_61-110.json'), 'utf8'));
const correcoes = JSON.parse(fs.readFileSync(path.join(__dirname, '_correcoes_2011_61-110.json'), 'utf8'));

const resto = pre.filter(q => q.numero >= 61);
for (const q of resto) {
  const key = String(q.numero);
  if (correcoes[key]) {
    q.enunciado = correcoes[key].enunciado;
    q.alternativas = correcoes[key].alternativas;
    q.status = 'ok';
  }
  const c = classe[key];
  if (c) {
    q.especialidade_primaria = c.especialidade_primaria;
    q.especialidade_secundaria = c.especialidade_secundaria || [];
    q.tema = c.tema;
    q.assunto = c.assunto;
    q.competencia = c.competencia;
    q.dificuldade_estimada = c.dificuldade_estimada;
  }
  delete q._motivo;
}

const completo = existentes.concat(resto).sort((a, b) => a.numero - b.numero);
fs.writeFileSync(path.join(RAW, '2011.1.json'), JSON.stringify(completo, null, 2), 'utf8');
console.log('2011.1.json completo:', completo.length, 'questoes. Sem especialidade:', completo.filter(q=>!q.especialidade_primaria).length, 'revisar:', completo.filter(q=>q.status && q.status!=='ok').length);
