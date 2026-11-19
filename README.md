# Tu pelo, tu cepillo (Tangle Teezer en Salcobrand)

Asesor de realidad aumentada para la góndola. La persona responde **3 preguntas**, la cámara queda de fondo y ve en **3D el cepillo que le conviene**, con tarjetas de "para quién es", "cómo usarlo", "ojo con esto" y "dónde está". Puede **escanear el código de barras** del envase que tiene en la mano para saber si es el indicado, y guardar su elección en **Mi lista**.

```
TANGLE-CEPILLO/
├── index.html           Pantallas (bienvenida, test, resultado, escáner)
├── css/app.css          Estilos (línea gráfica)
├── fonts/               Poppins y Cormorant Garamond (woff2, licencia OFL)
├── js/
│   ├── config.js        LO QUE SE EDITA: modelos, textos, códigos de barras, reglas, URL de la planilla
│   ├── recommend.js     Motor de recomendación (suma de puntos, fácil de auditar)
│   ├── app.js           Flujo, 3D, tarjetas, escáner, lista
│   ├── scan.js          Lector de código de barras (BarcodeDetector o ZXing)
│   ├── cam.js           Cámara de fondo (si no hay permiso, sigue funcionando)
│   ├── track.js         Métricas anónimas hacia Google Sheets
│   └── brush.js         Cepillo 3D de ejemplo hecho por código
├── lib/                 three.min.js (r150, MIT) y zxing.min.js (@zxing/library 0.21, MIT)
├── img/sb-logo.png      Logo Salcobrand
├── qr/qr-ejemplo.png    QR de ejemplo (cambia NOMBRE-TIENDA por el código de cada tienda)
├── apps-script/         Backend en Google Sheets (Code.gs y appsscript.json)
└── .nojekyll
```

## Línea gráfica
Paleta "Metal-verso" tomada de las imágenes de la marca y de Salco Lente: fondo champagne perla, lila y rosa de acento, cobre y dorado para los metálicos, tinta casi negra en los textos. Titulares en Poppins (negrita) con una palabra en Cormorant Garamond cursiva, iconos de línea (sin emojis) y tarjetas de vidrio claro. Las fuentes van incluidas en `fonts/` (no dependen de internet). Los colores están como variables al inicio de `css/app.css` (`--violet`, `--rose`, `--copper`, `--gold`, `--champ`), y los colores de los cepillos 3D en `js/config.js`.

## Flujo
1. **Bienvenida**: "Empezar" (test) o "Ya tengo uno en la mano" (directo al escáner).
2. **Test** de 3 preguntas: tipo de pelo, si se enreda, cuándo lo peina.
3. **Resultado**: cepillo 3D que gira (se puede girar con el dedo), por qué se recomienda, afinidad, 4 tarjetas (tocar para leer completa), opciones alternativas y botones para guardar, escanear o repetir.
4. **Escáner**: lee el código del envase y responde:
   - "¡Es el indicado para ti!"
   - "Ese es X, para tu pelo te conviene Y" (con botón para ver Y)
   - "No tenemos ese producto en esta campaña"
   También se puede escribir el código a mano.
5. **Mi lista**: se guarda solo en el celular.

## IMPORTANTE: completar con datos reales
Todo lo que aparece de cada modelo en `js/config.js` (`MODELOS`) es **un ejemplo** hasta contrastarlo con la ficha oficial de Tangle Teezer:
- **`ean`**: código de barras de cada envase. **Está vacío**: mientras esté vacío, ese modelo no se reconoce al escanear. Cargar los reales del surtido de Salcobrand (13 u 8 dígitos; el cero inicial no importa).
- **`perfil`**: puntos (0 a 5) que suma el modelo según cada respuesta. Es la regla de recomendación: revisarla con la marca.
- **`resumen`, `paraQuien`, `comoUsar`, `ojo`**: textos de ejemplo. Reemplazar por lo que diga la ficha oficial. No agregar promesas médicas.
- **`pasillo`** (opcional): dónde está en cada tienda; si se deja vacío dice "pregunta en la góndola de cuidado del cabello".
- **`disponible: false`** oculta un modelo que una campaña no incluya.

## Poner en marcha
### 1. Planilla y backend (Google Sheets)
1. Crea una planilla nueva (por ejemplo "Tu pelo, tu cepillo").
2. **Extensiones > Apps Script**. Pega `apps-script/Code.gs`. En *Configuración del proyecto* activa "Mostrar archivo de manifiesto appsscript.json" y pega el de este repo.
3. **Implementar > Nueva implementación > Aplicación web**. Ejecutar como: *yo*. Quién tiene acceso: *cualquier persona*. Copia la URL que termina en `/exec` y acepta los permisos.
4. Pega esa URL en `js/config.js`, campo `URL`.
5. Si luego cambias el script: **Implementar > Administrar implementaciones > editar > Versión nueva** (la URL no cambia).

La hoja `Eventos` se crea sola.

### 2. Publicar en GitHub Pages
1. Crea el repositorio (sugerido: `TANGLE-CEPILLO`) y sube **todo el contenido de esta carpeta** a la raíz.
2. **Settings > Pages > Deploy from a branch > main / (root)**.
3. Queda en `https://cvaldovinos25.github.io/TANGLE-CEPILLO/`.
4. Para ver cambios nuevos, recarga con Ctrl+Shift+R o cambia el `?v=` de los scripts en `index.html`.

### 3. Antes de lanzar
- Cargar `ean` reales y revisar textos y reglas con la marca.
- `MODO_PRUEBA: false`.
- Pegar la `URL` del Apps Script.
- Un QR por tienda: `https://cvaldovinos25.github.io/TANGLE-CEPILLO/?t=SB-LAS-CONDES` (opcional `&origen=cartel`).

## Métricas (hoja `Eventos`)
Fecha y hora, tienda, origen, visita (1 = primera, 2 o más = repetición), evento (`inicio`, `test`, `escaneo`, `lista`, `otro_modelo`, `puente`), tipo de pelo, si se enreda, momento, modelo recomendado, modelo escaneado o elegido, resultado del escaneo (`correcto`, `otro`, `no_reconocido`, `sin_test`), dispositivo y versión. Con eso se ve qué pelos consultan más, qué modelo se recomienda, cuántos confirman con el envase y cuántos recomendaciones coinciden con lo que ya tenían en la mano.

## Escáner: compatibilidad
- Android (Chrome): usa el lector nativo del navegador.
- iPhone (Safari): usa ZXing, funciona pero un poco más lento. Si no logra leer, se puede escribir el código.
- Requiere HTTPS (GitHub Pages lo cumple) y permiso de cámara.

## Privacidad
No se piden ni guardan nombre, correo, teléfono, IP ni imágenes. La cámara solo es fondo y lector de códigos. La lista, el contador de visitas y la cola de eventos se guardan en el propio celular.

## Puente con la otra campaña
Si publican también "Desenreda el nudo", poner su URL en `DESENREDA_URL` y en el resultado aparece el botón para jugar y ganar un cupón.

## Pendiente con la marca
Cepillos 3D de ejemplo hechos por código (forma, color y dientes configurables en `MODELOS`). Se pueden reemplazar por fotos o modelos reales. No se usa el logo de Tangle Teezer, solo el nombre en texto.
