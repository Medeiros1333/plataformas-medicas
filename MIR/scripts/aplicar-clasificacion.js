#!/usr/bin/env node
/**
 * Aplica la especialidad sugerida por clasificar-especialidad.js al campo
 * "especialidad" del archivo de preguntas final, SOLO cuando hubo sugerencia
 * confiable. Las no clasificadas quedan con especialidad:null para revisión
 * manual posterior (durante la Fase 7, al redactar cada módulo).
 *
 * Uso: node aplicar-clasificacion.js <preguntas.json> <sugerido.json> <salida.json>
 */
const fs = require("fs");

function main() {
  const [, , preguntasPath, sugeridoPath, salida] = process.argv;
  const preguntas = JSON.parse(fs.readFileSync(preguntasPath, "utf8"));
  const sugerido = JSON.parse(fs.readFileSync(sugeridoPath, "utf8"));
  const porId = new Map(sugerido.map((s) => [s.id, s]));

  const resultado = preguntas.map((p) => {
    const s = porId.get(p.id);
    return {
      ...p,
      especialidad: s && s.especialidad_sugerida ? s.especialidad_sugerida : p.especialidad,
      especialidad_confianza: s ? `${s.score}/${s.score2}` : null,
    };
  });

  fs.writeFileSync(salida, JSON.stringify(resultado, null, 2), "utf8");
  const n = resultado.filter((p) => p.especialidad).length;
  console.log(`OK: ${n}/${resultado.length} con especialidad asignada -> ${salida}`);
}

main();
