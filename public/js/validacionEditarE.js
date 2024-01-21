import { mostrarAlerta, validar } from "./mensajeAlerta.js"

    const formulario = document.querySelector('#formulario2')
    formulario.addEventListener('submit', validacion)


    function validacion(e){
        e.preventDefault()
        const pastoresCampus = document.querySelector('#pastoresCampus').value
        const ministrosEncargados = document.querySelector('#ministrosEncargados').cvlue
        const lideresVoluntarios = document.querySelector('#lideresVoluntarios').value
        const fecha = document.querySelector('#fecha').value
        const hora = document.querySelector('#hora').value
        const modalidad = document.querySelector('#modalidad').value
        const campus = document.querySelector('#campus').value
        const adultos = document.querySelector('#adultos').value
        const kids = document.querySelector('#kids')
        const tweens = document.querySelector('#tweens').value
        const servicioVoluntarios = document.querySelector('#servicioVoluntarios').value
        const tecnicaVoluntarios = document.querySelector('#tecnicaVoluntarios').value
        const kidsVoluntarios = document.querySelector('#kidsVoluntarios').value
        const tweensVoluntarios = document.querySelector('#tweensVoluntarios').value
        const worshipVoluntarios = document.querySelector('#worshipVoluntarios').value
        const cocinaVoluntarios = document.querySelector('#cocinaVoluntarios').value
        const redesSocialesVoluntarios = document.querySelector('#redesSocialesVoluntarios')
        const seguridadVoluntarios = document.querySelector('#seguridadVoluntarios').value
        const salaBebesVoluntarios = document.querySelector('#salaBebesVoluntarios').value
        const infoVoluntarios = document.querySelector('#infoVoluntarios').value
        const oracionVoluntarios = document.querySelector('#oracionVoluntarios').value
        const recursosVoluntarios = document.querySelector('#recursosVoluntarios').value
        const amorPorLaCasaVoluntarios = document.querySelector('#amorPorLaCasaVoluntarios').value
        const proyectoEducativoVoluntarios = document.querySelector('#proyectoEducativoVoluntarios').value
        const totalAsistentes = document.querySelector('#totalAsistentes').value
        const aceptaOnline = document.querySelector('#aceptaOnline').value
        const nombrePredicador = document.querySelector('#nombrePredicador').value
        const nombreMensaje = document.querySelector('#nombreMensaje').value
        const observaciones = document.querySelector('#observaciones').value
        const salaBebe = document.querySelector('#salaBebe').value

        const encuentro = {
            pastoresCampus,
            ministrosEncargados,
            lideresVoluntarios,
            fecha,
            hora,
            modalidad,
            campus,
            adultos,
            kids,
            tweens,
            servicioVoluntarios,
            tecnicaVoluntarios,
            kidsVoluntarios,
            tweensVoluntarios,
            worshipVoluntarios,
            cocinaVoluntarios,
            redesSocialesVoluntarios,
            seguridadVoluntarios,
            salaBebesVoluntarios,
            infoVoluntarios,
            oracionVoluntarios,
            recursosVoluntarios,
            amorPorLaCasaVoluntarios,
            proyectoEducativoVoluntarios,
            totalAsistentes,
            aceptaOnline,
            nombrePredicador,
            nombreMensaje,
            observaciones,
            salaBebe
        }

        console.log(encuentro);

        if (validar(encuentro)) {
            mostrarAlerta('Todos los campos son obligatorios')
            return
        }

        formulario.submit()
    }


