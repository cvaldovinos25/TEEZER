/* Cepillo 3D de ejemplo, hecho por código (sin fotos): cuerpo ovalado, dientes en dos alturas y, si se pide, mango.
   Sirve de reemplazo hasta tener los modelos reales del producto. Uso: TT.makeBrush(THREE, { color, acento, forma, dientes, escala }). */
(function () {
  const TT = (window.TT = window.TT || {});
  TT.makeBrush = function (THREE, o) {
    o = Object.assign({ color: '#b7a2e6', acento: '#e3c4f2', forma: 'oval', dientes: 1, escala: 1 }, o || {});
    const g = new THREE.Group(), a = o.forma === 'compacto' ? 0.62 : 0.78, b = o.forma === 'compacto' ? 0.82 : 1.05;   // semiejes del óvalo
    const sh = new THREE.Shape(); sh.absellipse(0, 0, a, b, 0, Math.PI * 2, false, 0);
    const bodyGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 5, curveSegments: 48 });
    bodyGeo.translate(0, 0, -0.1);
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshPhysicalMaterial({ color: o.color, roughness: 0.28, metalness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.12 }));
    g.add(body);
    // aro claro alrededor de los dientes
    const rim = new THREE.Mesh(new THREE.TorusGeometry(Math.min(a, b) * 0.98, 0.012, 8, 64), new THREE.MeshStandardMaterial({ color: o.acento, roughness: 0.4 }));
    rim.scale.set(a / Math.min(a, b), b / Math.min(a, b), 1); rim.position.z = 0.17; g.add(rim);
    // dientes: rejilla dentro del óvalo, más altos en el centro (dos alturas)
    const step = 0.17 / o.dientes, pts = [];
    for (let y = -b * 0.84; y <= b * 0.84; y += step) for (let x = -a * 0.84; x <= a * 0.84; x += step) {
      const off = (Math.round(y / step) % 2) ? step / 2 : 0, xx = x + off;
      if ((xx * xx) / (a * a * 0.72) + (y * y) / (b * b * 0.72) < 1) pts.push([xx, y]);
    }
    const toothGeo = new THREE.CylinderGeometry(0.016, 0.03, 0.3, 8); toothGeo.rotateX(Math.PI / 2); toothGeo.translate(0, 0, 0.15);
    const teeth = new THREE.InstancedMesh(toothGeo, new THREE.MeshStandardMaterial({ color: o.acento, roughness: 0.5 }), pts.length), m = new THREE.Matrix4();
    pts.forEach((p, i) => { const k = ((Math.round(p[0] / step) + Math.round(p[1] / step)) % 2 === 0) ? 1 : 0.72; m.makeScale(1, 1, k); m.setPosition(p[0], p[1], 0.17); teeth.setMatrixAt(i, m); });
    g.add(teeth);
    if (o.forma === 'mango') {   // versión con mango (por ejemplo para usar en la ducha)
      const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.1, 6, 16), new THREE.MeshPhysicalMaterial({ color: o.color, roughness: 0.28, metalness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.12 }));
      h.position.set(0, -b - 0.45, 0); g.add(h);
    }
    g.scale.setScalar(o.escala);
    g.userData.height = (b * 2 + (o.forma === 'mango' ? 1.4 : 0)) * o.escala;
    return g;
  };
})();
