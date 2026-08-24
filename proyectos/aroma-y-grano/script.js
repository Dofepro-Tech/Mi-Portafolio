// ==========================================
// 1. MODO OSCURO / CLARO PERSISTENTE
// ==========================================
const themeToggle = document.getElementById('themeToggle');

// Cargar tema guardado al iniciar
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  if (themeToggle) themeToggle.textContent = '☀️';
} else {
  document.documentElement.classList.remove('dark');
  if (themeToggle) themeToggle.textContent = '🌙';
}

// Evento para alternar tema
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const esOscuro = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', esOscuro ? 'dark' : 'light');
    themeToggle.textContent = esOscuro ? '☀️' : '🌙';
  });
}

// ==========================================
// 2. BOTÓN IR ARRIBA (SCROLL TO TOP)
// ==========================================
const backToTopBtn = document.getElementById('backToTop') || document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('hidden');
    } else {
      backToTopBtn.classList.add('hidden');
    }
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', scrollToTop);
}

// ==========================================
// 3. CARRITO DE COMPRAS & INTERFAZ
// ==========================================
let carrito = [];

const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

if (cartBtn) cartBtn.addEventListener('click', () => cartModal && cartModal.classList.remove('hidden'));
if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartModal && cartModal.classList.add('hidden'));
if (cartOverlay) cartOverlay.addEventListener('click', () => cartModal && cartModal.classList.add('hidden'));

function agregarAlCarrito(nombre, precio) {
  const existe = carrito.find(item => item.nombre === nombre);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarritoUI();
  if (cartModal) cartModal.classList.remove('hidden');
}

