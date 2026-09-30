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