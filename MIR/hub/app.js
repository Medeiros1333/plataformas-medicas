// MIR Hub — lógica de la aplicación. Vanilla JS, sin dependencias externas.
// Los datos (preguntas por especialidad/tema + calendario) se cargan de window.MIR_HUB_DATA,
// incrustado en data.js por scripts/generar-hub-data-preguntas.js — así el Hub funciona con solo
// abrir index.html (file://), sin necesidad de servidor local.

const state = {
  preguntas: [],
  especialidades: [],
  calendario: null,
  view: 'dashboard',
  estudio: { preguntas: [], idx: 0, respuestas: {} },
  simulacro: { preguntas: [], idx: 0, respuestas: {}, negativa: 1 / 3, cronoStart: null, cronoInterval: null, terminado: false }
};

async function cargarDatos() {
  if (!window.MIR_HUB_DATA) {
    throw new Error('window.MIR_HUB_DATA no está definido — falta cargar data.js o el archivo está vacío/corrupto.');
  }
  state.preguntas = window.MIR_HUB_DATA.preguntas || [];
  state.especialidades = window.MIR_HUB_DATA.especialidades || [];
  state.calendario = window.MIR_HUB_DATA.calendario || null;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ------------------------------------------------------------------
// NAVEGACIÓN
// ------------------------------------------------------------------
function initNav() {
  document.querySelectorAll('.navbtn').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('.navbtn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-' + view).classList.remove('hidden');
}

// ------------------------------------------------------------------
// TEMA (claro / oscuro / negro puro / auto según el sistema)
// ------------------------------------------------------------------
const TEMAS = ['auto', 'light', 'dark', 'black'];
const TEMA_LABEL = { auto: '🌗 Tema: Auto', light: '☀️ Tema: Claro', dark: '🌙 Tema: Oscuro', black: '⬛ Tema: Negro' };

function leerTemaGuardado() {
  try {
    return localStorage.getItem('mirhub-theme') || 'auto';
  } catch (e) {
    return 'auto';
  }
}

function aplicarTema(tema) {
  if (tema === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', tema);
  }
  const btn = document.getElementById('btn-tema');
  if (btn) btn.textContent = TEMA_LABEL[tema];
  try {
    if (tema === 'auto') localStorage.removeItem('mirhub-theme');
    else localStorage.setItem('mirhub-theme', tema);
  } catch (e) { /* localStorage no disponible — el tema no persistirá entre visitas, pero funciona en esta sesión */ }
}

function initTema() {
  aplicarTema(leerTemaGuardado());
  const btn = document.getElementById('btn-tema');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const actual = leerTemaGuardado();
    const siguiente = TEMAS[(TEMAS.indexOf(actual) + 1) % TEMAS.length];
    aplicarTema(siguiente);
  });
}

