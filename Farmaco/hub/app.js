// Farmaco Hub — lógica de la aplicación. Vanilla JS, sin dependencias externas.
// Los datos se cargan de window.FARMACO_HUB_DATA (incrustado en data.js por
// scripts/generar-hub-data.js), de modo que el Hub funciona abriendo index.html
// con doble clic (file://), sin servidor ni problemas de CORS.

const D = {
  farmacos: [], pediatria: [], microbiologia: [], patologias: [], pat_por_farmaco: {},
  areas: [], grupos: [], correlacion: { por_patogeno: {}, por_farmaco: {} },
  nombres_area: {}, nombres_grupo: {}
};

const sel = { vademecum: null, pediatria: null, microbiologia: null, corr: null, patologias: null };

// Desde qué patología se abrió la ficha actual: permite volver a ella tras consultar un fármaco.
let retorno = null;

const $ = id => document.getElementById(id);

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Texto de contenido: escapa el HTML y convierte **...** en un resaltado. En los datos,
// **...** marca lo que es PROPIO de ese fármaco frente a su clase (ver campo vs_clase).
function fmt(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong class="hl">$1</strong>');
}

const NIVEL_TXT = { 1: 'Nivel 1 · núcleo', 2: 'Nivel 2 · frecuente', 3: 'Nivel 3 · específico' };

function porId(id) {
  return D.farmacos.find(f => f.id === id) || D.pediatria.find(f => f.id === id) || D.microbiologia.find(p => p.id === id) || null;
}
const esPatogeno = x => x && 'grupo' in x;

// ------------------------------------------------------------------ NAVEGACIÓN
function setView(view, { conservarRetorno = false } = {}) {
  if (!conservarRetorno) retorno = null;
  document.querySelectorAll('.navbtn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = $('view-' + view);
  if (el) el.classList.remove('hidden');
}

function initNav() {
  document.querySelectorAll('.navbtn').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });
}

// ------------------------------------------------------------------ TEMA
const TEMAS = ['auto', 'light', 'dark', 'black'];
const TEMA_LABEL = { auto: '🌗 Tema: Auto', light: '☀️ Tema: Claro', dark: '🌙 Tema: Oscuro', black: '⬛ Tema: Negro' };

function leerTema() {
  try { return localStorage.getItem('farmacohub-theme') || 'auto'; } catch (e) { return 'auto'; }
}
function aplicarTema(t) {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  const b = $('btn-tema');
  if (b) b.textContent = TEMA_LABEL[t];
  try {
    if (t === 'auto') localStorage.removeItem('farmacohub-theme');
    else localStorage.setItem('farmacohub-theme', t);
  } catch (e) { /* sin localStorage el tema no persiste, pero funciona en esta sesión */ }
}
function initTema() {
  aplicarTema(leerTema());
  const b = $('btn-tema');
  if (b) b.addEventListener('click', () => aplicarTema(TEMAS[(TEMAS.indexOf(leerTema()) + 1) % TEMAS.length]));
}

