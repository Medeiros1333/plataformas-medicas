#!/usr/bin/env node
/**
 * Combina preguntas.json + respuestas.json (o ninguna, si no hay plantilla)
 * en el JSON final por pregunta, según el esquema del playbook (sección 5).
 *
 * Uso: node combinar-examen.js <año> <preguntas.json> <salida.json> [respuestas.json]
 */
const fs = require("fs");

function main() {
  const [, , anioStr, preguntasPath, salida, respuestasPath] = process.argv;
  if (!anioStr || !preguntasPath || !salida) {
    console.error("Uso: node combinar-examen.js <año> <preguntas.json> <salida.json> [respuestas.json]");
    process.exit(1);
  }
  const anio = parseInt(anioStr, 10);
  const preguntas = JSON.parse(fs.readFileSync(preguntasPath, "utf8"));
  const respuestas = respuestasPath ? JSON.parse(fs.readFileSync(respuestasPath, "utf8")) : null;

  const resultado = preguntas.map((p) => {
    let respuesta_correcta = null;
    let anulada = false;
    let pendiente_verificacion = true;

    if (respuestas) {
      pendiente_verificacion = false;
      const rc = respuestas[String(p.numero_pregunta)];
      if (rc === undefined) {
        pendiente_verificacion = true; // no aparece en la plantilla, revisar
      } else if (rc === null) {
        anulada = true;
      } else {
        respuesta_correcta = rc;
      }
    }

    return {
      id: `MIR-${anio}-${String(p.numero_pregunta).padStart(3, "0")}`,
      año: anio,
      numero_pregunta: p.numero_pregunta,
      especialidad: null,
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      imagen_ref: p.imagen_ref,
      respuesta_correcta,
      anulada,
      pendiente_verificacion,
      origen: "real",
      fuente: `Examen MIR ${anio}, pregunta ${p.numero_pregunta}`,
      modulo_asociado: null,
    };
  });

  fs.writeFileSync(salida, JSON.stringify(resultado, null, 2), "utf8");
  const anuladas = resultado.filter((r) => r.anulada).length;
  const pendientes = resultado.filter((r) => r.pendiente_verificacion).length;
  console.log(
    `OK: ${resultado.length} preguntas MIR ${anio} -> ${salida} (${anuladas} anuladas, ${pendientes} pendientes de verificación)`
  );
}

main();
