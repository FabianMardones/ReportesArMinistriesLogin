window.addEventListener('click', mensajeDashboard)

function mensajeDashboard(e){

  const dashboard = e.target.classList.contains('dashboard');

  if (dashboard) {
    Swal.fire({
      icon: 'warning',
      title: 'Este sitio se encuentra en desarrollo',
      text: 'Pagina en construcción',
      footer: '<p>Pronto esa sección estará disponible</p>'
    })
  }
}
