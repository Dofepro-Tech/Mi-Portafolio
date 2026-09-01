// Catálogo del portafolio.
// Para publicar un proyecto nuevo, añade un objeto aquí y crea su carpeta en /proyectos.
window.misProyectos = [
  {
    id: 'aroma-grano',
    titulo: 'Aroma & Grano',
    categoria: 'web',
    descripcion: 'Sitio web interactivo para cafetería de especialidad con carrito de compras, pedidos por WhatsApp, reserva de mesas y comentarios con guardado local.',
    icono: '☕',
    imagen: './assets/proyectos/aroma-y-grano.png',
    tags: ['HTML5', 'Tailwind CSS', 'JavaScript'],
    demoUrl: './proyectos/aroma-y-grano/index.html',
    destacado: true
  },
  {
    id: 'florecer',
    titulo: 'Florecer',
    categoria: 'landing',
    descripcion: 'Página de aterrizaje optimizada para conversión de clientes e integración con formularios.',
    icono: '🚀',
    imagen: './assets/proyectos/florecer.png',
    tags: ['HTML5', 'Tailwind CSS', 'JavaScript'],
    demoUrl: './proyectos/floristeria-florecer/index.html',
    destacado: true
  },
  {
    id: 'barberpro',
    titulo: 'BarberOS',
    categoria: 'app',
    descripcion: 'App móvil (Flutter) para gestión de barberías: autenticación con Supabase (email, Google y Apple), roles de usuario y tema oscuro premium con acentos dorados.',
    icono: '💈',
    imagen: './assets/proyectos/barberpro.png',
    tags: ['Flutter', 'Dart', 'Supabase'],
    demoUrl: 'https://dofepro-tech.github.io/barberpro/',
    destacado: true
  },
  {
    id: 'biblia-dj',
    titulo: 'Bíblia DJ',
    categoria: 'app',
    descripcion: 'App de lectura y estudio bíblico con backend en Express, estudio guiado con IA, retos diarios y empaquetado para Android con Capacitor.',
    icono: '📖',
    imagen: './assets/proyectos/biblia-dj.png?v=c434abd',
    tags: ['React', 'TypeScript', 'Capacitor'],
    demoUrl: 'https://dofepro-tech.github.io/?desde=portafolio',
    destacado: true
  },
  {
    id: 'cambiar-imagen',
    titulo: 'Cambiar Imagen',
    categoria: 'web',
    descripcion: 'Herramienta web para comprimir y convertir imágenes directamente en el navegador, sin backend ni claves API.',
    icono: '🖼️',
    imagen: './assets/proyectos/cambiar-imagen.png?v=c434abd',
    tags: ['React', 'Vite', 'Cloudflare Workers'],
    demoUrl: 'https://dofepro-tech.github.io/cambiar-imagen/',
    destacado: false
  }
];
