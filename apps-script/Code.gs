/**
 * Tu pelo, tu cepillo | backend en Google Apps Script
 * Recibe los eventos anónimos de la app (POST) y los guarda en la hoja "Eventos".
 * No guarda IP, nombre, teléfono ni imágenes. Solo respuestas del test, modelo recomendado y resultado del escaneo.
 */
var TZ = 'America/Santiago';
var H = ['Fecha y hora (Chile)', 'Tienda', 'Origen', 'Visita', 'Evento', 'Tipo de pelo', 'Se enreda', 'Momento', 'Modelo recomendado', 'Modelo escaneado o elegido', 'Resultado del escaneo', 'Dispositivo', 'Versión'];
var EVENTOS = ['inicio', 'test', 'escaneo', 'lista', 'otro_modelo', 'puente'];

function txt(v, n) { var s = String(v == null ? '' : v).slice(0, n); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function num(v, a, b) { var x = Math.round(Number(v)); return isFinite(x) ? Math.max(a, Math.min(b, x)) : ''; }
function hoja(ss) {
  var sh = ss.getSheetByName('Eventos');
  if (!sh) { sh = ss.insertSheet('Eventos'); sh.setFrozenRows(1); }
  for (var i = 0; i < H.length; i++) {                         // agrega los encabezados que falten
    var c = sh.getRange(1, i + 1);
    if (c.getValue() === '') c.setValue(H[i]).setFontWeight('bold').setBackground('#007dc3').setFontColor('#ffffff');
  }
  return sh;
}
function doPost(e) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var d = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (d.camp !== 'cepillo' || EVENTOS.indexOf(d.evt) < 0) return salida({ ok: false });
    var f = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
    hoja(SpreadsheetApp.getActiveSpreadsheet()).appendRow([f, txt(d.tienda, 24), txt(d.origen, 24), num(d.visita, 1, 100000), d.evt, txt(d.pelo, 20), txt(d.enredo, 20), txt(d.momento, 20), txt(d.recomendado, 30), txt(d.escaneado, 30), txt(d.resultado, 20), txt(d.disp, 12), txt(d.ver, 10)]);
    return salida({ ok: true });
  } catch (err) { return salida({ ok: false }); } finally { lock.releaseLock(); }
}
function doGet() { return salida({ ok: true, servicio: 'tu pelo, tu cepillo' }); }
function salida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
