const express = require('express');

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

// Función para generar SVG del contador
function generateCountdownSVG(days, hours, minutes, seconds, bgColor = '#000000', textColor = '#FFFFFF') {
  const width = 800;
  const height = 250;

  // Configuración de secciones
  const sections = [
    { value: String(days).padStart(2, '0'), label: 'DÍAS', x: 100 },
    { value: String(hours).padStart(2, '0'), label: 'HORAS', x: 280 },
    { value: String(minutes).padStart(2, '0'), label: 'MINUTOS', x: 460 },
    { value: String(seconds).padStart(2, '0'), label: 'SEGUNDOS', x: 640 }
  ];

  // Generar elementos SVG
  let numberElements = '';
  let labelElements = '';

  sections.forEach(section => {
    // Números grandes
    numberElements += `
      <text x="${section.x}" y="130" 
            font-family="Arial, sans-serif" 
            font-size="80" 
            font-weight="bold" 
            fill="${textColor}" 
            text-anchor="middle">${section.value}</text>
    `;

    // Etiquetas
    labelElements += `
      <text x="${section.x}" y="180" 
            font-family="Arial, sans-serif" 
            font-size="20" 
            font-weight="bold" 
            fill="${textColor}" 
            text-anchor="middle">${section.label}</text>
    `;
  });

  // SVG completo
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  ${numberElements}
  ${labelElements}
</svg>`;

  return svg;
}

// Ruta principal - info
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Countdown API</title>
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
        <h1>🎯 Countdown API - Generador de Imágenes Dinámicas</h1>
        <p>API para generar imágenes de cuenta atrás en tiempo real para emails y campañas.</p>
        
        <div class="example">
          <h2>📖 Uso básico</h2>
          <p>URL: <code>/countdown?date=YYYY-MM-DD&time=HH:MM</code></p>
          
          <h3>Ejemplo:</h3>
          <img src="/countdown?date=2026-02-27&time=21:00" alt="Countdown" style="max-width: 100%;">
          <pre>&lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00" alt="Cuenta atrás"&gt;</pre>
        </div>

        <div class="example">
          <h2>🎨 Personalización</h2>
          <p>Añade parámetros para personalizar colores:</p>
          <ul>
            <li><code>bg</code> - Color de fondo (hex sin #, ej: 000000)</li>
            <li><code>color</code> - Color de texto (hex sin #, ej: FFFFFF)</li>
          </ul>
          
          <h3>Ejemplo con colores personalizados:</h3>
          <img src="/countdown?date=2026-02-27&time=21:00&bg=1a1a1a&color=00ff00" alt="Countdown green" style="max-width: 100%;">
          <pre>&lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00&bg=1a1a1a&color=00ff00"&gt;</pre>
        </div>

        <div class="example">
          <h2>📧 Para usar en Klaviyo</h2>
          <p>Simplemente copia la URL de la imagen y pégala en tu email de Klaviyo:</p>
          <pre>&lt;div style="text-align: center; background: #000000; padding: 20px;"&gt;
  &lt;img src="${req.protocol}://${req.get('host')}/countdown?date=2026-02-27&time=21:00" alt="Cuenta atrás" style="max-width: 100%;"&gt;
&lt;/div&gt;</pre>
        </div>

        <div class="example">
          <h2>✅ Características</h2>
          <ul>
            <li>✅ Sin marca de agua</li>
            <li>✅ Actualización en tiempo real</li>
            <li>✅ Totalmente personalizable</li>
            <li>✅ Compatible con todos los clientes de email</li>
            <li>✅ SVG ligero y escalable</li>
            <li>✅ Sin dependencias nativas</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Ruta para generar la imagen de cuenta atrás
app.get('/countdown', (req, res) => {
  try {
    // Obtener parámetros
    const { date, time, bg, color } = req.query;

    // Validar parámetros requeridos
    if (!date || !time) {
      return res.status(400).send('Faltan parámetros: date (YYYY-MM-DD) y time (HH:MM) son requeridos');
    }

    // Construir fecha objetivo
    const targetDate = `${date}T${time}:00`;

    // Calcular diferencia de tiempo
    const { days, hours, minutes, seconds } = getTimeDifference(targetDate);

    // Colores personalizados (opcional)
    const bgColor = bg ? `#${bg}` : '#000000';
    const textColor = color ? `#${color}` : '#FFFFFF';

    // Generar SVG
    const svg = generateCountdownSVG(days, hours, minutes, seconds, bgColor, textColor);

    // Configurar headers para evitar caché (importante para que se actualice)
    res.set({
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.send(svg);
  } catch (error) {
    console.error('Error generando imagen:', error);
    res.status(500).send('Error generando la imagen');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📸 Ejemplo: http://localhost:${PORT}/countdown?date=2026-02-27&time=21:00`);
});
