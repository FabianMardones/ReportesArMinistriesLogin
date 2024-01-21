const modalidad = document.querySelector('#modalidad')
const campus = document.querySelector('#campus')
const fecha = document.querySelector('#fecha')
const hora = document.querySelector('#hora')
const ministrosEncargados = document.querySelector('#ministrosEncargados')
const lideresVoluntarios = document.querySelector('#lideresVoluntarios')
const adultos = document.querySelector('#adultos')
const servicioVoluntarios = document.querySelector('#servicioVoluntarios')
const tecnicaVoluntarios = document.querySelector('#tecnicaVoluntarios')
const worshipVoluntarios = document.querySelector('#worshipVoluntarios')
const cocinaVoluntarios = document.querySelector('#cocinaVoluntarios')
const redesSocialesVoluntarios = document.querySelector('#redesSocialesVoluntarios')
const seguridadVoluntarios = document.querySelector('#seguridadVoluntarios')
const totalAsistentes = document.querySelector('#totalAsistentes')
const asistenciaOnline = document.querySelector('#asistenciaOnline')
const totalAsistentesOnline = document.querySelector('#totalAsistentesOnline')
const botonCalcularPresencial = document.querySelector('#caclularPresencial')
const botonCalcularOnline = document.querySelector('#calcularOnline')
const btnReset = document.querySelector('button[type="reset"]')
const btnSubmit = document.querySelector('button[type="submit"]')


const obj = {
    modalidad: '',
    campus: '',
    fecha: '',
    hora: '',
    ministrosEncargados: '',
    lideresVoluntarios: '',
    adultos: '',
    servicioVoluntarios: '',
    tecnicaVoluntarios: '',
    worshipVoluntarios: '',
    cocinaVoluntarios: '',
    redesSocialesVoluntarios: '',
    seguridadVoluntarios: '',
    totalAsistentes: '',
    asistenciaOnline: '',
    totalAsistentesOnline: '',
}


const elementos = [
    modalidad, campus, fecha, hora, ministrosEncargados, lideresVoluntarios,
    adultos, servicioVoluntarios, tecnicaVoluntarios, worshipVoluntarios,
    cocinaVoluntarios, redesSocialesVoluntarios, seguridadVoluntarios,
    asistenciaOnline
]


for (const elemento of elementos) {
    if (elemento.type === 'select-one' || elemento.type === 'select-multiple' || elemento.type === 'textarea') {
      elemento.addEventListener('blur', validacion);
    } else {
      elemento.addEventListener('input', validacion);
    }
}


function agruparEventListener(){

    botonCalcularPresencial.addEventListener('click', ((e) =>{
      e.preventDefault()
      calcularTotalAsistencia()
      validacionTotalAsistentes(e)
    }))

    botonCalcularOnline.addEventListener('click', (e) => {
      e.preventDefault()
      calcularTotalOnline()
      validacionTotalAsistentesOnline(e)
    })

    btnReset.addEventListener('click', (e) =>{
        e.preventDefault()
        resetearFormulario()
    })
}
agruparEventListener()

