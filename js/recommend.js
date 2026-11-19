/* Motor de recomendación: suma los puntos del perfil de cada modelo según las 3 respuestas. Simple y fácil de auditar. */
(function () {
  const TT = window.TT;
  TT.recomendar = function (resp) {
    const C = TT.CONFIG, lista = C.MODELOS.filter((m) => m.disponible).map((m) => {
      let pts = 0, max = 0;
      ['pelo', 'enredo', 'momento'].forEach((k) => { pts += (m.perfil[k] || {})[resp[k]] || 0; max += Math.max.apply(null, Object.values(m.perfil[k] || { x: 0 })); });
      return { modelo: m, pts, afinidad: max ? Math.round(pts / max * 100) : 0 };
    });
    lista.sort((a, b) => b.pts - a.pts || b.afinidad - a.afinidad);   // si empatan, queda primero el que aparece antes en la lista
    return lista;
  };
  TT.porque = function (resp) {
    const e = TT.CONFIG.ETIQUETAS; return 'Tu pelo es ' + e.pelo[resp.pelo] + ', ' + e.enredo[resp.enredo] + ' y ' + e.momento[resp.momento] + '.';
  };
})();
