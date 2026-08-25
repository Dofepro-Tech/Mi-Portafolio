// LISTA DE PROYECTOS
const misProyectos = [
  {
    id: "aroma-grano",
    titulo: "Aroma & Grano",
    categoria: "web",
    descripcion: "Sitio web interactivo para cafetería de especialidad con carrito de compras, pedidos por WhatsApp, reserva de mesas y comentarios con guardado local.",
    icono: "☕",
    tags: ["HTML5", "Tailwind CSS", "JavaScript"],
    demoUrl: "./proyectos/aroma-y-grano/index.html",
    destacado: true
  },
  {
    id: "florecer",
    titulo: "Florecer",
    categoria: "landing",
    descripcion: "Página de aterrizaje optimizada para conversión de clientes e integración con formularios.",
    icono: "🚀",
    tags: ["HTML5", "Tailwind CSS", "JavaScript"],
    demoUrl: "./proyectos/floristeria-florecer/index.html",
    destacado: true
  }
];

// 1. GESTIÓN DEL MODO CLARO / OSCURO
function inicializarTema() {
  const btnTheme = document.getElementById('themeToggle');
  const iconSun = document.getElementById('themeSun');
  const iconMoon = document.getElementById('themeMoon');

  if (!btnTheme) return;

  const aplicarIconos = (isDark) => {
    btnTheme.setAttribute('aria-pressed', String(isDark));
    if (iconSun && iconMoon) {
      if (isDark) {
        iconSun.classList.remove('hidden');
        iconMoon.classList.add('hidden');
      } else {
        iconSun.classList.add('hidden');
        iconMoon.classList.remove('hidden');
      }
    }
  };

  const themeGuardado = localStorage.getItem('theme');
  const esOscuro = themeGuardado === 'dark' || (!themeGuardado && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (esOscuro) {
    document.documentElement.classList.add('dark');
    aplicarIconos(true);
  } else {
    document.documentElement.classList.remove('dark');
    aplicarIconos(false);
  }

  // Evento Clic
  btnTheme.addEventListener('click', (e) => {
    e.preventDefault();
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    aplicarIconos(isDark);
  });
}

// Actualiza el contador de proyectos
function actualizarContadorProyectos() {
  const contadorElemento = document.getElementById('contador-proyectos');
  if (contadorElemento) {
    contadorElemento.textContent = `+${misProyectos.length}`;
  }
}

// RENDERIZADO DE TARJETAS DE PROYECTOS
function renderizarProyectos(lista) {
  const grid = document.getElementById('gridProyectos');
  
  if (!grid) return;
  grid.innerHTML = '';

  if (lista.length === 0) {
    grid.innerHTML = '<p class="text-slate-500 text-sm col-span-full text-center py-8">No hay proyectos en esta categoría aún.</p>';
    return;
  }

  lista.forEach(p => {
    const card = document.createElement('article');
    card.className = "glow-card-container group";
    
    card.innerHTML = `
      <div class="glow-card-content bg-white dark:bg-slate-900 p-6 flex flex-col justify-between transition-colors shadow-lg dark:shadow-none rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 group-hover:scale-110 transition-transform" aria-hidden="true">${p.icono}</span>
            <span class="text-[10px] uppercase font-extrabold tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full shadow-xs">
              ${p.categoria}
            </span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">${p.titulo}</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">${p.descripcion}</p>
          
          <div class="flex flex-wrap gap-1.5 mt-5">
            ${p.tags.map(tag => `<span class="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono px-2.5 py-0.5 rounded-md">${tag}</span>`).join('')}
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
          <a href="${p.demoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Ver demo del proyecto ${p.titulo}" class="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
            Ver Proyecto ↗
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// INICIALIZAR EVENTOS EN BOTONES DE FILTRO
function inicializarFiltros() {
  const botonesFiltro = document.querySelectorAll('.filtro-btn');
  
  const clasesInactivo = 'filtro-btn text-slate-800 dark:text-slate-100 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/80 font-bold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm cursor-pointer';
  const clasesActivo = 'filtro-btn active bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm cursor-pointer';

  botonesFiltro.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const categoria = e.currentTarget.getAttribute('data-categoria') || 'todos';

      botonesFiltro.forEach(b => {
        b.className = clasesInactivo;
      });

      e.currentTarget.className = clasesActivo;

      if (categoria === 'todos') {
        renderizarProyectos(misProyectos);
      } else {
        const filtrados = misProyectos.filter(p => p.categoria === categoria);
        renderizarProyectos(filtrados);
      }
    });
  });
}

// BOTÓN VOLVER ARRIBA
function inicializarScrollTop() {
  const btnScrollTop = document.getElementById('btnScrollTop');
  if (!btnScrollTop) return;

  const evaluarScroll = () => {
    if (window.scrollY > 100) {
      btnScrollTop.classList.add('opacity-100', 'pointer-events-auto');
      btnScrollTop.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      btnScrollTop.classList.add('opacity-0', 'pointer-events-none');
      btnScrollTop.classList.remove('opacity-100', 'pointer-events-auto');
    }
  };

  window.addEventListener('scroll', evaluarScroll);
  evaluarScroll();

  btnScrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// SISTEMA DE PARTÍCULAS EN CANVAS
function inicializarParticulas() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numParticles = 45;
  const particles = Array.from({ length: numParticles }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    color: '#38bdf8',
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// CONEXIÓN DEL FORMULARIO CON LA API
function inicializarFormularioContacto() {
  const formContacto = document.querySelector('#modalContacto form');
  if (!formContacto) return;

  formContacto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnSubmit = formContacto.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerHTML;

    btnSubmit.innerHTML = 'Enviando... ⏳';
    btnSubmit.disabled = true;

    const datos = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      mensaje: document.getElementById('mensaje').value
    };

    try {
      const respuesta = await fetch('https://dofepro-backend.onrender.com/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok && resultado.exito) {
        alert('¡Mensaje enviado con éxito! Se ha guardado en la base de datos y enviado por correo.');
        formContacto.reset();
        toggleContactoModal();
      } else {
        alert('Error: ' + (resultado.error || 'No se pudo enviar el mensaje.'));
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      alert('No se pudo conectar con el servidor backend.');
    } finally {
      btnSubmit.innerHTML = textoOriginal;
      btnSubmit.disabled = false;
    }
  });
}

// APERTURA / CIERRE DEL MODAL DE CONTACTO
function toggleContactoModal() {
  const modal = document.getElementById('modalContacto');
  const content = document.getElementById('modalContactoContent');
  if (!modal || !content) return;

  if (!modal.open) {
    modal.showModal();
    requestAnimationFrame(() => {
      content.classList.remove('scale-95', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    });
    document.body.style.overflow = 'hidden';
  } else {
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      modal.close();
      document.body.style.overflow = '';
    }, 150);
  }
}

// CONTROL DEL MENÚ HAMBURGUESA MÓVIL
function inicializarMenuMovil() {
  const btnMenuMovil = document.getElementById('btnMenuMovil');
  const menuMovil = document.getElementById('menuMovil');
  const iconMenuOpen = document.getElementById('iconMenuOpen');
  const iconMenuClose = document.getElementById('iconMenuClose');

  if (!btnMenuMovil || !menuMovil) return;

  const toggleMenu = () => {
    const isHidden = menuMovil.classList.toggle('hidden');
    
    if (iconMenuOpen && iconMenuClose) {
      iconMenuOpen.classList.toggle('hidden', !isHidden);
      iconMenuClose.classList.toggle('hidden', isHidden);
    }
  };

  btnMenuMovil.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (e) => {
    const isMenuOpen = !menuMovil.classList.contains('hidden');
    if (isMenuOpen && !menuMovil.contains(e.target) && !btnMenuMovil.contains(e.target)) {
      toggleMenu();
    }
  });

  const elementosMenu = menuMovil.querySelectorAll('a, button');
  elementosMenu.forEach(item => {
    item.addEventListener('click', () => {
      if (!menuMovil.classList.contains('hidden')) {
        toggleMenu();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && !menuMovil.classList.contains('hidden')) {
      toggleMenu();
    }
  });
}

// EVENTOS GLOBALES DE CIERRE DEL MODAL
document.getElementById('modalContacto')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    toggleContactoModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const modal = document.getElementById('modalContacto');
    if (modal && modal.open) {
      toggleContactoModal();
    }
  }
});

// PUNTO DE ENTRADA ÚNICO
document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  renderizarProyectos(misProyectos);
  actualizarContadorProyectos();
  inicializarFiltros();
  inicializarScrollTop();
  inicializarParticulas();
  inicializarFormularioContacto();
  inicializarMenuMovil();
});
