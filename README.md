# 🎯 Countdown GIF API - Generador de GIFs Animados

API para generar **GIFs animados** de cuenta atrás en tiempo real, perfecta para campañas de email en Klaviyo.

## ✨ Características

- ✅ **GIF animado** - ¡Se ve el tiempo bajando segundo a segundo!
- ✅ **Sin marca de agua** - 100% tuyo
- ✅ **Tiempo real** - Se calcula cuando alguien abre el email
- ✅ **Personalizable** - Colores, fechas, duración
- ✅ **Gratis** - Sin límites ni costos
- ✅ **Loop infinito** - El GIF se repite automáticamente

## 🎬 ¿Cómo funciona?

Cuando alguien abre tu email:
1. La API calcula el tiempo restante hasta tu fecha objetivo
2. Genera un GIF de 30-60 segundos mostrando el contador bajando
3. El GIF se reproduce en loop, dando sensación de actualización constante
4. Cada vez que alguien abre el email, se genera con el tiempo actual

## 🚀 Instalación Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📖 Uso

### URL básica
```
http://localhost:3000/countdown?date=YYYY-MM-DD&time=HH:MM
```

### Ejemplo
```
http://localhost:3000/countdown?date=2026-02-27&time=21:00
```

### Con colores personalizados
```
http://localhost:3000/countdown?date=2026-02-27&time=21:00&bg=000000&color=FFFFFF
```

## 🎨 Parámetros

| Parámetro | Requerido | Descripción | Ejemplo |
|-----------|-----------|-------------|---------|
| `date` | ✅ Sí | Fecha objetivo (YYYY-MM-DD) | `2026-02-27` |
| `time` | ✅ Sí | Hora objetivo (HH:MM) | `21:00` |
| `bg` | ❌ No | Color de fondo (hex sin #) | `000000` |
| `color` | ❌ No | Color de texto (hex sin #) | `FFFFFF` |
| `duration` | ❌ No | Duración del GIF en segundos (default: 60, max: 300) | `30` |

## 💡 Duración recomendada

- **30 segundos** → Perfecto para emails (~250KB)
- **60 segundos** → Más animación, más peso (~500KB)
- **120+ segundos** → Solo si realmente lo necesitas

## 📧 Uso en Klaviyo

En tu campaña de Klaviyo, usa este código HTML:

```html
<div style="text-align: center; background: #000000; padding: 20px;">
  <img src="https://TU-DOMINIO.com/countdown?date=2026-02-27&time=21:00&duration=30" 
       alt="Cuenta atrás" 
       style="max-width: 100%; height: auto;">
</div>
```

**Importante:** 
- Reemplaza `TU-DOMINIO.com` con tu dominio real después del despliegue
- Usa `duration=30` para emails (más ligero y rápido)
- El GIF mostrará los segundos bajando en tiempo real cuando se abra el email

## 🌐 Despliegue en Vercel (GRATIS)

### 1. Crear cuenta en Vercel
Ve a [vercel.com](https://vercel.com) y crea una cuenta gratuita.

### 2. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 3. Desplegar
```bash
vercel
```

Sigue las instrucciones y ¡listo! Tendrás una URL como:
```
https://countdown-api.vercel.app
```

### 4. Usar en Klaviyo
```html
<img src="https://countdown-api.vercel.app/countdown?date=2026-02-27&time=21:00">
```

## 🚀 Despliegue en Railway (GRATIS)

### 1. Crear cuenta en Railway
Ve a [railway.app](https://railway.app)

### 2. Conectar repositorio
- Sube el código a GitHub
- Conecta Railway con tu repositorio
- Railway detectará automáticamente Node.js

### 3. Listo
Railway te dará una URL automáticamente.

## 🔧 Desarrollo

### Modo desarrollo con auto-reload
```bash
npm run dev
```

## 📝 Ejemplos de URLs

### Contador básico (negro con blanco)
```
/countdown?date=2026-02-27&time=21:00
```

### Contador con fondo gris oscuro y texto verde
```
/countdown?date=2026-02-27&time=21:00&bg=1a1a1a&color=00ff00
```

### Contador con fondo blanco y texto negro
```
/countdown?date=2026-02-27&time=21:00&bg=ffffff&color=000000
```

## 💡 Consejos

1. **Caché**: La API está configurada para NO cachear las imágenes, así se actualizan en tiempo real.

2. **Rendimiento**: Las imágenes son PNG optimizadas y muy ligeras.

3. **Compatibilidad**: Funciona en todos los clientes de email (Gmail, Outlook, Apple Mail, etc).

4. **Múltiples contadores**: Puedes crear URLs diferentes para diferentes fechas en la misma campaña.

## 🐛 Troubleshooting

### La imagen no se actualiza
- Verifica que los parámetros `date` y `time` sean correctos
- Asegúrate de que el formato sea `YYYY-MM-DD` para fecha y `HH:MM` para hora

### Error 400
- Faltan los parámetros requeridos `date` o `time`

### Error 500
- Revisa los logs del servidor con `npm start`

## 📄 Licencia

MIT - Úsalo como quieras

## 👨‍💻 Autor

Creado por Ruben para RMT Agency