function actualizarCarritoUI() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-gray-500 dark:text-stone-400 text-sm text-center py-8">Tu carrito está vacío.</p>';
  } else {
    carrito.forEach((item, index) => {
      total += item.precio * item.cantidad;
      totalItems += item.cantidad;

      const itemEl = document.createElement('div');
      itemEl.className = 'flex justify-between items-center bg-stone-100 dark:bg-stone-800 p-3 rounded-lg text-sm';
      itemEl.innerHTML = `
        <div>
          <h4 class="font-bold dark:text-white">${item.nombre}</h4>
          <p class="text-xs text-stone-500 dark:text-stone-400">$${item.precio} DOP x ${item.cantidad}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="cambiarCantidad(${index}, -1)" class="w-6 h-6 bg-stone-200 dark:bg-stone-700 font-bold rounded hover:bg-stone-300 dark:hover:bg-stone-600 dark:text-white">-</button>
          <span class="font-semibold text-xs dark:text-white">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, 1)" class="w-6 h-6 bg-stone-200 dark:bg-stone-700 font-bold rounded hover:bg-stone-300 dark:hover:bg-stone-600 dark:text-white">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  if (cartCount) cartCount.textContent = totalItems;
  if (cartTotal) cartTotal.textContent = `$${total} DOP`;
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  actualizarCarritoUI();
}

function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
  let total = 0;
  carrito.forEach(item => {
    mensaje += `• ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad} DOP)\n`;
    total += item.precio * item.cantidad;
  });
  mensaje += `\n*Total:* $${total} DOP\n\n¿Me indican el tiempo estimado de entrega/preparación?`;

  const numWhatsApp = "18093031738";
  window.open(`https://wa.me/${numWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// ==========================================
// 4. NAVEGACIÓN Y FILTRADO DEL MENÚ
// ==========================================
function filtrarMenu(categoria) {
  const items = document.querySelectorAll('.menu-item');
  const btns = document.querySelectorAll('.filter-btn');

  btns.forEach(btn => {
    btn.classList.remove('bg-brand-dark', 'dark:bg-amber-600', 'text-white');
    btn.classList.add('bg-stone-200', 'dark:bg-stone-800', 'text-stone-800', 'dark:text-stone-200');
  });

  if (event && event.target) {
    event.target.classList.remove('bg-stone-200', 'dark:bg-stone-800', 'text-stone-800', 'dark:text-stone-200');
    event.target.classList.add('bg-brand-dark', 'dark:bg-amber-600', 'text-white');
  }

  items.forEach(item => {
    if (categoria === 'todos' || item.classList.contains(categoria)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');

  if (menu) {
    if (menu.classList.contains('hidden')) {
      menu.classList.remove('hidden');
      if (icon) icon.textContent = '✕';
    } else {
      menu.classList.add('hidden');
      if (icon) icon.textContent = '☰';
    }
  }
}

function toggleMisionVisionValores() {
  const container = document.getElementById('mvvContainer');
  const btn = document.getElementById('toggleMVVBtn');
  const icon = document.getElementById('mvvIcon');

  if (container) {
    if (container.classList.contains('hidden')) {
      container.classList.remove('hidden');
      if (btn) btn.querySelector('span').textContent = 'Ocultar Misión, Visión y Valores';
      if (icon) icon.textContent = '👆';
    } else {
      container.classList.add('hidden');
      if (btn) btn.querySelector('span').textContent = 'Ver Misión, Visión y Valores';
      if (icon) icon.textContent = '👇';
    }
  }
}

// ==========================================
// 5. FORMULARIOS Y PERSISTENCIA (LOCALSTORAGE)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  cargarOpinionesGuardadas();

  const opinionForm = document.getElementById('opinionForm');
  if (opinionForm) {
    opinionForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const autorInput = document.getElementById('autorOpinion') || document.getElementById('autorOpinión');
      const autor = autorInput ? autorInput.value.trim() : 'Anónimo';
      const ratingNum = parseInt(document.getElementById('ratingOpinion').value);
      const texto = document.getElementById('textoOpinion').value.trim();

      guardarOpinionLocal(autor, ratingNum, texto);
      renderizarTarjetaOpinion(autor, ratingNum, texto, true);

      this.reset();
      alert('¡Muchas gracias! Tu opinión ha sido publicada.');
    });
  }

  const reservaForm = document.getElementById('reservaForm');
  if (reservaForm) {
    reservaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const personas = document.getElementById('personas').value;

      const msg = document.getElementById('mensajeReserva');
      if (msg) {
        msg.textContent = `¡Reserva confirmada a nombre de ${nombre} para ${personas} persona(s)!`;
        msg.classList.remove('hidden');
      }
      this.reset();
    });
  }
});

function guardarOpinionLocal(nombre, estrellas, comentario) {
  const opiniones = JSON.parse(localStorage.getItem('opiniones_aroma')) || [];
  opiniones.unshift({ nombre, estrellas, comentario });
  localStorage.setItem('opiniones_aroma', JSON.stringify(opiniones));
}

function cargarOpinionesGuardadas() {
  const opiniones = JSON.parse(localStorage.getItem('opiniones_aroma')) || [];
  opiniones.forEach(op => {
    renderizarTarjetaOpinion(op.nombre, op.estrellas, op.comentario, false);
  });
}

function renderizarTarjetaOpinion(autor, ratingNum, texto, esNueva) {
  const lista = document.getElementById('opinionesLista');
  if (!lista) return;

  const estrellas = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
  const iniciales = autor.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  const nuevaTarjeta = document.createElement('div');
  nuevaTarjeta.className = "bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 animate-fade-in";
  nuevaTarjeta.innerHTML = `
    <div class="text-amber-500 mb-2">${estrellas}</div>
    <p class="text-gray-700 dark:text-stone-300 text-sm italic">"${texto}"</p>
    <div class="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">${iniciales}</div>
      <div>
        <h4 class="font-bold text-sm dark:text-white">${autor}</h4>
        <span class="text-xs text-gray-500 dark:text-stone-400">Cliente Verificado</span>
      </div>
    </div>
  `;

  if (esNueva) {
    lista.insertBefore(nuevaTarjeta, lista.firstChild);
  } else {
    lista.appendChild(nuevaTarjeta);
  }
}