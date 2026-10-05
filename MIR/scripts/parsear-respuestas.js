#!/usr/bin/env node
/**
 * Parsea la plantilla de respuestas del MIR (tabla ancha de columnas "V/RC"
 * repetidas G veces por fila, R filas). pdftotext -layout NO alinea los
 * números en columnas de ancho fijo real (los de 1-3 dígitos se desplazan
 * ligeramente), así que no es fiable cortar por posición de caracter.
 *
 * En su lugar se usa la geometría conocida de la tabla: en la fila r
 * (1-indexada) y grupo g (0-indexado), el número de pregunta esperado es
 * V(r,g) = r + g*R, donde R = número de filas de datos. Se recorren los
 * números encontrados en la línea de izquierda a derecha y se van
 * emparejando contra esa secuencia esperada; si el siguiente número no
 * coincide con "es la RC de este V" sino con "es el V del siguiente grupo",
 * se concluye que la RC de la pregunta actual viene en blanco (anulada).
 *
 * Uso: node parsear-respuestas.js <respuestas_layout.txt> <salida.json>
 * Salida: { "1": "B", "2": "A", "13": null, ... }  (null = pregunta anulada / sin RC)
 */
const fs = require("fs");

const LETRAS = { 1: "A", 2: "B", 3: "C", 4: "D" };

function main() {
  const [, , entrada, salida] = process.argv;
  if (!entrada || !salida) {
    console.error("Uso: node parsear-respuestas.js <respuestas_layout.txt> <salida.json>");
    process.exit(1);
  }
  const texto = fs.readFileSync(entrada, "utf8").replace(/\r/g, "");
  const lineas = texto.split("\n");

  const tokenRe = /\b(V0|V|RC|R)\b/g;
  function esCabecera(linea) {
    const toks = [];
    let mm;
    tokenRe.lastIndex = 0;
    while ((mm = tokenRe.exec(linea)) !== null) {
      toks.push(mm[1].startsWith("V") ? "V" : "RC");
    }
    if (toks.length < 4) return null;
    for (let i = 0; i < toks.length; i++) {
      if (toks[i] !== (i % 2 === 0 ? "V" : "RC")) return null;
    }
    return toks.length / 2; // número de grupos
  }

  let headerIdx = -1;
  let G = 0;
  for (let i = 0; i < lineas.length; i++) {
    const g = esCabecera(lineas[i]);
    if (g) {
      headerIdx = i;
      G = g;
      break;
    }
  }
  if (headerIdx === -1) {
    console.error("No se encontró la línea de cabecera de columnas V/RC");
    process.exit(1);
  }

  const filas = lineas.slice(headerIdx + 1).filter((l) => /^\s*\d/.test(l));
  const R = filas.length;

  const respuestas = {};
  const avisos = [];

  filas.forEach((linea, idx) => {
    const r = idx + 1;
    const nums = [...linea.matchAll(/\d+/g)].map((m) => parseInt(m[0], 10));
    let ptr = 0;
    for (let g = 0; g < G; g++) {
      const expectedV = r + g * R;
      if (ptr >= nums.length) break;
      if (nums[ptr] !== expectedV) {
        avisos.push(`fila ${r}, grupo ${g}: se esperaba V=${expectedV}, se encontró ${nums[ptr]}`);
        break;
      }
      ptr++; // consumido el V
      if (ptr >= nums.length) {
        respuestas[expectedV] = null;
        continue;
      }
      const siguienteEsperadoV = r + (g + 1) * R;
      if (nums[ptr] === siguienteEsperadoV) {
        // no había RC: el siguiente número ya es el V del próximo grupo
        respuestas[expectedV] = null;
      } else if (nums[ptr] >= 1 && nums[ptr] <= 4) {
        respuestas[expectedV] = LETRAS[nums[ptr]];
        ptr++;
      } else {
        avisos.push(`fila ${r}, V=${expectedV}: RC inesperada (${nums[ptr]}), se marca en blanco`);
        respuestas[expectedV] = null;
      }
    }
  });

  fs.writeFileSync(salida, JSON.stringify(respuestas, null, 2), "utf8");
  const total = Object.keys(respuestas).length;
  const anuladas = Object.values(respuestas).filter((v) => v === null).length;
  console.log(`OK: ${total} respuestas (${anuladas} sin RC / posiblemente anuladas) -> ${salida}`);
  if (avisos.length) {
    console.log(`${avisos.length} aviso(s):`);
    avisos.slice(0, 20).forEach((a) => console.log(" - " + a));
  }
}

main();
