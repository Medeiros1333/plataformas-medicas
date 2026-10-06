// Farmaco Hub — vista «Calculadoras»: función renal, dosis por peso e interacciones.
// Usa los globales de app.js (D, $, esc, fmt, norm, engancharChips). Se inicializa en su propio
// DOMContentLoaded, que se dispara después del de app.js porque este archivo se carga después.
// Todo cálculo se muestra junto al texto ORIGINAL de la ficha: la herramienta ayuda a leerla,
// no la sustituye.

(function () {
  const C = { meds: [] };           // ids de la medicación del paciente (adulto y pediatría)
  let todos = [];                   // fármacos de adulto + pediatría
  const nombreDe = id => (todos.find(f => f.id === id) || {}).nombre || id;

  // ---------------------------------------------------------------- utilidades numéricas
  const num = s => parseFloat(String(s).replace(/\./g, '').replace(',', '.'));   // «1.000,5» → 1000.5
  const numSimple = s => parseFloat(String(s).replace(',', '.'));               // «0,25» → 0.25
  function fmtNum(x) {
    if (!isFinite(x)) return '—';
    const d = x >= 100 ? 0 : x >= 10 ? 1 : x >= 1 ? 2 : 3;
    return (+x.toFixed(d)).toLocaleString('es-ES');
  }

  // ---------------------------------------------------------------- medicación del paciente
  function initMeds() {
    const dl = $('calc-datalist');
    dl.innerHTML = todos.map(f => `<option value="${esc(f.nombre)}">`).join('');
    const input = $('calc-med-input');
    const añadir = () => {
      const v = norm(input.value.trim());
      if (!v) return;
      const f = todos.find(x => norm(x.nombre) === v) || todos.find(x => norm(x.nombre).startsWith(v));
      if (f && !C.meds.includes(f.id)) C.meds.push(f.id);
      input.value = '';
      renderTodo();
    };
    input.addEventListener('change', añadir);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); añadir(); } });
    $('calc-med-limpiar').addEventListener('click', () => { C.meds = []; renderTodo(); });
  }

  function renderMeds() {
    const cont = $('calc-meds');
    if (!C.meds.length) { cont.innerHTML = '<span class="calc-vacio">Ningún fármaco añadido todavía.</span>'; return; }
    cont.innerHTML = C.meds.map(id => `<span class="chip med" data-id="${esc(id)}">${esc(nombreDe(id))} <b title="Quitar">×</b></span>`).join('');
    cont.querySelectorAll('.chip.med b').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      C.meds = C.meds.filter(x => x !== b.parentElement.dataset.id);
      renderTodo();
    }));
    cont.querySelectorAll('.chip.med').forEach(ch => ch.addEventListener('click', () => irAFarmaco(ch.dataset.id)));
  }

  // ---------------------------------------------------------------- 1. FUNCIÓN RENAL
  function calcRenal() {
    const edad = numSimple($('ren-edad').value), peso = numSimple($('ren-peso').value);
    const talla = numSimple($('ren-talla').value), mujer = $('ren-sexo').value === 'M';
    let cr = numSimple($('ren-cr').value);
    if ($('ren-cr-u').value === 'umol') cr = cr / 88.4;
    if (!(edad > 0 && peso > 0 && cr > 0)) return null;

    // Peso para Cockcroft-Gault: real; ajustado si >120% del ideal (con talla); real si < ideal.
    let pesoCG = peso, notaPeso = 'peso real';
    if (talla > 0) {
      const ideal = (mujer ? 45.5 : 50) + 0.9 * (talla - 152);
      if (peso > 1.2 * ideal) { pesoCG = ideal + 0.4 * (peso - ideal); notaPeso = `peso ajustado (${fmtNum(pesoCG)} kg; ideal ${fmtNum(ideal)} kg)`; }
      else if (peso >= ideal) { pesoCG = ideal; notaPeso = `peso ideal (${fmtNum(ideal)} kg)`; }
    }
    const cg = ((140 - edad) * pesoCG) / (72 * cr) * (mujer ? 0.85 : 1);
    // CKD-EPI 2021 (sin coeficiente de raza)
    const k = mujer ? 0.7 : 0.9, a = mujer ? -0.241 : -0.302;
    const epi = 142 * Math.pow(Math.min(cr / k, 1), a) * Math.pow(Math.max(cr / k, 1), -1.2) * Math.pow(0.9938, edad) * (mujer ? 1.012 : 1);
    return { cg, epi, notaPeso, cr };
  }

  const estadio = fg => fg >= 90 ? 'G1' : fg >= 60 ? 'G2' : fg >= 45 ? 'G3a' : fg >= 30 ? 'G3b' : fg >= 15 ? 'G4' : 'G5';

  // ¿Este fragmento del texto de ajuste renal se aplica al filtrado calculado?
  const RX_MENOR = /(?:FG|FGe|ClCr|CrCl|aclaramiento(?: de creatinina)?)\s*(<|≤|<=|>|≥|>=)\s*(\d+)/i;
  const RX_RANGO = /(?:FG|FGe|ClCr|CrCl|aclaramiento(?: de creatinina)?)\s*(?:de\s*)?(\d+)\s*[-–]\s*(\d+)/i;
  function aplica(seg, fg) {
    let m = seg.match(RX_RANGO);
    if (m) { const lo = +m[1], hi = +m[2]; return fg >= lo && fg <= hi; }
    m = seg.match(RX_MENOR);
    if (m) {
      const v = +m[2];
      return ({ '<': fg < v, '≤': fg <= v, '<=': fg <= v, '>': fg > v, '≥': fg >= v, '>=': fg >= v })[m[1]];
    }
    return false;
  }
  function textoRenal(txt, fg) {
    if (fg == null) return fmt(txt);
    return txt.split(/(?<=[;.])\s+/).map(seg => aplica(seg, fg) ? `<mark class="aplica">${fmt(seg)}</mark>` : fmt(seg)).join(' ');
  }
  const sinAjuste = t => /^no precisa\.?$|^no requiere/i.test((t || '').trim());

  function renderRenal() {
    const r = calcRenal();
    const out = $('ren-resultado');
    if (!r) { out.innerHTML = '<p class="calc-vacio">Introduce edad, sexo, peso y creatinina.</p>'; }
    else {
      out.innerHTML = `<div class="calc-cifras">
        <div class="stat-card"><div class="num">${fmtNum(r.cg)}</div><div class="label">mL/min · aclaramiento de creatinina (Cockcroft-Gault, ${esc(r.notaPeso)})</div></div>
        <div class="stat-card"><div class="num">${fmtNum(r.epi)}</div><div class="label">mL/min/1,73 m² · FGe CKD-EPI 2021 · estadio ${estadio(r.epi)}</div></div>
      </div>
      <p class="calc-nota">Las fichas técnicas expresan la mayoría de los ajustes con el <strong>aclaramiento de Cockcroft-Gault</strong>; el FGe CKD-EPI estadifica la enfermedad renal. Con función renal inestable (lesión renal aguda) ninguna fórmula es fiable.</p>`;
    }
    const usar = $('ren-usar').value;
    const fg = r ? (usar === 'epi' ? r.epi : r.cg) : null;

    const lista = C.meds.length
      ? C.meds.map(id => todos.find(f => f.id === id)).filter(Boolean)
      : (() => {
          const q = norm($('ren-filtro').value.trim());
          return q ? todos.filter(f => norm(f.nombre).includes(q)).slice(0, 40) : [];
        })();
    const tabla = $('ren-tabla');
    if (!lista.length) {
      tabla.innerHTML = `<p class="calc-vacio">${C.meds.length ? '' : 'Añade la medicación del paciente arriba, o filtra aquí por nombre para consultar el ajuste renal de cualquier fármaco.'}</p>`;
      return;
    }
    tabla.innerHTML = `<table><thead><tr><th>Fármaco</th><th>Ajuste renal según la ficha${fg != null ? ` <span class="calc-nota-th">(resaltado lo que aplica a ${fmtNum(fg)} mL/min)</span>` : ''}</th></tr></thead><tbody>${
      lista.map(f => {
        const t = (f.farmacocinetica || {}).ajuste_renal || '—';
        return `<tr${sinAjuste(t) ? ' class="calc-tenue"' : ''}><td><span class="chip" data-goto-farmaco="${esc(f.id)}">${esc(f.nombre)}</span></td><td>${textoRenal(t, fg)}</td></tr>`;
      }).join('')}</tbody></table>`;
    engancharChips(tabla);
  }

  // ---------------------------------------------------------------- 2. DOSIS POR PESO
  // Reconoce «N[-M] unidad/kg[/día|/dosis|/h|/min|/24 h…]» y lo multiplica por el peso.
  const RX_KG = /(\d+(?:[.,]\d+)?)(?:\s*[-–]\s*(\d+(?:[.,]\d+)?))?\s*(mg|g|µg|mcg|microgramos?|UI|U|mL|mEq|mmol)\s*(?:de\s+\S+\s+)?\/\s*kg(?:\s*\/\s*(día|dia|dosis|h|min|\d+\s*h))?(?:\s+(al día|por dosis|cada \d+\s*h(?:oras)?))?/gi;
  const UNI = u => /^(mcg|microgramos?)$/i.test(u) ? 'µg' : u;
  // Topes ABSOLUTOS («máx. 500 mg», «nunca más de 4 g/día», «no superar 1 g por dosis»); se ignoran
  // los expresados por kilo («máximo 60 mg/kg/día»), que no son un techo en miligramos.
  const A_MG = { g: 1000, mg: 1, 'µg': 0.001, mcg: 0.001 };
  function maximosEn(txt) {
    const rx = /(?:m[aá]x(?:imo|\.)?|nunca m[aá]s de|no superar|sin superar)\s*(?:de\s*)?(\d+(?:[.,]\d+)?)\s*(g|mg|µg|mcg|UI|mL)\b(?!\s*\/\s*kg)(?:\s*(por dosis|\/dosis|al día|\/día|por semana))?/gi;
    const out = []; let m;
    while ((m = rx.exec(txt || ''))) out.push({ v: num(m[1]), u: m[2], por: (m[3] || '').replace('/', '') });
    return out;
  }
  // Convierte un tope a la unidad de la dosis calculada (g ↔ mg ↔ µg); null si no son comparables.
  function enUnidad(max, u) {
    if (max.u === u) return max.v;
    if (A_MG[max.u] && A_MG[u]) return max.v * A_MG[max.u] / A_MG[u];
    return null;
  }
  function tomasDe(pos) {
    const m = (pos || '').match(/cada\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*h/i);
    if (m) return [24 / +m[1], m[2] ? 24 / +m[2] : null].filter(Boolean);
    const t = (pos || '').match(/(\d+)\s*tomas/i) || (pos || '').match(/en\s*(\d+)\s*dosis/i);
    if (t) return [+t[1]];
    if (/una vez al día|cada 24|una toma/i.test(pos || '')) return [1];
    return [];
  }

  function calcularIndicacion(ind, peso, f) {
    const texto = `${ind.dosis}`;
    const res = [];
    let m;
    RX_KG.lastIndex = 0;
    while ((m = RX_KG.exec(texto))) {
      const lo = numSimple(m[1]) * peso, hi = m[2] ? numSimple(m[2]) * peso : null;
      const u = UNI(m[3]);
      let por = (m[4] || '').toLowerCase().replace('dia', 'día');
      if (!por && /al día/i.test(m[5] || '')) por = 'día';
      const etiqueta = por === 'día' ? '/día' : por === 'dosis' ? ' por dosis' : por === 'h' ? '/h' : por === 'min' ? '/min' : por ? `/${por}` : ' por dosis';
      let linea = `<strong>${fmtNum(lo)}${hi != null ? '–' + fmtNum(hi) : ''} ${esc(u)}${esc(etiqueta)}</strong> <span class="calc-orig">(${esc(m[0].trim())})</span>`;
      const tomas = tomasDe(ind.posologia);
      const tTxt = n => `${fmtNum(n)} ${n === 1 ? 'toma' : 'tomas'}/día`;
      let diarioMax = null;   // dosis diaria máxima resultante, para compararla con el tope diario
      if (por === 'día') {
        if (tomas.length) linea += ' → ' + tomas.map(n => `${fmtNum(lo / n)}${hi != null ? '–' + fmtNum(hi / n) : ''} ${esc(u)} por toma si ${tTxt(n)}`).join('; ');
      } else if ((por === 'dosis' || !por) && tomas.length) {
        const tMax = Math.max(...tomas), tMin = Math.min(...tomas);
        diarioMax = (hi || lo) * tMax;
        linea += ` → ≈ ${fmtNum(lo * tMin)}${diarioMax !== lo * tMin ? '–' + fmtNum(diarioMax) : ''} ${esc(u)}/día (${tMin === tMax ? tTxt(tMin) : `${fmtNum(tMin)}-${tTxt(tMax)}`})`;
      }
      // El tope diario se compara con la dosis diaria; el tope sin «día» (o «por dosis»), con la dosis por toma.
      for (const max of [...maximosEn(texto), ...maximosEn(f.dosis_maxima)]) {
        const v = enUnidad(max, u);
        if (v == null || /semana/.test(max.por)) continue;
        const esDiario = /día/.test(max.por);
        const calculado = esDiario ? (por === 'día' ? (hi || lo) : diarioMax) : (por !== 'día' && por !== 'h' && por !== 'min' ? (hi || lo) : null);
        const tope = calculado == null ? null : v;
        if (tope != null && calculado > tope) {
          linea += ` <span class="calc-alerta">⚠ supera el máximo de ${fmtNum(max.v)} ${esc(max.u)}${esDiario ? '/día' : ' por dosis'}: no pasar de esa cifra</span>`;
          break;
        }
      }
      res.push(linea);
    }
    return res;
  }

  function renderPeso() {
    const id = $('pes-farmaco').value, peso = numSimple($('pes-peso').value);
    const out = $('pes-resultado');
    const f = todos.find(x => x.id === id);
    if (!f) { out.innerHTML = '<p class="calc-vacio">Elige un fármaco.</p>'; return; }
    const cab = `<p><span class="chip" data-goto-farmaco="${esc(f.id)}">${esc(f.nombre)}</span>${f.dosis_maxima ? ` <span class="calc-nota">Dosis máxima de la ficha: ${fmt(f.dosis_maxima)}</span>` : ''}</p>`;
    if (!(peso > 0)) { out.innerHTML = cab + '<p class="calc-vacio">Introduce el peso.</p>'; engancharChips(out); return; }
    const filas = (f.indicaciones || []).map(ind => {
      const c = calcularIndicacion(ind, peso, f);
      return `<tr><td>${fmt(ind.patologia)}</td><td>${fmt(ind.dosis)}<div class="calc-sub">${esc(ind.posologia)} · ${esc(ind.via)}</div></td><td>${c.length ? c.join('<br>') : '<span class="calc-tenue">Dosis no ponderal: ver la ficha</span>'}</td></tr>`;
    }).join('');
    out.innerHTML = cab + `<div class="table-wrap"><table><thead><tr><th>Indicación</th><th>Dosis de la ficha</th><th>Cálculo para ${fmtNum(peso)} kg</th></tr></thead><tbody>${filas}</tbody></table></div>
      <p class="calc-nota">En el niño, la dosis calculada nunca debe superar la del adulto. En obesidad, muchos fármacos se dosifican por peso ideal o ajustado: revisa la ficha.</p>`;
    engancharChips(out);
  }

  function initPeso() {
    const conKg = todos.filter(f => (f.indicaciones || []).some(i => /\/\s*kg/i.test(i.dosis)));
    const opt = arr => arr.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')).map(f => `<option value="${esc(f.id)}">${esc(f.nombre)}</option>`).join('');
    $('pes-farmaco').innerHTML = '<option value="">— Elige —</option>' +
      `<optgroup label="Pediatría">${opt(conKg.filter(f => f.id.startsWith('PED-')))}</optgroup>` +
      `<optgroup label="Adulto (dosis por peso)">${opt(conKg.filter(f => !f.id.startsWith('PED-')))}</optgroup>`;
    $('pes-farmaco').addEventListener('change', renderPeso);
    $('pes-peso').addEventListener('input', renderPeso);
  }

  // ---------------------------------------------------------------- 3. INTERACCIONES
  // Una interacción registrada en la ficha de A («con»: texto libre) se busca en B por su
  // nombre, sus sinónimos y su clase. Las categorías de texto («AINE», «inductores
  // enzimáticos», «fármacos que prolongan el QT»…) se traducen a reglas sobre la ficha de B.
  const PALABRAS_VACIAS = new Set(['oral', 'topico', 'topica', 'topicos', 'intravenoso', 'intravenosa', 'liberacion', 'prolongada', 'colirio', 'nasal', 'intranasal', 'otico', 'pediatria', 'sodico', 'sodica', 'potasico', 'calcico', 'acido', 'deposito', 'inhalado', 'inhalada', 'cutaneo', 'crema', 'humana', 'humano', 'micronizada', 'intravitreo', 'vaginal']);
  function terminos(f) {
    const set = new Set();
    for (const s of [f.nombre, ...(f.sinonimos || [])]) {
      const limpio = norm(s).replace(/\(.*?\)/g, ' ');
      for (const parte of limpio.split(/[\/+,;]| y | o /)) {
        const p = parte.trim();
        if (p.length >= 4) set.add(p);
        for (const w of p.split(/[\s-]+/)) if (w.length >= 6 && !PALABRAS_VACIAS.has(w)) set.add(w);
      }
    }
    return [...set];
  }
  const LISTAS = {
    inductores: /rifampicin|rifabutin|carbamazepin|fenitoin|fenobarbital|primidona|hiperico|efavirenz|apalutamida|enzalutamida/,
    inh3a4: /claritromicin|eritromicin|ketoconazol|itraconazol|voriconazol|posaconazol|ritonavir|cobicistat|nirmatrelvir|diltiazem|verapamilo|fluconazol/,
    qt: /amiodarona|sotalol|flecainida|haloperidol|quetiapina|olanzapina|risperidona|ondansetron|domperidona|citalopram|escitalopram|metadona|azitromicin|claritromicin|eritromicin|levofloxacino|moxifloxacino|ciprofloxacino|hidroxicloroquina|cloroquina|bedaquilina|clofazimina|antimoniato|vardenafilo|tacrolimus/,
    serotonina: /isrs|irsn|sertralina|escitalopram|fluoxetina|paroxetina|venlafaxina|duloxetina|tramadol|triptan|linezolid|metadona|fentanilo|ondansetron|dextrometorfano|litio|mirtazapina|trazodona|amitriptilina/,
    sedantes: /benzodiacepina|opioide|hipnotico|antihistaminico|gabapentinoide|antipsicotico|relajante muscular|zolpidem|zopiclona/,
    nefrotox: /aminoglucosido|vancomicina|aine|anfotericina|cisplatino|ciclosporina|tacrolimus|anticalcineurin/
  };
  const CLASES = [
    [/\baine\b|antiinflamatorios? no esteroideos?/, /aine|coxib|cox-2/],
    [/\bisrs\b/, /isrs|inhibidor selectivo de la recaptacion/],
    [/\birsn\b/, /irsn|venlafaxina|duloxetina/],
    [/\bimao\b/, /imao|rasagilina|selegilina|linezolid/],
    [/betabloqueante/, /betabloqueante/],
    [/nitrato|donantes? de (oxido nitrico|no)\b/, /nitrato|donante de oxido nitrico/],
    [/opioide/, /opioide/],
    [/anticoagulante/, /anticoagulante/],
    [/antiagregante/, /antiagregante/],
    [/\bieca\b/, /\bieca\b/],
    [/ara-ii|\bara ii\b/, /ara-ii/],
    [/ahorradores? de potasio/, /espironolactona|eplerenona|amilorida|finerenona|mineralocorticoide/],
    [/suplementos? de potasio|cloruro potasico/, /cloruro potasico/],
    [/diuretico/, /diuretico/],
    [/tiazida/, /tiazid/],
    [/estatina/, /estatina/],
    [/benzodiacepina/, /benzodiacepina/],
    [/macrolido/, /macrolido/],
    [/quinolona/, /quinolona/],
    [/aminoglucosido/, /aminoglucosido/],
    [/corticoide/, /corticoide/],
    [/antipsicotico|neuroleptico/, /antipsicotico/],
    [/triptan/, /triptan/],
    [/sulfonilurea/, /secretagogo|sulfonilurea/],
    [/insulina/, /insulina/],
    [/\bibp\b|bomba de protones/, /bomba de protones/],
    [/antiacido/, /antiacido|almagato/],
    [/antiepileptico|anticonvulsivante/, /antiepileptico/],
    [/triciclico/, /amitriptilina|triciclic/],
    [/anticolinergico|antimuscarinico/, /antimuscarinico|anticolinergico/],
    [/antihistaminico/, /antihistaminico/],
    [/antihipertensivo/, /ieca|ara-ii|antagonista del calcio|betabloqueante|diuretico|alfabloqueante|antihipertensivo/],
    [/alfabloqueante/, /alfabloqueante/],
    [/antidiabetico|hipoglucemiante/, /antidiabetico|insulina|secretagogo|glp-1|dpp-4|isglt2/],
    [/inductor/, LISTAS.inductores],
    [/inhibidor(?:es)?(?: potentes?| moderados?)? (?:de |del )?(?:la )?cyp3a4|inhibidores potentes/, LISTAS.inh3a4],
    [/\bqt\b/, LISTAS.qt],
    [/serotoninergic/, LISTAS.serotonina],
    [/depresores del snc|sedantes|alcohol, benzodiacepinas/, LISTAS.sedantes],
    [/nefrotoxic/, LISTAS.nefrotox],
    [/anticonceptivos? (orales|hormonales)/, /anticonceptivo|anticoncepcion/]
  ];
  function coincide(conTxt, b) {
    const con = ' ' + norm(conTxt) + ' ';
    for (const t of terminos(b)) {
      const re = new RegExp('(^|[^a-z])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)');
      if (re.test(con)) return `por nombre («${t}»)`;
    }
    const perfil = norm([b.nombre, b.clase, b.subclase, ...(b.sinonimos || [])].join(' | '));
    for (const [rxCon, rxB] of CLASES) if (rxCon.test(con) && rxB.test(perfil)) return 'por su clase o grupo';
    return null;
  }
  const PESO_GRAV = { alta: 0, media: 1, baja: 2 };

  function renderInteracciones() {
    const out = $('int-resultado');
    const meds = C.meds.map(id => todos.find(f => f.id === id)).filter(Boolean);
    if (meds.length < 2) { out.innerHTML = '<p class="calc-vacio">Añade al menos dos fármacos a la medicación del paciente.</p>'; return; }
    // Se agrupa por PAR de fármacos: la misma interacción suele estar registrada en las dos fichas.
    const porPar = new Map();
    for (const a of meds) for (const b of meds) {
      if (a.id === b.id) continue;
      for (const it of ((a.farmacocinetica || {}).interacciones || [])) {
        if (!it.con || /sin interacciones/i.test(it.con)) continue;
        const como = coincide(it.con, b);
        if (!como) continue;
        const [x, y] = [a, b].sort((p, q) => p.nombre.localeCompare(q.nombre, 'es'));
        const k = x.id + '|' + y.id;
        if (!porPar.has(k)) porPar.set(k, { x, y, regs: [] });
        porPar.get(k).regs.push({ en: a, it, como });
      }
    }
    const grupos = [...porPar.values()].map(g => {
      g.regs.sort((r, s) => (PESO_GRAV[r.it.gravedad] ?? 3) - (PESO_GRAV[s.it.gravedad] ?? 3));
      g.grav = g.regs[0].it.gravedad;
      return g;
    }).sort((g, h) => (PESO_GRAV[g.grav] ?? 3) - (PESO_GRAV[h.grav] ?? 3));
    const pares = meds.length * (meds.length - 1) / 2;
    if (!grupos.length) {
      out.innerHTML = `<div class="callout"><strong>Sin interacciones registradas</strong> entre estos ${meds.length} fármacos (${pares} pares revisados). Que no figure aquí no garantiza que no exista: las fichas recogen las interacciones de relevancia clínica, no todas.</div>`;
      return;
    }
    out.innerHTML = `<p class="calc-nota">${grupos.length} par(es) con interacción de ${pares} revisados, de más a menos grave.</p>` + grupos.map(g => `
      <div class="int-item grav-borde-${esc(g.grav)}">
        <div class="int-cab"><span class="chip" data-goto-farmaco="${esc(g.x.id)}">${esc(g.x.nombre)}</span> + <span class="chip" data-goto-farmaco="${esc(g.y.id)}">${esc(g.y.nombre)}</span>
          <span class="grav-${esc(g.grav)}">${esc((g.grav || '').toUpperCase())}</span></div>
        ${g.regs.map(r => `<div class="int-reg">
          <div><strong>Efecto:</strong> ${fmt(r.it.efecto)}</div>
          <div><strong>Manejo:</strong> ${fmt(r.it.manejo)}</div>
          <div class="calc-sub">Según la ficha de ${esc(r.en.nombre)} («${esc(r.it.con)}»), detectada ${esc(r.como)}</div>
        </div>`).join('')}
      </div>`).join('');
    engancharChips(out);
  }

  // ---------------------------------------------------------------- arranque
  function renderTodo() { renderMeds(); renderRenal(); renderInteracciones(); }

  function initCalculadoras() {
    if (!window.FARMACO_HUB_DATA || !$('view-calculadoras')) return;
    todos = [...D.farmacos.filter(f => !f.vision_clase), ...D.pediatria];
    initMeds();
    ['ren-edad', 'ren-peso', 'ren-talla', 'ren-cr', 'ren-filtro'].forEach(id => $(id).addEventListener('input', renderRenal));
    ['ren-sexo', 'ren-cr-u', 'ren-usar'].forEach(id => $(id).addEventListener('change', renderRenal));
    initPeso();
    renderTodo();
    renderPeso();
  }
  document.addEventListener('DOMContentLoaded', initCalculadoras);
})();
