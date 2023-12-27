/**Los selectores para cada input, para manipular los valores que se ingresen a cada uno*/
/** Primero tenemos Los selectores para manipular el primer grupo de datos, como son los datos de día fechas y pastores y, para manipular los valores que se ingresen a cada uno*/
const pastoresCampus = document.querySelector('#pastoresCampus')
const ministrosEncargados = document.querySelector('#ministrosEncargados')
const lideresVoluntarios = document.querySelector('#lideresVoluntarios')
const fecha = document.querySelector('#fecha')
const hora = document.querySelector('#hora')
const modalidad = document.querySelector('#modalidad')
const campus = document.querySelector('#campus')

/**En esta sección se encuentran seleccionadas las asistencias*/
const asistencialAdulto = document.querySelector('#adultos')
const asistenciaKids = document.querySelector('#kids')
const asistenciaTweens = document.querySelector('#tweens')
const asistenciaServicio = document.querySelector('#servicioVoluntarios')
const asistenciaTecnica = document.querySelector('#tecnicaVoluntarios')
const asistenciaKidsVoluntarios = document.querySelector('#kidsVoluntarios')
const asistenciaTweensVoluntarios = document.querySelector('#tweensVoluntarios')
const asistenciaWorshipVoluntarios = document.querySelector('#worshipVoluntarios')
const asistenciaCocinaVoluntarios = document.querySelector('#cocinaVoluntarios')
const asistenciaRedesSocialesVoluntarios = document.querySelector('#redesSocialesVoluntarios')
const asistenciaSeguridadVoluntarios = document.querySelector('#seguridadVoluntarios')
const asistenciaSalaDeBebesVoluntarios = document.querySelector('#salaBebesVoluntarios')
const infoStand = document.querySelector('#infoVoluntarios')
const oracionStand = document.querySelector('#oracionVoluntarios')
const standRecursos = document.querySelector('#recursosVoluntarios')
const standAmorPorLaCasa = document.querySelector('#amorPorLaCasaVoluntarios')
const standProyectoEducativo = document.querySelector('#proyectoEducativoVoluntarios')

/**En esta sección se encuentran seleccionadas las asistencias y el botón que generará automáticamente la suma*/
const botonCalcular = document.querySelector('#calcular')
const totalAsistentes = document.querySelector('#totalAsistentes')

const botonCalcularAJ = document.querySelector('#calcularAJ')
const totalAJ = document.querySelector('#totalAJ')

/**Muy importante llevar el registro de las personas que aceptaron a Jesús*/
const aceptaPresencial = document.querySelector('#aceptaPresencial')
const aceptaOnline = document.querySelector('#aceptaOnline')
const aceptaTweens = document.querySelector('#aceptaTweens')

/**Nombre del predicador y el mensaje */
const predicador = document.querySelector('#nombrePredicador')
const nombreMensaje = document.querySelector('#nombreMensaje')

/**La última parte del reporte, las observaciones que por cierto son obligatorias*/
const observaciones = document.querySelector('#observaciones')

/** selector del formulario */
const formulario = document.querySelector('.formularioForm')

/**botones de rest y submit */
const btnSubmit = document.querySelector('button[type="submit"]')
const btnReset = document.querySelector('button[type="reset"]')

/**Container doc, es un contenedor el cual recibirá el reporte dinámicamente mediante javascript al presionar generar reporte*/
const containerDoc = document.querySelector('.container')



/**Objeto form, para capturar los datos, verificar si estos tienen datos, poder desbloquear el botón de enviar, y proveer de los valores capturados en el formulario a la tabla que se inserta dinámicamente en pdf para su posterior descarga*/
const objetoForm = {
  pastoresCampus: '',
  ministrosEncargados: '',
  lideresVoluntarios: '',
  fecha: '',
  hora: '',
  modalidad: '',
  campus: '',
  adultos: '',
  kids: '',
  tweens: '',
  servicioVoluntarios: '',
  tecnicaVoluntarios: '',
  kidsVoluntarios: '',
  tweensVoluntarios: '',
  worshipVoluntarios: '',
  cocinaVoluntarios: '',
  redesSocialesVoluntarios: '',
  seguridadVoluntarios: '',
  salaBebesVoluntarios: '',
  infoVoluntarios: '',
  oracionVoluntarios: '',
  recursosVoluntarios: '',
  amorPorLaCasaVoluntarios: '',
  proyectoEducativoVoluntarios: '',
  totalAsistentes: "",
  totalAJ: "",
  aceptaPresencial: '',
  aceptaOnline: '',
  aceptaTweens: '',
  nombrePredicador: '',
  nombreMensaje: '',
  observaciones: ''
}

const elementos = [
    pastoresCampus, ministrosEncargados, lideresVoluntarios, fecha, hora, modalidad, campus,
    asistencialAdulto, asistenciaKids, asistenciaTweens,
    asistenciaServicio, asistenciaTecnica, asistenciaKidsVoluntarios, asistenciaTweensVoluntarios,
    asistenciaWorshipVoluntarios, asistenciaCocinaVoluntarios, asistenciaRedesSocialesVoluntarios,
    asistenciaSeguridadVoluntarios, asistenciaSalaDeBebesVoluntarios,
    infoStand, oracionStand, standRecursos, standAmorPorLaCasa, standProyectoEducativo,
    aceptaPresencial, aceptaOnline, aceptaTweens,
    predicador, nombreMensaje,
    observaciones
  ];


  for (const elemento of elementos) {
    if (elemento.type === 'select-one' || elemento.type === 'select-multiple' || elemento.type === 'textarea') {
      elemento.addEventListener('blur', validacion);
    } else {
      elemento.addEventListener('input', validacion);
    }
  }

