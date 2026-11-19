/* ============================================================
   Tu pelo, tu cepillo | configuración (lo único que se edita)
   IMPORTANTE: las reglas, textos y códigos de barras de los modelos son EJEMPLOS.
   Reemplazarlos con la ficha oficial de Tangle Teezer y los códigos de barras reales del surtido de Salcobrand.
   ============================================================ */
window.TT = window.TT || {};
TT.CONFIG = {
  CAMP: 'cepillo',
  VERSION: '1',
  /* URL de la aplicación web de Google Apps Script (ver README). Vacío = no se envían métricas. */
  URL: '',
  /* Mientras sea true se muestra "Modo de prueba". Poner false al lanzar. */
  MODO_PRUEBA: true,
  /* Enlace opcional a la otra campaña ("Desenreda el nudo"). Vacío = no se muestra el botón. */
  DESENREDA_URL: '',

  PREGUNTAS: [
    { id: 'pelo', t: '¿Cómo es tu pelo?', op: [
      { v: 'liso', t: 'Liso' }, { v: 'ondulado', t: 'Ondulado' }, { v: 'rizado', t: 'Rizado' }, { v: 'grueso', t: 'Grueso y abundante' }, { v: 'fino', t: 'Fino y delicado' }] },
    { id: 'enredo', t: '¿Se te enreda?', op: [
      { v: 'poco', t: 'Casi nunca' }, { v: 'aveces', t: 'A veces' }, { v: 'mucho', t: 'Todo el tiempo' }] },
    { id: 'momento', t: '¿Cuándo lo peinas?', op: [
      { v: 'seco', t: 'Con el pelo seco' }, { v: 'mojado', t: 'Mojado o en la ducha' }, { v: 'viaje', t: 'En la mochila o el bolso, de paso' }] }
  ],
  ETIQUETAS: { pelo: { liso: 'liso', ondulado: 'ondulado', rizado: 'rizado', grueso: 'grueso y abundante', fino: 'fino y delicado' }, enredo: { poco: 'casi no se te enreda', aveces: 'se te enreda a veces', mucho: 'se te enreda mucho' }, momento: { seco: 'lo peinas seco', mojado: 'lo peinas mojado', viaje: 'lo peinas de paso' } },

  /* ean: código de barras del envase (13 u 8 dígitos). Si queda vacío, ese modelo no se puede reconocer al escanear.
     perfil: puntos que suma el modelo según cada respuesta (0 a 5). Gana el que más suma. */
  MODELOS: [
    { id: 'original', nombre: 'The Original', ean: '', disponible: true, color: '#b7a2e6', acento: '#e3c4f2', forma: 'oval', dientes: 1, escala: 1,
      resumen: 'El clásico para el uso diario: un solo cepillo para casi todo tipo de pelo, en seco o mojado.',
      paraQuien: 'Para quien quiere un cepillo para todos los días y no tiene un pelo muy extremo.',
      comoUsar: 'Peina desde las puntas hacia arriba, con movimientos suaves y sin apuro, en pelo seco o húmedo.',
      ojo: 'Si tu pelo es muy grueso o muy rizado, mira también el modelo pensado para ese tipo.',
      perfil: { pelo: { liso: 3, ondulado: 3, rizado: 2, grueso: 1, fino: 2 }, enredo: { poco: 3, aveces: 2, mucho: 1 }, momento: { seco: 3, mojado: 2, viaje: 1 } } },
    { id: 'compact', nombre: 'Compact Styler', ean: '', disponible: true, color: '#e8a3bd', acento: '#f6d3df', forma: 'compacto', dientes: 1.1, escala: 1,
      resumen: 'Tamaño compacto para llevarlo a todas partes y peinarte de paso.',
      paraQuien: 'Para quien se peina en la oficina, el gimnasio o de viaje y quiere algo que quepa en el bolso.',
      comoUsar: 'Pasa el cepillo con suavidad desde las puntas hacia arriba. Guárdalo con su tapa para llevarlo limpio.',
      ojo: 'Por su tamaño pequeño, en pelo muy abundante tendrás que hacer más pasadas.',
      perfil: { pelo: { liso: 2, ondulado: 2, rizado: 1, grueso: 0, fino: 2 }, enredo: { poco: 2, aveces: 2, mucho: 1 }, momento: { seco: 1, mojado: 1, viaje: 5 } } },
    { id: 'thick', nombre: 'Thick & Curly', ean: '', disponible: true, color: '#b3623a', acento: '#e9a37a', forma: 'oval', dientes: 0.8, escala: 1.12,
      resumen: 'Pensado para pelo grueso, abundante o rizado.',
      paraQuien: 'Para quien tiene mucho volumen o rizos y busca desenredar sin deshacer su forma.',
      comoUsar: 'Peina por secciones, de las puntas hacia la raíz. Funciona bien con el pelo húmedo o con acondicionador.',
      ojo: 'En pelo liso y fino puede ser más cepillo del que necesitas.',
      perfil: { pelo: { liso: 0, ondulado: 2, rizado: 4, grueso: 4, fino: 0 }, enredo: { poco: 1, aveces: 2, mucho: 3 }, momento: { seco: 2, mojado: 3, viaje: 0 } } },
    { id: 'wet', nombre: 'Wet Detangler', ean: '', disponible: true, color: '#8d78d8', acento: '#d6c3f5', forma: 'mango', dientes: 1, escala: 0.72,
      resumen: 'Con mango, para desenredar el pelo mojado, en la ducha o recién lavado.',
      paraQuien: 'Para quien se enreda mucho al salir de la ducha y quiere peinarse con comodidad.',
      comoUsar: 'Con el pelo mojado o con acondicionador, sostén el mango y peina desde las puntas hacia arriba, con calma.',
      ojo: 'Está pensado para pelo mojado: para peinarte en seco, otro modelo te servirá más.',
      perfil: { pelo: { liso: 2, ondulado: 2, rizado: 2, grueso: 2, fino: 2 }, enredo: { poco: 0, aveces: 2, mucho: 4 }, momento: { seco: 0, mojado: 5, viaje: 0 } } },
    { id: 'fine', nombre: 'Fine & Fragile', ean: '', disponible: true, color: '#d9b46a', acento: '#f3dfa8', forma: 'oval', dientes: 1.35, escala: 0.95,
      resumen: 'Pensado para pelo fino y delicado.',
      paraQuien: 'Para quien tiene el pelo fino y quiere peinarlo con más cuidado.',
      comoUsar: 'Peina con suavidad, de las puntas hacia arriba, sin tirar. Evita hacerlo con el pelo muy mojado.',
      ojo: 'Si tu pelo es grueso o muy rizado, este modelo se te va a quedar corto.',
      perfil: { pelo: { liso: 1, ondulado: 1, rizado: 1, grueso: 0, fino: 5 }, enredo: { poco: 2, aveces: 2, mucho: 2 }, momento: { seco: 3, mojado: 2, viaje: 1 } } }
  ]
};
