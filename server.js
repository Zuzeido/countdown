const express = require('express');
const { GifWriter } = require('omggif');

const app = express();
const PORT = process.env.PORT || 3000;

// Función para calcular la diferencia de tiempo
function getTimeDifference(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

// Convertir hex a RGB
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

// Dibujar un dígito simple (8x12 pixels) usando una matriz de bits
const DIGIT_PATTERNS = {
  '0': [
    '  ████  ',
    ' ██  ██ ',
    '██    ██',
    '██    ██',
    '██    ██',
    '██    ██',
    '██    ██',
    '██    ██',
    '██    ██',
    ' ██  ██ ',
    '  ████  ',
    '        '
  ],
  '1': [
    '   ██   ',
    ' ████   ',
    '   ██   ',
    '   ██   ',
    '   ██   ',
    '   ██   ',
    '   ██   ',
    '   ██   ',
    '   ██   ',
    '   ██   ',
    ' ██████ ',
    '        '
  ],
  '2': [
    '  ████  ',
    ' ██  ██ ',
    '██    ██',
    '      ██',
    '     ██ ',
    '    ██  ',
    '   ██   ',
    '  ██    ',
    ' ██     ',
    '██      ',
    '████████',
    '        '
  ],
  '3': [
    '  ████  ',
    ' ██  ██ ',
    '      ██',
    '      ██',
    '   ███  ',
    '      ██',
    '      ██',
    '      ██',
    '      ██',
    ' ██  ██ ',
    '  ████  ',
    '        '
  ],
  '4': [
    '     ██ ',
    '    ███ ',
    '   ████ ',
    '  ██ ██ ',
    ' ██  ██ ',
    '██   ██ ',
    '████████',
    '     ██ ',
    '     ██ ',
    '     ██ ',
    '     ██ ',
    '        '
  ],
  '5': [
    '████████',
    '██      ',
    '██      ',
    '██      ',
    '██████  ',
    '     ██ ',
    '      ██',
    '      ██',
    '      ██',
    ' ██  ██ ',
    '  ████  ',
    '        '
  ],
  '6': [
    '  ████  ',
    ' ██  ██ ',
    '██      ',
    '██      ',
    '██████  ',
    '███  ██ ',
    '██    ██',
    '██    ██',
    '██    ██',
    ' ██  ██ ',
    '  ████  ',
    '        '
  ],
  '7': [
    '████████',
    '      ██',
    '     ██ ',
    '    ██  ',
    '   ██   ',
    '  ██    ',
    '  ██    ',
    ' ██     ',
    ' ██     ',
    '██      ',
    '██      ',
    '        '
  ],
  '8': [
    '  ████  ',
    ' ██  ██ ',
    '██    ██',
    '██    ██',
    ' ██  ██ ',
    '  ████  ',
    ' ██  ██ ',
    '██    ██',
    '██    ██',
    ' ██  ██ ',
    '  ████  ',
    '        '
  ],
  '9': [
    '  ████  ',
    ' ██  ██ ',
    '██    ██',
    '██    ██',
    '██    ██',
    ' ██  ███',
    '  ██████',
    '      ██',
    '      ██',
    ' ██  ██ ',
    '  ████  ',
    '        '
  ]
};

// Función para dibujar texto simple en el buffer
function drawText(buffer, width, text, x, y, scale, colorIndex) {
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ') {
      x += 6 * scale;
      continue;
    }
    
    const pattern = DIGIT_PATTERNS[char];
    if (!pattern) continue;

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] === '█') {
          // Dibujar pixel con escala
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              const px = x + col * scale + sx;
              const py = y + row * scale + sy;
              if (px >= 0 && px < width && py >= 0 && py < 250) {
                buffer[py * width + px] = colorIndex;
              }
            }
          }
        }
      }
    }
    x += 9 * scale;
  }
}

// Generar un frame del GIF
function generateFrame(days, hours, minutes, seconds, width, height, bgIndex, textIndex) {
  const buffer = new Uint8Array(width * height);
  buffer.fill(bgIndex); // Fondo

  const scale = 6; // Escala de los dígitos
  
  // Dibujar números y etiquetas
  const sections = [
    { value: String(days).padStart(2, '0'), label: 'DIAS', x: 40 },
    { value: String(hours).padStart(2, '0'), label: 'HORAS', x: 220 },
    { value: String(minutes).padStart(2, '0'), label: 'MINUTOS', x: 400 },
    { value: String(seconds).padStart(2, '0'), label: 'SEGUNDOS', x: 600 }
  ];

  sections.forEach(section => {
    // Dibujar número (grande)
    drawText(buffer, width, section.value, section.x, 70, scale, textIndex);
    
    // Dibujar label (pequeño)
    drawText(buffer, width, section.label, section.x + 10, 160, 2, textIndex);
  });

  return buffer;
}

