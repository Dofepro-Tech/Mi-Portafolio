document.addEventListener('DOMContentLoaded', () => {

  // 1. CAMBIO DE TEMA (DARK / LIGHT)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    themeIcon.textContent = '☀️';
  } else {
    html.classList.remove('dark');
    themeIcon.textContent = '🌙';
  }

  themeToggle.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.theme = 'light';
      themeIcon.textContent = '🌙';
    } else {
      html.classList.add('dark');
      localStorage.theme = 'dark';
      themeIcon.textContent = '☀️';
    }
  });

  // 2. BOTÓN IR ARRIBA
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.remove('hidden');
      scrollTopBtn.classList.add('flex');
    } else {
      scrollTopBtn.classList.add('hidden');
      scrollTopBtn.classList.remove('flex');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. VALIDACIÓN Y ENVÍO DE FORMULARIO
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btnSubmit = document.getElementById('btnSubmit');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const formAlert = document.getElementById('formAlert');
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    input.addEventListener('blur', () => validarCampo(input));
  });

  function validarCampo(input) {
    const errorSpan = document.getElementById(`${input.id}-error`);
    let mensaje = '';

    if (input.validity.valueMissing) {
      mensaje = 'Este campo es obligatorio.';
    } else if (input.type === 'email' && input.validity.typeMismatch) {
      mensaje = 'Ingresa un correo electrónico válido.';
    }

    if (mensaje) {
      input.classList.add('input-invalid');
      input.classList.remove('input-valid');
      if (errorSpan) errorSpan.textContent = mensaje;
      return false;
    } else {
      input.classList.remove('input-invalid');
      input.classList.add('input-valid');
      if (errorSpan) errorSpan.textContent = '';
      return true;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let esValido = true;

    inputs.forEach(input => {
      if (!validarCampo(input)) esValido = false;
    });

    if (!esValido) return;

    btnSubmit.disabled = true;
    btnText.textContent = 'Enviando...';
    btnSpinner.classList.remove('hidden');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        mostrarAlerta('¡Pedido registrado con éxito! Te contactaremos a la brevedad.', 'exito');
        form.reset();
        inputs.forEach(i => i.classList.remove('input-valid', 'input-invalid'));
      } else {
        mostrarAlerta('Ocurrió un error al procesar el pedido.', 'error');
      }
    } catch (error) {
      mostrarAlerta('Error de conexión. Inténtalo de nuevo.', 'error');
    } finally {
      btnSubmit.disabled = false;
      btnText.textContent = 'Enviar Pedido';
      btnSpinner.classList.add('hidden');
    }
  });

  function mostrarAlerta(mensaje, tipo) {
    formAlert.textContent = mensaje;
    formAlert.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-emerald-100', 'text-emerald-800');

    if (tipo === 'exito') {
      formAlert.classList.add('bg-emerald-100', 'text-emerald-800', 'border', 'border-emerald-200');
    } else {
      formAlert.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-200');
    }
  }
});