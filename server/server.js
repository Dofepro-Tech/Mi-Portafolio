const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escaparHtml(valor) {
  return valor.replace(/[&<>'"]/g, (caracter) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[caracter]);
}

async function fetchConTimeout(url, opciones = {}, timeoutMs = 10000) {
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opciones, signal: controlador.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Configuración de orígenes autorizados para CORS
const origenesPermitidos = [
  'http://127.0.0.1:5500',               // Pruebas locales (Live Server)
  'http://localhost:3000',               // Pruebas locales
  'https://dofepro-tech.github.io',       // Tu sitio en GitHub Pages
  'https://dofepro.do',                  // Tu dominio personalizado principal
  'https://www.dofepro.do'              // Tu dominio personalizado con www
];

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones sin origen (como llamadas directas) o si está en la lista de dominios
    if (!origin || origenesPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  }
}));

app.use(express.json({ limit: '20kb' }));

const intentosPorIp = new Map();
const permitirSolicitud = (ip, limite) => {
  const ahora = Date.now();
  const registro = intentosPorIp.get(ip) || [];
  const recientes = registro.filter((tiempo) => ahora - tiempo < 60 * 60 * 1000);
  if (recientes.length >= limite) return false;
  recientes.push(ahora);
  intentosPorIp.set(ip, recientes);
  return true;
};

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Servidor de API funcionando correctamente.');
});

// Endpoint principal
app.post('/api/contacto', async (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const email = String(req.body.email || '').trim();
  const asunto = String(req.body.asunto || '').trim();
  const mensaje = String(req.body.mensaje || '').trim();

  if (
    nombre.length < 2 || nombre.length > 80 ||
    !emailValido.test(email) || email.length > 254 ||
    asunto.length < 3 || asunto.length > 150 ||
    mensaje.length < 10 || mensaje.length > 2000
  ) {
    return res.status(400).json({ 
      exito: false, 
      error: 'Los datos de contacto no son válidos.'
    });
  }
  if (!permitirSolicitud(req.ip, 5)) {
    return res.status(429).json({ exito: false, error: 'Intenta nuevamente más tarde.' });
  }

  try {
    // 1. Guardar en Supabase mediante su API REST directa
    const supabaseUrl = `${process.env.SUPABASE_URL}/rest/v1/mensajes`;
    const responseDb = await fetchConTimeout(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ nombre, email, asunto, mensaje })
    });

    if (!responseDb.ok) {
      const dbError = await responseDb.text();
      throw new Error(`Error Supabase: ${dbError}`);
    }

    console.log('✅ Mensaje guardado en Supabase');

    // 2. Enviar notificación por correo con Resend
    await resend.emails.send({
      from: 'Portafolio <onboarding@resend.dev>',
      to: process.env.MI_CORREO,
      replyTo: email,
      subject: `Nuevo mensaje: ${asunto}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #0ea5e9; margin-top: 0;">Tienes un nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${escaparHtml(nombre)}</p>
          <p><strong>Correo:</strong> ${escaparHtml(email)}</p>
          <p><strong>Asunto:</strong> ${escaparHtml(asunto)}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote style="background: #ffffff; padding: 15px; border-left: 4px solid #0ea5e9; border-radius: 4px; font-style: italic;">
            ${escaparHtml(mensaje)}
          </blockquote>
        </div>
      `
    });

    console.log(`✉️ Notificación enviada a ${process.env.MI_CORREO}`);

    return res.status(200).json({ 
      exito: true, 
      mensaje: '¡Mensaje guardado y enviado con éxito!' 
    });

  } catch (error) {
    console.error('❌ Error en el servidor:', error.message);
    return res.status(500).json({ 
      exito: false, 
      error: 'Ocurrió un error al procesar el mensaje.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/api/resenas', async (_req, res) => {
  try {
    const url = `${process.env.SUPABASE_URL}/rest/v1/resenas?estado=eq.aprobada&select=nombre,comentario,puntuacion,created_at&order=created_at.desc`;
    const respuesta = await fetchConTimeout(url, { headers: { apikey: process.env.SUPABASE_KEY, Authorization: `Bearer ${process.env.SUPABASE_KEY}` } });
    if (!respuesta.ok) throw new Error(await respuesta.text());
    const todasLasResenas = await respuesta.json();
    const total = todasLasResenas.length;
    const promedio = total ? (todasLasResenas.reduce((suma, item) => suma + item.puntuacion, 0) / total).toFixed(1) : null;
    res.json({ resenas: todasLasResenas.slice(0, 6), total, promedio });
  } catch (error) {
    console.error('Error al obtener reseñas:', error.message);
    res.status(503).json({ error: 'Reseñas no disponibles.' });
  }
});

app.post('/api/resenas', async (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const comentario = String(req.body.comentario || '').trim();
  const puntuacion = Number(req.body.puntuacion);
  if (nombre.length < 2 || nombre.length > 80 || comentario.length < 10 || comentario.length > 600 || !Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) return res.status(400).json({ error: 'Datos de reseña no válidos.' });
  if (!permitirSolicitud(req.ip, 3)) return res.status(429).json({ error: 'Intenta nuevamente más tarde.' });
  try {
    const respuesta = await fetchConTimeout(`${process.env.SUPABASE_URL}/rest/v1/resenas`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: process.env.SUPABASE_KEY, Authorization: `Bearer ${process.env.SUPABASE_KEY}`, Prefer: 'return=minimal' }, body: JSON.stringify({ nombre, comentario, puntuacion, estado: 'pendiente' }) });
    if (!respuesta.ok) throw new Error(await respuesta.text());
    res.status(201).json({ exito: true });
  } catch (error) {
    console.error('Error al guardar reseña:', error.message);
    res.status(503).json({ error: 'No se pudo guardar la reseña.' });
  }
});
