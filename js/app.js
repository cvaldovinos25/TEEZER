/* ============================================================
   Tu pelo, tu cepillo | flujo: bienvenida, test, resultado en 3D con tarjetas, escáner, lista
   ============================================================ */
(function () {
  const TT = window.TT, C = TT.CONFIG, THREE = window.THREE, S = TT.store;
  const $ = (s) => document.querySelector(s), esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = (id) => C.MODELOS.find((m) => m.id === id);
  let paso = 0, resp = {}, ranking = [], actual = null, cur = null;      // actual = modelo que se muestra

  function show(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('on', s.id === id));
    $('#top').hidden = id === 'sWelcome'; $('#gl').classList.toggle('on', id === 'sResult');
    if (id !== 'sScan') TT.scan.stop();
  }
  function toast(t, ms) { const e = $('#toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { e.hidden = true; }, ms || 2600); }

  /* ---------- Mi lista (solo en este celular) ---------- */
  const lista = () => { try { return JSON.parse(S.get('tt_lista_cepillo') || '[]').filter(byId); } catch (e) { return []; } };
  const guardar = (l) => { S.set('tt_lista_cepillo', JSON.stringify(l)); $('#nLista').textContent = l.length; };

  /* ---------- Test ---------- */
  function pregunta() {
    const q = C.PREGUNTAS[paso];
    $('#tStep').textContent = 'Pregunta ' + (paso + 1) + ' de ' + C.PREGUNTAS.length; $('#tBar').style.width = (paso / C.PREGUNTAS.length * 100) + '%';
    $('#tQ').textContent = q.t; $('#tBack').hidden = paso === 0;
    $('#tOpts').innerHTML = q.op.map((o) => '<button class="opt" data-v="' + esc(o.v) + '">' + esc(o.t) + '</button>').join('');
    $('#tOpts').querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      resp[q.id] = b.dataset.v; b.classList.add('sel');
      setTimeout(() => { if (paso + 1 < C.PREGUNTAS.length) { paso++; pregunta(); } else terminar(); }, 160);
    }));
  }
  function empezar() { paso = 0; resp = {}; show('sTest'); $('#topTit').textContent = 'Tu pelo, tu cepillo'; pregunta(); }
  function terminar() {
    ranking = TT.recomendar(resp); if (!ranking.length) { toast('Aún no hay modelos disponibles.'); return; }
    TT.track('test', { pelo: resp.pelo, enredo: resp.enredo, momento: resp.momento, recomendado: ranking[0].modelo.id });
    mostrar(ranking[0].modelo, true);
  }

  /* ---------- Resultado: cepillo 3D sobre la cámara + 4 tarjetas ---------- */
  let ren, scene, cam3, pivot, brush3, drag = null, t0 = 0, raf = 0;
  function gl() {
    if (ren) return;
    const cv = $('#gl'); ren = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); ren.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); ren.outputEncoding = THREE.sRGBEncoding;
    scene = new THREE.Scene(); cam3 = new THREE.PerspectiveCamera(40, 1, 0.1, 50); cam3.position.set(0, 0, 8.6);
    scene.add(new THREE.HemisphereLight(0xfff4ee, 0xb7a2e6, 0.55)); const dl = new THREE.DirectionalLight(0xfff1e8, 0.85); dl.position.set(2, 3, 5); scene.add(dl);
    pivot = new THREE.Group(); scene.add(pivot);
    const rs = () => { ren.setSize(innerWidth, innerHeight, false); cam3.aspect = innerWidth / innerHeight; cam3.updateProjectionMatrix(); pivot.position.y = 0.62; };
    addEventListener('resize', rs); rs();
    cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, r: pivot.rotation.y }; }); addEventListener('pointerup', () => { drag = null; });
    cv.addEventListener('pointermove', (e) => { if (drag) pivot.rotation.y = drag.r + (e.clientX - drag.x) * 0.012; });
    const loop = (t) => { raf = requestAnimationFrame(loop); if (!$('#gl').classList.contains('on')) return; if (!drag) pivot.rotation.y += 0.012; pivot.position.y = 0.62 + Math.sin(t / 900) * 0.06; ren.render(scene, cam3); };
    raf = requestAnimationFrame(loop);
  }
  function mostrar(m, conTest) {
    actual = m; gl(); show('sResult'); $('#topTit').textContent = 'Para ti';
    if (brush3) { pivot.remove(brush3); brush3.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
    brush3 = TT.makeBrush(THREE, m); brush3.rotation.x = -0.15; pivot.add(brush3); pivot.rotation.y = -0.6;
    const r = ranking.find((x) => x.modelo.id === m.id);
    $('#rWhy').textContent = conTest && resp.pelo ? TT.porque(resp) : 'Cepillo seleccionado';
    $('#rName').textContent = m.nombre; $('#rSum').textContent = m.resumen;
    $('#rAff').textContent = r ? (ranking[0].modelo.id === m.id ? 'Tu mejor opción · ' : 'Opción alternativa · ') + r.afinidad + '% de afinidad' : '';
    const IC = (p) => '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>';
    const cards = [['Para quién es', m.paraQuien, '#6b4fc4', IC('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>')], ['Cómo usarlo', m.comoUsar, '#b3623a', IC('<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>')], ['Ojo con esto', m.ojo, '#a67c1f', IC('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>')], ['Dónde está', m.pasillo ? 'Lo encuentras en: ' + m.pasillo : 'Pregunta en la góndola de cuidado del cabello o al personal de la farmacia.', '#c2557f', IC('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>')]];
    $('#rCards').innerHTML = cards.map((c, i) => '<button class="mini" data-i="' + i + '" style="--c:' + c[2] + '"><b>' + c[3] + esc(c[0]) + '</b><span>' + esc(c[1]) + '</span></button>').join('');
    $('#rCards').querySelectorAll('.mini').forEach((b) => b.addEventListener('click', () => { const c = cards[+b.dataset.i]; abrir('<h3 style="color:' + c[2] + '">' + esc(c[0]) + '</h3><p class="big">' + esc(c[1]) + '</p>'); }));
    $('#rAlts').innerHTML = ranking.length > 1 ? '<small>Otras opciones</small>' + ranking.filter((x) => x.modelo.id !== m.id).slice(0, 2).map((x) => '<button class="alt" data-id="' + esc(x.modelo.id) + '">' + esc(x.modelo.nombre) + ' <i>' + x.afinidad + '%</i></button>').join('') : '';
    $('#rAlts').querySelectorAll('.alt').forEach((b) => b.addEventListener('click', () => { TT.track('otro_modelo', { recomendado: ranking[0].modelo.id, escaneado: b.dataset.id }); mostrar(byId(b.dataset.id), true); }));
    const en = lista().indexOf(m.id) >= 0; $('#btnSave').textContent = en ? 'Quitar de mi lista' : 'Guardar en mi lista';
    $('#btnBridge').hidden = !C.DESENREDA_URL;
  }

  /* ---------- Hoja inferior ---------- */
  function abrir(html) { $('#sheetBody').innerHTML = html; $('#sheetBg').hidden = false; $('#sheet').hidden = false; requestAnimationFrame(() => { $('#sheet').classList.add('on'); $('#sheetBg').classList.add('on'); }); }
  function cerrar() { $('#sheet').classList.remove('on'); $('#sheetBg').classList.remove('on'); setTimeout(() => { $('#sheet').hidden = true; $('#sheetBg').hidden = true; }, 220); }
  function verLista() {
    const l = lista().map(byId);
    abrir('<h3>Mi lista</h3>' + (l.length ? l.map((m) => '<div class="li"><div><b>' + esc(m.nombre) + '</b><small>' + esc(m.resumen) + '</small></div><button data-id="' + esc(m.id) + '" class="rm">Quitar</button></div>').join('') + '<p class="fine">Se guarda solo en este celular. Muéstrala en la góndola o en caja.</p>' : '<p class="big">Aún no guardas ningún cepillo.</p>'));
    $('#sheetBody').querySelectorAll('.rm').forEach((b) => b.addEventListener('click', () => { guardar(lista().filter((x) => x !== b.dataset.id)); verLista(); }));
  }

  /* ---------- Escáner de código de barras ---------- */
  function abrirScan() {
    show('sScan'); $('#topTit').textContent = 'Escanea tu envase'; $('#scVerdict').hidden = true; $('#scAgain').hidden = true; $('#mCode').value = '';
    $('#scMsg').textContent = 'Apunta al código de barras del envase'; $('#scSub').textContent = 'Mantén el envase firme y con buena luz.';
    if (!TT.cam.on) TT.cam.start($('#cam'));
    TT.scan.start($('#cam'), resolver);
  }
  function resolver(code) {
    const n = TT.scan.norm(code), m = n && C.MODELOS.find((x) => x.ean && TT.scan.norm(x.ean) === n), rec = ranking[0] && ranking[0].modelo;
    let res, html;
    if (!m) { res = 'no_reconocido'; html = '<b>No tenemos ese producto en esta campaña.</b><span>Código leído: ' + esc(code) + '. Puedes hacer el test y te decimos cuál conviene.</span>'; }
    else if (rec && m.id === rec.id) { res = 'correcto'; html = '<b class="okk">¡Es el indicado para ti!</b><span>' + esc(m.nombre) + ' coincide con tu pelo.</span><button class="btn sm" id="vVer">Ver cómo usarlo</button>'; }
    else if (rec) { res = 'otro'; html = '<b>Ese es ' + esc(m.nombre) + '.</b><span>Para tu pelo te conviene más <b>' + esc(rec.nombre) + '</b>.</span><button class="btn sm" id="vVer">Ver ' + esc(rec.nombre) + '</button><button class="link" id="vEste">Ver igual ' + esc(m.nombre) + '</button>'; }
    else { res = 'sin_test'; html = '<b>Es ' + esc(m.nombre) + '.</b><span>' + esc(m.resumen) + '</span><button class="btn sm" id="vVer">Ver detalles</button><button class="link" id="vTest">Hacer el test para ver si es el tuyo</button>'; }
    TT.track('escaneo', { escaneado: m ? m.id : '', resultado: res, recomendado: rec ? rec.id : '' });
    $('#scMsg').textContent = 'Listo'; $('#scSub').textContent = ''; const v = $('#scVerdict'); v.innerHTML = html; v.hidden = false; $('#scAgain').hidden = false;
    const go = (id) => { const mm = byId(id); if (mm) { show('sResult'); mostrar(mm, !!rec); } };
    if ($('#vVer')) $('#vVer').addEventListener('click', () => go(res === 'otro' ? rec.id : m.id));
    if ($('#vEste')) $('#vEste').addEventListener('click', () => go(m.id));
    if ($('#vTest')) $('#vTest').addEventListener('click', empezar);
  }

  /* ---------- Eventos ---------- */
  $('#btnStart').addEventListener('click', () => { TT.cam.start($('#cam')); TT.track('inicio', {}); empezar(); });
  $('#btnScan0').addEventListener('click', () => { TT.track('inicio', { origen_scan: 1 }); abrirScan(); });
  $('#tBack').addEventListener('click', () => { if (paso > 0) { paso--; pregunta(); } });
  $('#btnRedo').addEventListener('click', empezar);
  $('#btnScan').addEventListener('click', abrirScan);
  $('#scClose').addEventListener('click', () => { if (actual) show('sResult'); else show('sWelcome'); });
  $('#scAgain').addEventListener('click', abrirScan);
  $('#manual').addEventListener('submit', (e) => { e.preventDefault(); const v = $('#mCode').value.trim(); if (!v) return; TT.scan.stop(); resolver(v); });
  $('#btnSave').addEventListener('click', () => {
    let l = lista(); if (l.indexOf(actual.id) >= 0) { l = l.filter((x) => x !== actual.id); toast('Quitado de tu lista'); } else { l.push(actual.id); toast('Guardado en tu lista'); TT.track('lista', { recomendado: ranking[0] ? ranking[0].modelo.id : '', escaneado: actual.id }); }
    guardar(l); $('#btnSave').textContent = l.indexOf(actual.id) >= 0 ? 'Quitar de mi lista' : 'Guardar en mi lista';
  });
  $('#btnLista').addEventListener('click', verLista); $('#sheetX').addEventListener('click', cerrar); $('#sheetBg').addEventListener('click', cerrar);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#sheet').hidden) cerrar(); });
  $('#btnBridge').addEventListener('click', () => { TT.track('puente', {}); location.href = C.DESENREDA_URL; });
  $('#tagPrueba').hidden = !C.MODO_PRUEBA; guardar(lista());
  if (new URLSearchParams(location.search).get('debug')) window.__TT = { C, resolver, mostrar, empezar, abrirScan, get ranking() { return ranking; } };
})();
