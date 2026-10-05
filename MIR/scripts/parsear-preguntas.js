#!/usr/bin/env node
/**
 * Parsea el texto ordenado (salida de extraer-columnas.js) en preguntas
 * estructuradas: {numero_pregunta, enunciado, alternativas:{1,2,3,4}, imagen_ref}.
 *
 * La indentación que deja pdftotext -layout tras el recorte por columna NO es
 * fiable como separador (varía ligeramente entre años e incluso entre líneas
 * de un mismo bloque), así que el parser usa una máquina de estados basada
 * únicamente en la SECUENCIA NUMÉRICA esperada:
 *   buscando pregunta N -> buscando alternativa "1." -> "2." -> "3." -> "4." -> buscando pregunta N+1 ...
 * Esto es robusto porque en cada estado solo se acepta el número exacto
 * esperado, no cualquier dígito 1-4, así que el riesgo de falso positivo por
 * texto de un enunciado que empiece por casualidad con "2." es mínimo.
 *
 * Uso: node parsear-preguntas.js <texto_ordenado.txt> <salida.json>
 */
const fs = require("fs");

function dehyphenateJoin(lines) {
  let out = "";
  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") continue;
    if (out === "") {
      out = line;
      continue;
    }
    if (out.endsWith("-")) {
      out = out.slice(0, -1) + line;
    } else {
      out += " " + line;
    }
  }
  return out.replace(/\s+/g, " ").trim();
}

const PATRONES_RUIDO = [
  /^-?\d{1,3}-?$/, // contadores de marca de agua diagonal: "-1", "1-", "23"
  /^FSE\s+MEDICI\w*$/i, // fragmento de marca de agua (MIR 2020)
  /^INA\s+\d{4}\/\d{2}$/i, // fragmento de marca de agua (MIR 2020)
  /^\(--MEDICINA[-0]*--?\d+\/\d+\)$/i, // marca de agua "(--MEDICINA-0--N/36)" (MIR 2023)
  /^P[áa]gina:?\s*\d+(\s+de\s+\d+)?$/i, // pie de página "Página: 1", "Pagina: 12 de 34"
  /^\d{1,3}\s+de\s+\d{1,3}$/i, // pie de página suelto "1 de 33"
];

function esRuido(linea) {
  const s = linea.trim();
  if (s === "") return false;
  return PATRONES_RUIDO.some((p) => p.test(s));
}

function lineaNumero(linea, numeroEsperado) {
  // ¿Esta línea inicia el ítem "numeroEsperado."? (con cualquier indentación).
  // El texto tras el número puede venir vacío (a veces el enunciado/alternativa
  // empieza en la línea siguiente, típicamente tras un salto de página).
  const re = new RegExp(`^\\s*${numeroEsperado}[.)]\\s*(.*)$`);
  const m = linea.match(re);
  return m ? m[1] : null;
}

function parseTexto(texto) {
  const lineas = texto
    .replace(/\r/g, "")
    .split("\n")
    .filter((l) => !/^===PAGINA/.test(l));

  const RE_PREGUNTA_GENERICA = /^\s*(\d{1,3})[.)]\s*(.*)$/;

  const preguntas = [];
  let ultimoNumero = 0;
  let estado = "BUSCANDO_PREGUNTA"; // | "EN_ENUNCIADO" | "EN_ALT1".."EN_ALT4"
  let enunciadoLineas = [];
  let alternativas = null;
  let numeroActual = null;

  function cerrarPreguntaActual() {
    if (numeroActual === null) return;
    const enunciado = dehyphenateJoin(enunciadoLineas);
    const imagenMatch = enunciado.match(/\(IM[ÁA]GEN(?:ES)?\s*[^)]*\)/i);
    preguntas.push({
      numero_pregunta: numeroActual,
      enunciado,
      alternativas: {
        A: dehyphenateJoin(alternativas[1]),
        B: dehyphenateJoin(alternativas[2]),
        C: dehyphenateJoin(alternativas[3]),
        D: dehyphenateJoin(alternativas[4]),
      },
      imagen_ref: imagenMatch ? imagenMatch[0] : null,
    });
  }

  for (const raw of lineas) {
    if (esRuido(raw)) continue; // descarta pies de página / marcas de agua repetidas

    if (estado === "BUSCANDO_PREGUNTA") {
      const m = raw.match(RE_PREGUNTA_GENERICA);
      if (m && parseInt(m[1], 10) === ultimoNumero + 1) {
        numeroActual = ultimoNumero + 1;
        ultimoNumero = numeroActual;
        enunciadoLineas = [m[2]];
        alternativas = { 1: [], 2: [], 3: [], 4: [] };
        estado = "EN_ENUNCIADO";
      }
      continue;
    }

    if (estado === "EN_ENUNCIADO") {
      const alt1 = lineaNumero(raw, 1);
      if (alt1 !== null) {
        alternativas[1].push(alt1);
        estado = "EN_ALT1";
      } else {
        enunciadoLineas.push(raw);
      }
      continue;
    }

    // EN_ALT1..EN_ALT4
    const nAlt = parseInt(estado.slice(-1), 10);
    const siguienteAlt = lineaNumero(raw, nAlt + 1);
    if (nAlt < 4 && siguienteAlt !== null) {
      alternativas[nAlt + 1].push(siguienteAlt);
      estado = `EN_ALT${nAlt + 1}`;
      continue;
    }
    if (nAlt === 4) {
      const mPreg = raw.match(RE_PREGUNTA_GENERICA);
      if (mPreg && parseInt(mPreg[1], 10) === ultimoNumero + 1) {
        cerrarPreguntaActual();
        numeroActual = ultimoNumero + 1;
        ultimoNumero = numeroActual;
        enunciadoLineas = [mPreg[2]];
        alternativas = { 1: [], 2: [], 3: [], 4: [] };
        estado = "EN_ENUNCIADO";
        continue;
      }
    }
    alternativas[nAlt].push(raw);
  }
  cerrarPreguntaActual();

  return preguntas;
}

function main() {
  const [, , entrada, salida] = process.argv;
  if (!entrada || !salida) {
    console.error("Uso: node parsear-preguntas.js <texto_ordenado.txt> <salida.json>");
    process.exit(1);
  }
  const texto = fs.readFileSync(entrada, "utf8");
  const preguntas = parseTexto(texto);
  fs.writeFileSync(salida, JSON.stringify(preguntas, null, 2), "utf8");
  console.log(`OK: ${preguntas.length} preguntas -> ${salida}`);
}

main();
