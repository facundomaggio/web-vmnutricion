// Cada logo abre la misma ventana, con el nombre de su institución.
const logos = document.querySelectorAll('.certificacion-logo');
const ventanaCertificado = document.getElementById('certificado-modal');
const tituloCertificado = document.getElementById('certificado-titulo');

logos.forEach(function (logo) {
  logo.addEventListener('click', function () {
    tituloCertificado.textContent = 'Certificado · ' + logo.dataset.institucion;
    ventanaCertificado.showModal();
  });
});

// Cerrar al pulsar fuera de la ventana. El botón y Escape son nativos de dialog.
ventanaCertificado.addEventListener('click', function (evento) {
  const limites = ventanaCertificado.getBoundingClientRect();
  const fuera = evento.clientX < limites.left || evento.clientX > limites.right
    || evento.clientY < limites.top || evento.clientY > limites.bottom;
  if (evento.target === ventanaCertificado && fuera) {
    ventanaCertificado.close();
  }
});
// Un único fondo cambia al salir de cada sección; las tarjetas no se alteran.
const raiz = document.documentElement;
const encabezado = document.querySelector('.encabezado');
const secciones = Array.from(document.querySelectorAll('main > section'));
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
const colorInicial = [37, 60, 109]; // #253C6D
const colorFinal = [15, 28, 51];
let limitesSecciones = [];
let cuadroPendiente = false;

function actualizarFondo() {
  cuadroPendiente = false;
  if (movimientoReducido.matches) {
    raiz.style.setProperty('--fondo-scroll', '#253c6d');
    return;
  }

  // La transición empieza cuando el final de la sección entra en el tramo
  // inferior de la pantalla y termina al llegar debajo del nav fijo.
  const altoNav = encabezado.getBoundingClientRect().bottom + 24;
  const inicioSalida = Math.max(altoNav + 1, window.innerHeight * 0.85);
  let avance = 0;
  limitesSecciones.forEach(function (finalSeccion) {
    const progreso = Math.max(0, Math.min(1,
      (window.scrollY + inicioSalida - finalSeccion) / (inicioSalida - altoNav)));
    avance += progreso * progreso * (3 - 2 * progreso);
  });
  avance /= Math.max(1, limitesSecciones.length);
  const color = colorInicial.map(function (canal, indice) {
    return Math.round(canal + (colorFinal[indice] - canal) * avance);
  });
  raiz.style.setProperty('--fondo-scroll', 'rgb(' + color.join(', ') + ')');
}

function solicitarFondo() {
  if (!cuadroPendiente) {
    cuadroPendiente = true;
    window.requestAnimationFrame(actualizarFondo);
  }
}

function medirPagina() {
  raiz.style.setProperty('--alto-nav',
    Math.ceil(encabezado.getBoundingClientRect().bottom + 24) + 'px');
  limitesSecciones = secciones.map(function (seccion) {
    return seccion.getBoundingClientRect().bottom + window.scrollY;
  });
  solicitarFondo();
}

window.addEventListener('scroll', solicitarFondo, { passive: true });
window.addEventListener('resize', medirPagina);
window.addEventListener('pageshow', medirPagina);
movimientoReducido.addEventListener('change', solicitarFondo);
if ('ResizeObserver' in window) {
  const observadorTamano = new ResizeObserver(medirPagina);
  observadorTamano.observe(encabezado);
  secciones.forEach(function (seccion) { observadorTamano.observe(seccion); });
}
medirPagina();
// Cambio de hoja manual. Los enlaces nunca activan el giro.
const libroPortada = document.querySelector('.portada-libro');
if (libroPortada) {
  const frente = libroPortada.querySelector('.portada-frente');
  const reverso = libroPortada.querySelector('.portada-reverso');
  let perfilVisible = false;

  function girarPortada(mostrarPerfil) {
    perfilVisible = mostrarPerfil;
    libroPortada.classList.toggle('girada', mostrarPerfil);
    // Si el foco está en la hoja que cerramos, conservarlo en el panel.
    const saliente = mostrarPerfil ? frente : reverso;
    if (saliente.contains(document.activeElement)) {
      libroPortada.focus({ preventScroll: true });
    }
    frente.inert = mostrarPerfil;
    reverso.inert = !mostrarPerfil;
    frente.setAttribute('aria-hidden', String(mostrarPerfil));
    reverso.setAttribute('aria-hidden', String(!mostrarPerfil));
    libroPortada.setAttribute('aria-label', mostrarPerfil
      ? 'Presentación de Valentín. Presioná Enter para volver a la portada.'
      : 'Portada. Presioná Enter para conocer a Valentín.');
  }

  reverso.hidden = false;
  libroPortada.tabIndex = 0;
  libroPortada.setAttribute('role', 'group');
  libroPortada.classList.add('lista');
  girarPortada(false);

  libroPortada.addEventListener('click', function (evento) {
    if (evento.target.closest('a, button, input, select, textarea, label')) return;
    if (window.getSelection()?.toString()) return;
    girarPortada(!perfilVisible);
  });
  libroPortada.addEventListener('pointerleave', function (evento) {
    // Un toque de celular no equivale a retirar el cursor.
    if (evento.pointerType === 'mouse' && perfilVisible) girarPortada(false);
  });
  libroPortada.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && perfilVisible) {
      evento.preventDefault();
      girarPortada(false);
    } else if (evento.target === libroPortada && (evento.key === 'Enter' || evento.key === ' ')) {
      evento.preventDefault();
      girarPortada(!perfilVisible);
    }
  });
}
