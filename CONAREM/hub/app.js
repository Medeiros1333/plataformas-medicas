// CONAREM Hub — lógica de la aplicación. Vanilla JS, sin dependencias externas.
// Datos: window.CONAREM_DATA (data.js, público) y, si existe, window.CONAREM_PRIVADO (data_privado.js,
// banco de uso personal que no se publica). Ambos los genera scripts/generar-hub-data.js, así el Hub
// funciona con solo abrir index.html (file://) o desde GitHub Pages.

const D = window.CONAREM_DATA || null;
const P = window.CONAREM_PRIVADO || null;
const TRONCALES = ['CIR', 'GO', 'SP', 'MI', 'PED'];
const FUENTE_LABEL = { oficial: 'Oficial', conaflix: 'CONAFLIX', simuresi: 'Banco extra' };

const state = {
  preguntas: [],
  porId: new Map(),
  view: 'dashboard',
  estudio: { preguntas: [], idx: 0, respuestas: {} },
  simulacro: null,
  progreso: null,
  repaso: { activa: false, cola: [], idx: 0, elegida: null, repetidas: new Set(), hechas: 0, aciertos: 0 },
  fc: null,
  simModo: 'oficial'
};

// ------------------------------------------------------------------
// UTILIDADES
// ------------------------------------------------------------------
function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Las preguntas de un caso clínico seriado viajan juntas y en orden.
function unidades(pool) {
  const grupos = new Map();
  const out = [];
  for (const q of pool) {
    if (q.serie) {
      if (!grupos.has(q.serie)) { grupos.set(q.serie, []); out.push(grupos.get(q.serie)); }
      grupos.get(q.serie).push(q);
    } else out.push([q]);
  }
  for (const g of grupos.values()) g.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  return out;
}
const mezclar = pool => shuffle(unidades(pool)).flat();
function tomarN(pool, n) {
  const out = [];
  for (const u of shuffle(unidades(pool))) {
    if (out.length + u.length > n) continue;
    out.push(...u);
    if (out.length === n) break;
  }
  return out;
}
const areaNombre = a => (D.areas[a] && D.areas[a].nombre) || a;
const areaCorto = a => (D.areas[a] && D.areas[a].corto) || a;
function fechaLocal(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function hoyLocal() { return fechaLocal(new Date()); }
function sumarDias(iso, n) { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return fechaLocal(d); }
function diasEntre(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
function fmtFecha(iso) { return new Date(iso + 'T12:00:00').toLocaleDateString('es-PY', { day: 'numeric', month: 'short' }); }
function fmtTiempo(segs) {
  const h = Math.floor(segs / 3600), m = Math.floor(segs % 3600 / 60), s = segs % 60;
  return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
const pct = (a, b) => b ? Math.round(100 * a / b) : 0;

// ------------------------------------------------------------------
// CARGA DE DATOS
// ------------------------------------------------------------------
function cargarDatos() {
  if (!D) throw new Error('window.CONAREM_DATA no está definido (falta data.js).');
  const expPriv = (P && P.explicaciones_oficiales) || {};
  const todas = [];
  for (const q of D.preguntas) {
    const copia = Object.assign({}, q);
    const priv = copia.fuente === 'oficial' ? expPriv[copia.id] : null;
    if (priv) {
      if (!copia.explicacion) copia.explicacion = priv.explicacion;
      // el banco extra explica por qué cada alternativa incorrecta está mal: se suma a la explicación propia
      if (!copia.por_que_no || !Object.keys(copia.por_que_no).length) copia.por_que_no = priv.por_que_no;
    }
    todas.push(copia);
  }
  if (P && P.preguntas) todas.push(...P.preguntas);
  state.preguntas = todas;
  state.porId = new Map(todas.map(q => [q.id, q]));
}
const tieneExpl = q => !!(q.explicacion && q.explicacion.trim().length > 5);

function etiquetaFuente(q) {
  if (q.fuente === 'oficial') return `CONAREM ${q.anio} · ${q.tipo === 'TRO' ? 'Bloque ' + q.bloque : 'Sub ' + q.bloque} · #${q.numero}`;
  if (q.fuente === 'conaflix') return 'CONAFLIX · ' + (q.tema_titulo || '');
  return FUENTE_LABEL[q.fuente] || q.fuente;
}

// ------------------------------------------------------------------
// NAVEGACIÓN Y TEMA
// ------------------------------------------------------------------
function initNav() {
  document.querySelectorAll('.navbtn').forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
}
function setView(view) {
  state.view = view;
  document.querySelectorAll('.navbtn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-' + view).classList.remove('hidden');
  if (!state.progreso) return;
  if (view === 'dashboard') renderDashboard();
  if (view === 'banco') renderBancoResumen();
  if (view === 'simulacro' && !state.simulacro) renderSimConfig();
  if (view === 'repaso') renderRepaso();
  if (view === 'flashcards') renderFlashcards();
  if (view === 'temario') renderTemario();
  if (view === 'calendario') renderCalendario();
  window.scrollTo(0, 0);
}

const TEMAS_UI = ['auto', 'light', 'dark', 'black'];
const TEMA_LABEL = { auto: '🌗 Tema: Auto', light: '☀️ Tema: Claro', dark: '🌙 Tema: Oscuro', black: '⬛ Tema: Negro' };
function leerTema() { try { return localStorage.getItem('conaremhub-theme') || 'auto'; } catch (e) { return 'auto'; } }
function aplicarTema(t) {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  document.getElementById('btn-tema').textContent = TEMA_LABEL[t];
  try { if (t === 'auto') localStorage.removeItem('conaremhub-theme'); else localStorage.setItem('conaremhub-theme', t); } catch (e) { /* sin persistencia */ }
}
function initTema() {
  aplicarTema(leerTema());
  document.getElementById('btn-tema').addEventListener('click', () => {
    const t = leerTema();
    aplicarTema(TEMAS_UI[(TEMAS_UI.indexOf(t) + 1) % TEMAS_UI.length]);
  });
}

// ------------------------------------------------------------------
// PROGRESO PERSISTENTE
// ------------------------------------------------------------------
const PROGRESO_KEY = 'conaremhub-progreso-v1';
function progresoVacio() {
  return { version: 1, historial: {}, srs: {}, fc: {}, simulacros: [], temario: {}, config: {} };
}
function cargarProgreso() {
  try {
    const raw = localStorage.getItem(PROGRESO_KEY);
    return raw ? Object.assign(progresoVacio(), JSON.parse(raw)) : progresoVacio();
  } catch (e) { return progresoVacio(); }
}
let avisoSinGuardar = false;
function guardarProgreso() {
  try { localStorage.setItem(PROGRESO_KEY, JSON.stringify(state.progreso)); }
  catch (e) {
    if (!avisoSinGuardar) {
      avisoSinGuardar = true;
      alert('No se pudo guardar el progreso en este navegador. Exporta una copia desde la pestaña Repaso.');
    }
  }
  actualizarBadgeRepaso();
}
function config() {
  const c = state.progreso.config;
  if (!c.fechaExamen) c.fechaExamen = '2027-03-06';
  if (!c.fechaInicio) c.fechaInicio = hoyLocal();
  if (c.semanasRepaso == null) c.semanasRepaso = 2;
  return c;
}

// ------------------------------------------------------------------
// REPASO ESPACIADO (SM-2 simplificado, igual que en el MIR Hub)
// ------------------------------------------------------------------
const SRS_MAX_DIAS = 365;
const SRS = { OTRA: 1, DIFICIL: 2, BIEN: 3, FACIL: 4 };
const SRS_LABEL = { 1: 'Otra vez', 2: 'Difícil', 3: 'Bien', 4: 'Fácil' };
function fmtIntervalo(d) {
  if (d < 30) return d + ' d';
  if (d < 365) return (d / 30).toFixed(1).replace('.', ',') + ' m';
  return (d / 365).toFixed(1).replace('.', ',') + ' a';
}
function srsCalcular(c, nota) {
  let { ivl, ease, reps, lapses } = c;
  if (nota === SRS.OTRA) return { ivl: 1, ease: Math.max(1.3, ease - 0.2), reps: 0, lapses: lapses + 1 };
  if (reps === 0) ivl = nota === SRS.DIFICIL ? 2 : nota === SRS.BIEN ? 3 : 5;
  else if (nota === SRS.DIFICIL) ivl = Math.max(ivl + 1, Math.round(ivl * 1.2));
  else if (nota === SRS.BIEN) ivl = Math.max(ivl + 1, Math.round(ivl * ease));
  else ivl = Math.max(ivl + 2, Math.round(ivl * ease * 1.3));
  if (nota === SRS.DIFICIL) ease = Math.max(1.3, ease - 0.15);
  if (nota === SRS.FACIL) ease += 0.15;
  return { ivl: Math.min(SRS_MAX_DIAS, ivl), ease: +ease.toFixed(2), reps: reps + 1, lapses };
}
const tarjetaNueva = () => ({ ivl: 0, ease: 2.5, reps: 0, lapses: 0, due: hoyLocal(), alta: hoyLocal() });
function srsAplicar(mazo, id, nota) {
  const c = mazo[id];
  if (!c) return;
  Object.assign(c, srsCalcular(c, nota));
  c.due = sumarDias(hoyLocal(), c.ivl);
  c.ultimo = hoyLocal();
  guardarProgreso();
}
function srsFallo(id) {
  const manana = sumarDias(hoyLocal(), 1);
  const c = state.progreso.srs[id];
  if (!c) state.progreso.srs[id] = Object.assign(tarjetaNueva(), { due: manana });
  else if (c.due > manana) { Object.assign(c, srsCalcular(c, SRS.OTRA)); c.due = manana; }
}
function registrarRespuesta(q, letra, { guardar = true, srs = true } = {}) {
  const ok = letra === q.respuesta_correcta;
  const h = state.progreso.historial[q.id] || { n: 0, ok: 0 };
  h.n++; if (ok) h.ok++;
  h.ultima = letra; h.correcta = ok; h.fecha = hoyLocal();
  state.progreso.historial[q.id] = h;
  if (!ok && srs) srsFallo(q.id);
  if (guardar) guardarProgreso();
}
function srsPendientes(area) {
  const hoy = hoyLocal();
  return Object.entries(state.progreso.srs)
    .filter(([id, c]) => c.due <= hoy && state.porId.has(id) && (!area || state.porId.get(id).area === area))
    .sort((a, b) => a[1].due.localeCompare(b[1].due) || Math.random() - 0.5)
    .map(([id]) => id);
}
function actualizarBadgeRepaso() {
  const btn = document.getElementById('nav-repaso');
  if (!btn || !state.progreso) return;
  const n = srsPendientes().length;
  btn.innerHTML = 'Repaso' + (n ? ` <span class="badge-repaso">${n}</span>` : '');
}

// ------------------------------------------------------------------
// TARJETA DE PREGUNTA (compartida por banco, simulacro, repaso)
// ------------------------------------------------------------------
function htmlMeta(q, extra = '') {
  const pdf = q.fuente === 'oficial' ? (D.examenes.find(e => e.id === q.examen_id) || {}).pdf : null;
  return `<div class="meta">
      <span class="tag ${q.fuente === 'oficial' ? 'tag-oficial' : ''}">${escapeHtml(etiquetaFuente(q))}</span>
      <span class="tag">${escapeHtml(areaNombre(q.area))}</span>
      ${q.repetida_en ? `<span class="tag tag-repetida" title="${escapeHtml('También en: ' + q.repetida_en.join(', '))}">🔁 Repetida</span>` : ''}
      ${q.revision_incierta ? '<span class="tag tag-warning">⚠️ Gabarito en revisión</span>' : ''}
      ${extra}
      ${pdf ? `<a class="link-pdf" href="${pdf}" target="_blank" rel="noopener">📄 PDF oficial</a>` : ''}
    </div>`;
}
function htmlOpciones(q, { elegida = null, corregida = false } = {}) {
  return `<div class="opciones">${Object.entries(q.alternativas).map(([letra, texto]) => {
    let cls = '';
    if (corregida) {
      cls = 'disabled';
      if (letra === q.respuesta_correcta) cls += ' correct';
      else if (letra === elegida) cls += ' incorrect';
      if (q.revision_incierta && q.revision_incierta.alternativa_sugerida === letra) cls += ' sugerida';
    } else if (elegida === letra) cls = 'selected';
    return `<div class="opcion ${cls}" data-letra="${letra}"><span class="letra">${letra}.</span><span>${escapeHtml(texto)}</span></div>`;
  }).join('')}</div>`;
}
function htmlExplicacion(q) {
  let h = '';
  if (q.revision_incierta && q.revision_incierta.nota) {
    h += `<div class="nota-verif">⚠️ ${escapeHtml(q.revision_incierta.nota)}</div>`;
  }
  if (tieneExpl(q)) {
    h += `<div class="detalle"><strong>Explicación:</strong> ${escapeHtml(q.explicacion)}</div>`;
    const pq = Object.entries(q.por_que_no || {}).filter(([l]) => q.alternativas[l]);
    if (pq.length) h += `<ul class="por-que-no">${pq.map(([l, t]) => `<li><b>${l}.</b> ${escapeHtml(t)}</li>`).join('')}</ul>`;
    if (q.perla) h += `<div class="perla">💡 ${escapeHtml(q.perla)}</div>`;
  } else {
    h += `<div class="nota-verif">Explicación aún no disponible. Respuesta según el gabarito oficial.</div>`;
  }
  if (q.referencia) h += `<div class="ref">📚 ${escapeHtml(q.referencia)}</div>`;
  if (q.repetida_en) h += `<div class="ref">🔁 También apareció en: ${escapeHtml(q.repetida_en.join(' · '))}</div>`;
  return h;
}
function htmlFeedback(q, elegida) {
  const ok = elegida === q.respuesta_correcta;
  return `<div class="feedback-box ${ok ? 'ok' : 'bad'}">
    ${ok ? '✔ Correcto' : elegida ? `✘ Incorrecto — la respuesta correcta es ${q.respuesta_correcta}` : `Sin responder — la respuesta correcta es ${q.respuesta_correcta}`}
    ${htmlExplicacion(q)}
  </div>`;
}

// ------------------------------------------------------------------
// PANEL
// ------------------------------------------------------------------
function estadisticasPorArea() {
  const out = {};
  for (const [id, h] of Object.entries(state.progreso.historial)) {
    const q = state.porId.get(id);
    if (!q) continue;
    const o = out[q.area] = out[q.area] || { resp: 0, ok: 0, intentos: 0 };
    o.resp++; o.intentos += h.n; o.ok += h.ok;
  }
  return out;
}
function renderDashboard() {
  const c = config();
  const faltan = diasEntre(hoyLocal(), c.fechaExamen);
  document.getElementById('dash-cuenta').innerHTML = `
    <div class="cuenta-regresiva">
      <div><div class="dias">${faltan > 0 ? faltan : 0} días</div>
      <div class="sub">para el examen CONAREM (${new Date(c.fechaExamen + 'T12:00:00').toLocaleDateString('es-PY', { day: 'numeric', month: 'long', year: 'numeric' })}) · cámbialo en Calendario</div></div>
      <button class="btn-secondary" id="dash-ir-cal">Ver plan de esta semana</button>
    </div>`;
  document.getElementById('dash-ir-cal').addEventListener('click', () => setView('calendario'));

  const { historial, srs, simulacros } = state.progreso;
  const resp = Object.values(historial);
  const intentos = resp.reduce((s, h) => s + h.n, 0);
  const aciertos = resp.reduce((s, h) => s + h.ok, 0);
  const pend = srsPendientes().length;
  const temarioTotal = TRONCALES.reduce((s, a) => s + (D.temario[a] || []).length, 0);
  const temarioHecho = Object.keys(state.progreso.temario).length;
  document.getElementById('dash-progreso').innerHTML = `
    ${pend ? `<div class="repaso-aviso"><span>🧠 Tienes <b>${pend}</b> pregunta${pend === 1 ? '' : 's'} para repasar hoy.</span>
      <button class="btn-primary" id="dash-ir-repaso">Repasar ahora</button></div>` : ''}`;
  const b = document.getElementById('dash-ir-repaso');
  if (b) b.addEventListener('click', () => setView('repaso'));

  const oficiales = state.preguntas.filter(q => q.fuente === 'oficial').length;
  document.getElementById('stats-grid').innerHTML = [
    ['Preguntas en el banco', state.preguntas.length.toLocaleString('es-PY')],
    ['Oficiales (INS)', oficiales.toLocaleString('es-PY')],
    ['Respondidas', resp.length.toLocaleString('es-PY')],
    ['Acierto global', intentos ? pct(aciertos, intentos) + '%' : '—'],
    ['En el repaso', Object.keys(srs).length],
    ['Simulacros', simulacros.length],
    ['Temario estudiado', `${pct(temarioHecho, temarioTotal)}%`]
  ].map(([l, n]) => `<div class="stat-card"><div class="num">${n}</div><div class="label">${l}</div></div>`).join('');

  const est = estadisticasPorArea();
  const areasConDatos = Object.keys(D.areas).filter(a => state.preguntas.some(q => q.area === a));
  document.getElementById('dash-areas').innerHTML = areasConDatos.map(a => {
    const o = est[a];
    const p = o ? pct(o.ok, o.intentos) : 0;
    return `<div class="barra-area"><span>${escapeHtml(areaNombre(a))}${o ? ` <small style="color:var(--text-muted)">(${o.resp} resp.)</small>` : ''}</span>
      <div class="barra"><div style="width:${p}%"></div></div><span class="pct">${o ? p + '%' : '—'}</span></div>`;
  }).join('');

  document.querySelector('#tabla-areas tbody').innerHTML = areasConDatos.map(a => {
    const qs = state.preguntas.filter(q => q.area === a);
    const of = qs.filter(q => q.fuente === 'oficial');
    return `<tr class="fila-area" data-area="${a}" style="cursor:pointer" title="Estudiar ${escapeHtml(areaNombre(a))}">
      <td>${escapeHtml(areaNombre(a))}${D.areas[a].sub ? ' <small style="color:var(--text-muted)">(sub)</small>' : ''}</td>
      <td>${of.length}</td><td>${of.filter(tieneExpl).length}</td><td>${qs.length - of.length}</td><td>${qs.length}</td></tr>`;
  }).join('');
  document.querySelectorAll('.fila-area').forEach(tr => tr.addEventListener('click', () => {
    setView('banco');
    document.getElementById('sel-area').value = tr.dataset.area;
    renderBancoResumen();
  }));
}

// ------------------------------------------------------------------
// BANCO DE PREGUNTAS
// ------------------------------------------------------------------
function opcionesFuente() {
  const o = [['todas', 'Todas las fuentes'], ['oficial', 'Exámenes oficiales (todos)'], ['oficial-TRO', 'Oficiales · troncales'], ['oficial-SUB', 'Oficiales · subespecialidades'], ['conaflix', 'CONAFLIX']];
  if (P && P.preguntas && P.preguntas.length) o.push(['simuresi', 'Banco extra (uso personal)']);
  return o.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
}
function opcionesArea(incluirTroncales = true) {
  const areas = Object.keys(D.areas).filter(a => state.preguntas.some(q => q.area === a));
  return '<option value="todas">Todas las áreas</option>' +
    (incluirTroncales ? '<option value="troncales">Las 5 troncales</option>' : '') +
    areas.map(a => `<option value="${a}">${escapeHtml(areaNombre(a))} (${state.preguntas.filter(q => q.area === a).length})</option>`).join('');
}
function filtrarFuente(pool, f) {
  if (f === 'todas') return pool;
  if (f === 'oficial') return pool.filter(q => q.fuente === 'oficial');
  if (f === 'oficial-TRO') return pool.filter(q => q.fuente === 'oficial' && q.tipo === 'TRO');
  if (f === 'oficial-SUB') return pool.filter(q => q.fuente === 'oficial' && q.tipo === 'SUB');
  return pool.filter(q => q.fuente === f);
}
function filtrarArea(pool, a) {
  if (a === 'todas') return pool;
  if (a === 'troncales') return pool.filter(q => TRONCALES.includes(q.area));
  return pool.filter(q => q.area === a);
}
function initBanco() {
  document.getElementById('sel-area').innerHTML = opcionesArea();
  document.getElementById('sel-fuente').innerHTML = opcionesFuente();
  document.getElementById('sel-examen').innerHTML = '<option value="todos">Todos</option>' +
    D.examenes.map(e => `<option value="${e.id}">${escapeHtml(e.titulo)}</option>`).join('');
  ['sel-area', 'sel-fuente', 'sel-examen', 'sel-situacion', 'chk-repetidas'].forEach(id =>
    document.getElementById(id).addEventListener('change', renderBancoResumen));
  document.getElementById('btn-iniciar-estudio').addEventListener('click', () => {
    const pool = preguntasFiltradasBanco();
    iniciarSesionEstudio(document.getElementById('chk-orden').checked ? pool : mezclar(pool));
  });
  document.getElementById('btn-estudio-anterior').addEventListener('click', () => navegarEstudio(-1));
  document.getElementById('btn-estudio-siguiente').addEventListener('click', () => navegarEstudio(1));
  document.getElementById('btn-estudio-terminar').addEventListener('click', finalizarEstudio);
}
function preguntasFiltradasBanco() {
  let pool = filtrarArea(state.preguntas, document.getElementById('sel-area').value);
  pool = filtrarFuente(pool, document.getElementById('sel-fuente').value);
  const ex = document.getElementById('sel-examen').value;
  if (ex !== 'todos') pool = pool.filter(q => q.examen_id === ex);
  if (document.getElementById('chk-repetidas').checked) pool = pool.filter(q => q.repetida_en);
  const sit = document.getElementById('sel-situacion').value;
  const { historial, srs } = state.progreso;
  if (sit === 'no') pool = pool.filter(q => !historial[q.id]);
  else if (sit === 'falladas') pool = pool.filter(q => historial[q.id] && !historial[q.id].correcta);
  else if (sit === 'repaso') pool = pool.filter(q => srs[q.id]);
  return pool;
}
function renderBancoResumen() {
  const pool = preguntasFiltradasBanco();
  const conExpl = pool.filter(tieneExpl).length;
  const of = pool.filter(q => q.fuente === 'oficial').length;
  document.getElementById('banco-resumen').innerHTML =
    `<strong>${pool.length}</strong> pregunta${pool.length === 1 ? '' : 's'} en esta selección (${of} oficiales · ${conExpl} con explicación).`;
}
function iniciarSesionEstudio(pool) {
  if (!pool.length) { alert('No hay preguntas para esa combinación de filtros.'); return; }
  state.estudio = { preguntas: pool, idx: 0, respuestas: {} };
  document.getElementById('estudio-session').classList.remove('hidden');
  document.getElementById('estudio-resumen').classList.add('hidden');
  document.getElementById('banco-filters').classList.add('hidden');
  document.getElementById('banco-resumen').classList.add('hidden');
  renderTarjetaEstudio();
}
function renderTarjetaEstudio() {
  const { preguntas, idx, respuestas } = state.estudio;
  const q = preguntas[idx];
  const elegida = respuestas[q.id] || null;
  document.getElementById('estudio-contador').textContent = `Pregunta ${idx + 1} / ${preguntas.length}`;
  document.getElementById('estudio-progress-fill').style.width = `${((idx + 1) / preguntas.length) * 100}%`;
  const cont = document.getElementById('estudio-tarjeta');
  cont.innerHTML = htmlMeta(q) + `<div class="enunciado">${escapeHtml(q.enunciado)}</div>` +
    htmlOpciones(q, { elegida, corregida: !!elegida }) + (elegida ? htmlFeedback(q, elegida) : '');
  if (!elegida) cont.querySelectorAll('.opcion').forEach(el => el.addEventListener('click', () => {
    registrarRespuesta(q, el.dataset.letra);
    state.estudio.respuestas[q.id] = el.dataset.letra;
    renderTarjetaEstudio();
  }));
  document.getElementById('btn-estudio-anterior').disabled = idx === 0;
  document.getElementById('btn-estudio-siguiente').textContent = idx === preguntas.length - 1 ? 'Finalizar' : 'Siguiente →';
}
function navegarEstudio(d) {
  const { preguntas, idx } = state.estudio;
  if (idx + d < 0) return;
  if (idx + d >= preguntas.length) { finalizarEstudio(); return; }
  state.estudio.idx += d;
  renderTarjetaEstudio();
  window.scrollTo(0, 0);
}
function finalizarEstudio() {
  const { preguntas, respuestas } = state.estudio;
  const respondidas = Object.keys(respuestas).length;
  const aciertos = preguntas.filter(q => respuestas[q.id] === q.respuesta_correcta).length;
  document.getElementById('estudio-session').classList.add('hidden');
  document.getElementById('banco-filters').classList.remove('hidden');
  document.getElementById('banco-resumen').classList.remove('hidden');
  const r = document.getElementById('estudio-resumen');
  r.classList.remove('hidden');
  r.innerHTML = `
    <div class="resultado-score">${aciertos} / ${respondidas}</div>
    <div class="resultado-sub">${respondidas} de ${preguntas.length} preguntas respondidas · ${pct(aciertos, respondidas)}% de acierto</div>
    <div class="resultado-desglose">
      <div class="item aciertos"><div class="n">${aciertos}</div>Aciertos</div>
      <div class="item fallos"><div class="n">${respondidas - aciertos}</div>Fallos (al repaso)</div>
      <div class="item blancos"><div class="n">${preguntas.length - respondidas}</div>Sin responder</div>
    </div>
    <button class="btn-primary" id="btn-cerrar-resumen">Cerrar resumen</button>`;
  document.getElementById('btn-cerrar-resumen').addEventListener('click', () => r.classList.add('hidden'));
  renderBancoResumen();
}

// ------------------------------------------------------------------
// SIMULACRO
// ------------------------------------------------------------------
function initSimulacro() {
  document.querySelectorAll('#sim-modos button').forEach(b => b.addEventListener('click', () => {
    state.simModo = b.dataset.modo;
    document.querySelectorAll('#sim-modos button').forEach(x => x.classList.toggle('active', x === b));
    ['oficial', 'conarem', 'libre'].forEach(m => document.getElementById('sim-panel-' + m).classList.toggle('hidden', m !== state.simModo));
  }));
  document.getElementById('sim-area').innerHTML = opcionesArea();
  document.getElementById('sim-fuente').innerHTML = opcionesFuente();
  document.getElementById('btn-sim-conarem').addEventListener('click', iniciarSimConarem);
  document.getElementById('btn-sim-libre').addEventListener('click', iniciarSimLibre);
  document.getElementById('btn-sim-anterior').addEventListener('click', () => navegarSim(-1));
  document.getElementById('btn-sim-siguiente').addEventListener('click', () => navegarSim(1));
  document.getElementById('btn-sim-finalizar').addEventListener('click', () => {
    const s = state.simulacro;
    const blancos = s.preguntas.filter(q => !s.respuestas[q.id]).length;
    if (blancos && !confirm(`Quedan ${blancos} preguntas sin responder. ¿Finalizar y corregir igual?`)) return;
    finalizarSimulacro();
  });
}
function renderSimConfig() {
  const sims = state.progreso.simulacros;
  const mejor = id => {
    const r = sims.filter(s => s.examen_id === id);
    return r.length ? Math.max(...r.map(s => s.pct)) : null;
  };
  document.getElementById('sim-examenes').innerHTML = D.examenes.map(e => {
    const m = mejor(e.id);
    const areas = [...new Set(e.preguntas.map(id => state.porId.get(id).area))].map(areaCorto).join(' · ');
    return `<div class="examen-card">
      <b>${escapeHtml(e.titulo.replace('CONAREM ', ''))}</b>
      <span class="sub">${e.preguntas.length} preguntas · ${escapeHtml(areas)}</span>
      ${m != null ? `<span class="mejor">Tu mejor resultado: ${m}%</span>` : ''}
      <div class="acciones">
        <button class="btn-primary" data-examen="${e.id}">Rendir</button>
        ${e.pdf ? `<a class="link-pdf" href="${e.pdf}" target="_blank" rel="noopener">📄 PDF oficial</a>` : ''}
      </div></div>`;
  }).join('');
  document.querySelectorAll('#sim-examenes [data-examen]').forEach(b => b.addEventListener('click', () => {
    const e = D.examenes.find(x => x.id === b.dataset.examen);
    iniciarSimulacro({ titulo: e.titulo, examen_id: e.id, preguntas: e.preguntas.map(id => state.porId.get(id)), segundosPorPregunta: 90 });
  }));
  const hist = sims.slice(-15).reverse();
  document.getElementById('sim-historial').innerHTML = hist.length ? `<div class="table-wrap"><table>
    <thead><tr><th>Fecha</th><th>Simulacro</th><th>Aciertos</th><th>%</th><th>Tiempo</th></tr></thead>
    <tbody>${hist.map(s => `<tr><td>${fmtFecha(s.fecha)}</td><td>${escapeHtml(s.titulo)}</td><td>${s.aciertos}/${s.n}</td><td><b>${s.pct}%</b></td><td>${fmtTiempo(s.segundos)}</td></tr>`).join('')}</tbody>
    </table></div>` : '<p class="repaso-vacio">Todavía no hiciste simulacros.</p>';
}
function iniciarSimConarem() {
  const bloque = document.getElementById('sim-bloque').value;
  const fuente = document.getElementById('sim-fuente-conarem').value;
  const seg = +document.getElementById('sim-tiempo-conarem').value;
  const partes = bloque === 'I+II' ? [...D.bloques.I.partes, ...D.bloques.II.partes] : D.bloques[bloque].partes;
  let preguntas = [];
  for (const [area, n] of partes) {
    let pool = state.preguntas.filter(q => q.area === area);
    if (fuente === 'oficial') pool = pool.filter(q => q.fuente === 'oficial' && q.tipo === 'TRO');
    if (fuente === 'no-vistas') {
      const nuevas = pool.filter(q => !state.progreso.historial[q.id]);
      const parte = tomarN(nuevas, n);
      preguntas.push(...parte, ...tomarN(pool.filter(q => !parte.includes(q)), n - parte.length));
    } else preguntas.push(...tomarN(pool, n));
  }
  const titulo = `Simulacro ${bloque === 'I+II' ? 'completo' : 'Bloque ' + bloque} (${fuente === 'oficial' ? 'oficiales' : 'banco'})`;
  iniciarSimulacro({ titulo, preguntas, segundosPorPregunta: seg });
}
function iniciarSimLibre() {
  const numSel = document.getElementById('sim-num').value;
  let pool = filtrarFuente(filtrarArea(state.preguntas, document.getElementById('sim-area').value), document.getElementById('sim-fuente').value);
  const n = numSel === 'all' ? pool.length : Math.min(+numSel, pool.length);
  const preguntas = numSel === 'all' ? mezclar(pool) : tomarN(pool, n);
  iniciarSimulacro({ titulo: `Personalizado (${preguntas.length})`, preguntas, segundosPorPregunta: +document.getElementById('sim-tiempo').value });
}
function iniciarSimulacro({ titulo, examen_id = null, preguntas, segundosPorPregunta = 0 }) {
  if (!preguntas.length) { alert('No hay preguntas para esa combinación.'); return; }
  state.simulacro = {
    titulo, examen_id, preguntas, idx: 0, respuestas: {},
    inicio: Date.now(), limite: segundosPorPregunta ? segundosPorPregunta * preguntas.length : 0, intervalo: null
  };
  document.getElementById('simulacro-config').classList.add('hidden');
  document.getElementById('simulacro-resultado').classList.add('hidden');
  document.getElementById('simulacro-session').classList.remove('hidden');
  const el = document.getElementById('sim-cronometro');
  const tick = () => {
    const s = state.simulacro;
    if (!s) return;
    const trans = Math.floor((Date.now() - s.inicio) / 1000);
    if (s.limite) {
      const resta = s.limite - trans;
      el.textContent = '⏱ ' + fmtTiempo(Math.max(0, resta));
      el.style.color = resta < 300 ? 'var(--danger)' : '';
      if (resta <= 0) { alert('¡Se terminó el tiempo! Se corrige el examen.'); finalizarSimulacro(); }
    } else el.textContent = fmtTiempo(trans);
  };
  tick();
  state.simulacro.intervalo = setInterval(tick, 1000);
  renderTarjetaSim();
}
function renderTarjetaSim() {
  const s = state.simulacro;
  const q = s.preguntas[s.idx];
  document.getElementById('sim-contador').textContent = `Pregunta ${s.idx + 1} / ${s.preguntas.length} · ${s.titulo}`;
  document.getElementById('sim-progress-fill').style.width = `${((s.idx + 1) / s.preguntas.length) * 100}%`;
  const cont = document.getElementById('simulacro-tarjeta');
  // en el simulacro no se revela la fuente exacta (año/número) para no condicionar la respuesta
  cont.innerHTML = `<div class="meta"><span class="tag">${escapeHtml(areaNombre(q.area))}</span></div>
    <div class="enunciado">${escapeHtml(q.enunciado)}</div>` + htmlOpciones(q, { elegida: s.respuestas[q.id] || null });
  cont.querySelectorAll('.opcion').forEach(el => el.addEventListener('click', () => {
    s.respuestas[q.id] = el.dataset.letra;
    renderTarjetaSim();
  }));
  document.getElementById('btn-sim-anterior').disabled = s.idx === 0;
  document.getElementById('btn-sim-siguiente').disabled = s.idx === s.preguntas.length - 1;
  const mapa = document.getElementById('sim-mapa-preguntas');
  mapa.innerHTML = s.preguntas.map((p, i) => `<div class="celda ${s.respuestas[p.id] ? 'respondida' : ''} ${i === s.idx ? 'actual' : ''}" data-idx="${i}">${i + 1}</div>`).join('');
  mapa.querySelectorAll('.celda').forEach(el => el.addEventListener('click', () => { s.idx = +el.dataset.idx; renderTarjetaSim(); }));
}
function navegarSim(d) {
  const s = state.simulacro;
  const n = s.idx + d;
  if (n < 0 || n >= s.preguntas.length) return;
  s.idx = n;
  renderTarjetaSim();
}
function finalizarSimulacro() {
  const s = state.simulacro;
  if (!s) return;
  clearInterval(s.intervalo);
  const segundos = Math.floor((Date.now() - s.inicio) / 1000);
  let aciertos = 0, fallos = 0, blancos = 0;
  const porArea = {};
  for (const q of s.preguntas) {
    const r = s.respuestas[q.id];
    const o = porArea[q.area] = porArea[q.area] || { aciertos: 0, fallos: 0, blancos: 0, total: 0 };
    o.total++;
    if (!r) { blancos++; o.blancos++; }
    else if (r === q.respuesta_correcta) { aciertos++; o.aciertos++; }
    else { fallos++; o.fallos++; }
    if (r) registrarRespuesta(q, r, { guardar: false });
  }
  const total = s.preguntas.length;
  state.progreso.simulacros.push({ fecha: hoyLocal(), titulo: s.titulo, examen_id: s.examen_id, n: total, aciertos, fallos, blancos, pct: pct(aciertos, total), segundos });
  guardarProgreso();
  state.simulacro = null;

  document.getElementById('simulacro-session').classList.add('hidden');
  document.getElementById('simulacro-config').classList.remove('hidden');
  renderSimConfig();
  const res = document.getElementById('simulacro-resultado');
  res.classList.remove('hidden');
  res.innerHTML = `
    <div class="resultado-score">${pct(aciertos, total)}%</div>
    <div class="resultado-sub">${escapeHtml(s.titulo)} · ${aciertos}/${total} correctas · tiempo ${fmtTiempo(segundos)}</div>
    <div class="resultado-desglose">
      <div class="item aciertos"><div class="n">${aciertos}</div>Aciertos</div>
      <div class="item fallos"><div class="n">${fallos}</div>Fallos</div>
      <div class="item blancos"><div class="n">${blancos}</div>Sin responder</div>
    </div>
    <h2>Desglose por área</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Área</th><th>Aciertos</th><th>Fallos</th><th>Blancos</th><th>%</th></tr></thead>
      <tbody>${Object.entries(porArea).map(([a, o]) => `<tr><td>${escapeHtml(areaNombre(a))}</td><td>${o.aciertos}</td><td>${o.fallos}</td><td>${o.blancos}</td><td><b>${pct(o.aciertos, o.total)}%</b></td></tr>`).join('')}</tbody>
    </table></div>
    <p class="repaso-intro" style="margin-top:12px">El puntaje del examen CONAREM es el porcentaje de aciertos (no hay descuento por error). Las falladas ya están en tu repaso espaciado.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button id="btn-revisar-sim" class="btn-secondary">Revisar todas las respuestas</button>
      ${fallos + blancos ? `<button id="btn-estudiar-falladas" class="btn-primary">Estudiar las ${fallos + blancos} falladas/en blanco</button>` : ''}
    </div>
    <div id="sim-revision" class="hidden" style="margin-top:16px"></div>`;
  const preguntas = s.preguntas, respuestas = s.respuestas;
  const bf = document.getElementById('btn-estudiar-falladas');
  if (bf) bf.addEventListener('click', () => {
    setView('banco');
    iniciarSesionEstudio(preguntas.filter(q => respuestas[q.id] !== q.respuesta_correcta));
  });
  document.getElementById('btn-revisar-sim').addEventListener('click', () => {
    const rev = document.getElementById('sim-revision');
    if (!rev.classList.contains('hidden')) { rev.classList.add('hidden'); return; }
    rev.innerHTML = preguntas.map((q, i) => {
      const r = respuestas[q.id];
      const color = !r ? 'var(--text-muted)' : r === q.respuesta_correcta ? 'var(--success)' : 'var(--danger)';
      return `<div class="tarjeta-pregunta" style="border-left:4px solid ${color}">
        ${htmlMeta(q, `<span class="tag">${i + 1}</span>`)}
        <div class="enunciado" style="font-size:0.95rem">${escapeHtml(q.enunciado)}</div>
        ${htmlOpciones(q, { elegida: r, corregida: true })}${htmlFeedback(q, r)}</div>`;
    }).join('');
    rev.classList.remove('hidden');
  });
  window.scrollTo(0, 0);
}

// ------------------------------------------------------------------
// REPASO (preguntas falladas)
// ------------------------------------------------------------------
function renderRepaso() {
  if (state.repaso.activa) return renderTarjetaRepaso();
  const { srs } = state.progreso;
  const hoy = hoyLocal();
  const pendientes = srsPendientes();
  const total = Object.keys(srs).length;
  const maduras = Object.values(srs).filter(c => c.ivl >= 21).length;
  const prox = [];
  for (let i = 1; i <= 7; i++) { const dia = sumarDias(hoy, i); prox.push({ dia, n: Object.values(srs).filter(c => c.due === dia).length }); }
  const maxProx = Math.max(1, ...prox.map(p => p.n));
  const porArea = {};
  pendientes.forEach(id => { const a = state.porId.get(id).area; porArea[a] = (porArea[a] || 0) + 1; });
  const siguiente = Object.values(srs).map(c => c.due).filter(d => d > hoy).sort()[0];
  const diaSemana = iso => new Date(iso + 'T12:00:00').toLocaleDateString('es-PY', { weekday: 'short', day: 'numeric' });
  document.getElementById('repaso-contenido').innerHTML = `
    <p class="repaso-intro">Cada pregunta que fallas (en el banco o en un simulacro) entra aquí y vuelve en intervalos crecientes, como en Anki: si la aciertas, el intervalo aumenta; si la vuelves a fallar, vuelve mañana.</p>
    <div class="stats-grid">
      ${[['Para hoy', pendientes.length], ['Mañana', prox[0].n], ['En el mazo', total], ['Maduras (≥ 21 d)', maduras]]
        .map(([l, n]) => `<div class="stat-card"><div class="num">${n}</div><div class="label">${l}</div></div>`).join('')}
    </div>
    <div class="filters" style="margin-top:18px">
      ${pendientes.length ? `
      <label>Área
        <select id="repaso-area"><option value="">Todas (${pendientes.length})</option>
          ${Object.entries(porArea).sort((a, b) => b[1] - a[1]).map(([a, n]) => `<option value="${a}">${escapeHtml(areaNombre(a))} (${n})</option>`).join('')}
        </select></label>
      <button class="btn-primary" id="btn-iniciar-repaso">Empezar repaso</button>`
      : `<div class="repaso-vacio">${total ? `✅ Nada pendiente hoy. Próximo repaso: <b>${siguiente ? diaSemana(siguiente) : '—'}</b>.` : 'El mazo está vacío. Las preguntas que falles aparecerán aquí.'}</div>`}
    </div>
    ${total ? `<h2>Próximos 7 días</h2><div class="repaso-previsto">${prox.map(p => `
      <div class="fila"><span class="dia">${diaSemana(p.dia)}</span><div class="barra"><div style="width:${100 * p.n / maxProx}%"></div></div><span class="n">${p.n}</span></div>`).join('')}</div>` : ''}
    <h2>Copia de seguridad</h2>
    <p class="repaso-intro">El progreso (respuestas, repaso, simulacros, temario y flashcards) se guarda solo, en este navegador. Exporta una copia de vez en cuando o para pasarlo a otro dispositivo.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-secondary" id="btn-exportar">⬇️ Exportar progreso</button>
      <label class="btn-secondary" style="cursor:pointer">📤 Importar copia<input type="file" id="input-importar" accept="application/json" hidden></label>
    </div>`;
  const bi = document.getElementById('btn-iniciar-repaso');
  if (bi) bi.addEventListener('click', () => iniciarRepaso(document.getElementById('repaso-area').value));
  document.getElementById('btn-exportar').addEventListener('click', exportarProgreso);
  document.getElementById('input-importar').addEventListener('change', importarProgreso);
}
function iniciarRepaso(area) {
  const cola = srsPendientes(area);
  if (!cola.length) return;
  state.repaso = { activa: true, cola, idx: 0, elegida: null, repetidas: new Set(), hechas: 0, aciertos: 0 };
  renderTarjetaRepaso();
}
function renderTarjetaRepaso() {
  const r = state.repaso;
  if (r.idx >= r.cola.length) return finalizarRepaso();
  const id = r.cola[r.idx];
  const q = state.porId.get(id);
  const c = state.progreso.srs[id];
  const esRep = r.repetidas.has(id) && r.cola.indexOf(id) < r.idx;
  const resp = r.elegida !== null;
  const ok = resp && r.elegida === q.respuesta_correcta;
  let pie = '';
  if (resp) {
    let botones;
    if (esRep || !c) botones = '<button class="btn-primary" data-continuar>Continuar ⏎</button>';
    else if (!ok) botones = '<div class="srs-nota">Vuelve <b>mañana</b> y otra vez al final de esta sesión.</div><button class="btn-primary" data-continuar>Continuar ⏎</button>';
    else botones = [SRS.OTRA, SRS.DIFICIL, SRS.BIEN, SRS.FACIL].map(n =>
      `<button class="srs-btn srs-${n}" data-nota="${n}"><b>${SRS_LABEL[n]}</b><span>${fmtIntervalo(srsCalcular(c, n).ivl)} · ${n}</span></button>`).join('');
    pie = htmlFeedback(q, r.elegida) + `<div class="srs-botones">${botones}</div>`;
  }
  document.getElementById('repaso-contenido').innerHTML = `
    <div class="session-progress"><span>Repaso ${Math.min(r.idx + 1, r.cola.length)} / ${r.cola.length}${esRep ? ' · repetición' : ''}</span>
      <div class="progress-bar"><div class="progress-fill" style="width:${100 * r.idx / r.cola.length}%"></div></div></div>
    <div class="tarjeta-pregunta">
      ${htmlMeta(q, c && c.lapses ? `<span class="tag tag-warning">fallada ${c.lapses + 1}×</span>` : '')}
      <div class="enunciado">${escapeHtml(q.enunciado)}</div>
      ${htmlOpciones(q, { elegida: r.elegida, corregida: resp })}
      ${pie}
    </div>
    <div class="session-nav">
      <button class="btn-secondary" id="btn-repaso-quitar">Quitar del repaso</button>
      <button class="btn-secondary" id="btn-repaso-salir">Terminar sesión</button>
    </div>
    <p class="repaso-atajos">Atajos: A–E responder · 1–4 calificar · Enter continuar</p>`;
  const cont = document.getElementById('repaso-contenido');
  if (!resp) cont.querySelectorAll('.opcion').forEach(el => el.addEventListener('click', () => responderRepaso(el.dataset.letra)));
  cont.querySelectorAll('[data-nota]').forEach(b => b.addEventListener('click', () => calificarRepaso(+b.dataset.nota)));
  const bc = cont.querySelector('[data-continuar]');
  if (bc) bc.addEventListener('click', () => calificarRepaso(null));
  document.getElementById('btn-repaso-salir').addEventListener('click', finalizarRepaso);
  document.getElementById('btn-repaso-quitar').addEventListener('click', () => {
    if (!confirm('¿Quitar esta pregunta del repaso? Seguirá en el banco de preguntas.')) return;
    delete state.progreso.srs[id];
    guardarProgreso();
    r.cola = r.cola.filter((x, i) => i < r.idx || x !== id);
    r.elegida = null;
    renderTarjetaRepaso();
  });
}
function responderRepaso(letra) {
  const r = state.repaso;
  const id = r.cola[r.idx];
  const q = state.porId.get(id);
  const esRep = r.repetidas.has(id) && r.cola.indexOf(id) < r.idx;
  r.elegida = letra;
  if (!esRep) {
    registrarRespuesta(q, letra, { srs: false });
    r.hechas++;
    if (letra === q.respuesta_correcta) r.aciertos++;
    else { srsAplicar(state.progreso.srs, id, SRS.OTRA); r.repetidas.add(id); r.cola.push(id); }
  }
  renderTarjetaRepaso();
}
function calificarRepaso(nota) {
  const r = state.repaso;
  const id = r.cola[r.idx];
  if (nota === SRS.OTRA && !r.repetidas.has(id)) { r.repetidas.add(id); r.cola.push(id); }
  if (nota) srsAplicar(state.progreso.srs, id, nota);
  r.idx++; r.elegida = null;
  renderTarjetaRepaso();
  window.scrollTo(0, 0);
}
function finalizarRepaso() {
  const r = state.repaso;
  state.repaso = { activa: false, cola: [], idx: 0, elegida: null, repetidas: new Set(), hechas: 0, aciertos: 0 };
  renderRepaso();
  if (r.hechas) {
    const aviso = document.createElement('div');
    aviso.className = 'repaso-aviso';
    aviso.innerHTML = `<span>✅ Sesión terminada: <b>${r.aciertos}/${r.hechas}</b> acertadas.</span>`;
    document.getElementById('repaso-contenido').prepend(aviso);
  }
}
function exportarProgreso() {
  const blob = new Blob([JSON.stringify({ tipo: 'conaremhub-progreso', exportado: new Date().toISOString(), ...state.progreso }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `conarem-progreso-${hoyLocal()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importarProgreso(e) {
  const f = e.target.files[0];
  if (!f) return;
  const lector = new FileReader();
  lector.onload = () => {
    try {
      const obj = JSON.parse(lector.result);
      if (obj.tipo !== 'conaremhub-progreso' || !obj.historial || !obj.srs) throw new Error('formato');
      if (!confirm(`Esta copia tiene ${Object.keys(obj.historial).length} preguntas respondidas y ${Object.keys(obj.srs).length} en el repaso. ¿Reemplazar el progreso actual?`)) return;
      const { tipo, exportado, ...resto } = obj;
      state.progreso = Object.assign(progresoVacio(), resto);
      guardarProgreso();
      renderRepaso();
      alert('Progreso importado.');
    } catch (err) { alert('El archivo no es una copia de progreso del CONAREM Hub.'); }
  };
  lector.readAsText(f);
}

// ------------------------------------------------------------------
// FLASHCARDS (mazos: preguntas oficiales → respuesta; banco extra; puntos clave CONAFLIX)
// ------------------------------------------------------------------
function construirMazos() {
  const mazos = [];
  for (const a of TRONCALES.concat(Object.keys(D.areas).filter(x => !TRONCALES.includes(x)))) {
    const cartas = state.preguntas.filter(q => q.fuente === 'oficial' && q.area === a).map(q => ({
      id: 'FC-' + q.id, area: a,
      frente: q.enunciado,
      dorso: `${q.respuesta_correcta}) ${q.alternativas[q.respuesta_correcta]}` + (tieneExpl(q) ? '\n\n' + q.explicacion : '')
    }));
    if (cartas.length) mazos.push({ id: 'of-' + a, nombre: `Oficiales · ${areaNombre(a)}`, cartas });
  }
  const pc = [];
  for (const t of D.temas) t.puntos_clave.forEach((p, i) => pc.push({ id: `FC-CF-${t.id}-${i}`, area: t.area, frente: `${t.icono} ${t.titulo} — punto clave ${i + 1}`, dorso: p }));
  if (pc.length) mazos.push({ id: 'conaflix', nombre: 'Puntos clave (CONAFLIX)', cartas: pc });
  if (P && P.flashcards && P.flashcards.length) {
    for (const a of TRONCALES) {
      const cartas = P.flashcards.filter(c => c.area === a).map(c => ({ id: 'FC-' + c.id, area: a, frente: c.frente, dorso: c.dorso }));
      if (cartas.length) mazos.push({ id: 'sr-' + a, nombre: `Banco extra · ${areaNombre(a)}`, cartas });
    }
  }
  return mazos;
}
let MAZOS = null;
function renderFlashcards() {
  if (state.fc && state.fc.activa) return renderCartaFc();
  MAZOS = MAZOS || construirMazos();
  const fcProg = state.progreso.fc;
  const hoy = hoyLocal();
  document.getElementById('flashcards-contenido').innerHTML = `
    <p class="repaso-intro">Lee el frente, intenta responder de memoria, gira la carta y califica. Las cartas vuelven según tu calificación (repetición espaciada). Cada sesión trae las cartas vencidas + hasta 20 nuevas.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Mazo</th><th>Cartas</th><th>Para hoy</th><th>Nuevas</th><th></th></tr></thead>
      <tbody>${MAZOS.map(m => {
        const vencidas = m.cartas.filter(c => fcProg[c.id] && fcProg[c.id].due <= hoy).length;
        const nuevas = m.cartas.filter(c => !fcProg[c.id]).length;
        return `<tr><td>${escapeHtml(m.nombre)}</td><td>${m.cartas.length}</td><td>${vencidas}</td><td>${nuevas}</td>
          <td><button class="btn-primary" data-mazo="${m.id}" ${vencidas + nuevas ? '' : 'disabled'}>Estudiar</button></td></tr>`;
      }).join('')}</tbody></table></div>`;
  document.querySelectorAll('[data-mazo]').forEach(b => b.addEventListener('click', () => iniciarFc(b.dataset.mazo)));
}
function iniciarFc(idMazo) {
  const m = MAZOS.find(x => x.id === idMazo);
  const fcProg = state.progreso.fc;
  const hoy = hoyLocal();
  const vencidas = shuffle(m.cartas.filter(c => fcProg[c.id] && fcProg[c.id].due <= hoy));
  const nuevas = shuffle(m.cartas.filter(c => !fcProg[c.id])).slice(0, 20);
  state.fc = { activa: true, mazo: m, cola: vencidas.concat(nuevas), idx: 0, girada: false, hechas: 0 };
  renderCartaFc();
}
function renderCartaFc() {
  const s = state.fc;
  const cont = document.getElementById('flashcards-contenido');
  if (s.idx >= s.cola.length) {
    state.fc = null;
    renderFlashcards();
    const aviso = document.createElement('div');
    aviso.className = 'repaso-aviso';
    aviso.innerHTML = `<span>✅ Sesión de flashcards terminada: <b>${s.hechas}</b> cartas.</span>`;
    cont.prepend(aviso);
    return;
  }
  const c = s.cola[s.idx];
  const prog = state.progreso.fc[c.id] || tarjetaNueva();
  cont.innerHTML = `
    <div class="fc-meta">${escapeHtml(s.mazo.nombre)} · carta ${s.idx + 1} / ${s.cola.length}</div>
    <div class="flashcard ${s.girada ? 'flipped' : ''}" id="fc-carta">
      <div class="flashcard-inner">
        <div class="flashcard-face">${escapeHtml(c.frente)}</div>
        <div class="flashcard-face flashcard-back">${escapeHtml(c.dorso)}</div>
      </div>
    </div>
    <div class="fc-controls">${s.girada
      ? [SRS.OTRA, SRS.DIFICIL, SRS.BIEN, SRS.FACIL].map(n => `<button class="srs-btn srs-${n}" data-nota="${n}"><b>${SRS_LABEL[n]}</b><span>${fmtIntervalo(srsCalcular(prog, n).ivl)} · ${n}</span></button>`).join('')
      : '<button class="btn-primary" id="fc-girar">Mostrar respuesta (espacio)</button>'}
      <button class="btn-secondary" id="fc-salir">Terminar</button></div>`;
  document.getElementById('fc-carta').addEventListener('click', girarFc);
  const g = document.getElementById('fc-girar');
  if (g) g.addEventListener('click', girarFc);
  cont.querySelectorAll('[data-nota]').forEach(b => b.addEventListener('click', () => calificarFc(+b.dataset.nota)));
  document.getElementById('fc-salir').addEventListener('click', () => { s.idx = s.cola.length; renderCartaFc(); });
}
function girarFc() { if (state.fc && !state.fc.girada) { state.fc.girada = true; renderCartaFc(); } }
function calificarFc(nota) {
  const s = state.fc;
  const c = s.cola[s.idx];
  const fc = state.progreso.fc;
  if (!fc[c.id]) fc[c.id] = tarjetaNueva();
  srsAplicar(fc, c.id, nota);
  if (nota === SRS.OTRA) s.cola.push(c);
  s.hechas++; s.idx++; s.girada = false;
  renderCartaFc();
}

// ------------------------------------------------------------------
// TEMARIO OFICIAL + RESÚMENES (CONAFLIX)
// ------------------------------------------------------------------
const claveTemario = (a, i) => a + '|' + i;
function sanearHtml(html) {
  const t = document.createElement('template');
  t.innerHTML = html;
  t.content.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(n => n.remove());
  t.content.querySelectorAll('*').forEach(n => [...n.attributes].forEach(at => {
    if (/^on/i.test(at.name) || /javascript:/i.test(at.value)) n.removeAttribute(at.name);
  }));
  return t.innerHTML;
}
function renderTemario(temaAbierto) {
  const cont = document.getElementById('temario-contenido');
  if (temaAbierto) {
    const t = D.temas.find(x => x.id === temaAbierto);
    cont.innerHTML = `<button class="btn-secondary" id="tema-volver">← Volver al temario</button>
      <div class="teoria-contenido" style="margin-top:14px">
        <h1>${escapeHtml(t.icono)} ${escapeHtml(t.titulo)}</h1>
        <p class="repaso-intro">${escapeHtml(areaNombre(t.area))}${t.submateria ? ' · ' + escapeHtml(t.submateria) : ''}${t.minutos ? ' · ~' + t.minutos + ' min' : ''}</p>
        ${sanearHtml(t.resumen_html)}
        ${t.puntos_clave.length ? `<h2>Puntos clave</h2><ul class="puntos-clave">${t.puntos_clave.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
        ${t.mnemotecnia ? `<blockquote>🧠 ${escapeHtml(t.mnemotecnia)}</blockquote>` : ''}
        ${t.bibliografia ? `<p class="repaso-intro">📚 ${escapeHtml(t.bibliografia)}</p>` : ''}
        ${t.preguntas.length ? `<button class="btn-primary" id="tema-practicar">Practicar ${t.preguntas.length} pregunta${t.preguntas.length > 1 ? 's' : ''} del tema</button>` : ''}
        <p class="aviso-privado">Resumen: CONAFLIX (Proyecto TOP 10, licencia Apache-2.0).</p>
      </div>`;
    document.getElementById('tema-volver').addEventListener('click', () => renderTemario());
    const bp = document.getElementById('tema-practicar');
    if (bp) bp.addEventListener('click', () => { setView('banco'); iniciarSesionEstudio(t.preguntas.map(id => state.porId.get(id))); });
    return;
  }
  const hecho = state.progreso.temario;
  cont.innerHTML = `
    ${D.temas.length ? `<h2 style="margin-top:0">Resúmenes de alto rendimiento</h2>
    <div class="temas-grid">${D.temas.map(t => `<div class="tema-card" data-tema="${t.id}"><div class="ic">${escapeHtml(t.icono)}</div>
      <b>${escapeHtml(t.titulo)}</b><div class="sub">${escapeHtml(areaNombre(t.area))}${t.frecuencia ? ' · frecuencia ' + t.frecuencia + '%' : ''}</div></div>`).join('')}</div>` : ''}
    <h2>Temario oficial CONAREM (troncales)</h2>
    <p class="repaso-intro">Temario aprobado por CONAREM para el concurso 2026 (fuente: INS). Marca lo que ya estudiaste: el avance se refleja en el Panel y en el Calendario.</p>
    ${TRONCALES.map(a => {
      const items = D.temario[a] || [];
      const n = items.filter((_, i) => hecho[claveTemario(a, i)]).length;
      const grupos = [];
      items.forEach((it, i) => {
        let g = grupos[grupos.length - 1];
        if (!g || g.nombre !== it.grupo) { g = { nombre: it.grupo, items: [] }; grupos.push(g); }
        g.items.push({ ...it, i });
      });
      return `<details class="temario-area"><summary>${escapeHtml(areaNombre(a))}<span class="pct">${n}/${items.length} · ${pct(n, items.length)}%</span></summary>
        ${grupos.map(g => `<div class="temario-grupo">${g.nombre ? `<h4>${escapeHtml(g.nombre)}</h4>` : ''}
          ${g.items.map(it => `<label class="temario-item ${hecho[claveTemario(a, it.i)] ? 'hecho' : ''}"><input type="checkbox" data-clave="${claveTemario(a, it.i)}" ${hecho[claveTemario(a, it.i)] ? 'checked' : ''}><span>${escapeHtml(it.titulo)}</span></label>`).join('')}
        </div>`).join('')}
      </details>`;
    }).join('')}`;
  cont.querySelectorAll('[data-tema]').forEach(el => el.addEventListener('click', () => { renderTemario(el.dataset.tema); window.scrollTo(0, 0); }));
  cont.querySelectorAll('input[data-clave]').forEach(chk => chk.addEventListener('change', () => {
    marcarTemario(chk.dataset.clave, chk.checked);
    chk.closest('.temario-item').classList.toggle('hecho', chk.checked);
    const det = chk.closest('details');
    const total = det.querySelectorAll('input[data-clave]').length;
    const n = det.querySelectorAll('input[data-clave]:checked').length;
    det.querySelector('.pct').textContent = `${n}/${total} · ${pct(n, total)}%`;
  }));
}
function marcarTemario(clave, si) {
  if (si) state.progreso.temario[clave] = hoyLocal();
  else delete state.progreso.temario[clave];
  guardarProgreso();
}

// ------------------------------------------------------------------
// CALENDARIO DE ESTUDIO (generado a partir del temario y la fecha del examen)
// ------------------------------------------------------------------
// Peso de cada área = nº de preguntas en el examen troncal (CIR 30, GO 30, SP 20, MI 30, PED 30).
const PESO_AREA = { MI: 30, CIR: 30, PED: 30, GO: 30, SP: 20 };
function lunesDe(iso) { const d = new Date(iso + 'T12:00:00'); const dia = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dia); return fechaLocal(d); }
function generarCalendario() {
  const c = config();
  const inicio = lunesDe(c.fechaInicio);
  const totalSemanas = Math.max(1, Math.ceil((diasEntre(inicio, c.fechaExamen) + 1) / 7));
  const repaso = Math.min(+c.semanasRepaso || 0, Math.max(0, totalSemanas - 5));
  const primera = Math.max(1, totalSemanas - repaso);
  // semanas por área proporcionales al peso, mínimo 1
  const pesoTotal = Object.values(PESO_AREA).reduce((s, x) => s + x, 0);
  const minimo = primera >= 5 ? 1 : 0;   // con menos de 5 semanas no entran todas las áreas
  const semanasArea = {};
  let asignadas = 0;
  for (const a of Object.keys(PESO_AREA)) { semanasArea[a] = Math.max(minimo, Math.floor(primera * PESO_AREA[a] / pesoTotal)); asignadas += semanasArea[a]; }
  const orden = Object.keys(PESO_AREA).sort((a, b) => PESO_AREA[b] - PESO_AREA[a]);
  for (let k = 0; asignadas < primera; k++, asignadas++) semanasArea[orden[k % orden.length]]++;
  for (let k = orden.length - 1; asignadas > primera; k = (k + orden.length - 1) % orden.length) {
    if (semanasArea[orden[k]] > minimo) { semanasArea[orden[k]]--; asignadas--; }
  }
  // secuencia intercalada: MI, CIR, PED, GO, SP, MI, CIR...
  const restantes = Object.assign({}, semanasArea);
  const secuencia = [];
  while (secuencia.length < primera) {
    for (const a of ['MI', 'CIR', 'PED', 'GO', 'SP']) if (restantes[a] > 0 && secuencia.length < primera) { secuencia.push(a); restantes[a]--; }
  }
  // repartir los temas de cada área entre sus semanas
  const cursor = {};
  const semanas = [];
  secuencia.forEach((a, k) => {
    const items = (D.temario[a] || []).map((it, i) => ({ ...it, clave: claveTemario(a, i) }));
    const n = semanasArea[a];
    const idx = cursor[a] = (cursor[a] || 0) + 1;
    const desde = Math.floor(items.length * (idx - 1) / n), hasta = Math.floor(items.length * idx / n);
    const ini = sumarDias(inicio, 7 * k);
    semanas.push({ n: k + 1, inicio: ini, fin: sumarDias(ini, 6), area: a, temas: items.slice(desde, hasta) });
  });
  for (let k = 0; k < repaso; k++) {
    const ini = sumarDias(inicio, 7 * (primera + k));
    semanas.push({ n: primera + k + 1, inicio: ini, fin: sumarDias(ini, 6), area: null, temas: [] });
  }
  return { inicio, semanas, totalSemanas, primera, repaso };
}
function initCalendario() {
  const c = config();
  const fe = document.getElementById('cfg-fecha-examen'), fi = document.getElementById('cfg-fecha-inicio'), fr = document.getElementById('cfg-repaso');
  fe.value = c.fechaExamen; fi.value = c.fechaInicio; fr.value = c.semanasRepaso;
  const guardar = () => {
    if (fe.value) c.fechaExamen = fe.value;
    if (fi.value) c.fechaInicio = fi.value;
    c.semanasRepaso = Math.max(0, Math.min(8, +fr.value || 0));
    guardarProgreso();
    renderCalendario();
  };
  [fe, fi, fr].forEach(el => el.addEventListener('change', guardar));
  document.getElementById('sel-calendario-filtro').addEventListener('change', renderCalendario);
}
function renderCalendario() {
  const cal = generarCalendario();
  const c = config();
  const hoy = hoyLocal();
  document.getElementById('calendario-periodo').textContent =
    `${fmtFecha(cal.inicio)} → examen ${fmtFecha(c.fechaExamen)} · ${cal.semanas.length} semanas (${cal.primera} de temario + ${cal.repaso} de repaso final con simulacros)`;
  const filtro = document.getElementById('sel-calendario-filtro').value;
  let semanas = cal.semanas;
  if (filtro === 'pendientes') semanas = semanas.filter(s => s.fin >= hoy);
  const hecho = state.progreso.temario;
  document.getElementById('calendario-lista').innerHTML = semanas.map(s => {
    const actual = hoy >= s.inicio && hoy <= s.fin;
    const nHecho = s.temas.filter(t => hecho[t.clave]).length;
    return `<div class="semana-card ${actual ? 'semana-actual' : ''} ${s.fin < hoy ? 'semana-pasada' : ''}">
      <div class="semana-header"><span class="semana-num">Semana ${s.n}</span><span class="semana-fechas">${fmtFecha(s.inicio)} → ${fmtFecha(s.fin)}</span>
        ${actual ? '<span class="tag tag-actual">Esta semana</span>' : ''}
        ${s.temas.length ? `<span class="semana-progreso">${nHecho}/${s.temas.length} temas</span>` : ''}</div>
      <div class="semana-especialidad">${s.area ? escapeHtml(areaNombre(s.area)) : '🎯 Repaso final'}</div>
      ${s.area ? `<ul class="semana-temas">${s.temas.map(t => `<li><label><input type="checkbox" data-clave="${t.clave}" ${hecho[t.clave] ? 'checked' : ''}> <span>${escapeHtml(t.titulo)}</span></label></li>`).join('')}</ul>
        <button class="btn-secondary btn-ir-banco" data-area="${s.area}">Practicar preguntas de ${escapeHtml(areaCorto(s.area))}</button>`
      : `<ul class="semana-temas"><li>• 2 simulacros completos (Bloque I + II) con tiempo</li><li>• Repaso espaciado diario de las falladas</li><li>• Repetir los exámenes oficiales con menor puntaje</li></ul>
        <button class="btn-secondary btn-ir-sim">Ir a simulacros</button>`}
    </div>`;
  }).join('') || '<p class="teoria-vacio">No hay semanas para este filtro.</p>';
  document.querySelectorAll('#calendario-lista input[data-clave]').forEach(chk => chk.addEventListener('change', () => {
    marcarTemario(chk.dataset.clave, chk.checked);
    renderCalendario();
  }));
  document.querySelectorAll('#calendario-lista .btn-ir-banco').forEach(b => b.addEventListener('click', () => {
    setView('banco');
    document.getElementById('sel-area').value = b.dataset.area;
    renderBancoResumen();
  }));
  document.querySelectorAll('#calendario-lista .btn-ir-sim').forEach(b => b.addEventListener('click', () => setView('simulacro')));
}

// ------------------------------------------------------------------
// BIBLIOGRAFÍA
// ------------------------------------------------------------------
function renderBibliografia() {
  const B = D.bibliografia;
  const enlace = (t, u) => `<a href="${escapeHtml(u)}" target="_blank" rel="noopener">${escapeHtml(t)}</a>`;
  document.getElementById('bibliografia-contenido').innerHTML = `
    <p class="repaso-intro">${escapeHtml(B.nota)} Página oficial: ${enlace('ins.gov.py/conarem', B.fuente)}. Los libros de texto son comerciales: suelen estar disponibles en AccessMedicina / ClinicalKey a través de la universidad u hospital.</p>
    <h2>Especialidades troncales</h2>
    ${B.troncales.map(m => `<div class="biblio-area"><h3>${escapeHtml(m.materia)}</h3>
      📄 ${enlace('Lista oficial y temario (PDF del INS)', m.temario)}
      <div class="etq">Libros</div><ul>${m.libros.map(l => `<li>${enlace(l.titulo, l.url)}</li>`).join('')}</ul>
      ${m.documentos.length ? `<div class="etq">Documentos oficiales gratuitos</div><ul>${m.documentos.map(l => `<li>${enlace(l.titulo, l.url)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}
    <h2>Subespecialidades (derivadas)</h2>
    ${B.subespecialidades.map(m => `<div class="biblio-area"><h3>${escapeHtml(m.materia)}</h3>
      📄 ${enlace('Lista oficial y temario (PDF del INS)', m.temario)}
      <ul>${m.libros.map(l => `<li>${enlace(l.titulo, l.url)}</li>`).join('')}</ul></div>`).join('')}`;
}

// ------------------------------------------------------------------
// BÚSQUEDA GLOBAL
// ------------------------------------------------------------------
function initBusqueda() {
  const input = document.getElementById('busqueda-input');
  const panel = document.getElementById('busqueda-resultados');
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  input.addEventListener('input', () => {
    const t = norm(input.value.trim());
    if (t.length < 3) { panel.classList.add('hidden'); return; }
    const res = state.preguntas.filter(q => norm(q.enunciado).includes(t)).slice(0, 12);
    panel.innerHTML = res.length ? res.map(q => `<div class="busqueda-item" data-id="${q.id}"><span class="tag">${escapeHtml(q.fuente === 'oficial' ? q.anio + ' ' + q.area : areaCorto(q.area))}</span>${escapeHtml(q.enunciado.slice(0, 100))}${q.enunciado.length > 100 ? '…' : ''}</div>`).join('')
      : '<div class="busqueda-vacia">Sin resultados.</div>';
    panel.classList.remove('hidden');
    panel.querySelectorAll('.busqueda-item').forEach(el => el.addEventListener('click', () => {
      setView('banco');
      iniciarSesionEstudio([state.porId.get(el.dataset.id)]);
      panel.classList.add('hidden');
      input.value = '';
    }));
  });
  document.addEventListener('click', e => { if (!panel.contains(e.target) && e.target !== input) panel.classList.add('hidden'); });
}

// ------------------------------------------------------------------
// ATAJOS DE TECLADO
// ------------------------------------------------------------------
function initAtajos() {
  window.addEventListener('storage', e => {
    if (e.key !== PROGRESO_KEY || state.repaso.activa || state.simulacro) return;
    state.progreso = cargarProgreso();
    actualizarBadgeRepaso();
  });
  document.addEventListener('keydown', e => {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toUpperCase();
    if (state.view === 'repaso' && state.repaso.activa) {
      if (state.repaso.elegida === null) {
        const q = state.porId.get(state.repaso.cola[state.repaso.idx]);
        if (q && q.alternativas[k]) { e.preventDefault(); responderRepaso(k); }
      } else if (/^[1-4]$/.test(k) && document.querySelector(`[data-nota="${k}"]`)) { e.preventDefault(); calificarRepaso(+k); }
      else if (k === 'ENTER' && document.querySelector('[data-continuar]')) { e.preventDefault(); calificarRepaso(null); }
    } else if (state.view === 'flashcards' && state.fc && state.fc.activa) {
      if (k === ' ' && !state.fc.girada) { e.preventDefault(); girarFc(); }
      else if (/^[1-4]$/.test(k) && state.fc.girada) { e.preventDefault(); calificarFc(+k); }
    } else if (state.view === 'simulacro' && state.simulacro) {
      const q = state.simulacro.preguntas[state.simulacro.idx];
      if (q.alternativas[k]) { e.preventDefault(); state.simulacro.respuestas[q.id] = k; renderTarjetaSim(); }
      else if (k === 'ARROWRIGHT') navegarSim(1);
      else if (k === 'ARROWLEFT') navegarSim(-1);
    }
  });
}

// ------------------------------------------------------------------
// ARRANQUE
// ------------------------------------------------------------------
(function init() {
  initNav();
  initTema();
  try { cargarDatos(); }
  catch (err) {
    document.getElementById('loading').textContent = 'Error al cargar los datos (data.js ausente o corrupto). Regenera con: node scripts/generar-hub-data.js';
    console.error(err);
    return;
  }
  state.progreso = cargarProgreso();
  config();
  document.getElementById('loading').classList.add('hidden');
  initBanco();
  initSimulacro();
  initCalendario();
  initBusqueda();
  initAtajos();
  renderBibliografia();
  setView('dashboard');
  actualizarBadgeRepaso();
})();
