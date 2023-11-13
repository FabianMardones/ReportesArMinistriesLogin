
const santiago = document.querySelector('#info-santiago');
const puenteAlto = document.querySelector('#info-puente-alto');
const montevideo = document.querySelector('#info-montevideo');
const westPerrine = document.querySelector('#info-west-perrine');
const doral = document.querySelector('#info-doral');

const filtrarBtn = document.querySelector('#filtrar-btn');
const fechaFiltro = document.querySelector('#fecha-filtro');
const horaFiltro = document.querySelector('#hora-filtro');


  // Realiza el filtrado de datos según la fecha y hora proporcionadas
  fetch('/datos-encuentros')
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.error('Error al cargar datos de encuentros:', error);
    });