// Generar GIF animado completo
function generateCountdownGIF(targetDate, bgColor, textColor, duration) {
  const width = 800;
  const height = 250;

  // Crear paleta de colores en formato hexadecimal (potencia de 2)
  const bgRgb = hexToRgb(bgColor);
  const textRgb = hexToRgb(textColor);
  
  // Convertir RGB a formato hexadecimal 0xRRGGBB
  const bgHex = (bgRgb.r << 16) | (bgRgb.g << 8) | bgRgb.b;
  const textHex = (textRgb.r << 16) | (textRgb.g << 8) | textRgb.b;
  
  // Paleta con 4 colores (2^2)
  const palette = [bgHex, textHex, 0x000000, 0x000000];

  // Calcular tiempo inicial
  let { days, hours, minutes, seconds } = getTimeDifference(targetDate);

  // Crear buffer para el GIF
  const gifBuffer = new Uint8Array(width * height * duration * 2);
  const gif = new GifWriter(gifBuffer, width, height, { 
    loop: 0, 
    palette: palette 
  });

  // Generar frames
  for (let i = 0; i < duration; i++) {
    const frameData = generateFrame(days, hours, minutes, seconds, width, height, 0, 1);
    
    gif.addFrame(0, 0, width, height, frameData, {
      delay: 100 // 100 * 10ms = 1 segundo
    });

    // Decrementar tiempo
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
      if (minutes < 0) {
        minutes = 59;
        hours--;
        if (hours < 0) {
          hours = 23;
          days--;
          if (days < 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
          }
        }
      }
    }
  }

  // Retornar solo la parte usada del buffer
  return gifBuffer.slice(0, gif.end());
}

// Ruta principal
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Countdown GIF API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          h1 { color: #333; }
          code {
            background: #e0e0e0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
          }
          .example {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          pre {
            background: #2d2d2d;
            color: #f8f8f8;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <h1>🎯 Countdown GIF API</h1>
        <p>Genera GIFs animados de cuenta atrás en tiempo real para emails.</p>
        
        <div class="example">
          <h2>📖 Uso básico</h2>
          <p><code>/countdown?date=YYYY-MM-DD&time=HH:MM</code></p>
          
          <h3>Ejemplo:</h3>
          <img src="/countdown?date=2026-02-27&time=21:00&duration=30" alt="Countdown">
          <pre>&lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00&duration=30"&gt;</pre>
        </div>

        <div class="example">
          <h2>🎨 Parámetros</h2>
          <ul>
            <li><code>date</code> - Fecha (YYYY-MM-DD) ✅ Requerido</li>
            <li><code>time</code> - Hora (HH:MM) ✅ Requerido</li>
            <li><code>bg</code> - Color fondo (hex sin #, default: 000000)</li>
            <li><code>color</code> - Color texto (hex sin #, default: FFFFFF)</li>
            <li><code>duration</code> - Segundos de animación (default: 60, max: 120)</li>
          </ul>
        </div>

        <div class="example">
          <h2>📧 Para Klaviyo</h2>
          <pre>&lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00&duration=30"&gt;</pre>
        </div>

        <div class="example">
          <h2>✅ Características</h2>
          <ul>
            <li>✅ GIF animado - segundos bajando</li>
            <li>✅ Sin marca de agua</li>
            <li>✅ 100% JavaScript puro</li>
            <li>✅ Funciona en Vercel</li>
            <li>✅ Loop infinito</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Ruta para generar GIF
app.get('/countdown', (req, res) => {
  try {
    const { date, time, bg, color, duration } = req.query;

    if (!date || !time) {
      return res.status(400).send('Faltan parámetros: date y time son requeridos');
    }

    const targetDate = `${date}T${time}:00`;
    const bgColor = bg ? `#${bg}` : '#000000';
    const textColor = color ? `#${color}` : '#FFFFFF';
    const gifDuration = duration ? Math.min(parseInt(duration), 120) : 60;

    console.log(`Generando GIF de ${gifDuration}s...`);

    const gifBuffer = generateCountdownGIF(targetDate, bgColor, textColor, gifDuration);

    res.set({
      'Content-Type': 'image/gif',
      'Cache-Control': 'public, max-age=3600',
      'Content-Length': gifBuffer.length
    });

    res.send(Buffer.from(gifBuffer));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generando el GIF');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log(`📸 Ejemplo: http://localhost:${PORT}/countdown?date=2026-02-27&time=21:00`);
});
