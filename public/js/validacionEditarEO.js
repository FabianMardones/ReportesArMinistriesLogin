import { mostrarAlerta, validar } from "./mensajeAlerta.js"

    const formulario = document.querySelector('#formulario2')
    formulario.addEventListener('submit', validacion)


    function validacion(e){
        e.preventDefault()
        const modalidad = document.querySelector('#modalidad').value
        const campus = document.querySelector('#campus').value
        const fecha = document.querySelector('#fecha').value
        const hora = document.querySelector('#hora').value
        const ministrosEncargados = document.querySelector('#ministrosEncargados').value
        const lideresVoluntarios = document.querySelector('#lideresVoluntarios').value
        const adultos = document.querySelector('#adultos').value
        const servicioVoluntarios = document.querySelector('#servicioVoluntarios').value
        const tecnicaVoluntarios = document.querySelector('#tecnicaVoluntarios').value
        const worshipVoluntarios = document.querySelector('#worshipVoluntarios').value
        const cocinaVoluntarios = document.querySelector('#cocinaVoluntarios').value
        const redesSocialesVoluntarios = document.querySelector('#redesSocialesVoluntarios').value
        const seguridadVoluntarios = document.querySelector('#seguridadVoluntarios').value
        const totalAsistentes = document.querySelector('#totalAsistentes').value
        const asistenciaOnline = document.querySelector('#asistenciaOnline').value
        const totalAsistentesOnline = document.querySelector('#totalAsistentesOnline').value

        const encuentro = {
            modalidad,
            campus,
            fecha,
            hora,
            ministrosEncargados,
            lideresVoluntarios,
            adultos,
            servicioVoluntarios,
            tecnicaVoluntarios,
            worshipVoluntarios,
            cocinaVoluntarios,
            redesSocialesVoluntarios,
            seguridadVoluntarios,
            totalAsistentes,
            asistenciaOnline,
            totalAsistentesOnline
        }

        console.log(encuentro);

        if (validar(encuentro)) {
            mostrarAlerta('Todos los campos son obligatorios')
            return
        }

        formulario.submit()
    }


