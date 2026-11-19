/* Métricas anónimas hacia Google Sheets (Apps Script). No se guardan nombre, correo, IP ni imágenes.
   Si CONFIG.URL está vacío no se envía nada. Los eventos que fallan se reintentan después. */
(function () {
  const TT = (window.TT = window.TT || {});
  const C = () => TT.CONFIG;
  const lget = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lset = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const q = new URLSearchParams(location.search);
  TT.tienda = ((q.get('t') || '').match(/^[A-Za-z0-9_-]{1,24}$/) || ['sin-tienda'])[0];
  TT.origen = ((q.get('origen') || '').match(/^[A-Za-z0-9_-]{1,24}$/) || [''])[0];
  const dev = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'móvil' : 'escritorio';

  /* Visita nueva si pasaron más de 30 minutos desde el último uso; si no, sigue la misma. */
  TT.visita = (function () {
    const k = 'tt_' + C().CAMP, now = Date.now();
    let n = parseInt(lget(k + '_n'), 10) || 0; const t = parseInt(lget(k + '_t'), 10) || 0;
    if (!n || now - t > 30 * 60 * 1000) n++;
    lset(k + '_n', String(n)); lset(k + '_t', String(now));
    document.addEventListener('visibilitychange', () => lset(k + '_t', String(Date.now())));
    return n;
  })();

  const QK = 'tt_cola_' + C().CAMP;
  const readQ = () => { try { return JSON.parse(lget(QK) || '[]'); } catch (e) { return []; } };
  async function post(obj) {
    const u = C().URL; if (!u) return true;
    try { await fetch(u, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(obj) }); return true; } catch (e) { return false; }
  }
  async function flush() {
    const qq = readQ(); if (!qq.length) return; lset(QK, '[]');
    const rest = []; for (const o of qq) { if (!(await post(o))) rest.push(o); }
    if (rest.length) lset(QK, JSON.stringify(rest.slice(-50)));
  }
  TT.track = async function (evt, data) {
    const o = Object.assign({ camp: C().CAMP, evt, tienda: TT.tienda, origen: TT.origen, visita: TT.visita, ver: C().VERSION, disp: dev }, data || {});
    if (new URLSearchParams(location.search).get('debug')) { (TT.log = TT.log || []).push(o); console.log('[track]', o); }
    if (!(await post(o))) { const qq = readQ(); qq.push(o); lset(QK, JSON.stringify(qq.slice(-50))); }
  };
  addEventListener('online', flush); setTimeout(flush, 2500);

  /* Ranking del día de la tienda (lo calcula el Apps Script). Si falla, devuelve null. */
  TT.ranking = async function () {
    const u = C().URL; if (!u) return null;
    try {
      const r = await fetch(u + '?accion=ranking&t=' + encodeURIComponent(TT.tienda), { cache: 'no-store' });
      const j = await r.json(); return j && j.ok ? j.top : null;
    } catch (e) { return null; }
  };
  TT.store = { get: lget, set: lset };
})();
