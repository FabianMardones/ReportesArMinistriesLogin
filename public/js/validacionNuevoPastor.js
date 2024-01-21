import { mostrarAlerta, validar } from "./mensajeAlerta.js"

    const formulario = document.querySelector('#formulario2')
    formulario.addEventListener('submit', validacion)


    function validacion(e){
        e.preventDefault()
        const rolPastor = document.querySelector('.rol').value
        const nuevoNombrePastor = document.querySelector('.nombre_pastor').value
        const nuevoApellidoPastor = document.querySelector('.apellido_pastor').value
        const estadoCivilPastor = document.querySelector('.estado_civil').value
        const generoPastor = document.querySelector('.genero').value

        const pastores = {
            rol: rolPastor,
            nombre_pastor: nuevoNombrePastor,
            apellido_pastor: nuevoApellidoPastor,
            estado_civil: estadoCivilPastor,
            genero: generoPastor
        }

        console.log(pastores);

        if (validar(pastores)) {
            mostrarAlerta('Todos los campos son obligatorios')
            return
        }

        formulario.submit()
    }


