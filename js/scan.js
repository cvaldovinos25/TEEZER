/* Lectura del código de barras del envase. Usa BarcodeDetector si el navegador lo tiene (Chrome en Android);
   si no (iPhone), usa ZXing (lib/zxing.min.js). */
(function () {
  const TT = window.TT, scan = (TT.scan = { on: false });
  let timer = 0, det = null, zx = null, cv = null;
  const FORMATOS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
  scan.start = async function (video, onCode) {
    scan.stop(); scan.on = true;
    if ('BarcodeDetector' in window) { try { det = new BarcodeDetector({ formats: FORMATOS }); } catch (e) { det = null; } }
    if (!det && window.ZXing) {
      const Z = window.ZXing, hints = new Map(); hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E]); hints.set(Z.DecodeHintType.TRY_HARDER, true);
      zx = new Z.MultiFormatReader(); zx.setHints(hints);
    }
    cv = cv || document.createElement('canvas');
    timer = setInterval(async () => {
      if (!scan.on || video.readyState < 2 || !video.videoWidth) return;
      try {
        let code = null;
        if (det) { const r = await det.detect(video); if (r.length) code = r[0].rawValue; }
        else if (zx) {
          const w = Math.min(960, video.videoWidth), h = Math.round(w * video.videoHeight / video.videoWidth); cv.width = w; cv.height = h;
          cv.getContext('2d', { willReadFrequently: true }).drawImage(video, 0, 0, w, h);
          const Z = window.ZXing; try { code = zx.decode(new Z.BinaryBitmap(new Z.HybridBinarizer(new Z.HTMLCanvasElementLuminanceSource(cv)))).getText(); } catch (e) { code = null; }
        }
        if (code && scan.on) { scan.stop(); onCode(String(code)); }
      } catch (e) { /* un cuadro que falla no detiene la lectura */ }
    }, 220);
  };
  scan.stop = function () { scan.on = false; clearInterval(timer); timer = 0; };
  scan.norm = (c) => String(c || '').replace(/\D/g, '').replace(/^0+/, '');
})();
