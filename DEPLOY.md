# 🚀 Guía Rápida de Despliegue

## Opción 1: Vercel (Recomendado - Más fácil)

### Paso 1: Preparar el código
```bash
# Si no tienes Git instalado, primero instálalo
git init
git add .
git commit -m "Initial commit"
```

### Paso 2: Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Regístrate con GitHub, GitLab o email
3. Es GRATIS

### Paso 3: Desplegar
**Opción A - Desde la web:**
1. Sube tu proyecto a GitHub
2. En Vercel, haz clic en "Import Project"
3. Selecciona tu repositorio
4. ¡Listo! Vercel desplegará automáticamente

**Opción B - Desde terminal:**
```bash
npm install -g vercel
vercel login
vercel
```

### Paso 4: Obtener tu URL
Vercel te dará una URL como:
```
https://countdown-api-xyz123.vercel.app
```

### Paso 5: Usar en Klaviyo
```html
<img src="https://TU-URL-DE-VERCEL.vercel.app/countdown?date=2026-02-27&time=21:00">
```

---

## Opción 2: Railway

### Paso 1: Crear cuenta
1. Ve a https://railway.app
2. Regístrate con GitHub
3. GRATIS (500 horas/mes)

### Paso 2: Nuevo proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio

### Paso 3: Configurar
Railway detecta automáticamente Node.js, no necesitas hacer nada más.

### Paso 4: Obtener URL
Railway genera automáticamente una URL pública.

---

## Opción 3: Render

### Paso 1: Crear cuenta
1. Ve a https://render.com
2. Regístrate gratis

### Paso 2: Nuevo Web Service
1. Click en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub

### Paso 3: Configurar
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Paso 4: Deploy
Click en "Create Web Service" y espera 2-3 minutos.

---

## 🎯 Después del Despliegue

### Prueba tu API
Abre en el navegador:
```
https://TU-DOMINIO.com/countdown?date=2026-02-27&time=21:00
```

Deberías ver la imagen del contador.

### Usa en Klaviyo
```html
<div style="text-align: center; background: #000000; padding: 20px;">
  <img src="https://TU-DOMINIO.com/countdown?date=2026-02-27&time=21:00" 
       alt="Cuenta atrás" 
       style="max-width: 100%; height: auto;">
</div>
```

---

## ⚡ Comparación de Plataformas

| Plataforma | Precio | Facilidad | Velocidad | Recomendado |
|------------|--------|-----------|-----------|-------------|
| **Vercel** | Gratis | ⭐⭐⭐⭐⭐ | Muy rápido | ✅ SÍ |
| **Railway** | Gratis* | ⭐⭐⭐⭐ | Rápido | ✅ Sí |
| **Render** | Gratis* | ⭐⭐⭐ | Medio | Sí |

*Límites en plan gratuito pero más que suficiente para emails.

---

## 🆘 ¿Problemas?

### No puedo instalar dependencias
```bash
# Asegúrate de tener Node.js instalado (v18 o superior)
node --version
npm --version
```

### Error al desplegar en Vercel
- Verifica que `vercel.json` esté en la raíz del proyecto
- Asegúrate de que `server.js` esté en la raíz

### La imagen no se muestra
- Verifica la URL en el navegador primero
- Asegúrate de usar HTTPS en la URL para Klaviyo

---

## 💰 Costos

**TODO ES GRATIS:**
- Vercel: Gratis ilimitado para proyectos personales
- Railway: 500 horas gratis/mes (más que suficiente)
- Render: Gratis con algunas limitaciones

Para emails de marketing, cualquiera de las opciones gratis es más que suficiente.

---

## 🎉 ¡Listo!

Una vez desplegado, tendrás tu propio servicio de cuenta atrás:
- ✅ Sin marca de agua
- ✅ Sin límites de uso
- ✅ Totalmente gratis
- ✅ URLs personalizables
- ✅ Actualización en tiempo real
