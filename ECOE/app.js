// Simulacro de estaciones ECOE: 4 estaciones de 8 minutos, cada una con una patología distinta.
// Nada se guarda: todo vive en memoria y se borra al cerrar o recargar la página.
(function () {
  const D = window.ECOE, M = window.Motor;
  const MIN = (+new URLSearchParams(location.search).get('seg') || 8 * 60) * 1000; // ?seg=N solo para probar
  const EST = [
    { n: 1, c: 's1', t: 'Anamnesis e historia clínica', corto: 'Anamnesis', d: 'Interrogue al paciente en español y redacte la historia clínica.', prio: 'Prioriza temas que se definen por el interrogatorio.' },
    { n: 2, c: 's2', t: 'Laboratorio y diagnósticos', corto: 'Laboratorio', d: 'Interprete el laboratorio: sindromáticos, diferenciales y presuntivo.', prio: 'Prioriza temas con laboratorio característico.' },
    { n: 3, c: 's3', t: 'Diagnóstico y tratamiento', corto: 'Tratamiento', d: 'Comunique el diagnóstico e indique el esquema de tratamiento.', prio: 'Prioriza temas con esquema terapéutico definido.' },
    { n: 4, c: 's4', t: 'Examen físico', corto: 'Examen', d: 'Describa en orden el examen físico completo.', prio: 'Prioriza temas con hallazgos y maniobras propias.' },
  ];
  // Afinidad de cada tema por estación [anamnesis, laboratorio, tratamiento, examen físico], de 1 (poco) a 3 (mucho).
  // El sorteo es aleatorio pero ponderado (peso = afinidad²): un tema de afinidad 3 sale ~9 veces más que uno de afinidad 1.
  const AF = {
    'Enfermedad celíaca': [3, 3, 2, 1],
    'Cirrosis hepática': [2, 2, 2, 3],
    'Hipertensión portal': [2, 1, 3, 3],
    'Anemias': [2, 3, 2, 1],
    'Mieloma múltiple': [1, 3, 1, 1],
    'Enfermedad suprarrenal': [2, 3, 3, 2],
    'Patología tiroidea': [3, 3, 2, 3],
    'Diabetes mellitus': [3, 3, 3, 2],
    'Meningitis': [2, 3, 3, 3],
    'Arbovirosis (dengue y chikungunya)': [3, 2, 3, 2],
    'Síndrome febril prolongado': [3, 2, 2, 2],
    'Infecciones de piel y partes blandas': [2, 1, 3, 3],
    'Artritis reumatoidea': [3, 2, 2, 3],
    'Lupus eritematoso sistémico': [3, 3, 2, 2],
    'Osteoporosis': [3, 2, 3, 1],
    'Monoartritis aguda': [2, 3, 2, 3],
  };
  const TEMAS = [...new Set(D.casos.map(c => c.tema))];
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app'), next = $('#next'), timerEl = $('#timer'), tt = $('#tt'), stepsEl = $('#steps'), tbar = $('#tbar');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^»\s*/, '');
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const I = {
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    flip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/></svg>',
    dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7M5 10v10h14V10"/></svg>',
  };

  // ---------- tema claro / oscuro (sin guardar) ----------
  $('#theme').onclick = () => {
    const root = document.documentElement;
    const oscuro = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = oscuro ? 'light' : 'dark';
  };

  // ---------- sorteo ponderado y sin repetición en la sesión ----------
  const vistos = [new Set(), new Set(), new Set(), new Set()];   // claves ya mostradas en cada estación (solo en memoria)
  const elegidos = ['', '', '', ''];
  let nSim = 0;
  // Candidatos de un tema para una estación. Estación 3: un candidato por esquema; estación 4: uno por tema.
  function candidatos(i, tema) {
    const cs = D.casos.filter(c => c.tema === tema);
    if (i <= 1) return cs.map(c => ({ key: c.id, caso: c }));
    if (i === 2) { const u = {}; cs.forEach(c => { u[c.esq] = u[c.esq] || c; }); return Object.values(u).map(c => ({ key: 'esq:' + c.esq, caso: c })); }
    return [{ key: 'ex:' + cs[0].ex, caso: cs[0] }];
  }
  const libres = (i, tema, salvo) => candidatos(i, tema).filter(x => !vistos[i].has(x.key) && x.key !== salvo);
  function ponderado(temas, i) {
    const w = temas.map(t => Math.pow((AF[t] || [2, 2, 2, 2])[i], 2));
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let k = 0; k < temas.length; k++) { r -= w[k]; if (r <= 0) return temas[k]; }
    return temas[temas.length - 1];
  }
  // Elige tema y caso para la estación i, sin repetir temas del simulacro actual ni casos ya vistos en esa estación.
  function elegir(i, ocupados, fijo, salvo) {
    let tema = fijo, lista;
    if (tema) {
      lista = libres(i, tema, salvo);
      if (!lista.length) { candidatos(i, tema).forEach(x => x.key !== salvo && vistos[i].delete(x.key)); lista = libres(i, tema, salvo); }
      if (!lista.length) tema = '';   // el tema elegido no tiene otro caso: se sortea otro
    }
    if (!tema) {
      let pool = TEMAS.filter(t => !ocupados.has(t) && libres(i, t, salvo).length);
      if (!pool.length) { vistos[i] = new Set(salvo ? [salvo] : []); pool = TEMAS.filter(t => !ocupados.has(t) && libres(i, t, salvo).length); }
      tema = ponderado(pool, i);
      lista = libres(i, tema, salvo);
    }
    const x = pick(lista);
    vistos[i].add(x.key);
    return { tema, key: x.key, caso: x.caso };
  }
  function armar(i, sel) {
    const st = { tema: sel.tema, key: sel.key, caso: sel.caso, r: {} };
    if (i === 0) st.log = [];
    if (i === 2) st.esq = D.esquemas[sel.caso.esq];
    if (i === 3) st.ex = D.examen[sel.caso.ex];
    return st;
  }
  function sortear() {
    const est = [], ocupados = new Set();
    elegidos.forEach(t => t && ocupados.add(t));
    const orden = [0, 1, 2, 3].sort((a, b) => (elegidos[b] ? 1 : 0) - (elegidos[a] ? 1 : 0) || Math.random() - .5);
    for (const i of orden) {
      const sel = elegir(i, new Set([...ocupados].filter(t => t !== elegidos[i])), elegidos[i]);
      ocupados.add(sel.tema);
      est[i] = armar(i, sel);
    }
    nSim++;
    return { i: 0, est };
  }
  function otroCaso() {
    const i = S.i, actual = S.est[i];
    const ocupados = new Set(S.est.filter((_, k) => k !== i).map(s => s.tema));
    S.est[i] = armar(i, elegir(i, ocupados, '', actual.key));
    estacion();
    toast('Nuevo caso', 'ok');
  }

  // ---------- estado, pasos y cronómetro ----------
  let S = null, tick = null, pendiente = null, fin = 0, avanzando = false;
  function pasos(i) {
    stepsEl.innerHTML = EST.map((e, k) => `<li class="${k === i ? 'on' : k < i ? 'done' : ''}" style="--c:var(--${e.c})"><i>${k < i ? '✓' : e.n}</i><span>${esc(e.corto)}</span></li>`).join('');
  }
  function pararReloj() { clearInterval(tick); tick = null; clearTimeout(pendiente); pendiente = null; }
  function reloj() { timerEl.className = 'clock idle mono'; tt.textContent = fmt(MIN); tbar.style.width = '0'; }
  function arrancar() {
    fin = Date.now() + MIN;
    S.est[S.i].inicio = Date.now();
    const upd = () => {
      const r = fin - Date.now();
      tt.textContent = fmt(r);
      tbar.style.width = Math.min(100, (1 - r / MIN) * 100) + '%';
      timerEl.className = 'clock mono ' + (r <= 0 ? 'over' : r <= 60000 ? 'warn' : 'run');
      if (r <= 0) { pararReloj(); beep(); toast('Se terminó el tiempo'); pendiente = setTimeout(() => avanzar(true), 1400); }
    };
    upd(); tick = setInterval(upd, 250);
  }
  function beep() {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      [0, .35, .7].forEach(t => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
        g.gain.setValueAtTime(.0001, ac.currentTime + t); g.gain.exponentialRampToValueAtTime(.25, ac.currentTime + t + .02);
        g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + t + .25); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + .3); });
    } catch (e) { /* sin audio */ }
  }
  function toast(t, tipo) {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = t;
    if (tipo === 'ok') d.style.background = 'var(--text)', d.style.color = 'var(--bg)';
    document.body.appendChild(d); setTimeout(() => d.remove(), 1800);
  }
  const acento = c => { document.body.style.setProperty('--c', `var(--${c})`); };

  // ---------- inicio ----------
  function inicio() {
    pararReloj(); S = null; reloj(); pasos(-1); next.hidden = true; document.body.style.removeProperty('--c');
    const opts = '<option value="">Aleatorio</option>' + TEMAS.map(t => `<option>${esc(t)}</option>`).join('');
    const pasosHow = [
      ['Toque la tarjeta', 'para darla vuelta: aparece el caso y empiezan los <b>8 minutos</b>.'],
      ['Responda', 'en los campos, sin pistas. En la anamnesis, pregúntele al paciente en español.'],
      ['Avance', 'con <b>Próxima estación</b> o al terminar el tiempo. Al final, compare con la referencia.'],
    ];
    app.innerHTML = `
      <section class="hero">
        <div>
          <span class="eyebrow"><b></b>Final de Clínica Médica II · 16 temas</span>
          <h1>Simulacro de las 4 estaciones</h1>
          <p>Cada estación trae una patología distinta. Los temas se reparten según lo que más se evalúa en cada estación, sin repetir casos ya vistos mientras la página siga abierta.</p>
        </div>
        <ol class="how">${pasosHow.map((p, k) => `<li><span>${k + 1}</span><span><b>${p[0]}</b> ${p[1]}</span></li>`).join('')}</ol>
      </section>
      <div class="tiles">${EST.map(e => `<div class="tile" style="--c:var(--${e.c})"><span class="n">Estación ${e.n}</span><b>${esc(e.t)}</b><p>${esc(e.d)}</p><div class="prio">${esc(e.prio)}</div></div>`).join('')}</div>
      <details class="pick"><summary>${I.chev.replace('class="chev"', '')}Elegir los temas <small>(opcional; por defecto, aleatorio)</small></summary>
        <div class="pick-grid">${EST.map((e, i) => `<label>Estación ${e.n} · ${esc(e.corto)}<select data-i="${i}">${opts}</select></label>`).join('')}</div>
      </details>
      <div class="start">
        <button class="btn" id="go">${nSim ? 'Nuevo simulacro' : 'Comenzar simulacro'} ${I.next}</button>
        <p class="note">Nada se guarda: lo escrito existe solo mientras la página esté abierta.${nSim ? ` Simulacros en esta sesión: <b>${nSim}</b>.` : ''}</p>
      </div>`;
    app.querySelectorAll('select').forEach(s => { s.value = elegidos[+s.dataset.i]; s.onchange = () => { elegidos[+s.dataset.i] = s.value; }; });
    $('#go').onclick = () => { S = sortear(); estacion(); };
    window.scrollTo(0, 0);
  }

  // ---------- estación ----------
  function estacion() {
    pararReloj(); reloj(); avanzando = false;
    const e = EST[S.i];
    pasos(S.i); acento(e.c);
    next.innerHTML = (S.i < 3 ? 'Próxima estación' : 'Finalizar') + ` <small>${S.i + 1}/4</small>` + I.next;
    next.hidden = false;
    app.innerHTML = `
      <div class="st-bar">
        <div><span class="kicker">Estación ${e.n} de 4</span><h1>${esc(e.t)}</h1><p>${esc(e.d)}</p></div>
        <div class="st-actions">
          <button class="btn ghost sm" id="otro" title="Cambiar por otro caso que no haya visto en esta sesión">${I.dice} Otro caso</button>
          <button class="btn ghost sm" id="salir" title="Volver al inicio">${I.home}</button>
        </div>
      </div>
      <div class="layout">
        <div class="col-card"><div class="scene"><div class="card" id="card">
          <div class="face front" id="front" role="button" tabindex="0" aria-label="Dar vuelta la tarjeta y comenzar la estación">
            <div class="num">${e.n}</div>
            <h2>${esc(e.t)}</h2>
            <p>El caso aparece al dar vuelta la tarjeta.</p>
            <span class="tap">${I.flip} Dar vuelta · ${fmt(MIN)}</span>
          </div>
          <div class="face back" id="back"></div>
        </div></div></div>
        <div id="resp"><div class="panel locked"><div>${I.lock}<p>Los campos de respuesta aparecen al dar vuelta la tarjeta.</p></div></div></div>
      </div>`;
    const front = $('#front');
    front.onclick = voltear;
    front.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); voltear(); } };
    $('#otro').onclick = () => {
      if (S.est[S.i].inicio && !confirm('¿Cambiar por otro caso? Se reinicia el tiempo y se borra lo escrito en esta estación.')) return;
      otroCaso();
    };
    $('#salir').onclick = () => { if (!S.est.some(s => s.inicio) || confirm('¿Salir del simulacro? Se pierde lo escrito.')) inicio(); };
    front.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function voltear() {
    const card = $('#card');
    if (card.classList.contains('flip')) return;
    const st = S.est[S.i];
    $('#back').innerHTML = [dorso1, dorso2, dorso3, dorso4][S.i](st);
    $('#resp').innerHTML = `<section class="panel in">${[form1, form2, form3, form4][S.i](st)}</section>`;
    card.classList.add('flip');
    arrancar();
    enlazar(st);
    if (S.i === 0) setTimeout(() => $('#q') && $('#q').focus({ preventScroll: true }), 750);
  }

  // ----- dorsos de la tarjeta -----
  const consigna = t => `<div class="consigna">${I.info}<div>${t}</div></div>`;
  function dorso1(st) {
    const c = st.caso, t = c.tarjeta;
    let tarea = c.tarea.replace(/\s*(y presente( al evaluador)? una síntesis|y redacte la historia clínica al finalizar|Al finalizar[^.]*)\.?$/i, '');
    if (!/\.$/.test(tarea)) tarea += '.';
    return `
      <div class="sec">Tarjeta del paciente</div>
      <dl class="tarjeta">
        <dt>Escenario</dt><dd>${md(t.esc)}</dd>
        <dt>Paciente</dt><dd>${md(t.pac)}</dd>
        <dt>Motivo de consulta</dt><dd>${md(t.mot)}</dd>
        <dt>Signos vitales</dt><dd>${md(t.sv)}</dd>
      </dl>
      ${consigna(md(tarea) + ' Luego redacte la historia clínica. No se pide examen físico ni tratamiento.')}
      <div class="chat">
        <div class="chat-h"><span class="dot"></span><span>Paciente${c.pac.voz ? ' y acompañante' : ''}</span><span>responde en español</span></div>
        <div class="log" id="log"><div class="hint">Preséntese y comience la anamnesis. Escriba cada pregunta como se la haría al paciente.</div></div>
        <form class="ask" id="ask" autocomplete="off">
          <input id="q" type="text" placeholder="Ej.: ¿Desde cuándo le pasa esto?" aria-label="Pregunta al paciente">
          <button type="submit" aria-label="Preguntar">${I.send}</button>
        </form>
      </div>`;
  }
  function dorso2(st) {
    const c = st.caso;
    return `
      <div class="sec">Caso clínico</div>
      <p class="caso">${md(c.presentacion)}</p>
      <div class="sec">Laboratorio</div>
      <ul class="labs">${c.lab.map(l => `<li>${md(l)}</li>`).join('')}</ul>
      ${c.img.length ? `<div class="sec">Otros estudios</div><ul class="labs">${c.img.map(l => `<li>${md(l)}</li>`).join('')}</ul>` : ''}
      ${consigna('Describa e interprete el laboratorio y plantee al menos 3 diagnósticos sindromáticos, al menos 3 diferenciales y el diagnóstico presuntivo.')}`;
  }
  function dorso3(st) {
    return `
      <div class="sec">Caso</div>
      <p class="caso">${md(st.caso.presentacion)}</p>
      <div class="sec">Diagnóstico confirmado</div>
      <p class="dx">${esc(st.esq.nombre)}</p>
      ${consigna('Comunique al paciente el diagnóstico, en lenguaje claro, e indíquele el esquema de tratamiento: medicamentos, dosis, vía, frecuencia y duración.')}`;
  }
  function dorso4(st) {
    const t = st.ex.titulo;
    return `
      <div class="sec">Consigna</div>
      <p class="ef-q">Realice el examen físico de un paciente con <b>${esc(t[0].toLowerCase() + t.slice(1))}</b>.</p>
      ${consigna('Escriba en orden todo lo que haría y lo que buscaría.')}`;
  }

  // ----- campos de respuesta -----
  const ta = (id, rows) => `<textarea id="${id}" data-k="${id}" rows="${rows}"></textarea>`;
  const fila = (label, campo, sub) => {
    const id = /^<(textarea|input)/.test(campo) ? campo.match(/id="([^"]+)"/)[1] : '';
    return `<div class="row"><label${id ? ` for="${id}"` : ''}>${label}${sub ? `<small>${sub}</small>` : ''}</label><div>${campo}</div></div>`;
  };
  const multi = (id, n) => `<div class="multi" id="${id}" data-k="${id}">${Array.from({ length: n }, (_, i) => `<div class="it"><span>${i + 1}.</span><input type="text" aria-label="${id} ${i + 1}"></div>`).join('')}<button type="button" class="add" data-add="${id}">+ agregar</button></div>`;
  const head = (t, s) => `<div class="panel-h"><b>${t}</b><small>${s}</small></div><div class="panel-b">`;
  const form1 = () => head('Historia clínica', 'a partir de lo que respondió el paciente') +
    fila('Datos reportados por el paciente, merecen fe', `<input type="text" id="fe" data-k="fe">`) +
    fila('Motivo de consulta', ta('mc', 2)) +
    fila('Motivo de ingreso', ta('mi', 2)) +
    fila('Antecedentes remotos de la enfermedad actual', ta('area', 8)) +
    fila('Antecedentes patológicos personales', ta('app', 4)) + '</div>';
  const form2 = () => head('Interpretación', 'sin pistas') +
    fila('Descripción del laboratorio', ta('desc', 6)) +
    fila('Diagnósticos sindromáticos', multi('sind', 3), 'mínimo 3') +
    fila('Diagnósticos diferenciales', multi('dif', 3), 'mínimo 3') +
    fila('Diagnóstico presuntivo', ta('pres', 3)) + '</div>';
  const form3 = () => head('Respuesta', 'lo que le diría al paciente') +
    fila('Comunicación del diagnóstico', ta('com', 8)) +
    fila('Esquema de tratamiento', ta('esq', 9)) + '</div>';
  const form4 = () => head('Examen físico', 'caja abierta, sin guía') +
    `<div style="padding-top:12px"><textarea id="ef" data-k="ef" rows="20" aria-label="Examen físico"></textarea></div></div>`;

  function enlazar(st) {
    const box = $('#resp');
    box.addEventListener('input', ev => {
      const el = ev.target, m = el.closest('.multi');
      if (m) st.r[m.dataset.k] = [...m.querySelectorAll('input')].map(i => i.value);
      else if (el.dataset.k) st.r[el.dataset.k] = el.value;
    });
    box.addEventListener('click', ev => {
      const b = ev.target.closest('[data-add]'); if (!b) return;
      const m = $('#' + b.dataset.add), n = m.querySelectorAll('.it').length + 1;
      b.insertAdjacentHTML('beforebegin', `<div class="it"><span>${n}.</span><input type="text"></div>`);
      m.querySelectorAll('input')[n - 1].focus();
    });
    if (S.i !== 0) return;
    const log = $('#log'), q = $('#q');
    let turno = 0;
    $('#ask').onsubmit = ev => {
      ev.preventDefault();
      const t = q.value.trim(); if (!t) return;
      q.value = '';
      const hint = log.querySelector('.hint'); if (hint) hint.remove();
      log.insertAdjacentHTML('beforeend', `<div class="msg q">${esc(t)}</div>`);
      const r = M.responder(st.caso, st.caso.pac, t, turno++) || 'Perdón, ¿cómo?';
      const quien = (r.match(/^\((\w+)\)\s*/) || [])[1] || st.caso.tarjeta.pac.split(',')[0];
      const txt = r.replace(/\((\w+)\)\s*/g, '');
      st.log.push([t, txt, quien]);
      const b = document.createElement('div'); b.className = 'msg a typing'; b.textContent = '•••';
      log.appendChild(b); log.scrollTop = log.scrollHeight;
      setTimeout(() => { b.className = 'msg a'; b.innerHTML = `<small>${esc(quien)}</small>${esc(txt)}`; log.scrollTop = log.scrollHeight; }, 300 + Math.min(600, r.length * 5));
    };
  }

  // ---------- avanzar ----------
  function avanzar(porTiempo) {
    if (!S || avanzando) return;
    avanzando = true;
    const st = S.est[S.i];
    pararReloj();
    st.usado = st.inicio ? Math.min(MIN, Date.now() - st.inicio) : 0;
    st.porTiempo = !!porTiempo;
    revision();
  }
  function continuar() { S.fase = ''; if (S.i < 3) { S.i++; estacion(); } else final(); }
  next.onclick = () => (S && S.fase === 'rev' ? continuar() : avanzar(false));

  // ---------- respuesta completa al terminar cada estación ----------
  function revision() {
    pararReloj(); reloj(); S.fase = 'rev';
    const i = S.i, e = EST[i], st = S.est[i], [sub, suyo, ref] = partes(i);
    acento(e.c);
    const sig = i < 3 ? `Continuar a la estación ${i + 2}` : 'Ver resumen final';
    next.innerHTML = sig + I.next; next.hidden = false;
    app.innerHTML = `
      <div class="st-bar">
        <div><span class="kicker">Estación ${e.n} de 4 · terminada · ${tiempoDe(st)}</span><h1>Respuesta completa</h1><p>${esc(e.t)} — ${esc(sub)}</p></div>
        <div class="st-actions"><button class="btn sm" id="cont">${sig} ${I.next}</button></div>
      </div>
      <div class="res-b rev"><div class="box"><h4>Lo que usted escribió</h4>${suyo}</div><div class="box ref"><h4>Respuesta completa (documentos)</h4>${ref}</div></div>`;
    $('#cont').onclick = continuar;
    window.scrollTo(0, 0);
  }

  // ---------- final ----------
  const vacio = '<span class="empty">(vacío)</span>';
  const val = v => (v && String(v).trim()) ? `<pre>${esc(v)}</pre>` : vacio;
  const lista = a => { const x = (a || []).filter(s => s && s.trim()); return x.length ? `<ol>${x.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : vacio; };
  const ul = a => `<ul>${a.map(s => `<li>${md(s)}</li>`).join('')}</ul>`;
  const kv = (k, v) => `<div class="k">${k}</div>${v}`;
  const tiempoDe = st => !st.inicio ? 'no iniciada' : st.porTiempo ? 'tiempo agotado' : fmt(st.usado) + ' usados';
  // [subtítulo, lo que escribió el estudiante, respuesta completa de los documentos] de la estación i.
  function partes(i) {
    const st = S.est[i], r = st.r;
    if (i === 0) {
      const chat = st.log.length ? `<ul>${st.log.map(([p, a, w]) => `<li><b>${esc(p)}</b><br>${esc(w)}: ${esc(a)}</li>`).join('')}</ul>` : vacio;
      return [st.caso.titulo,
        kv('Preguntas al paciente', chat) + kv('Merecen fe', val(r.fe)) + kv('Motivo de consulta', val(r.mc)) + kv('Motivo de ingreso', val(r.mi)) + kv('Antecedentes remotos de la enfermedad actual', val(r.area)) + kv('Antecedentes patológicos personales', val(r.app)),
        kv('Historia clínica completa', ul(st.caso.hc.filter(h => !/no realizado/.test(h)))) + kv('Qué había que preguntar (y la síntesis)', ul(st.caso.claves)) + kv('Lo que el paciente tenía para contar', ul(st.caso.guion))];
    }
    if (i === 1) return [st.caso.titulo,
      kv('Descripción', val(r.desc)) + kv('Sindromáticos', lista(r.sind)) + kv('Diferenciales', lista(r.dif)) + kv('Presuntivo', val(r.pres)),
      kv('Descripción e interpretación del laboratorio', ul(st.caso.labRes)) + kv('Diagnósticos sindromáticos, diferenciales y presuntivo', ul(st.caso.dxRes))];
    if (i === 2) { const q = st.esq; return [q.nombre,
      kv('Comunicación', val(r.com)) + kv('Esquema', val(r.esq)),
      kv('Cómo comunicar el diagnóstico', `<p>${md(q.dx)}</p>`) + kv('Cómo explicarle el esquema al paciente', ul(q.paciente)) + kv('Esquema de tratamiento (técnico)', ul(q.esquema)) + (q.alarma ? kv('Signos de alarma', `<p>${md(q.alarma)}</p>`) : '')]; }
    const x = st.ex;
    const ef = x.pasos.map(p => `<div><b>${md(p.t)}</b><br>${md(p.como)}<br><span class="tag n">Normal</span> ${md(p.normal)}${p.patologico ? `<br><span class="tag p">Patológico</span> ${md(p.patologico)}` : ''}</div>`).join('');
    const man = (x.maniobras || []).map(m => `<div><b>Maniobra: ${md(m.nombre)}</b><ol>${m.pasos.map(s => `<li>${md(s)}</li>`).join('')}</ol>${m.interpretacion ? md(m.interpretacion) : ''}</div>`).join('');
    return [x.titulo, val(r.ef), `<div class="ef">${ef}${man}</div>`];
  }
  function final() {
    pararReloj(); reloj(); pasos(4); next.hidden = true; document.body.style.removeProperty('--c');
    const bloque = i => { const [sub, suyo, ref] = partes(i); return `
      <details class="res" style="--c:var(--${EST[i].c})">
        <summary><span class="badge">${i + 1}</span><span class="tt"><b>${esc(EST[i].t)}</b><span>${esc(sub)} · ${tiempoDe(S.est[i])}</span></span>${I.chev}</summary>
        <div class="res-b"><div class="box"><h4>Lo que usted escribió</h4>${suyo}</div><div class="box"><h4>Respuesta completa (documentos)</h4>${ref}</div></div>
      </details>`; };
    app.innerHTML = `
      <div class="fin-h">
        <div><span class="eyebrow"><b></b>Simulacro ${nSim} de esta sesión</span><h1>Simulacro terminado</h1><p>Resumen de las 4 estaciones: abra cada una para ver lo que escribió y la respuesta completa.</p></div>
        <div class="st-actions"><button class="btn" id="otra">Nuevo simulacro ${I.next}</button><button class="btn ghost" id="ini">Inicio</button></div>
      </div>
      ${[0, 1, 2, 3].map(bloque).join('')}`;
    $('#otra').onclick = () => { S = sortear(); estacion(); };
    $('#ini').onclick = inicio;
    S.terminado = true;
    window.scrollTo(0, 0);
  }

  window.addEventListener('beforeunload', ev => { if (S && !S.terminado && S.est.some(s => s.inicio)) { ev.preventDefault(); ev.returnValue = ''; } });
  window.__ECOE_TEST = { sortear: () => sortear(), vistos };   // solo para pruebas automáticas
  inicio();
})();