// ------------------------------------------------------------------ PANEL
function renderPanel() {
  const todos = D.farmacos.concat(D.pediatria);
  const nInter = todos.reduce((a, f) => a + ((f.farmacocinetica && f.farmacocinetica.interacciones) || []).length, 0);
  const nIndic = todos.reduce((a, f) => a + (f.indicaciones || []).length, 0);
  const nCuadros = D.microbiologia.reduce((a, p) => a + (p.patologias || []).length, 0);
  const nEnlaces = Object.values(D.correlacion.por_patogeno).reduce((a, b) => a + b.length, 0);

  $('stats-grid').innerHTML = [
    ['Patologías con pauta', D.patologias.length],
    ['Fármacos (adulto)', D.farmacos.length],
    ['Fichas pediátricas', D.pediatria.length],
    ['Patógenos', D.microbiologia.length],
    ['Indicaciones con dosis', nIndic],
    ['Interacciones registradas', nInter],
    ['Cuadros clínicos microbianos', nCuadros],
    ['Enlaces de correlación', nEnlaces],
    ['Áreas terapéuticas', D.areas.length]
  ].map(([l, n]) => `<div class="stat-card"><div class="num">${n.toLocaleString('es-ES')}</div><div class="label">${esc(l)}</div></div>`).join('');

  const cnt = (arr, k, v, nivel) => arr.filter(x => x[k] === v && x.nivel === nivel).length;

  $('tabla-areas').querySelector('tbody').innerHTML = D.areas.map(a => `
    <tr>
      <td><strong>${esc(a.nombre)}</strong> <span class="badge">${esc(a.codigo)}</span></td>
      <td>${a.n_farmacos}</td><td>${a.n_pediatria}</td>
      <td>${cnt(D.farmacos, 'area', a.codigo, 1)}</td>
      <td>${cnt(D.farmacos, 'area', a.codigo, 2)}</td>
      <td>${cnt(D.farmacos, 'area', a.codigo, 3)}</td>
      <td style="font-size:.82rem;color:var(--text-muted)">${esc(a.clases.join(' · '))}</td>
    </tr>`).join('') || '<tr><td colspan="7">Sin datos todavía.</td></tr>';

  $('tabla-grupos').querySelector('tbody').innerHTML = D.grupos.map(g => {
    const ps = D.microbiologia.filter(p => p.grupo === g.codigo);
    const conTto = ps.filter(p => (D.correlacion.por_patogeno[p.id] || []).length > 0).length;
    return `<tr>
      <td><strong>${esc(g.nombre)}</strong> <span class="badge">${esc(g.codigo)}</span></td>
      <td>${g.n_patogenos}</td>
      <td>${ps.filter(p => p.nivel === 1).length}</td>
      <td>${ps.filter(p => p.nivel === 2).length}</td>
      <td>${ps.filter(p => p.nivel === 3).length}</td>
      <td>${conTto} / ${ps.length}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6">Sin datos todavía.</td></tr>';
}

// ------------------------------------------------------------------ FICHA DE FÁRMACO
function badgesFarmaco(f) {
  const b = [`<span class="badge n${f.nivel}">${NIVEL_TXT[f.nivel] || ''}</span>`,
             `<span class="badge area">${esc(D.nombres_area[f.area] || f.area)}</span>`];
  if (f.subclase) b.push(`<span class="badge">${esc(f.subclase)}</span>`);
  return `<div class="badges">${b.join('')}</div>`;
}

function seccion(titulo, cuerpo) {
  if (!cuerpo) return '';
  return `<div class="sec"><h3>${esc(titulo)}</h3>${cuerpo}</div>`;
}

function listaUl(arr, clase) {
  if (!arr || !arr.length) return '';
  return `<ul${clase ? ` class="${clase}"` : ''}>${arr.map(x => `<li>${fmt(x)}</li>`).join('')}</ul>`;
}

function tablaIndicaciones(inds) {
  if (!inds || !inds.length) return '';
  return `<div class="table-wrap"><table>
    <thead><tr><th>Patología / indicación</th><th>Dosis</th><th>Posología</th><th>Vía</th><th>Nota clínica</th></tr></thead>
    <tbody>${inds.map(i => `<tr>
      <td><strong>${fmt(i.patologia)}</strong></td>
      <td>${fmt(i.dosis)}${i.dosis_objetivo ? `<div class="objetivo">Objetivo: ${fmt(i.dosis_objetivo)}</div>` : ''}</td>
      <td>${fmt(i.posologia)}</td><td>${fmt(i.via)}</td>
      <td style="color:var(--text-muted)">${fmt(i.nota || '—')}</td></tr>`).join('')}</tbody></table></div>`;
}

function bloqueEsquema(e) {
  if (!e) return '';
  const filas = [
    ['Inicio', e.inicio], ['Titulación / escalada', e.titulacion],
    ['Duración', e.duracion], ['Fin / retirada', e.fin],
    ['Vía', e.via], ['Monitorización', e.monitorizacion]
  ].filter(([, v]) => v);
  return `<dl class="kv">${filas.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${fmt(v)}</dd>`).join('')}</dl>`;
}

function bloqueFarmacocinetica(fc) {
  if (!fc) return '';
  const filas = [
    ['Absorción', fc.absorcion], ['Distribución', fc.distribucion], ['Metabolismo', fc.metabolismo],
    ['Eliminación', fc.eliminacion], ['Vida media', fc.vida_media],
    ['Ajuste renal', fc.ajuste_renal], ['Ajuste hepático', fc.ajuste_hepatico]
  ].filter(([, v]) => v);
  let html = `<dl class="kv">${filas.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${fmt(v)}</dd>`).join('')}</dl>`;
  const it = fc.interacciones || [];
  if (it.length) {
    const orden = { alta: 0, media: 1, baja: 2 };
    const ord = it.slice().sort((a, b) => (orden[a.gravedad] ?? 3) - (orden[b.gravedad] ?? 3));
    html += `<div class="table-wrap" style="margin-top:.6rem"><table>
      <thead><tr><th>Interacción con</th><th>Efecto</th><th>Gravedad</th><th>Manejo</th></tr></thead>
      <tbody>${ord.map(i => `<tr><td><strong>${fmt(i.con)}</strong></td><td>${fmt(i.efecto)}</td>
        <td class="grav-${esc(i.gravedad)}">${esc((i.gravedad || '').toUpperCase())}</td><td>${fmt(i.manejo)}</td></tr>`).join('')}
      </tbody></table></div>`;
  }
  return html;
}

function bloqueCorrelacionFarmaco(f) {
  const ids = D.correlacion.por_farmaco[f.id] || [];
  if (!ids.length) return '';
  const chips = ids.map(id => {
    const p = D.microbiologia.find(x => x.id === id);
    return p ? `<span class="chip micro" data-goto-micro="${esc(p.id)}">${esc(p.nombre)}</span>` : '';
  }).join('');
  return seccion('Patógenos cubiertos (correlación)', `<div class="chips">${chips}</div>`);
}

// Otros fármacos de la misma clase (mismo ámbito adulto/pediatría), para saltar entre ellos.
function hermanosDeClase(f) {
  const fuente = f.id.startsWith('PED-') ? D.pediatria : D.farmacos;
  return fuente.filter(x => x.clase === f.clase && x.id !== f.id)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

function bloqueDistintivo(f) {
  const herm = hermanosDeClase(f);
  if (!(f.vs_clase || []).length && !herm.length) return '';
  let html = '';
  if ((f.vs_clase || []).length) {
    html += `<div class="callout distintivo"><h4>Qué lo distingue dentro de su clase</h4>${listaUl(f.vs_clase)}</div>`;
  }
  if (herm.length) {
    html += `<div class="hermanos">Otros de su clase: ${herm.map(h =>
      `<span class="chip" data-goto-farmaco="${esc(h.id)}">${esc(h.nombre)}</span>`).join('')}
      <span class="chip" data-comparar-clase="${esc(f.clase)}" data-comparar-ambito="${f.id.startsWith('PED-') ? 'pediatria' : 'farmacos'}">⇄ Comparar la clase</span></div>`;
  }
  return `<div class="sec">${html}</div>`;
}

function bloquePatologiasDeFarmaco(f) {
  const ids = D.pat_por_farmaco[f.id] || [];
  if (!ids.length) return '';
  const chips = ids.map(id => {
    const p = D.patologias.find(x => x.id === id);
    return p ? `<span class="chip pat" data-goto-pat="${esc(p.id)}">${esc(p.nombre)}</span>` : '';
  }).join('');
  return seccion('Se usa en estas patologías (tratamiento por patología)', `<div class="chips">${chips}</div>`);
}

function botonRetorno() {
  if (!retorno) return '';
  const p = D.patologias.find(x => x.id === retorno);
  return p ? `<button class="btn-volver" data-volver-pat="${esc(p.id)}">← Volver a «${esc(p.nombre)}»</button>` : '';
}

function renderFichaFarmaco(f) {
  if (!f) return '<div class="vacio">Selecciona un fármaco de la lista.</div>';
  const ea = f.efectos_adversos || {};
  let html = botonRetorno() + `<div class="ficha-head">
    <h2>${esc(f.nombre)}</h2>
    <div class="clase">${esc(f.clase)}</div>
    ${f.sinonimos && f.sinonimos.length ? `<div class="sinonimos">${esc(f.sinonimos.join(' · '))}</div>` : ''}
    ${badgesFarmaco(f)}
  </div>`;

  html += bloqueDistintivo(f);
  html += seccion('Mecanismo de acción', `<p>${fmt(f.mecanismo)}</p>`);
  if (f.espectro) html += seccion('Espectro', `<p>${fmt(f.espectro)}</p>`);
  html += seccion('Indicaciones, dosis y posología', tablaIndicaciones(f.indicaciones));
  html += seccion('Esquema de tratamiento', bloqueEsquema(f.esquema));
  html += bloquePatologiasDeFarmaco(f);

  // Datos pediátricos, solo presentes en las fichas de la sección de Pediatría
  if (f.dosis_pediatrica_base) {
    const filas = [
      ['Dosis base', f.dosis_pediatrica_base], ['Dosis máxima', f.dosis_maxima],
      ['Edad mínima', f.edad_minima], ['Presentaciones', (f.presentaciones || []).join(' · ')]
    ].filter(([, v]) => v);
    let ped = `<dl class="kv">${filas.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${fmt(v)}</dd>`).join('')}</dl>`;
    if (f.franjas_edad && f.franjas_edad.length) {
      ped += `<div class="table-wrap" style="margin-top:.6rem"><table>
        <thead><tr><th>Franja de edad</th><th>Ajuste</th></tr></thead>
        <tbody>${f.franjas_edad.map(x => `<tr><td>${esc(x.franja)}</td><td>${esc(x.ajuste)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    if (f.peculiaridad_pediatrica) {
      ped += `<div class="callout" style="margin-top:.6rem"><strong>Lo que cambia respecto al adulto:</strong> ${fmt(f.peculiaridad_pediatrica)}</div>`;
    }
    html += seccion('Datos pediátricos', ped);
  }

  html += seccion('Farmacocinética e interacciones', bloqueFarmacocinetica(f.farmacocinetica));

  let adv = '';
  if ((ea.frecuentes || []).length) adv += `<p><strong>Frecuentes:</strong></p>${listaUl(ea.frecuentes)}`;
  if ((ea.graves || []).length) adv += `<div class="callout grave"><strong>Graves — obligan a actuar:</strong>${listaUl(ea.graves)}</div>`;
  html += seccion('Efectos adversos', adv);

  html += seccion('Contraindicaciones', `<div class="callout aviso">${listaUl(f.contraindicaciones)}</div>`);
  if (f.embarazo_lactancia) html += seccion('Embarazo y lactancia', `<p>${fmt(f.embarazo_lactancia)}</p>`);
  html += seccion('Particularidades del fármaco', `<div class="callout">${listaUl(f.perlas)}</div>`);
  html += bloqueCorrelacionFarmaco(f);
  html += `<div class="fuente">Fuente: ${esc(f.fuente)}</div>`;
  return html;
}

// ------------------------------------------------------------------ FICHA DE PATÓGENO
function renderFichaPatogeno(p) {
  if (!p) return '<div class="vacio">Selecciona un patógeno de la lista.</div>';
  let html = `<div class="ficha-head">
    <h2>${esc(p.nombre)}</h2>
    <div class="clase">${esc(p.clasificacion)}</div>
    <div class="badges">
      <span class="badge n${p.nivel}">${NIVEL_TXT[p.nivel] || ''}</span>
      <span class="badge area">${esc(D.nombres_grupo[p.grupo] || p.grupo)}</span>
    </div>
  </div>`;

  html += seccion('Morfología y tinción', `<p>${esc(p.morfologia_tincion)}</p>`);
  html += seccion('Mecanismo de patogenia', listaUl(p.mecanismo_patogenia));

  if ((p.patologias || []).length) {
    const cuerpo = p.patologias.map(pt => `
      <div class="corr-item">
        <div class="t">${esc(pt.cuadro)}</div>
        <div><strong>Clínica:</strong> ${esc(pt.clinica)}</div>
        ${pt.lesiones ? `<div><strong>Lesiones / hallazgos:</strong> ${esc(pt.lesiones)}</div>` : ''}
        ${pt.clave ? `<div class="d"><strong>Clave:</strong> ${esc(pt.clave)}</div>` : ''}
      </div>`).join('');
    html += seccion('Patologías que causa — clínica y lesiones', cuerpo);
  }

  html += seccion('Características clave', `<div class="callout">${listaUl(p.caracteristicas_clave)}</div>`);

  if (p.diagnostico) {
    const d = p.diagnostico;
    html += seccion('Diagnóstico', `<dl class="kv">
      <dt>Muestra</dt><dd>${esc(d.muestra)}</dd>
      <dt>Pruebas</dt><dd>${esc((d.pruebas || []).join(' · '))}</dd>
      ${d.claves ? `<dt>Claves</dt><dd>${esc(d.claves)}</dd>` : ''}
    </dl>`);
  }

  if (p.tratamiento) {
    const t = p.tratamiento;
    html += seccion('Tratamiento y sensibilidad', `<dl class="kv">
      <dt>De elección</dt><dd>${esc(t.eleccion)}</dd>
      ${t.alternativas ? `<dt>Alternativas</dt><dd>${esc(t.alternativas)}</dd>` : ''}
      <dt>Duración</dt><dd>${esc(t.duracion)}</dd>
      ${t.resistencias ? `<dt>Resistencias</dt><dd>${esc(t.resistencias)}</dd>` : ''}
      ${t.notas ? `<dt>Notas</dt><dd>${esc(t.notas)}</dd>` : ''}
    </dl>`);
  }

  const ids = D.correlacion.por_patogeno[p.id] || [];
  if (ids.length) {
    const chips = ids.map(id => {
      const f = porId(id);
      return f ? `<span class="chip" data-goto-farmaco="${esc(f.id)}">${esc(f.nombre)}</span>` : '';
    }).join('');
    html += seccion('Fármacos activos (correlación)', `<div class="chips">${chips}</div>`);
  }

  html += `<div class="fuente">Fuente: ${esc(p.fuente)}</div>`;
  return html;
}

// ------------------------------------------------------------------ LISTADOS CON FILTRO
function pintarLista(cont, items, agruparPor, selId, onClick) {
  if (!items.length) {
    cont.innerHTML = '<div class="vacio" style="padding:1.5rem;text-align:center;color:var(--text-muted)">Sin resultados.</div>';
    return;
  }
  let html = '';
  let ultimoGrupo = null;
  for (const it of items) {
    const g = agruparPor(it);
    if (g !== ultimoGrupo) { html += `<div class="grupo-hdr">${esc(g)}</div>`; ultimoGrupo = g; }
    html += `<div class="item${it.id === selId ? ' sel' : ''}" data-id="${esc(it.id)}">
      <div class="n">${esc(it.nombre)}</div>
      <div class="c">${esc(it.clase || it.clasificacion || '')}</div>
    </div>`;
  }
  cont.innerHTML = html;
  cont.querySelectorAll('.item').forEach(el => el.addEventListener('click', () => onClick(el.dataset.id)));
}

function opcionesSelect(el, pares, primera) {
  el.innerHTML = (primera ? `<option value="todos">${primera}</option>` : '') +
    pares.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('');
}

// --- Vademécum / Pediatría comparten motor ---
function crearVistaFarmacos(cfg) {
  const fuente = () => D[cfg.fuente];
  const listaEl = $(cfg.lista), fichaEl = $(cfg.ficha);
  const areaEl = $(cfg.area), nivelEl = $(cfg.nivel), filtroEl = $(cfg.filtro);
  const claseEl = cfg.clase ? $(cfg.clase) : null;

  function areasDisponibles() {
    return [...new Set(fuente().map(f => f.area))].sort()
      .map(c => [c, D.nombres_area[c] || c]);
  }

  function refrescarClases() {
    if (!claseEl) return;
    const a = areaEl.value;
    const clases = [...new Set(fuente().filter(f => a === 'todos' || f.area === a).map(f => f.clase))].sort();
    opcionesSelect(claseEl, clases.map(c => [c, c]), 'Todas las clases');
  }

  function filtrar() {
    const a = areaEl.value, n = nivelEl.value, q = (filtroEl.value || '').toLowerCase().trim();
    const c = claseEl ? claseEl.value : 'todos';
    return fuente().filter(f =>
      (a === 'todos' || f.area === a) &&
      (c === 'todos' || f.clase === c) &&
      (n === 'todos' || String(f.nivel) === n) &&
      (!q || f.nombre.toLowerCase().includes(q) || (f.clase || '').toLowerCase().includes(q) ||
        (f.indicaciones || []).some(i => i.patologia.toLowerCase().includes(q)))
    ).sort((x, y) => x.area.localeCompare(y.area) || x.nombre.localeCompare(y.nombre, 'es'));
  }

  function render() {
    const items = filtrar();
    if (sel[cfg.key] && !items.some(i => i.id === sel[cfg.key])) sel[cfg.key] = null;
    pintarLista(listaEl, items, f => D.nombres_area[f.area] || f.area, sel[cfg.key], id => {
      sel[cfg.key] = id;
      render();
    });
    fichaEl.innerHTML = renderFichaFarmaco(fuente().find(f => f.id === sel[cfg.key]));
    engancharChips(fichaEl);
  }

  opcionesSelect(areaEl, areasDisponibles(), 'Todas las áreas');
  refrescarClases();
  areaEl.addEventListener('change', () => { refrescarClases(); render(); });
  if (claseEl) claseEl.addEventListener('change', render);
  nivelEl.addEventListener('change', render);
  filtroEl.addEventListener('input', render);
  return { render, seleccionar: id => { sel[cfg.key] = id; areaEl.value = 'todos'; if (claseEl) { refrescarClases(); claseEl.value = 'todos'; } nivelEl.value = 'todos'; filtroEl.value = ''; render(); } };
}

let vistaVademecum, vistaPediatria;

// --- Microbiología ---
function renderMicro() {
  const g = $('mic-grupo').value, n = $('mic-nivel').value, q = ($('mic-filtro').value || '').toLowerCase().trim();
  const items = D.microbiologia.filter(p =>
    (g === 'todos' || p.grupo === g) &&
    (n === 'todos' || String(p.nivel) === n) &&
    (!q || p.nombre.toLowerCase().includes(q) || (p.clasificacion || '').toLowerCase().includes(q) ||
      (p.patologias || []).some(x => x.cuadro.toLowerCase().includes(q)))
  ).sort((x, y) => x.grupo.localeCompare(y.grupo) || x.nombre.localeCompare(y.nombre, 'es'));

  if (sel.microbiologia && !items.some(i => i.id === sel.microbiologia)) sel.microbiologia = null;
  pintarLista($('mic-lista'), items, p => D.nombres_grupo[p.grupo] || p.grupo, sel.microbiologia, id => {
    sel.microbiologia = id;
    renderMicro();
  });
  $('mic-ficha').innerHTML = renderFichaPatogeno(D.microbiologia.find(p => p.id === sel.microbiologia));
  engancharChips($('mic-ficha'));
}

function initMicro() {
  const grupos = [...new Set(D.microbiologia.map(p => p.grupo))].sort().map(g => [g, D.nombres_grupo[g] || g]);
  opcionesSelect($('mic-grupo'), grupos, 'Todos los grupos');
  ['mic-grupo', 'mic-nivel'].forEach(id => $(id).addEventListener('change', renderMicro));
  $('mic-filtro').addEventListener('input', renderMicro);
}

// Navegación cruzada desde los chips de correlación
function engancharChips(cont) {
  cont.querySelectorAll('[data-goto-micro]').forEach(el => el.addEventListener('click', () => irAPatogeno(el.dataset.gotoMicro)));
  cont.querySelectorAll('[data-goto-farmaco]').forEach(el => el.addEventListener('click', () => irAFarmaco(el.dataset.gotoFarmaco, { conservarRetorno: true })));
  cont.querySelectorAll('[data-goto-pat]').forEach(el => el.addEventListener('click', () => irAPatologia(el.dataset.gotoPat)));
  cont.querySelectorAll('[data-volver-pat]').forEach(el => el.addEventListener('click', () => irAPatologia(el.dataset.volverPat)));
  cont.querySelectorAll('[data-comparar-clase]').forEach(el => el.addEventListener('click', () => irAComparar(el.dataset.compararAmbito, el.dataset.compararClase)));
}

function irAPatogeno(id) {
  sel.microbiologia = id;
  $('mic-grupo').value = 'todos'; $('mic-nivel').value = 'todos'; $('mic-filtro').value = '';
  renderMicro();
  setView('microbiologia');
  window.scrollTo(0, 0);
}

function irAFarmaco(id, { conservarRetorno = false } = {}) {
  if (!conservarRetorno) retorno = null;
  const enPed = D.pediatria.some(f => f.id === id);
  if (enPed) { vistaPediatria.seleccionar(id); setView('pediatria', { conservarRetorno: true }); }
  else { vistaVademecum.seleccionar(id); setView('vademecum', { conservarRetorno: true }); }
  window.scrollTo(0, 0);
}

function irAPatologia(id) {
  sel.patologias = id;
  $('pat-area').value = 'todos'; $('pat-pob').value = 'todos'; $('pat-filtro').value = '';
  renderPatologias();
  setView('patologias');
  window.scrollTo(0, 0);
}

function irAComparar(ambito, clase) {
  // Área «todas»: hay clases repartidas entre áreas (glucocorticoides, iSGLT2, ARM).
  $('cmp-ambito').value = ambito;
  $('cmp-ambito').dispatchEvent(new Event('change'));
  $('cmp-area').value = 'todos';
  $('cmp-area').dispatchEvent(new Event('change'));
  $('cmp-clase').value = clase;
  renderComparar();
  setView('comparar');
  window.scrollTo(0, 0);
}

// ------------------------------------------------------------------ CORRELACIÓN
function renderCorrelacion() {
  const modo = $('corr-modo').value;
  const q = ($('corr-filtro').value || '').toLowerCase().trim();
  const esPat = modo === 'patogeno';

  $('corr-titulo-izq').textContent = esPat ? 'Patógenos' : 'Antimicrobianos';
  const base = esPat
    ? D.microbiologia.filter(p => (D.correlacion.por_patogeno[p.id] || []).length)
    : D.farmacos.concat(D.pediatria).filter(f => (D.correlacion.por_farmaco[f.id] || []).length);

  const items = base
    .filter(x => !q || x.nombre.toLowerCase().includes(q))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  if (sel.corr && !items.some(i => i.id === sel.corr)) sel.corr = null;
  if (!sel.corr && items.length) sel.corr = items[0].id;

  $('corr-lista').innerHTML = items.length ? items.map(x => `
    <div class="corr-item" data-id="${esc(x.id)}" style="cursor:pointer${x.id === sel.corr ? ';background:var(--primary-soft)' : ''}">
      <div class="t">${esc(x.nombre)}</div>
      <div class="d">${esc(x.clase || x.clasificacion || '')}</div>
    </div>`).join('')
    : '<p style="color:var(--text-muted)">Aún no hay elementos con correlación registrada.</p>';

  $('corr-lista').querySelectorAll('.corr-item').forEach(el => el.addEventListener('click', () => {
    sel.corr = el.dataset.id;
    renderCorrelacion();
  }));

  const actual = porId(sel.corr);
  if (!actual) {
    $('corr-titulo-der').textContent = 'Selecciona un elemento';
    $('corr-detalle').innerHTML = '';
    return;
  }

  if (esPatogeno(actual)) {
    $('corr-titulo-der').textContent = `${actual.nombre} → antimicrobianos`;
    const ids = D.correlacion.por_patogeno[actual.id] || [];
    $('corr-detalle').innerHTML = `
      <p class="d" style="color:var(--text-muted)">${esc((actual.tratamiento || {}).eleccion || '')}</p>
      ${ids.map(id => {
        const f = porId(id);
        if (!f) return '';
        return `<div class="corr-item">
          <div class="t"><span class="chip" data-goto-farmaco="${esc(f.id)}">${esc(f.nombre)}</span></div>
          <div class="d">${esc(f.clase)}</div>
          ${f.espectro ? `<div class="d">${esc(f.espectro)}</div>` : ''}
        </div>`;
      }).join('')}`;
  } else {
    $('corr-titulo-der').textContent = `${actual.nombre} → patógenos cubiertos`;
    const ids = D.correlacion.por_farmaco[actual.id] || [];
    $('corr-detalle').innerHTML = `
      <p class="d" style="color:var(--text-muted)">${esc(actual.espectro || '')}</p>
      ${ids.map(id => {
        const p = D.microbiologia.find(x => x.id === id);
        if (!p) return '';
        return `<div class="corr-item">
          <div class="t"><span class="chip micro" data-goto-micro="${esc(p.id)}">${esc(p.nombre)}</span></div>
          <div class="d">${esc(p.clasificacion)}</div>
          <div class="d">${esc((p.patologias || []).map(x => x.cuadro).join(' · '))}</div>
        </div>`;
      }).join('')}`;
  }
  engancharChips($('corr-detalle'));
}

function initCorrelacion() {
  $('corr-modo').addEventListener('change', () => { sel.corr = null; renderCorrelacion(); });
  $('corr-filtro').addEventListener('input', renderCorrelacion);
}

// ------------------------------------------------------------------ COMPARAR
function renderComparar() {
  const fuente = D[$('cmp-ambito').value];
  const area = $('cmp-area').value, clase = $('cmp-clase').value;
  const items = fuente.filter(f => (area === 'todos' || f.area === area) && (clase === 'todos' || f.clase === clase))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  if (!items.length) { $('cmp-tabla').innerHTML = '<p style="padding:1rem;color:var(--text-muted)">Sin fármacos para esta selección.</p>'; return; }
  if (items.length > 8) {
    $('cmp-tabla').innerHTML = `<p style="padding:1rem;color:var(--text-muted)">${items.length} fármacos en esta selección — acota por clase para una comparativa legible.</p>`;
    return;
  }

  const filas = [
    ['Qué lo distingue', f => (f.vs_clase || []).map(x => '• ' + x).join('\n') || '—'],
    ['Clase', f => f.clase + (f.subclase ? ` (${f.subclase})` : '')],
    ['Nivel', f => NIVEL_TXT[f.nivel] || ''],
    ['Mecanismo', f => f.mecanismo],
    ['Espectro', f => f.espectro || '—'],
    ['Indicación principal', f => (f.indicaciones || []).map(i => `${i.patologia}: ${i.dosis} (${i.posologia}, ${i.via})`).join(' | ')],
    ['Inicio', f => (f.esquema || {}).inicio],
    ['Duración', f => (f.esquema || {}).duracion],
    ['Retirada', f => (f.esquema || {}).fin],
    ['Vida media', f => (f.farmacocinetica || {}).vida_media],
    ['Ajuste renal', f => (f.farmacocinetica || {}).ajuste_renal],
    ['Ajuste hepático', f => (f.farmacocinetica || {}).ajuste_hepatico],
    ['Interacciones graves', f => ((f.farmacocinetica || {}).interacciones || []).filter(i => i.gravedad === 'alta').map(i => i.con).join(' · ') || '—'],
    ['Adversos graves', f => ((f.efectos_adversos || {}).graves || []).join(' · ')],
    ['Contraindicaciones', f => (f.contraindicaciones || []).join(' · ')],
    ['Particularidad', f => (f.perlas || []).join(' · ')]
  ];
  if ($('cmp-ambito').value === 'pediatria') {
    filas.splice(5, 0, ['Dosis pediátrica', f => f.dosis_pediatrica_base || '—'],
                       ['Dosis máxima', f => f.dosis_maxima || '—'],
                       ['Edad mínima', f => f.edad_minima || '—']);
  }

  $('cmp-tabla').innerHTML = `<table>
    <thead><tr><th></th>${items.map(f => `<th><span class="chip" data-goto-farmaco="${esc(f.id)}">${esc(f.nombre)}</span></th>`).join('')}</tr></thead>
    <tbody>${filas.map(([lbl, fn]) => `<tr${lbl === 'Qué lo distingue' ? ' class="fila-distintivo"' : ''}><td>${esc(lbl)}</td>${items.map(f => `<td>${fmt(fn(f) || '—').replace(/\n/g, '<br>')}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
  engancharChips($('cmp-tabla'));
}

function initComparar() {
  function refrescar() {
    const fuente = D[$('cmp-ambito').value];
    const areas = [...new Set(fuente.map(f => f.area))].sort().map(c => [c, D.nombres_area[c] || c]);
    const areaPrev = $('cmp-area').value;
    opcionesSelect($('cmp-area'), areas, 'Todas las áreas');
    if (areas.some(a => a[0] === areaPrev)) $('cmp-area').value = areaPrev;
    const a = $('cmp-area').value;
    const clases = [...new Set(fuente.filter(f => a === 'todos' || f.area === a).map(f => f.clase))].sort();
    opcionesSelect($('cmp-clase'), clases.map(c => [c, c]), 'Todas las clases');
    renderComparar();
  }
  $('cmp-ambito').addEventListener('change', refrescar);
  $('cmp-area').addEventListener('change', refrescar);
  $('cmp-clase').addEventListener('change', renderComparar);
  refrescar();
}

// ------------------------------------------------------------------ PATOLOGÍAS
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Texto en el que se busca una patología: nombre, sinónimos, resumen y los fármacos que la tratan,
// para que buscar «amoxicilina» devuelva todas las patologías donde se usa.
function textoPatologia(p) {
  if (!p._txt) {
    p._txt = norm([p.nombre, ...(p.sinonimos || []), p.resumen,
      ...(p.escenarios || []).flatMap(e => [e.titulo, ...(e.farmacos || []).map(f => f.nombre)])].join(' | '));
  }
  return p._txt;
}

const esPed = e => /pedi|niñ|lactante|neonat/i.test(e.poblacion || '');

function celdaFarmacoPat(x) {
  const f = x.ref ? porId(x.ref) : null;
  const nombre = f
    ? `<span class="chip" data-goto-farmaco="${esc(f.id)}" title="Abrir la ficha completa de ${esc(f.nombre)}">${esc(x.nombre)}</span>`
    : `<span class="sin-ficha">${esc(x.nombre)}</span>`;
  return nombre + (x.alternativa ? `<span class="alt">${fmt(x.alternativa)}</span>` : '');
}

function renderFichaPatologia(p) {
  if (!p) return '<div class="vacio">Selecciona una patología de la lista.</div>';
  let html = `<div class="ficha-head">
    <h2>${esc(p.nombre)}</h2>
    ${p.sinonimos && p.sinonimos.length ? `<div class="sinonimos">${esc(p.sinonimos.join(' · '))}</div>` : ''}
    <div class="badges"><span class="badge area">${esc(D.nombres_area[p.area] || p.area)}</span></div>
  </div>`;
  html += seccion('Cuándo y cómo tratar', `<p>${fmt(p.resumen)}</p>${p.objetivo ? `<div class="callout pat-objetivo"><strong>Objetivo terapéutico:</strong> ${fmt(p.objetivo)}</div>` : ''}`);

  const escs = (p.escenarios || []).map(e => `
    <div class="escenario">
      <div class="escenario-hdr"><h4>${esc(e.titulo)}</h4>${e.poblacion ? `<span class="badge${esPed(e) ? ' ped' : ''}">${esc(e.poblacion)}</span>` : ''}</div>
      ${e.nota ? `<p class="nota-esc">${fmt(e.nota)}</p>` : ''}
      <div class="table-wrap"><table class="tto">
        <thead><tr><th>Fármaco</th><th>Dosis</th><th>Vía</th><th>Cada cuánto</th><th>Duración</th><th>Nota</th></tr></thead>
        <tbody>${(e.farmacos || []).map(x => `<tr>
          <td>${celdaFarmacoPat(x)}</td>
          <td class="dosis">${fmt(x.dosis)}</td>
          <td>${esc(x.via)}</td>
          <td class="intervalo">${fmt(x.intervalo)}</td>
          <td class="duracion">${fmt(x.duracion)}</td>
          <td style="color:var(--text-muted)">${fmt(x.nota || '—')}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`).join('');
  html += seccion('Esquema farmacológico', escs);

  if ((p.no_farmacologico || []).length) html += seccion('Medidas no farmacológicas y de soporte', listaUl(p.no_farmacologico));
  if ((p.claves || []).length) html += seccion('Claves y errores frecuentes', `<div class="callout aviso">${listaUl(p.claves)}</div>`);
  html += `<div class="fuente">Fuente: ${esc(p.fuente)}</div>`;
  return html;
}

function renderPatologias() {
  const a = $('pat-area').value, pob = $('pat-pob').value, q = norm($('pat-filtro').value).trim();
  const items = D.patologias.filter(p =>
    (a === 'todos' || p.area === a) &&
    (pob === 'todos' || (p.escenarios || []).some(e => pob === 'pediatria' ? esPed(e) : !esPed(e))) &&
    (!q || textoPatologia(p).includes(q))
  ).sort((x, y) => (D.nombres_area[x.area] || x.area).localeCompare(D.nombres_area[y.area] || y.area, 'es') || x.nombre.localeCompare(y.nombre, 'es'));

  if (sel.patologias && !items.some(i => i.id === sel.patologias)) sel.patologias = null;
  const cont = $('pat-lista');
  if (!items.length) {
    cont.innerHTML = '<div class="vacio" style="padding:1.5rem;text-align:center;color:var(--text-muted)">Sin resultados.</div>';
  } else {
    let html = '', ultimo = null;
    for (const p of items) {
      const g = D.nombres_area[p.area] || p.area;
      if (g !== ultimo) { html += `<div class="grupo-hdr">${esc(g)}</div>`; ultimo = g; }
      const n = new Set((p.escenarios || []).flatMap(e => (e.farmacos || []).map(f => f.nombre))).size;
      html += `<div class="item${p.id === sel.patologias ? ' sel' : ''}" data-id="${esc(p.id)}">
        <div class="n">${esc(p.nombre)}</div>
        <div class="c">${esc((p.sinonimos || []).slice(0, 2).join(' · '))}${(p.sinonimos || []).length ? ' · ' : ''}<span class="uso">${n} fármaco${n === 1 ? '' : 's'}</span></div>
      </div>`;
    }
    cont.innerHTML = html;
    cont.querySelectorAll('.item').forEach(el => el.addEventListener('click', () => {
      sel.patologias = el.dataset.id;
      renderPatologias();
    }));
  }
  const actual = D.patologias.find(p => p.id === sel.patologias);
  $('pat-ficha').innerHTML = renderFichaPatologia(actual);
  // Al abrir un fármaco desde aquí, su ficha ofrece volver a esta patología.
  $('pat-ficha').querySelectorAll('[data-goto-farmaco]').forEach(el => el.addEventListener('click', () => {
    retorno = actual ? actual.id : null;
    irAFarmaco(el.dataset.gotoFarmaco, { conservarRetorno: true });
  }));
}

function initPatologias() {
  const areas = [...new Set(D.patologias.map(p => p.area))]
    .map(c => [c, D.nombres_area[c] || c]).sort((x, y) => x[1].localeCompare(y[1], 'es'));
  opcionesSelect($('pat-area'), areas, 'Todas las áreas');
  ['pat-area', 'pat-pob'].forEach(id => $(id).addEventListener('change', renderPatologias));
  $('pat-filtro').addEventListener('input', renderPatologias);
}

// ------------------------------------------------------------------ BUSCADOR GLOBAL
function initBuscador() {
  const input = $('busqueda-input'), cont = $('busqueda-resultados');

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (q.length < 2) { cont.classList.add('hidden'); return; }

    const res = [];
    const push = (tipo, nombre, extra, id, ir) => res.push({ tipo, nombre, extra, id, ir });

    const qn = norm(q);
    for (const p of D.patologias) {
      if (textoPatologia(p).includes(qn)) {
        push('Patología', p.nombre, (p.sinonimos || []).join(' · ') || (D.nombres_area[p.area] || p.area), p.id, () => irAPatologia(p.id));
      }
    }
    for (const f of D.farmacos) {
      if (f.nombre.toLowerCase().includes(q) || (f.clase || '').toLowerCase().includes(q) ||
          (f.indicaciones || []).some(i => i.patologia.toLowerCase().includes(q))) {
        push('Fármaco', f.nombre, f.clase, f.id, () => irAFarmaco(f.id));
      }
    }
    for (const f of D.pediatria) {
      if (f.nombre.toLowerCase().includes(q) || (f.clase || '').toLowerCase().includes(q)) {
        push('Pediatría', f.nombre, f.clase, f.id, () => irAFarmaco(f.id));
      }
    }
    for (const p of D.microbiologia) {
      if (p.nombre.toLowerCase().includes(q) || (p.clasificacion || '').toLowerCase().includes(q) ||
          (p.patologias || []).some(x => x.cuadro.toLowerCase().includes(q))) {
        push('Patógeno', p.nombre, (p.patologias || []).map(x => x.cuadro).join(' · '), p.id, () => irAPatogeno(p.id));
      }
    }

    if (!res.length) {
      cont.innerHTML = '<div class="res"><div class="tipo">Sin resultados</div></div>';
      cont.classList.remove('hidden');
      return;
    }
    cont.innerHTML = res.slice(0, 25).map((r, i) =>
      `<div class="res" data-i="${i}"><div class="tipo">${esc(r.tipo)}</div><div><strong>${esc(r.nombre)}</strong> — ${esc(r.extra || '')}</div></div>`).join('');
    cont.querySelectorAll('.res[data-i]').forEach(el => el.addEventListener('click', () => {
      res[+el.dataset.i].ir();
      cont.classList.add('hidden');
      input.value = '';
    }));
    cont.classList.remove('hidden');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.busqueda-global')) cont.classList.add('hidden');
  });
}

// ------------------------------------------------------------------ ARRANQUE
function init() {
  const src = window.FARMACO_HUB_DATA;
  if (!src) {
    $('loading').textContent = 'Error: falta hub/data.js. Ejecuta «node scripts/generar-hub-data.js».';
    return;
  }
  Object.assign(D, src);

  initNav();
  initTema();
  renderPanel();

  vistaVademecum = crearVistaFarmacos({
    key: 'vademecum', fuente: 'farmacos', lista: 'vad-lista', ficha: 'vad-ficha',
    area: 'vad-area', clase: 'vad-clase', nivel: 'vad-nivel', filtro: 'vad-filtro'
  });
  vistaPediatria = crearVistaFarmacos({
    key: 'pediatria', fuente: 'pediatria', lista: 'ped-lista', ficha: 'ped-ficha',
    area: 'ped-area', clase: null, nivel: 'ped-nivel', filtro: 'ped-filtro'
  });
  vistaVademecum.render();
  vistaPediatria.render();

  initPatologias();
  renderPatologias();
  initMicro();
  renderMicro();
  initCorrelacion();
  renderCorrelacion();
  initComparar();
  initBuscador();

  $('loading').classList.add('hidden');
  setView('panel');
}

document.addEventListener('DOMContentLoaded', init);