function agruparEventListener(){

    botonCalcular.addEventListener('click', ((e) =>{
      e.preventDefault()
      calcularTotalAsistencia()
      validacionTotalAsistentes(e)
    }))

    botonCalcularAJ.addEventListener('click', (e) => {
      e.preventDefault();
      calcularTotalAsistenciaAJ();
      validacionTotalAJ(e);
    });

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
    objetoForm[e.target.id] = ''
    comprobarObjetoForm()
    inputElement.classList.add('input-invalid')
    return
  }

  if (nameInput === 'nombreMensaje' && Number(valorInput)) {
    mensajeAlerta(`El campo ${nameInput} debe ser texto`,referencia)
    objetoForm[e.target.id] = ''
    comprobarObjetoForm()
    inputElement.classList.add('input-invalid')
    return
  }

  if (nameInput === 'fecha' && valorInput != fechaFormateada) {
    mensajeAlerta(`La fecha no puede ser de ayer ni de mañana`, referencia)
    objetoForm[e.target.id] = ''
    comprobarObjetoForm()
    inputElement.classList.add('input-invalid')
    return
  }

  inputElement.classList.remove('input-invalid')

  eliminarMensajeAlerta(referencia)

  objetoForm[e.target.id] = valorInput.toLowerCase()

  comprobarObjetoForm()
}

/**Esta validación de totalAsistentes se valida de forma separada, ya que está directamente relacionada al evento click del boton con el id botonCalular, de esta forma, pasará la validación siempre y cuando se le haya dado click*/
function validacionTotalAsistentes(e) {
  const totalAsistencia = Number(totalAsistentes.value);
  const inputElement = e.target

  if (isNaN(totalAsistencia) || totalAsistencia < 0) {
    mensajeAlerta('El campo Total Asistentes debe ser un número válido', totalAsistentes.parentElement);
    objetoForm.totalAsistentes = '';
    comprobarObjetoForm();
    inputElement.classList.add('input-invalid')
  } else {
    eliminarMensajeAlerta(totalAsistentes.parentElement);
    objetoForm.totalAsistentes = totalAsistencia;
    comprobarObjetoForm();
  }
}

function validacionTotalAJ(e) {
  const totalAsistencia = Number(totalAJ.value); // Convierte el valor a número
  const inputElement = e.target;

  if (isNaN(totalAsistencia) || totalAsistencia < 0) {
    mensajeAlerta('El campo Total Asistentes debe ser un número válido', totalAJ.parentElement);
    objetoForm.totalAJ = ''; // Deja esto vacío o asigna null si es necesario
    comprobarObjetoForm();
    inputElement.classList.add('input-invalid');
  } else {
    eliminarMensajeAlerta(totalAJ.parentElement);
    objetoForm.totalAJ = totalAsistencia; // Almacena el número
    comprobarObjetoForm();
  }
}



/**Función mensaje de alerta, sirve para mostrar la alerta debajo de cada input, para ayudar al usuario a completar todos los campos y estos sepan que son obligatorios */
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


/**Esta función trabaja en conjunto con el input y el botón de calcular, para sumar todos los valores colocados en cada input de asistencia y estos se resuman en un total*/
function calcularTotalAsistencia() {

    const inputs = [
        asistencialAdulto, asistenciaKids, asistenciaTweens,
        asistenciaServicio, asistenciaTecnica, asistenciaKidsVoluntarios,
        asistenciaTweensVoluntarios, asistenciaWorshipVoluntarios,
        asistenciaCocinaVoluntarios, asistenciaRedesSocialesVoluntarios,
        asistenciaSeguridadVoluntarios, asistenciaSalaDeBebesVoluntarios,
        infoStand, oracionStand, standRecursos, standAmorPorLaCasa,
        standProyectoEducativo
      ];

      const totalAsistencia = inputs.reduce((total, input) => total
       + parseInt(input.value) || 0, 0)

  document.querySelector('#totalAsistentes').value = totalAsistencia;
}


function calcularTotalAsistenciaAJ() {


    const inputs = [ aceptaPresencial, aceptaOnline, aceptaTweens ];

    const totalAceptaAJesus = inputs.reduce((total, input) => total + parseInt(input.value) || 0, 0)

  document.querySelector('#totalAJ').value = totalAceptaAJesus;
}




/**Esta función recorre todos los componentes del formulario y hace una validación, la cual descarta los elementos del formularo que sean distintos a botón, a tipo submit y reset para darles un valor de un string vacío, y así que todos los inputs, textArea y select, queden con valor incial, osea reestablecerlos. Por último en caso de haber alertas, que no deberían, se vuelven a eliminar por si acaso, y el objeto completo del objetoForm queda con todos los valores de las keys vacíos para que al validar con la función comprobarObjetoForm, se vuelva a bloquear el botón de enviar */
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
    objetoForm[prop] = '';
  }

  comprobarObjetoForm();
}



function comprobarObjetoForm(){

  console.log(objetoForm);

  const tieneValorVacio = Object.values(objetoForm).includes('')

  if (tieneValorVacio) {
    btnSubmit.disabled = true
    return
  }
  btnSubmit.disabled = false
}