// ------------------------------------------------------------------
// DASHBOARD
// ------------------------------------------------------------------
function renderDashboard() {
  const total = state.preguntas.length;
  const conExpl = state.preguntas.filter(p => p.explicacion && p.explicacion.trim().length > 5).length;
  const nEsp = state.especialidades.length;
  const nTroncales = state.calendario ? state.calendario.distribucion_semanas_por_especialidad.length : 0;
  const nSemanas = state.calendario ? state.calendario.total_semanas : 0;

  const grid = document.getElementById('stats-grid');
  grid.innerHTML = [
    ['Preguntas en el banco', total],
    ['Con explicación', conExpl],
    ['Pendientes de explicación', total - conExpl],
    ['Especialidades', nEsp],
    ['Especialidades troncales', nTroncales],
    ['Semanas de calendario', nSemanas]
  ].map(([label, num]) => `
    <div class="stat-card">
      <div class="num">${num.toLocaleString('es-ES')}</div>
      <div class="label">${label}</div>
    </div>`).join('');

  const tbody = document.querySelector('#tabla-especialidades tbody');
  if (state.calendario) {
    const filas = state.calendario.distribucion_semanas_por_especialidad.slice().sort((a, b) => b.preguntas_banco - a.preguntas_banco);
    tbody.innerHTML = filas.map(t => {
      const preguntasTroncal = state.preguntas.filter(p => p.troncal === t.especialidad);
      const conExplTroncal = preguntasTroncal.filter(p => p.explicacion && p.explicacion.trim().length > 5).length;
      return `
      <tr class="fila-especialidad" data-troncal="${escapeHtml(t.especialidad)}" style="cursor:pointer" title="Estudiar ${escapeHtml(t.especialidad)}">
        <td>${escapeHtml(t.especialidad)}</td>
        <td>${t.preguntas_banco}</td>
        <td>${conExplTroncal}</td>
        <td>${t.semanas}</td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('.fila-especialidad').forEach(tr => {
      tr.addEventListener('click', () => irABancoTroncal(tr.dataset.troncal));
    });
  }
}

function irABancoTroncal(troncal) {
  setView('banco');
  const selEsp = document.getElementById('sel-especialidad');
  const codigos = state.especialidades.filter(e => preguntasDeTroncal(troncal).some(p => p.especialidad === e.codigo)).map(e => e.codigo);
  selEsp.value = codigos.length === 1 ? codigos[0] : 'troncal:' + troncal;
  if (![...selEsp.options].some(o => o.value === selEsp.value)) selEsp.value = 'todas';
  poblarSelectTema();
  renderBancoResumen();
}

function preguntasDeTroncal(troncal) {
  return state.preguntas.filter(p => p.troncal === troncal);
}

// ------------------------------------------------------------------
// BANCO DE PREGUNTAS (filtros especialidad -> tema -> año, y sesión de estudio)
// ------------------------------------------------------------------
function initBanco() {
  const selEsp = document.getElementById('sel-especialidad');
  const selTema = document.getElementById('sel-tema');
  const selAnio = document.getElementById('sel-anio');

  const gruposTroncales = {};
  for (const e of state.especialidades) {
    const t = state.preguntas.find(p => p.especialidad === e.codigo)?.troncal || e.nombre;
    if (!gruposTroncales[t]) gruposTroncales[t] = [];
    gruposTroncales[t].push(e);
  }

  let opciones = '<option value="todas">Todas las especialidades</option>';
  for (const troncal of Object.keys(gruposTroncales).sort()) {
    const esps = gruposTroncales[troncal];
    if (esps.length > 1) {
      opciones += `<option value="troncal:${escapeHtml(troncal)}">${escapeHtml(troncal)} (${esps.reduce((s, e) => s + e.n_preguntas, 0)})</option>`;
    }
    for (const e of esps) {
      opciones += `<option value="${e.codigo}">&nbsp;&nbsp;${escapeHtml(e.nombre)} (${e.n_preguntas})</option>`;
    }
  }
  selEsp.innerHTML = opciones;

  const años = [...new Set(state.preguntas.map(p => p.año))].sort((a, b) => a - b);
  selAnio.innerHTML = '<option value="todos">Todos los años</option>' + años.map(a => `<option value="${a}">${a}</option>`).join('');

  poblarSelectTema();
  renderBancoResumen();

  selEsp.addEventListener('change', () => { poblarSelectTema(); renderBancoResumen(); });
  selTema.addEventListener('change', renderBancoResumen);
  selAnio.addEventListener('change', renderBancoResumen);

  document.getElementById('btn-iniciar-estudio').addEventListener('click', () => {
    const pool = preguntasFiltradasBanco();
    iniciarSesionEstudioConPool(pool);
  });

  document.getElementById('btn-estudio-anterior').addEventListener('click', () => navegarEstudio(-1));
  document.getElementById('btn-estudio-siguiente').addEventListener('click', () => navegarEstudio(1));
  document.getElementById('btn-estudio-terminar').addEventListener('click', finalizarEstudio);
}

function poblarSelectTema() {
  const selEsp = document.getElementById('sel-especialidad');
  const selTema = document.getElementById('sel-tema');
  const val = selEsp.value;

  let temas = [];
  if (val === 'todas' || val.startsWith('troncal:')) {
    selTema.innerHTML = '<option value="todos">Todos los temas</option>';
    selTema.disabled = true;
    return;
  }
  const esp = state.especialidades.find(e => e.codigo === val);
  temas = esp ? esp.temas : [];
  selTema.disabled = false;
  selTema.innerHTML = '<option value="todos">Todos los temas</option>' +
    temas.map(t => `<option value="${t.numero}">${t.numero !== null && t.numero !== 999 ? 'Tema ' + t.numero + '. ' : ''}${escapeHtml(t.titulo)} (${t.n_preguntas})</option>`).join('');
}

function preguntasFiltradasBanco() {
  const esp = document.getElementById('sel-especialidad').value;
  const temaVal = document.getElementById('sel-tema').value;
  const anio = document.getElementById('sel-anio').value;

  let pool = state.preguntas.slice();
  if (esp.startsWith('troncal:')) {
    const troncal = esp.slice('troncal:'.length);
    pool = pool.filter(p => p.troncal === troncal);
  } else if (esp !== 'todas') {
    pool = pool.filter(p => p.especialidad === esp);
    if (temaVal !== 'todos') pool = pool.filter(p => String(p.tema_numero) === temaVal);
  }
  if (anio !== 'todos') pool = pool.filter(p => String(p.año) === anio);
  return pool;
}

function renderBancoResumen() {
  const pool = preguntasFiltradasBanco();
  const conExpl = pool.filter(p => p.explicacion && p.explicacion.trim().length > 5).length;
  document.getElementById('banco-resumen').innerHTML = `
    <strong>${pool.length}</strong> pregunta${pool.length === 1 ? '' : 's'} en esta selección
    (${conExpl} con explicación, ${pool.length - conExpl} pendientes).`;
}

function iniciarSesionEstudioConPool(pool) {
  if (pool.length === 0) {
    alert('No hay preguntas para esa combinación de filtros.');
    return;
  }
  state.estudio = { preguntas: shuffle(pool), idx: 0, respuestas: {} };
  document.getElementById('estudio-session').classList.remove('hidden');
  document.getElementById('estudio-resumen').classList.add('hidden');
  document.getElementById('banco-filters').classList.add('hidden');
  document.getElementById('banco-resumen').classList.add('hidden');
  renderTarjetaEstudio();
}

function renderTarjetaEstudio() {
  const { preguntas, idx, respuestas } = state.estudio;
  const q = preguntas[idx];
  const contenedor = document.getElementById('estudio-tarjeta');
  const yaRespondida = respuestas[q.id];

  document.getElementById('estudio-contador').textContent = `Pregunta ${idx + 1} / ${preguntas.length}`;
  document.getElementById('estudio-progress-fill').style.width = `${((idx + 1) / preguntas.length) * 100}%`;

  const temaLabel = q.tema_numero !== null && q.tema_numero !== 999 ? `Tema ${q.tema_numero}. ${q.tema_titulo}` : q.tema_titulo;

  contenedor.innerHTML = `
    <div class="meta">
      <span class="tag">${q.id}</span>
      <span class="tag">${escapeHtml(q.especialidad_nombre)}</span>
      <span class="tag">${escapeHtml(temaLabel)}</span>
      ${q.revision_incierta ? '<span class="tag tag-warning">⚠️ Respuesta en revisión</span>' : ''}
    </div>
    ${q.imagen_ref ? `<div class="nota-verif">🖼️ ${escapeHtml(q.imagen_ref)}</div>` : ''}
    <div class="enunciado">${escapeHtml(q.enunciado)}</div>
    <div class="opciones">
      ${Object.entries(q.alternativas).map(([letra, texto]) => `
        <div class="opcion${q.revision_incierta && q.revision_incierta.alternativa_sugerida === letra ? ' sugerida' : ''}" data-letra="${letra}">
          <span class="letra">${letra}.</span>
          <span>${escapeHtml(texto)}</span>
        </div>`).join('')}
    </div>
    ${q.revision_incierta ? `<div class="aviso-incierto">⚠️ El gabarito oficial de esta pregunta puede estar en revisión. La opción marcada con * podría también ser correcta — ver detalles en la explicación.</div>` : ''}
    <div id="estudio-feedback"></div>
  `;

  contenedor.querySelectorAll('.opcion').forEach(el => {
    el.addEventListener('click', () => responderEstudio(q, el.dataset.letra));
  });

  if (yaRespondida) mostrarFeedbackEstudio(q, yaRespondida);

  document.getElementById('btn-estudio-anterior').disabled = idx === 0;
  document.getElementById('btn-estudio-siguiente').textContent = idx === preguntas.length - 1 ? 'Finalizar' : 'Siguiente →';
}

function responderEstudio(q, letra) {
  state.estudio.respuestas[q.id] = letra;
  mostrarFeedbackEstudio(q, letra);
}

function mostrarFeedbackEstudio(q, letraElegida) {
  const contenedor = document.getElementById('estudio-tarjeta');
  const correcta = q.respuesta_correcta;
  contenedor.querySelectorAll('.opcion').forEach(el => {
    el.classList.add('disabled');
    if (el.dataset.letra === correcta) el.classList.add('correct');
    else if (el.dataset.letra === letraElegida) el.classList.add('incorrect');
  });

  const acierto = letraElegida === correcta;
  const feedback = document.getElementById('estudio-feedback');
  let detalle = '';
  if (q.explicacion) {
    detalle = `<div class="detalle"><strong>Explicación:</strong>\n${escapeHtml(q.explicacion)}</div>`;
  } else {
    detalle = `<div class="nota-verif">Explicación aún no disponible para esta pregunta (fuente: ${escapeHtml(q.fuente)}).</div>`;
  }
  feedback.innerHTML = `
    <div class="feedback-box ${acierto ? 'ok' : 'bad'}">
      ${acierto ? '✔ Correcto' : `✘ Incorrecto — la respuesta correcta es ${correcta}`}
      ${detalle}
    </div>`;
}

function navegarEstudio(delta) {
  const { preguntas, idx } = state.estudio;
  if (idx + delta < 0) return;
  if (idx + delta >= preguntas.length) { finalizarEstudio(); return; }
  state.estudio.idx += delta;
  renderTarjetaEstudio();
}

function finalizarEstudio() {
  const { preguntas, respuestas } = state.estudio;
  const respondidas = Object.keys(respuestas).length;
  const aciertos = preguntas.filter(q => respuestas[q.id] === q.respuesta_correcta).length;
  const fallos = respondidas - aciertos;

  document.getElementById('estudio-session').classList.add('hidden');
  document.getElementById('banco-filters').classList.remove('hidden');
  document.getElementById('banco-resumen').classList.remove('hidden');
  const resumen = document.getElementById('estudio-resumen');
  resumen.classList.remove('hidden');
  resumen.innerHTML = `
    <div class="resultado-score">${aciertos} / ${preguntas.length}</div>
    <div class="resultado-sub">${respondidas} de ${preguntas.length} preguntas respondidas</div>
    <div class="resultado-desglose">
      <div class="item aciertos"><div class="n">${aciertos}</div>Aciertos</div>
      <div class="item fallos"><div class="n">${fallos}</div>Fallos</div>
      <div class="item blancos"><div class="n">${preguntas.length - respondidas}</div>Sin responder</div>
    </div>
    <button class="btn-primary" onclick="document.getElementById('estudio-resumen').classList.add('hidden')">Cerrar resumen</button>
  `;
}

// ------------------------------------------------------------------
// CALENDARIO DE ESTUDIO
// ------------------------------------------------------------------
function initCalendario() {
  if (!state.calendario) {
    document.getElementById('calendario-lista').innerHTML = '<p class="teoria-vacio">No se encontró data/calendario_estudio.json — regenera el Hub con node scripts/generar-hub-data-preguntas.js.</p>';
    return;
  }
  const { periodo, total_semanas, semanas_primera_vuelta, semanas_repaso_final } = state.calendario;
  document.getElementById('calendario-periodo').textContent =
    `${periodo.inicio} → ${periodo.fin} · ${total_semanas} semanas (${semanas_primera_vuelta} de primera vuelta + ${semanas_repaso_final} de repaso final)`;

  document.getElementById('sel-calendario-filtro').addEventListener('change', renderCalendario);
  renderCalendario();
}

function renderCalendario() {
  const filtro = document.getElementById('sel-calendario-filtro').value;
  const hoy = new Date().toISOString().slice(0, 10);
  let semanas = state.calendario.calendario;
  if (filtro === 'pendientes') semanas = semanas.filter(s => s.fin >= hoy);

  document.getElementById('calendario-lista').innerHTML = semanas.map(s => {
    const esActual = hoy >= s.inicio && hoy <= s.fin;
    return `
    <div class="semana-card ${esActual ? 'semana-actual' : ''}">
      <div class="semana-header">
        <span class="semana-num">Semana ${s.semana}</span>
        <span class="semana-fechas">${s.inicio} → ${s.fin}</span>
        ${esActual ? '<span class="tag tag-actual">Esta semana</span>' : ''}
      </div>
      <div class="semana-especialidad">${escapeHtml(s.especialidad)}</div>
      <ul class="semana-temas">
        ${s.temas.map(t => `<li>${t.numero !== null ? 'Tema ' + t.numero + '. ' : ''}${escapeHtml(t.titulo)}${t.nPreguntas ? ` <span class="tag">${t.nPreguntas} preg.</span>` : ''}</li>`).join('')}
      </ul>
      ${s.nota ? `<div class="nota-verif">${escapeHtml(s.nota)}</div>` : ''}
      ${preguntasDeTroncal(s.especialidad).length > 0 ? `<button class="btn-secondary btn-ir-banco" data-especialidad="${escapeHtml(s.especialidad)}">Ir al banco de preguntas de esta especialidad</button>` : ''}
    </div>`;
  }).join('') || '<p class="teoria-vacio">No hay semanas para este filtro.</p>';

  document.querySelectorAll('.btn-ir-banco').forEach(btn => {
    btn.addEventListener('click', () => irABancoTroncal(btn.dataset.especialidad));
  });
}

// ------------------------------------------------------------------
// MODO SIMULACRO
// ------------------------------------------------------------------
function initSimulacro() {
  const sel = document.getElementById('sim-especialidad');
  const opciones = state.especialidades.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
  sel.innerHTML = '<option value="todas">Todas las especialidades</option>' +
    opciones.map(e => `<option value="${e.codigo}">${escapeHtml(e.nombre)} (${e.n_preguntas})</option>`).join('');

  document.getElementById('btn-iniciar-simulacro').addEventListener('click', iniciarSimulacro);
  document.getElementById('btn-sim-anterior').addEventListener('click', () => navegarSimulacro(-1));
  document.getElementById('btn-sim-siguiente').addEventListener('click', () => navegarSimulacro(1));
  document.getElementById('btn-sim-finalizar').addEventListener('click', finalizarSimulacro);
}

function iniciarSimulacro() {
  const numSel = document.getElementById('sim-num').value;
  const esp = document.getElementById('sim-especialidad').value;
  const negativa = parseFloat(document.getElementById('sim-negativa').value);

  let pool = state.preguntas.slice();
  if (esp !== 'todas') pool = pool.filter(q => q.especialidad === esp);

  if (pool.length === 0) {
    alert('No hay preguntas para esa especialidad.');
    return;
  }

  pool = shuffle(pool);
  const n = numSel === 'all' ? pool.length : Math.min(parseInt(numSel, 10), pool.length);
  pool = pool.slice(0, n);

  state.simulacro = {
    preguntas: pool, idx: 0, respuestas: {}, negativa,
    cronoStart: Date.now(), cronoInterval: null, terminado: false
  };

  document.getElementById('simulacro-config').classList.add('hidden');
  document.getElementById('simulacro-session').classList.remove('hidden');
  document.getElementById('simulacro-resultado').classList.add('hidden');

  iniciarCronometro();
  renderTarjetaSimulacro();
  renderMapaSimulacro();
}

function iniciarCronometro() {
  const el = document.getElementById('sim-cronometro');
  clearInterval(state.simulacro.cronoInterval);
  state.simulacro.cronoInterval = setInterval(() => {
    const segs = Math.floor((Date.now() - state.simulacro.cronoStart) / 1000);
    const mm = String(Math.floor(segs / 60)).padStart(2, '0');
    const ss = String(segs % 60).padStart(2, '0');
    el.textContent = `${mm}:${ss}`;
  }, 1000);
}

function renderTarjetaSimulacro() {
  const { preguntas, idx, respuestas } = state.simulacro;
  const q = preguntas[idx];
  const contenedor = document.getElementById('simulacro-tarjeta');
  const elegida = respuestas[q.id];

  document.getElementById('sim-contador').textContent = `Pregunta ${idx + 1} / ${preguntas.length}`;
  document.getElementById('sim-progress-fill').style.width = `${((idx + 1) / preguntas.length) * 100}%`;

  contenedor.innerHTML = `
    <div class="meta">
      <span class="tag">${q.id}</span>
      <span class="tag">${escapeHtml(q.especialidad_nombre)}</span>
      ${q.revision_incierta ? '<span class="tag tag-warning">⚠️ Respuesta en revisión</span>' : ''}
    </div>
    ${q.imagen_ref ? `<div class="nota-verif">🖼️ ${escapeHtml(q.imagen_ref)}</div>` : ''}
    <div class="enunciado">${escapeHtml(q.enunciado)}</div>
    <div class="opciones">
      ${Object.entries(q.alternativas).map(([letra, texto]) => `
        <div class="opcion ${elegida === letra ? 'selected' : ''}${q.revision_incierta && q.revision_incierta.alternativa_sugerida === letra ? ' sugerida' : ''}" data-letra="${letra}">
          <span class="letra">${letra}.</span>
          <span>${escapeHtml(texto)}</span>
        </div>`).join('')}
    </div>
    ${q.revision_incierta ? `<div class="aviso-incierto">⚠️ El gabarito oficial de esta pregunta puede estar en revisión. La opción marcada con * podría también ser correcta.</div>` : ''}
  `;

  contenedor.querySelectorAll('.opcion').forEach(el => {
    el.addEventListener('click', () => {
      state.simulacro.respuestas[q.id] = el.dataset.letra;
      renderTarjetaSimulacro();
      renderMapaSimulacro();
    });
  });

  document.getElementById('btn-sim-anterior').disabled = idx === 0;
  document.getElementById('btn-sim-siguiente').textContent = idx === preguntas.length - 1 ? 'Última pregunta' : 'Siguiente →';
  document.getElementById('btn-sim-siguiente').disabled = idx === preguntas.length - 1;
}

function renderMapaSimulacro() {
  const { preguntas, idx, respuestas } = state.simulacro;
  const mapa = document.getElementById('sim-mapa-preguntas');
  mapa.innerHTML = preguntas.map((q, i) => `
    <div class="celda ${respuestas[q.id] ? 'respondida' : ''} ${i === idx ? 'actual' : ''}" data-idx="${i}">${i + 1}</div>
  `).join('');
  mapa.querySelectorAll('.celda').forEach(el => {
    el.addEventListener('click', () => {
      state.simulacro.idx = parseInt(el.dataset.idx, 10);
      renderTarjetaSimulacro();
      renderMapaSimulacro();
    });
  });
}

function navegarSimulacro(delta) {
  const { preguntas, idx } = state.simulacro;
  const nuevo = idx + delta;
  if (nuevo < 0 || nuevo >= preguntas.length) return;
  state.simulacro.idx = nuevo;
  renderTarjetaSimulacro();
  renderMapaSimulacro();
}

function finalizarSimulacro() {
  clearInterval(state.simulacro.cronoInterval);
  const { preguntas, respuestas, negativa, cronoStart } = state.simulacro;
  const segsTotal = Math.floor((Date.now() - cronoStart) / 1000);

  let aciertos = 0, fallos = 0, blancos = 0;
  const desglosePorEsp = {};

  preguntas.forEach(q => {
    const r = respuestas[q.id];
    if (!desglosePorEsp[q.especialidad_nombre]) desglosePorEsp[q.especialidad_nombre] = { aciertos: 0, fallos: 0, blancos: 0, total: 0 };
    desglosePorEsp[q.especialidad_nombre].total++;
    if (!r) { blancos++; desglosePorEsp[q.especialidad_nombre].blancos++; }
    else if (r === q.respuesta_correcta) { aciertos++; desglosePorEsp[q.especialidad_nombre].aciertos++; }
    else { fallos++; desglosePorEsp[q.especialidad_nombre].fallos++; }
  });

  const puntuacion = aciertos - fallos * negativa;
  const sobreDiez = (puntuacion / preguntas.length) * 10;

  document.getElementById('simulacro-session').classList.add('hidden');
  document.getElementById('simulacro-config').classList.remove('hidden');
  const resultado = document.getElementById('simulacro-resultado');
  resultado.classList.remove('hidden');

  const mm = String(Math.floor(segsTotal / 60)).padStart(2, '0');
  const ss = String(segsTotal % 60).padStart(2, '0');

  const filasEsp = Object.entries(desglosePorEsp)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([esp, d]) => `
      <tr>
        <td>${escapeHtml(esp)}</td>
        <td>${d.aciertos}</td>
        <td>${d.fallos}</td>
        <td>${d.blancos}</td>
        <td>${d.total}</td>
      </tr>`).join('');

  resultado.innerHTML = `
    <div class="resultado-score">${puntuacion.toFixed(2)} pts</div>
    <div class="resultado-sub">Nota sobre 10: ${sobreDiez.toFixed(2)} · Tiempo: ${mm}:${ss} · ${aciertos}/${preguntas.length} correctas</div>
    <div class="resultado-desglose">
      <div class="item aciertos"><div class="n">${aciertos}</div>Aciertos</div>
      <div class="item fallos"><div class="n">${fallos}</div>Fallos</div>
      <div class="item blancos"><div class="n">${blancos}</div>Sin responder</div>
    </div>
    <h2>Desglose por especialidad</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Especialidad</th><th>Aciertos</th><th>Fallos</th><th>Blancos</th><th>Total</th></tr></thead>
        <tbody>${filasEsp}</tbody>
      </table>
    </div>
    <p style="margin-top:16px;color:var(--text-muted);font-size:0.85rem;">Corrección aplicada: ${negativa === 0 ? 'sin penalización' : '-1/3 por respuesta fallada'} (estándar de convocatoria MIR).</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
      <button id="btn-revisar-simulacro" class="btn-secondary">Revisar respuestas</button>
      ${(fallos + blancos) > 0 ? `<button id="btn-estudiar-falladas" class="btn-primary">Estudiar las ${fallos + blancos} falladas/en blanco</button>` : ''}
    </div>
    <div id="simulacro-revision" class="hidden" style="margin-top:16px;"></div>
  `;

  const btnFalladas = document.getElementById('btn-estudiar-falladas');
  if (btnFalladas) {
    btnFalladas.addEventListener('click', () => {
      const pool = preguntas.filter(q => respuestas[q.id] !== q.respuesta_correcta);
      setView('banco');
      iniciarSesionEstudioConPool(pool);
    });
  }

  document.getElementById('btn-revisar-simulacro').addEventListener('click', () => {
    const rev = document.getElementById('simulacro-revision');
    const visible = !rev.classList.contains('hidden');
    if (visible) { rev.classList.add('hidden'); return; }
    rev.innerHTML = preguntas.map((q, i) => {
      const r = respuestas[q.id];
      const estado = !r ? 'blancos' : r === q.respuesta_correcta ? 'aciertos' : 'fallos';
      const colorVar = estado === 'aciertos' ? 'var(--success)' : estado === 'fallos' ? 'var(--danger)' : 'var(--text-muted)';
      return `
        <div class="tarjeta-pregunta" style="border-left:4px solid ${colorVar}; margin-bottom:12px;">
          <div class="meta"><span class="tag">${i + 1}. ${q.id}</span><span class="tag">${escapeHtml(q.especialidad_nombre)}</span>${q.revision_incierta ? '<span class="tag tag-warning">⚠️ Respuesta en revisión</span>' : ''}</div>
          <div class="enunciado" style="font-size:0.95rem;">${escapeHtml(q.enunciado)}</div>
          <div class="opciones">
            ${Object.entries(q.alternativas).map(([letra, texto]) => {
              let cls = '';
              if (letra === q.respuesta_correcta) cls = 'correct';
              else if (letra === r) cls = 'incorrect';
              if (q.revision_incierta && q.revision_incierta.alternativa_sugerida === letra) cls += ' sugerida';
              return `<div class="opcion disabled ${cls}"><span class="letra">${letra}.</span><span>${escapeHtml(texto)}</span></div>`;
            }).join('')}
          </div>
          ${!r ? '<div class="feedback-box bad">Sin responder</div>' : ''}
          ${q.revision_incierta ? `<div class="aviso-incierto">⚠️ El gabarito oficial de esta pregunta puede estar en revisión. La opción marcada con * podría también ser correcta.</div>` : ''}
          ${q.explicacion ? `<div class="detalle"><strong>Explicación:</strong>\n${escapeHtml(q.explicacion)}</div>` : ''}
        </div>`;
    }).join('');
    rev.classList.remove('hidden');
  });
}

// ------------------------------------------------------------------
// BÚSQUEDA GLOBAL (preguntas, por texto)
// ------------------------------------------------------------------
function initBusqueda() {
  const input = document.getElementById('busqueda-input');
  const panel = document.getElementById('busqueda-resultados');
  let activo = false;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 3) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }

    const pregsCoincidentes = state.preguntas
      .filter(p => p.enunciado.toLowerCase().includes(q))
      .slice(0, 10);

    if (pregsCoincidentes.length === 0) {
      panel.innerHTML = '<div class="busqueda-vacia">Sin resultados.</div>';
      panel.classList.remove('hidden');
      return;
    }

    panel.innerHTML = pregsCoincidentes.map(p => `
      <div class="busqueda-item" data-id="${p.id}">
        <span class="tag">${p.id}</span> ${escapeHtml(p.enunciado.slice(0, 90))}${p.enunciado.length > 90 ? '…' : ''}
      </div>`).join('');
    panel.classList.remove('hidden');
    activo = true;

    panel.querySelectorAll('.busqueda-item').forEach(el => {
      el.addEventListener('click', () => {
        const preg = state.preguntas.find(p => p.id === el.dataset.id);
        if (preg) {
          setView('banco');
          iniciarSesionEstudioConPool([preg]);
        }
        panel.classList.add('hidden');
        input.value = '';
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (activo && !panel.contains(e.target) && e.target !== input) {
      panel.classList.add('hidden');
    }
  });
}

// ------------------------------------------------------------------
// ARRANQUE
// ------------------------------------------------------------------
(async function init() {
  initNav();
  initTema();
  try {
    await cargarDatos();
  } catch (err) {
    document.getElementById('loading').textContent =
      'Error al cargar los datos (data.js no está presente o está corrupto). Regenera el Hub con: node scripts/generar-hub-data-preguntas.js';
    console.error(err);
    return;
  }
  document.getElementById('loading').classList.add('hidden');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('hidden'));
  setView('dashboard');

  renderDashboard();
  initBanco();
  initCalendario();
  initSimulacro();
  initBusqueda();
})();
