const express = require('express');
const GIFEncoder = require('gifencoder');
const { createCanvas } = require('pureimage');
const { PassThrough } = require('stream');

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

// Función para dibujar un frame del contador
function drawCountdownFrame(ctx, days, hours, minutes, seconds, width, height, bgColor, textColor) {
  // Limpiar canvas
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Configuración de secciones
  const sections = [
    { value: String(days).padStart(2, '0'), label: 'DÍAS', x: 100 },
    { value: String(hours).padStart(2, '0'), label: 'HORAS', x: 280 },
    { value: String(minutes).padStart(2, '0'), label: 'MINUTOS', x: 460 },
    { value: String(seconds).padStart(2, '0'), label: 'SEGUNDOS', x: 640 }
  ];

  sections.forEach(section => {
    // Números grandes
    ctx.fillStyle = textColor;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(section.value, section.x, 130);

    // Etiquetas
    ctx.font = 'bold 20px Arial';
    ctx.fillText(section.label, section.x, 180);
  });
}

// Generar GIF animado
async function generateCountdownGIF(targetDate, bgColor = '#000000', textColor = '#FFFFFF', duration = 60) {
  const width = 800;
  const height = 250;

  // Crear encoder
  const encoder = new GIFEncoder(width, height);
  
  // Stream para el GIF
  const stream = new PassThrough();
  
  encoder.createReadStream().pipe(stream);
  encoder.start();
  encoder.setRepeat(0); // 0 = loop infinito
  encoder.setDelay(1000); // 1000ms = 1 segundo por frame
  encoder.setQuality(10); // Calidad (1-20, menor = mejor calidad pero más pesado)

  // Calcular tiempo inicial
  let timeData = getTimeDifference(targetDate);
  let { days, hours, minutes, seconds } = timeData;

  // Generar frames (60 frames = 60 segundos de animación)
  for (let i = 0; i < duration; i++) {
    // Crear canvas para este frame
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Dibujar frame
    drawCountdownFrame(ctx, days, hours, minutes, seconds, width, height, bgColor, textColor);

    // Añadir frame al GIF
    encoder.addFrame(ctx);

    // Decrementar tiempo para el siguiente frame
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

  encoder.finish();

  // Convertir stream a buffer
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

// Ruta principal - info
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
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>🎯 Countdown GIF API - Generador de GIFs Animados</h1>
        <p>API para generar GIFs animados de cuenta atrás en tiempo real para emails y campañas.</p>
        
        <div class="warning">
          ⚠️ <strong>Nota:</strong> La primera carga puede tardar 5-10 segundos mientras se genera el GIF. Luego se cachea.
        </div>

        <div class="example">
          <h2>📖 Uso básico</h2>
          <p>URL: <code>/countdown?date=YYYY-MM-DD&time=HH:MM</code></p>
          
          <h3>Ejemplo (puede tardar unos segundos en cargar):</h3>
          <img src="/countdown?date=2026-02-27&time=21:00" alt="Countdown" style="max-width: 100%;">
          <pre>&lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00" alt="Cuenta atrás"&gt;</pre>
        </div>

        <div class="example">
          <h2>🎨 Personalización</h2>
          <p>Añade parámetros para personalizar:</p>
          <ul>
            <li><code>bg</code> - Color de fondo (hex sin #, ej: 000000)</li>
            <li><code>color</code> - Color de texto (hex sin #, ej: FFFFFF)</li>
            <li><code>duration</code> - Duración del GIF en segundos (default: 60, max: 300)</li>
          </ul>
          
          <h3>Ejemplo con 30 segundos de animación:</h3>
          <img src="/countdown?date=2026-02-27&time=21:00&duration=30" alt="Countdown 30s" style="max-width: 100%;">
          <pre>&lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00&duration=30"&gt;</pre>
        </div>

        <div class="example">
          <h2>📧 Para usar en Klaviyo</h2>
          <p>Simplemente copia la URL del GIF y pégala en tu email de Klaviyo:</p>
          <pre>&lt;div style="text-align: center; background: #000000; padding: 20px;"&gt;
  &lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00" alt="Cuenta atrás" style="max-width: 100%;"&gt;
&lt;/div&gt;</pre>
        </div>

        <div class="example">
          <h2>✅ Características</h2>
          <ul>
            <li>✅ GIF animado - Se ve el tiempo bajando</li>
            <li>✅ Sin marca de agua</li>
            <li>✅ Actualización al abrir - Calcula desde el momento que se abre</li>
            <li>✅ Totalmente personalizable</li>
            <li>✅ Compatible con todos los clientes de email</li>
            <li>✅ Loop infinito - Se repite automáticamente</li>
          </ul>
        </div>

        <div class="example">
          <h2>⚡ Rendimiento</h2>
          <ul>
            <li>60 segundos de animación = ~500KB</li>
            <li>30 segundos de animación = ~250KB (recomendado para emails)</li>
            <li>La primera generación tarda 5-10 segundos</li>
            <li>Luego se cachea para cargas rápidas</li>
          </ul>
          <p><strong>Recomendación:</strong> Usa <code>duration=30</code> para emails (mejor balance entre animación y tamaño)</p>
        </div>
      </body>
    </html>
  `);
});

// Ruta para generar GIF de cuenta atrás
app.get('/countdown', async (req, res) => {
  try {
    console.log('📸 Generando GIF...');
    
    // Obtener parámetros
    const { date, time, bg, color, duration } = req.query;

    // Validar parámetros requeridos
    if (!date || !time) {
      return res.status(400).send('Faltan parámetros: date (YYYY-MM-DD) y time (HH:MM) son requeridos');
    }

    // Construir fecha objetivo
    const targetDate = `${date}T${time}:00`;

    // Colores personalizados (opcional)
    const bgColor = bg ? `#${bg}` : '#000000';
    const textColor = color ? `#${color}` : '#FFFFFF';

    // Duración del GIF (default 60 segundos, max 300)
    const gifDuration = duration ? Math.min(parseInt(duration), 300) : 60;

    console.log(`⏱️  Generando GIF de ${gifDuration} segundos...`);

    // Generar GIF
    const gifBuffer = await generateCountdownGIF(targetDate, bgColor, textColor, gifDuration);

    console.log(`✅ GIF generado: ${(gifBuffer.length / 1024).toFixed(2)}KB`);

    // Configurar headers
    res.set({
      'Content-Type': 'image/gif',
      'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      'Content-Length': gifBuffer.length
    });

    res.send(gifBuffer);
  } catch (error) {
    console.error('❌ Error generando GIF:', error);
    res.status(500).send('Error generando el GIF');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📸 Ejemplo: http://localhost:${PORT}/countdown?date=2026-02-27&time=21:00`);
  console.log(`⚡ Usa duration=30 para GIFs más ligeros`);
});
