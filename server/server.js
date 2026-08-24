const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Servidor de API funcionando correctamente.');
});

// Endpoint principal
app.post('/api/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ 
      exito: false, 
      error: 'Todos los campos son obligatorios.' 
    });
  }

  try {
    // 1. Guardar en Supabase mediante su API REST directa (evita errores de librerías)
    const supabaseUrl = `${process.env.SUPABASE_URL}/rest/v1/mensajes`;
    const responseDb = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ nombre, email, mensaje })
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
      subject: `📩 Nuevo mensaje en tu Portafolio de: ${nombre}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #0ea5e9; margin-top: 0;">¡Tienes un nuevo mensaje de contacto!</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote style="background: #ffffff; padding: 15px; border-left: 4px solid #0ea5e9; border-radius: 4px; font-style: italic;">
            ${mensaje}
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