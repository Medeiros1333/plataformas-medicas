#!/usr/bin/env node
/**
 * Extrae el texto de un PDF de examen MIR maquetado a 2 columnas,
 * reordenando correctamente: columna izquierda completa, luego columna
 * derecha, página por página (evita el intercalado de líneas de pdftotext -layout).
 *
 * Uso: node extraer-columnas.js <pdf_origen> <pagina_inicio> <pagina_fin> <archivo_salida.txt>
 *
 * Coordenadas de columna calibradas para el formato A4 (595.276 x 841.89 pts)
 * usado por el Ministerio de Sanidad en los cuadernos de examen MIR 2020-2025.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");

const PDFTOTEXT = "pdftotext";
const LEFT = { x: 0, w: 300 };
const RIGHT = { x: 297, w: 300 };
const HEIGHT = 842;

function extraerColumna(pdf, pagina, col) {
  const args = [
    "-layout",
    "-f", String(pagina),
    "-l", String(pagina),
    "-x", String(col.x),
    "-y", "0",
    "-W", String(col.w),
    "-H", String(HEIGHT),
    pdf,
    "-",
  ];
  try {
    return execFileSync(PDFTOTEXT, args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  } catch (e) {
    return "";
  }
}

function main() {
  const [, , pdf, pInicioStr, pFinStr, salida] = process.argv;
  if (!pdf || !pInicioStr || !pFinStr || !salida) {
    console.error("Uso: node extraer-columnas.js <pdf> <pagina_inicio> <pagina_fin> <salida.txt>");
    process.exit(1);
  }
  const pInicio = parseInt(pInicioStr, 10);
  const pFin = parseInt(pFinStr, 10);
  let partes = [];
  for (let p = pInicio; p <= pFin; p++) {
    const izq = extraerColumna(pdf, p, LEFT);
    const der = extraerColumna(pdf, p, RIGHT);
    partes.push(`\n===PAGINA ${p} IZQ===\n${izq}`);
    partes.push(`\n===PAGINA ${p} DER===\n${der}`);
  }
  fs.writeFileSync(salida, partes.join(""), "utf8");
  console.log(`OK: ${salida} (paginas ${pInicio}-${pFin})`);
}

main();
