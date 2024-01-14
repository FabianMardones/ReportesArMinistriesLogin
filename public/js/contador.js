// const contador = document.querySelector('#contador')

// const url = 'http://127.0.0.1:3001/contadorDeAlmas'

// const mostrarConteo = async() => {
//     try {
//         const response = await fetch(url)
//         const data = await response.json()
//         return data

//     } catch (error) {
//         console.log(error);
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   mostrarConteoDom()
// })



// async function mostrarConteoDom(){
//     const datos = await mostrarConteo()

//     console.log(datos);

//     const { results } = datos 

//     const numero = document.createElement('h1')
//     numero.textContent = results

//     contador.appendChild(numero)
// }


const text = document.querySelector('.text p')
text.innerHTML = text.innerText.split('').map((char, i) => 
    `<span style="transform:rotate(${i * 8.3}deg)">${char}</span>`
).join('')
