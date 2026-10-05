#!/usr/bin/env node
/**
 * Validación mecánica de un examen combinado, según taxonomía de daños
 * del playbook (sección 12): alternativas vacías, numeración no secuencial,
 * respuesta_correcta fuera de A-D, enunciados sospechosamente cortos.
 *
 * Uso: node validar-examen.js <examen_combinado.json>
 * Exit code 0 si no hay errores, 1 si hay alguno (imprime detalle).
 */
const fs = require("fs");

function main() {
  const [, , path] = process.argv;
  if (!path) {
    console.error("Uso: node validar-examen.js <examen_combinado.json>");
    process.exit(1);
  }
  const preguntas = JSON.parse(fs.readFileSync(path, "utf8"));
  const errores = [];

  let prevNum = 0;
  for (const p of preguntas) {
    if (p.numero_pregunta !== prevNum + 1) {
      errores.push(`Salto de numeración: se esperaba ${prevNum + 1}, llegó ${p.numero_pregunta}`);
    }
    prevNum = p.numero_pregunta;

    if (!p.enunciado || p.enunciado.length < 15) {
      errores.push(`#${p.numero_pregunta}: enunciado vacío o sospechosamente corto ("${p.enunciado}")`);
    }
    for (const letra of ["A", "B", "C", "D"]) {
      const alt = p.alternativas[letra];
      if (!alt || alt.trim().length === 0 || alt.trim() === `${letra}.`) {
        errores.push(`#${p.numero_pregunta}: alternativa ${letra} vacía`);
      }
    }
    if (!p.anulada && !p.pendiente_verificacion && !["A", "B", "C", "D"].includes(p.respuesta_correcta)) {
      errores.push(`#${p.numero_pregunta}: respuesta_correcta fuera de rango A-D ("${p.respuesta_correcta}")`);
    }
  }

  // Duplicados de numero_pregunta
  const vistos = new Set();
  for (const p of preguntas) {
    if (vistos.has(p.numero_pregunta)) {
      errores.push(`#${p.numero_pregunta}: número de pregunta duplicado`);
    }
    vistos.add(p.numero_pregunta);
  }

  if (errores.length === 0) {
    console.log(`OK: ${path} — ${preguntas.length} preguntas, sin errores mecánicos detectados.`);
    process.exit(0);
  } else {
    console.log(`ATENCIÓN: ${path} — ${errores.length} problema(s) detectado(s):`);
    errores.forEach((e) => console.log(" - " + e));
    process.exit(1);
  }
}

main();