function formatearFecha(numero){
    return numero < 10 ? `0${numero}` : numero.toString()
  }
  
  
  /**Función de validación, la cual valida todos los campos para que estos sean obligatorios*/
  function validacion(e){
    e.preventDefault()
  
    const valorInput = e.target.value
    const referencia = e.target.parentElement
    const nameInput = e.target.name
    const mensaje = `El campo ${nameInput} es obligatorio`
    const inputElement = e.target
    const fechaActual = new Date();
    const dia = formatearFecha(fechaActual.getDate())
    const mes = formatearFecha(fechaActual.getMonth() + 1)
    const anio = fechaActual.getFullYear();
  
  const fechaFormateada = `${anio}-${mes}-${dia}`;
  
  console.log(fechaFormateada);
  
    
    if(valorInput === ''){
      mensajeAlerta(mensaje, referencia)
      obj[e.target.id] = ''
      comprobarObjetoForm()
      inputElement.classList.add('input-invalid')
      return
    }
  
    if (nameInput === 'nombreMensaje' && Number(valorInput)) {
      mensajeAlerta(`El campo ${nameInput} debe ser texto`,referencia)
      obj[e.target.id] = ''
      comprobarObjetoForm()
      inputElement.classList.add('input-invalid')
      return
    }
  
    if (nameInput === 'fecha' && valorInput != fechaFormateada) {
      mensajeAlerta(`La fecha no puede ser de ayer ni de mañana`, referencia)
      obj[e.target.id] = ''
      comprobarObjetoForm()
      inputElement.classList.add('input-invalid')
      return
    }
  
    inputElement.classList.remove('input-invalid')
  
    eliminarMensajeAlerta(referencia)
  
    obj[e.target.id] = valorInput.toLowerCase()
  
    comprobarObjetoForm()
  }

  function mensajeAlerta(mensaje, referencia){

    eliminarMensajeAlerta(referencia)
  
      const mensajeError = document.createElement('p')
      mensajeError.textContent = mensaje
      mensajeError.className = 'text-light w-100 p-1 bg-danger fw-bold fs-6 alerta'
  
      referencia.appendChild(mensajeError)
  
  }
  
  /**Esta función trabaja para eliminar el mensaje cada vez que exista uno en cada referencia del parentElement, quiere decir que por ejemplo si una persona se equivoca dos veces, no tendrá dos mensajes de alerta, sólamente conservará uno, y si existe otro lo eliminará*/
  function eliminarMensajeAlerta(referencia){
    const alerta = referencia.querySelector('.alerta')
  
    if(alerta){
      alerta.remove()
    }
  }

  function validacionTotalAsistentes(e) {
    const totalAsistencia = Number(totalAsistentes.value);
    const inputElement = e.target
  
    if (isNaN(totalAsistencia) || totalAsistencia < 0) {
      mensajeAlerta('El campo Total Asistentes debe ser un número válido', totalAsistentes.parentElement);
      obj.totalAsistentes = '';
      comprobarObjetoForm();
      inputElement.classList.add('input-invalid')
    } else {
      eliminarMensajeAlerta(totalAsistentes.parentElement);
      obj.totalAsistentes = totalAsistencia;
      comprobarObjetoForm();
    }
  }
  
    function validacionTotalAsistentesOnline(e){
        const totalAsistencia = parseFloat(totalAsistentesOnline.value);
        const inputElement = e.target;
        
        if (isNaN(totalAsistencia) || totalAsistencia < 0) {
        mensajeAlerta('El campo Total Asistentes debe ser un número válido', totalAsistentesOnline.parentElement);
        obj.totalAsistentesOnline = '';
        comprobarObjetoForm();
        inputElement.classList.add('input-invalid');
        } else {
        eliminarMensajeAlerta(totalAsistentesOnline.parentElement);
        obj.totalAsistentesOnline = totalAsistencia;
        comprobarObjetoForm();
        }
    }

    function calcularTotalAsistencia() {

        const inputs = [
            adultos, servicioVoluntarios, tecnicaVoluntarios,
            worshipVoluntarios, cocinaVoluntarios, redesSocialesVoluntarios,
            seguridadVoluntarios
        ];

        const totalAsistencia = inputs.reduce((total, input) => total
        + parseInt(input.value) || 0, 0)

    document.querySelector('#totalAsistentes').value = totalAsistencia;
    }


    function calcularTotalOnline(){
        const inputs = [ asistenciaOnline ];
    
        const totalAsistencia = inputs.reduce((total, input) => total + parseInt(input.value) || 0, 0);
    
        document.querySelector('#totalAsistentesOnline').value = totalAsistencia // Puedes ajustar la cantidad de decimales según tus necesidades
    }


    function resetearFormulario() {

        const formFields = formulario.elements;
    
        for (const field of formFields) {
        if (field.type !== 'button' && field.type !== 'submit' && field.type !== 'reset') {
            field.value = ''; 
        }
        }
    
        const alertas = document.querySelectorAll('.alerta');
        alertas.forEach(alerta => alerta.remove());
    
        for (const prop in objetoForm) {
        obj[prop] = '';
        }
    
        comprobarObjetoForm();
    }
  
  
  
    function comprobarObjetoForm(){
    
        console.log(obj);
    
        const tieneValorVacio = Object.values(obj).includes('')
    
        if (tieneValorVacio) {
        btnSubmit.disabled = true
        return
        }
        btnSubmit.disabled = false
    }