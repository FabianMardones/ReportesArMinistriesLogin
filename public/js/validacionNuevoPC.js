import { mostrarAlerta, validar } from "./mensajeAlerta.js"

    const formulario = document.querySelector('#formulario2')
    formulario.addEventListener('submit', validacion)


    function validacion(e){
        e.preventDefault()
        const idPastor = document.querySelector('.idPastor').value
        const idPastora = document.querySelector('.idPastora').value

        const pastoresC = {
            idPastor,
            idPastora
        }

        console.log(pastoresC);

        if (validar(pastoresC)) {
            mostrarAlerta('Todos los campos son obligatorios')
            return
        }

        formulario.submit()
    }
