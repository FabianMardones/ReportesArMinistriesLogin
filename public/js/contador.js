const contador = document.querySelector('#contador')

document.addEventListener('DOMContentLoaded', () => {
  mostrarContero()
})

function mostrarContero(){
  const url = 'http://127.0.0.1:3001/contadorDeAlmas'

  fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const numero = document.createElement('h1')
        numero.textContent = data.results

        console.log(numero);

        contador.appendChild(numero)
    })
}