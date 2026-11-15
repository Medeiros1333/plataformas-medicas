// Simulacro de estaciones ECOE: 4 estaciones de 8 minutos, cada una con una patología distinta.
// Nada se guarda: todo vive en memoria y se borra al recargar la página.
(function () {
  const D = window.ECOE, M = window.Motor;
  const MIN = (+new URLSearchParams(location.search).get('seg') || 8 * 60) * 1000; // ?seg=N solo para probar
  const EST = [
    { n: 1, c: 's1', t: 'Anamnesis e historia clínica', d: 'Interrogue al paciente en español y redacte la historia clínica.' },
    { n: 2, c: 's2', t: 'Laboratorio y diagnósticos', d: 'Interprete el laboratorio: sindromáticos, diferenciales y presuntivo.' },
    { n: 3, c: 's3', t: 'Diagnóstico y tratamiento', d: 'Comunique el diagnóstico e indique el esquema de tratamiento.' },
    { n: 4, c: 's4', t: 'Examen físico', d: 'Describa en orden el examen físico completo.' },
  ];
  const TEMAS = [...new Set(D.casos.map(c => c.tema))];
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app'), next = $('#next'), timerEl = $('#timer'), stepsEl = $('#steps');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^»\s*/, '');
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const ICON_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ICON_FLIP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/></svg>';

  // ---------- tema claro / oscuro (sin guardar) ----------
  $('#theme').onclick = () => {
    const root = document.documentElement;
    const oscuro = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = oscuro ? 'light' : 'dark';
  };

  // ---------- estado ----------
  let S = null;            // simulacro en curso
  let tick = null, pendiente = null, fin = 0, avanzando = false;
  const elegidos = ['', '', '', ''];

  function sortear() {
    const usados = new Set();
    const temas = elegidos.map(t => { if (t) usados.add(t); return t; });
    const libres = shuffle(TEMAS.filter(t => !usados.has(t)));
    for (let i = 0; i < 4; i++) if (!temas[i]) temas[i] = libres.pop() || pick(TEMAS);
    const caso = t => pick(D.casos.filter(c => c.tema === t));
    const c1 = caso(temas[0]), c2 = caso(temas[1]), c3 = caso(temas[2]), c4 = caso(temas[3]);
    return {
      i: 0, est: [
        { tema: temas[0], caso: c1, log: [], r: {} },
        { tema: temas[1], caso: c2, r: {} },
        { tema: temas[2], caso: c3, esq: D.esquemas[c3.esq], r: {} },
        { tema: temas[3], ex: D.examen[c4.ex], r: {} },
      ],
    };
  }

  // ---------- barra de pasos y cronómetro ----------
  function pasos(i) {
    stepsEl.innerHTML = EST.map((e, k) => `<li class="${k === i ? 'on' : k < i ? 'done' : ''}" style="--c:var(--${e.c})"><b>${e.n}</b><span>${esc(e.t.split(' ')[0])}</span></li>`).join('');
  }
  function pararReloj() { clearInterval(tick); tick = null; clearTimeout(pendiente); pendiente = null; }
  function reloj(estado) {
    timerEl.className = 'timer ' + (estado || 'idle');
    if (estado !== 'run' && estado !== 'warn') timerEl.textContent = '8:00';
  }
  function arrancar() {
    fin = Date.now() + MIN;
    S.est[S.i].inicio = Date.now();
    reloj('run');
    const upd = () => {
      const r = fin - Date.now();
      timerEl.textContent = fmt(r);
      timerEl.className = 'timer ' + (r <= 0 ? 'over' : r <= 60000 ? 'warn' : '');
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
  function toast(t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2200); }

  // ---------- pantalla de inicio ----------
  function inicio() {
    pararReloj(); S = null; reloj(); pasos(-1);
    next.hidden = true; document.body.style.removeProperty('--c');
    const opts = '<option value="">Aleatorio</option>' + TEMAS.map(t => `<option>${esc(t)}</option>`).join('');
    app.innerHTML = `
      <section class="hero">
        <h1>Simulacro de estaciones</h1>
        <p>Cuatro estaciones de <b>8 minutos</b>, cada una con una patología distinta de los 16 temas del final. Toque la tarjeta en blanco para darla vuelta: ahí empieza a correr el tiempo. Al terminar el tiempo, o con el botón <b>Próxima estación</b>, pasa a la siguiente.</p>
      </section>
      <div class="plan">${EST.map(e => `<div style="--c:var(--${e.c})"><i>Estación ${e.n}</i><b>${esc(e.t)}</b><span>${esc(e.d)}</span></div>`).join('')}</div>
      <details class="pick"><summary>Elegir los temas (opcional)</summary>
        <div class="pick-grid">${EST.map((e, i) => `<label>Estación ${e.n} · ${esc(e.t)}<select data-i="${i}">${opts}</select></label>`).join('')}</div>
      </details>
      <button class="btn" id="go">Comenzar simulacro ${ICON_NEXT.replace('<svg', '<svg width="18" height="18"')}</button>
      <p class="note">Nada se guarda: lo que escriba existe solo mientras la página esté abierta. Al final puede comparar lo que escribió con la referencia de los documentos.</p>`;
    app.querySelectorAll('select').forEach(s => { s.value = elegidos[+s.dataset.i]; s.onchange = () => { elegidos[+s.dataset.i] = s.value; }; });
    $('#go').onclick = () => { S = sortear(); estacion(); };
    window.scrollTo(0, 0);
  }

  // ---------- estación ----------
  function estacion() {
    pararReloj(); reloj(); avanzando = false;
    const e = EST[S.i], st = S.est[S.i];
    pasos(S.i);
    document.body.style.setProperty('--c', `var(--${e.c})`);
    next.style.setProperty('--c', `var(--${e.c})`);
    next.innerHTML = (S.i < 3 ? 'Próxima estación' : 'Terminar simulacro') + ICON_NEXT;
    next.hidden = false;
    app.innerHTML = `
      <div class="st-head" style="--c:var(--${e.c})"><b>Estación ${e.n} de 4</b>${esc(e.t)}</div>
      <div class="scene" style="--c:var(--${e.c})">
        <div class="card" id="card">
          <div class="face front" id="front" role="button" tabindex="0" aria-label="Dar vuelta la tarjeta y comenzar la estación">
            <div class="num">${e.n}</div>
            <h2>${esc(e.t)}</h2>
            <p>El caso aparece al dar vuelta la tarjeta.</p>
            <span class="tap">${ICON_FLIP} Toque para comenzar · 8:00</span>
          </div>
          <div class="face back" id="back"></div>
        </div>
      </div>
      <div id="resp"></div>`;
    const front = $('#front');
    const go = () => voltear();
    front.onclick = go;
    front.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } };
    front.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function voltear() {
    const card = $('#card');
    if (card.classList.contains('flip')) return;
    const e = EST[S.i], st = S.est[S.i];
    $('#back').innerHTML = [dorso1, dorso2, dorso3, dorso4][S.i](st);
    $('#resp').innerHTML = `<section class="resp" style="--c:var(--${e.c})">${[form1, form2, form3, form4][S.i](st)}</section>`;
    card.classList.add('flip');
    arrancar();
    enlazar(st);
    if (S.i === 0) setTimeout(() => $('#q') && $('#q').focus({ preventScroll: true }), 700);
  }

  // ----- dorsos de la tarjeta -----
  function dorso1(st) {
    const c = st.caso, t = c.tarjeta;
    let tarea = c.tarea.replace(/\s*(y presente una síntesis|y redacte la historia clínica al finalizar|Al finalizar[^.]*)\.?$/i, '');
    if (!/\.$/.test(tarea)) tarea += '.';
    return `
      <h3>Tarjeta del paciente</h3>
      <dl class="tarjeta">
        <dt>Escenario</dt><dd>${md(t.esc)}</dd>
        <dt>Paciente</dt><dd>${md(t.pac)}</dd>
        <dt>Motivo de consulta</dt><dd>${md(t.mot)}</dd>
        <dt>Signos vitales</dt><dd>${md(t.sv)}</dd>
      </dl>
      <div class="consigna">${md(tarea)} Luego redacte la historia clínica en los campos de abajo. No se pide examen físico ni tratamiento.</div>
      <div class="chat">
        <div class="chat-h"><span class="dot"></span>Paciente${c.pac.voz ? ' y acompañante' : ''} · responde a sus preguntas</div>
        <div class="log" id="log"><div class="hint">Preséntese y comience la anamnesis. Escriba cada pregunta en español, como se la haría al paciente.</div></div>
        <form class="ask" id="ask" autocomplete="off">
          <input id="q" type="text" placeholder="Ej.: ¿Desde cuándo le pasa esto?" aria-label="Pregunta al paciente">
          <button type="submit">Preguntar</button>
        </form>
      </div>`;
  }
  function dorso2(st) {
    const c = st.caso;
    return `
      <h3>Caso clínico</h3>
      <p class="caso">${md(c.presentacion)}</p>
      <div class="label">Laboratorio</div>
      <ul class="labs">${c.lab.map(l => `<li>${md(l)}</li>`).join('')}</ul>
      ${c.img.length ? `<div class="label">Otros estudios</div><ul class="labs">${c.img.map(l => `<li>${md(l)}</li>`).join('')}</ul>` : ''}
      <div class="consigna">Describa e interprete el laboratorio y plantee al menos 3 diagnósticos sindromáticos, al menos 3 diagnósticos diferenciales y el diagnóstico presuntivo.</div>`;
  }
  function dorso3(st) {
    return `
      <h3>Comunicar el diagnóstico</h3>
      <p class="caso">${md(st.caso.presentacion)}</p>
      <div class="label">Diagnóstico confirmado</div>
      <p class="caso" style="margin:0;font-size:1.08rem"><b>${esc(st.esq.nombre)}</b></p>
      <div class="consigna">Comunique al paciente el diagnóstico, en lenguaje claro, e indíquele el esquema de tratamiento: medicamentos, dosis, vía, frecuencia y duración.</div>`;
  }
  function dorso4(st) {
    return `
      <h3>Examen físico</h3>
      <p class="caso" style="font-size:1.12rem;margin:4px 0 0">Realice el examen físico de un paciente con <b>${esc(st.ex.titulo[0].toLowerCase() + st.ex.titulo.slice(1))}</b>.</p>
      <div class="consigna">Escriba en orden todo lo que haría y lo que buscaría.</div>`;
  }

  // ----- campos de respuesta -----
  const ta = (id, rows, ph = '') => `<textarea id="${id}" data-k="${id}" rows="${rows}" placeholder="${esc(ph)}"></textarea>`;
  const fila = (label, campo, sub) => {
    const id = /^<(textarea|input)/.test(campo) ? campo.match(/id="([^"]+)"/)[1] : '';
    return `<div class="row"><label${id ? ` for="${id}"` : ''}>${label}${sub ? `<small>${sub}</small>` : ''}</label><div>${campo}</div></div>`;
  };
  const multi = (id, n) => `<div class="multi" id="${id}" data-k="${id}">${Array.from({ length: n }, (_, i) => `<div class="it"><span>${i + 1}.</span><input type="text" aria-label="${id} ${i + 1}"></div>`).join('')}<button type="button" class="add" data-add="${id}">+ agregar otro</button></div>`;
  function form1() {
    return `<h3>Historia clínica</h3><p class="sub">Redacte a partir de lo que le respondió el paciente.</p>
      ${fila('Datos reportados por el paciente, merecen fe', `<input type="text" id="fe" data-k="fe">`)}
      ${fila('Motivo de consulta', ta('mc', 2))}
      ${fila('Motivo de ingreso', ta('mi', 2))}
      ${fila('Antecedentes remotos de la enfermedad actual', ta('area', 7))}
      ${fila('Antecedentes patológicos personales', ta('app', 4))}`;
  }
  function form2() {
    return `<h3>Interpretación</h3><p class="sub">Sin pistas: todo sale de usted.</p>
      ${fila('Descripción del laboratorio', ta('desc', 6))}
      ${fila('Diagnósticos sindromáticos', multi('sind', 3), 'mínimo 3')}
      ${fila('Diagnósticos diferenciales', multi('dif', 3), 'mínimo 3')}
      ${fila('Diagnóstico presuntivo', ta('pres', 3))}`;
  }
  function form3() {
    return `<h3>Respuesta</h3><p class="sub">Escriba lo que le diría al paciente y el esquema que indica.</p>
      ${fila('Comunicación del diagnóstico', ta('com', 8))}
      ${fila('Esquema de tratamiento', ta('esq', 8))}`;
  }
  function form4() {
    return `<h3>Examen físico</h3><p class="sub">Caja abierta, sin guía.</p>
      <textarea id="ef" data-k="ef" rows="18" aria-label="Examen físico"></textarea>`;
  }

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
    if (S.i === 0) {
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
        const burbuja = document.createElement('div'); burbuja.className = 'msg a typing'; burbuja.textContent = '…';
        log.appendChild(burbuja); log.scrollTop = log.scrollHeight;
        setTimeout(() => {
          burbuja.className = 'msg a';
          burbuja.innerHTML = `<small>${esc(quien)}</small>${esc(txt)}`;
          log.scrollTop = log.scrollHeight;
        }, 300 + Math.min(600, r.length * 5));
      };
    }
  }

  // ---------- avanzar ----------
  function avanzar(porTiempo) {
    if (!S || avanzando) return;
    avanzando = true;
    const st = S.est[S.i];
    pararReloj();
    st.usado = st.inicio ? Math.min(MIN, Date.now() - st.inicio) : 0;
    st.porTiempo = !!porTiempo;
    if (S.i < 3) { S.i++; estacion(); } else final();
  }
  next.onclick = () => avanzar(false);

  // ---------- pantalla final ----------
  const vacio = '<span class="empty">(vacío)</span>';
  const val = v => (v && String(v).trim()) ? `<pre>${esc(v)}</pre>` : vacio;
  const lista = a => { const x = (a || []).filter(s => s && s.trim()); return x.length ? `<ul>${x.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : vacio; };
  const ul = a => `<ul>${a.map(s => `<li>${md(s)}</li>`).join('')}</ul>`;
  const kv = (k, v) => `<div class="k">${k}</div>${v}`;
  function final() {
    pararReloj(); reloj(); pasos(4); next.hidden = true;
    const [a, b, c, d] = S.est;
    const tiempo = st => !st.inicio ? 'no iniciada' : st.porTiempo ? 'tiempo agotado' : fmt(st.usado) + ' usados';
    const chat = a.log.length ? `<ul>${a.log.map(([p, r, w]) => `<li><b>${esc(p)}</b><br>${esc(w)}: ${esc(r)}</li>`).join('')}</ul>` : vacio;
    const ef = d.ex.pasos.map(p => `<div><b>${md(p.t)}</b><br>${md(p.como)}<br><span class="tag n">Normal</span> ${md(p.normal)}${p.patologico ? `<br><span class="tag p">Patológico</span> ${md(p.patologico)}` : ''}</div>`).join('');
    const man = (d.ex.maniobras || []).map(m => `<div><b>Maniobra: ${md(m.nombre)}</b><ol>${m.pasos.map(s => `<li>${md(s)}</li>`).join('')}</ol>${m.interpretacion ? md(m.interpretacion) : ''}</div>`).join('');
    const bloque = (i, titulo, tema, suyo, ref) => `
      <details class="res" style="--c:var(--${EST[i].c})" ${i === 0 ? 'open' : ''}>
        <summary>Estación ${i + 1} · ${esc(titulo)} <span>${esc(tema)} · ${tiempo(S.est[i])}</span></summary>
        <div class="res-b cols"><div class="box"><h4>Lo que usted escribió</h4>${suyo}</div><div class="box"><h4>Referencia de los documentos</h4>${ref}</div></div>
      </details>`;
    app.innerHTML = `<section class="fin">
      <h1>Simulacro terminado</h1>
      <p>Compare lo que escribió con la referencia. No hay nota: es para ver qué salió de memoria y qué faltó.</p>
      ${bloque(0, EST[0].t, a.caso.titulo, kv('Preguntas al paciente', chat) + kv('Merecen fe', val(a.r.fe)) + kv('Motivo de consulta', val(a.r.mc)) + kv('Motivo de ingreso', val(a.r.mi)) + kv('Antecedentes remotos de la enfermedad actual', val(a.r.area)) + kv('Antecedentes patológicos personales', val(a.r.app)),
        kv('Historia clínica modelo', ul(a.caso.hc.filter(h => !/no realizado/.test(h)))) + kv('Qué había que preguntar', ul(a.caso.claves)))}
      ${bloque(1, EST[1].t, b.caso.titulo, kv('Descripción', val(b.r.desc)) + kv('Sindromáticos', lista(b.r.sind)) + kv('Diferenciales', lista(b.r.dif)) + kv('Presuntivo', val(b.r.pres)),
        kv('Lectura del laboratorio', ul(b.caso.labRes)) + kv('Diagnósticos', ul(b.caso.dxRes)))}
      ${bloque(2, EST[2].t, c.esq.nombre, kv('Comunicación', val(c.r.com)) + kv('Esquema', val(c.r.esq)),
        kv('Cómo decir el diagnóstico', `<p>${md(c.esq.dx)}</p>`) + kv('Cómo explicarle el esquema', ul(c.esq.paciente)) + kv('Esquema (técnico)', ul(c.esq.esquema)) + (c.esq.alarma ? kv('Signos de alarma', `<p>${md(c.esq.alarma)}</p>`) : ''))}
      ${bloque(3, EST[3].t, d.ex.titulo, val(d.r.ef), `<div class="ef">${ef}${man}</div>`)}
      <div class="actions"><button class="btn" id="otra">Nuevo simulacro</button><button class="btn ghost" id="ini">Volver al inicio</button></div>
    </section>`;
    $('#otra').onclick = () => { S = sortear(); estacion(); };
    $('#ini').onclick = inicio;
    S.terminado = true;
    window.scrollTo(0, 0);
  }

  window.addEventListener('beforeunload', ev => { if (S && !S.terminado && S.est.some(s => s.inicio)) { ev.preventDefault(); ev.returnValue = ''; } });
  inicio();
})();
