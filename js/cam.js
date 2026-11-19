/* Cámara trasera como fondo de la experiencia. Si no hay permiso o cámara, la experiencia sigue sobre un fondo de color. */
(function () {
  const TT = (window.TT = window.TT || {});
  const cam = (TT.cam = { stream: null, on: false });
  cam.start = async function (video) {
    cam.stop();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('sin getUserMedia');
      cam.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      video.srcObject = cam.stream; video.muted = true; video.setAttribute('playsinline', '');
      await video.play(); cam.on = true; document.body.classList.add('cam-on');
      return true;
    } catch (e) { cam.on = false; document.body.classList.remove('cam-on'); return false; }
  };
  cam.stop = function () {
    if (cam.stream) cam.stream.getTracks().forEach((t) => t.stop());
    cam.stream = null; cam.on = false; document.body.classList.remove('cam-on');
  };
})();
