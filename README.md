# Portafolio Profesional - DofeproTech

Portafolio personal de Domingo Feliz para presentar proyectos web y móviles. Incluye un catálogo filtrable, vistas previas de proyectos, modo claro u oscuro, navegación adaptable a móvil, enlaces de contacto por WhatsApp y un formulario de correo conectado a una API privada. También permite enviar reseñas que se guardan como pendientes y solo se muestran después de una moderación manual.

Sitio en producción: [dofepro.do](https://dofepro.do)

## Tecnologías

- HTML5, CSS y JavaScript moderno.
- Tailwind CSS para los estilos compilados.
- Node.js, Express, Supabase y Resend para la API.
- GitHub Pages para el frontend y Render para el backend.

## Requisitos

- Node.js 18 o superior.
- Una cuenta de Supabase y una tabla `mensajes`.
- Una cuenta de Resend y un dominio o remitente verificado para producción.

## Instalación

```bash
npm install
npm run build
```

El frontend es estático: abre `index.html` con un servidor local, por ejemplo Live Server. Para regenerar el CSS mientras editas:

```bash
npm run dev
```

## Backend

1. Copia `server/.env.example` como `server/.env`.
2. Completa las credenciales de Supabase, Resend y el correo de destino.
3. Ejecuta el SQL de `server/supabase-reviews.sql` en el editor SQL de Supabase.
4. Inicia la API:

```bash
npm start
```

La API escucha en `http://localhost:3000` por defecto y expone:

- `POST /api/contacto`: guarda un mensaje y envía una notificación por correo.
- `GET /api/resenas`: obtiene las reseñas aprobadas.
- `POST /api/resenas`: registra una reseña pendiente de moderación.

No publiques `server/.env` ni una clave `service_role` de Supabase. Configura las variables de entorno directamente en Render u otro proveedor de backend.

## Despliegue

1. Ejecuta `npm run build` y publica los archivos estáticos junto con `dist/output.css` en GitHub Pages.
2. Despliega la API en Render con el comando `npm start`.
3. Define las mismas variables de `server/.env.example` en Render.
4. Revisa `origenesPermitidos` en `server/server.js` antes de añadir dominios nuevos al frontend.

## Privacidad y licencia

Los formularios recopilan únicamente los datos enviados voluntariamente para atender contactos y moderar reseñas. Consulta [PRIVACIDAD.md](PRIVACIDAD.md) para el detalle.

Este proyecto se distribuye bajo la [licencia MIT](LICENSE).

## Contacto

- GitHub: [@dofepro](https://github.com/dofepro)
- LinkedIn: [Domingo Feliz](https://www.linkedin.com/in/domingo-feliz-dofepro-tech)
- Correo: [elsonidistaadnj@gmail.com](mailto:elsonidistaadnj@gmail.com)
