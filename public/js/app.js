/** Esta función de print canvas, está detallando el formato de impresión obtenida desde la libreria html2pdf */
function print_canvas(){
  const element = document.getElementById('contenido')
  html2pdf().set({
      margin:   2,
      filename:   'ReporteEncuentro.pdf',
      image:      { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPdf:       { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).from(element).save().toPdf().catch(error=>console.log(error));
}


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
const obervaciones = document.querySelector('#observaciones')

/** selector del formulario */
const formulario = document.querySelector('.formularioForm')

/**botones de rest y submit */
const btnSubmit = document.querySelector('button[type="submit"]')
const btnReset = document.querySelector('button[type="reset"]')

/**Container doc, es un contenedor el cual recibirá el reporte dinámicamente mediante javascript al presionar generar reporte*/
const containerDoc = document.querySelector('.container')




/**Objeto form, para capturar los datos, verificar si estos tienen datos, poder desbloquear el botón de enviar, y proveer de los valores capturados en el formulario a la tabla que se inserta dinámicamente en pdf para su posterior descarga*/
const objetoForm = {
  id: Date.now(),
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
  totalAsistentes: Number(0),
  totalAJ: Number(0),
  aceptaPresencial: '',
  aceptaOnline: '',
  aceptaTweens: '',
  nombrePredicador: '',
  nombreMensaje: '',
  observaciones: ''
}

/**En lo persona desde que aprendí javascript, siempre consideré que una forma un poco más ordenada es colocar dentro de una función los eventos principales dentro de los cuales, tenemos la validación, el envío del formulario y el reset de este mismo*/
function agruparEventListener(){

    pastoresCampus.addEventListener('input', validacion)
    ministrosEncargados.addEventListener('blur', validacion)
    lideresVoluntarios.addEventListener('blur',validacion)
    fecha.addEventListener('blur',validacion)
    hora.addEventListener('blur',validacion)
    modalidad.addEventListener('blur',validacion)
    campus.addEventListener('blur',validacion)

    asistencialAdulto.addEventListener('blur',validacion)
    asistenciaKids.addEventListener('blur',validacion)
    asistenciaTweens.addEventListener('blur',validacion)

    asistenciaServicio.addEventListener('blur',validacion)
    asistenciaTecnica.addEventListener('blur',validacion)
    asistenciaKidsVoluntarios.addEventListener('blur',validacion)
    asistenciaTweensVoluntarios.addEventListener('blur',validacion)
    asistenciaWorshipVoluntarios.addEventListener('blur',validacion)
    asistenciaCocinaVoluntarios.addEventListener('blur',validacion)
    asistenciaRedesSocialesVoluntarios.addEventListener('blur',validacion)
    asistenciaSeguridadVoluntarios.addEventListener('blur',validacion)
    asistenciaSalaDeBebesVoluntarios.addEventListener('blur',validacion)

    infoStand.addEventListener('blur', validacion)
    oracionStand.addEventListener('blur', validacion)
    standRecursos.addEventListener('blur', validacion)
    standAmorPorLaCasa.addEventListener('blur', validacion)
    standProyectoEducativo.addEventListener('blur', validacion)



    aceptaPresencial.addEventListener('blur', validacion)
    aceptaOnline.addEventListener('blur', validacion)
    aceptaTweens.addEventListener('blur', validacion)

    predicador.addEventListener('change', validacion)
    nombreMensaje.addEventListener('blur', validacion)

    obervaciones.addEventListener('blur', validacion)

    botonCalcular.addEventListener('click', ((e) =>{
      e.preventDefault()
      calcularTotalAsistencia()
      validacionTotalAsistentes(e)
    }))

    botonCalcularAJ.addEventListener('click', (e) => {
      e.preventDefault();
      calcularTotalAsistenciaAJ();
      validacionTotalAJ(e); // Pasa el evento como argumento
    });


    formulario.addEventListener('submit', registrarDatos)

    btnReset.addEventListener('click', (e) =>{
        e.preventDefault()
        resetearFormulario()
    })

    window.addEventListener('resize', () => {
      ocultarCard2()
    });
    
    document.addEventListener('DOMContentLoaded', () =>{
      ocultarCard2()
    })
}
agruparEventListener()


/**variable contenidoGenerado utilizada para verificiar si está o no el reporte listo, esta se modifica en registrarFormulario en un valor de true, para comprobar si estado y así cuando está la pantalla inferior a 1090px, esta se pueda desbloquear y colocarse como display flex para mostrarse en primer lugar en la pantalla */
let contenidoGenerado = false



/**Esta función comprueba el ancho de la pantalla donde se esté trabajando y está conectada con lo que pase en contenido generado para que en pantallas de menos de 1090px tenga un display none pero uqe cada vex que esté sobre esta medida, se muestre.*/
function ocultarCard2(){
  const windowWidth = window.innerWidth;

  if (windowWidth <= 1090 && !contenidoGenerado) {
    card2.style.display = 'none';
  } else {
    card2.style.display = 'block';
  }
}


/**Función de validación, la cual valida todos los campos para que estos sean obligatorios*/
function validacion(e){
  e.preventDefault()

  const valorInput = e.target.value
  const referencia = e.target.parentElement
  const nameInput = e.target.name
  const mensaje = `El campo ${nameInput} es obligatorio`
  const inputElement = e.target
  
  if(valorInput === ''){
    mensajeAlerta(mensaje, referencia)
    objetoForm[e.target.id] = ''
    comprobarObjetoForm()
    inputElement.classList.add('input-invalid')
    return
  }

  if(nameInput === 'Lideres de voluntarios' && Number(valorInput)){
    mensajeAlerta(`El campo ${nameInput} debe ser texto`,referencia)
    objetoForm[e.target.id] = ''
    comprobarObjetoForm()
    inputElement.classList.add('input-invalid')
    return
  }

  if (nameInput === 'Nombre del predicador' && Number(valorInput)) {
    mensajeAlerta(`El campo ${nameInput} debe ser texto`,referencia)
    objetoForm[e.target.id] = ''
    comprobarObjetoForm()
    inputElement.classList.add('input-invalid')
    return
  }

  if (nameInput === 'Mensaje' && Number(valorInput)) {
    mensajeAlerta(`El campo ${nameInput} debe ser texto`,referencia)
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
  const totalAsistencia = (totalAsistentes.value);
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
    mensajeError.className = 'text-light w-100 p-2 bg-danger fw-bold fs-5 alerta'

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

  const totalAsistencia =
    Number(asistencialAdulto.value) +
    Number(asistenciaKids.value) +
    Number(asistenciaTweens.value) +
    Number(asistenciaServicio.value) +
    Number(asistenciaTecnica.value) +
    Number(asistenciaKidsVoluntarios.value) +
    Number(asistenciaTweensVoluntarios.value) +
    Number(asistenciaWorshipVoluntarios.value) +
    Number(asistenciaCocinaVoluntarios.value) +
    Number(asistenciaRedesSocialesVoluntarios.value) +
    Number(asistenciaSeguridadVoluntarios.value) +
    Number(asistenciaSalaDeBebesVoluntarios.value) +
    Number(infoStand.value) +
    Number(oracionStand.value) +
    Number(standRecursos.value) +
    Number(standAmorPorLaCasa.value) +
    Number(standProyectoEducativo.value);

  document.querySelector('#totalAsistentes').value = totalAsistencia;
}


function calcularTotalAsistenciaAJ() {

  const totalAceptaAJesus =
    Number(aceptaPresencial.value) +
    Number(aceptaOnline.value) +
    Number(aceptaTweens.value);

  document.querySelector('#totalAJ').value = totalAceptaAJesus;
}

/**Función de registrar datos, está vinculada al formulario con un evento de tipo submit, el cual al momento de pasar la validación y enviar y generar el pdf, los datos, primeramente se generen en una tabla dinámica, esta se iprima en el html con un botón de descargar el cual está utilizando la librería de html2pdf, para descargar el pdf y en conjunto le asocia los datos capturados en el objetoForm para que se inserten dinámicamente según lo puesto en el formulario. Luego de esto está el setTimeout para añadir atributos al formulario, con el propósito importantísimo de enviar los datos a la base de datos, conectándo el formulario a la ruta de validar que se encuentra en index.js la cual utiliza express, node.js y mysql para enviar los datos a la base de datos y por último, luego de 1 segundo que sucede eso, se cambiar el texto que indica en la card2 que duce "aquí estará tu reporte" por "tu reporte está listo" de esta forma hacer intuitiva la visualización y descarga del documento. por último se muestra en bloque la card2, usando la función contenido true, y desbloqueando la card2 para pantallas más pequeñas así al momento de enviar, se muestra en primer lugar*/
function registrarDatos(e){
  e.preventDefault()


  containerDoc.innerHTML = `

  <div class="card face back" style="margin-top: 20px;">


  <div class="card-header d-flex justify-content-between no-print">
    <h3 class="text-dark">Ar <strong class="ministries">Ministries</strong></h3>
    <button class="btn btn-success no-print btn-descargar" onclick="print_canvas()">Descargar</button>
  </div>

  <div class="card-body" id="contenido">

  <div class="w-100 d-flex row flex-row-reverse align-content-between" style="margin-top: 10px; text-align: right !important;">
    <h1 class="w-50" style="color: #524d4d ; font-family: monospace; text-align: end;">Reporte Encuentro</h1>
    <h1 class="w-50" style="color: #524d4d ; font-family: monospace; text-align: start;">AR <strong class="ministries">Ministries</strong></h1>
  </div>

  <div class="d-flex justify-content-between">
  <div>
    <h5 class="text-dark"><b>Pastor Principal</b></h5>
    Patricio Burgos <br>
    patricio.burgos@arministries.com <br>
    +569 7777777 <br>
    Chile, Puente Alto <br>
  </div>
  <!-- <div style="text-align: right !important;">
    <h5 class="text-dark"><b>Pastor Principal</b></h5>
    Patricio Burgos <br>
    patricio.burgos@arministries.com<br>
    +569 7777777 <br>
    Chile, Puente Alto <br>
  </div> -->
  </div>

  <div class="d-flex justify-content-between" style="margin-top: 20px;">
    <div>
      <span><b>Fecha y Hora</b></span>
      <br>
      <span>${objetoForm.fecha}, ${objetoForm.hora}</span>
    </div>
    <div>
      <span><b>Modalidad</b></span>
      <br>
      <span>${objetoForm.modalidad}</span>
    </div>
    <div>
      <span><b>Campus</b></span>
      <br>
      <span>${objetoForm.campus}</span>
    </div>
    <div>
      <span><b>Lideres de voluntarios</b></span>
      <br>
      <span>${objetoForm.lideresVoluntarios}</span>
    </div>
    <div>
      <span><b>Pastores de campus</b></span>
      <br>
      <span class="pastores">${objetoForm.pastoresCampus}</span>
    </div>
    <div>
      <span><b>Ministros Encargados</b></span>
      <br>
      <span class="pastores">${objetoForm.ministrosEncargados}</span>
    </div>
  </div>

<h4 style="color: black; margin-top: 0;">Asistencia</h4>
    
    <table class="table table-bordered table-striped">
      <thead>
        <th>Adultos</th>
        <th>Kids</th>
        <th>Tweens</th>
      </thead>
      <tbody>
        <tr>
          <td>${objetoForm.adultos}</td>
          <td>${objetoForm.kids}</td>
          <td>${objetoForm.tweens}</td>
        </tr>
      </tbody>
    </table>
    
    <br>

    <h4 style="color: black;">Voluntarios</h4>
    
    <table class="table table-bordered table-striped">
      <thead>
        <th>Servcio</th>
        <th>Técnica</th>
        <th>Kids</th>
        <th>Tweens</th>
        <th>Worhsip</th>
        <th>Cocina</th>
        <th>Redes Sociales</th>
        <th>Seguridad</th>
        <th>Sala de bebés</th>
      </thead>
      <tbody>
        <tr>
          <td>${objetoForm.servicioVoluntarios}</td>
          <td>${objetoForm.tecnicaVoluntarios}</td>
          <td>${objetoForm.kidsVoluntarios}</td>
          <td>${objetoForm.tweensVoluntarios}</td>
          <td>${objetoForm.worshipVoluntarios}</td>
          <td>${objetoForm.cocinaVoluntarios}</td>
          <td>${objetoForm.redesSocialesVoluntarios}</td>
          <td>${objetoForm.seguridadVoluntarios}</td>
          <td>${objetoForm.salaBebesVoluntarios}</td>
        </tr>
      </tbody>
    </table>
    
    <br>

    <h4 style="color: black;">Stand</h4>
    
    <table class="table table-bordered table-striped">
      <thead>
        <th>Info</th>
        <th>Oración</th>
        <th>Recursos</th>
        <th>Amor por la casa</th>
        <th>Proyecto educativo</th>
      </thead>
      <tbody>
        <tr>
          <td>${objetoForm.infoVoluntarios}</td>
          <td>${objetoForm.oracionVoluntarios}</td>
          <td>${objetoForm.recursosVoluntarios}</td>
          <td>${objetoForm.amorPorLaCasaVoluntarios}</td>
          <td>${objetoForm.proyectoEducativoVoluntarios}</td>
        </tr>
      </tbody>
    </table>

    <br>

    <h4 style="color: black;">Total General</h4>

    <table class="table table-bordered table-striped">
      <thead>
        <th>Total</th>
      </thead>
      <tbody>
        <tr>
          <td>${objetoForm.totalAsistentes}</td>
        </tr>
      </tbody>
    </table>

    <br>

    <h4 style="color: black;">Personas que aceptaron a Jesús</h4>

    <table class="table table-bordered table-striped">
      <thead>
        <th>Presencial</th>
        <th>YouTube</th>
        <th>Tweens</th>
      </thead>
      <tbody>
        <tr>
          <td>${objetoForm.aceptaPresencial}</td>
          <td>${objetoForm.aceptaOnline}</td>
          <td>${objetoForm.aceptaTweens}</td>
        </tr>
      </tbody>
    </table>
    <br>

    <table class="table table-bordered table-striped">
    <thead>
      <th>Total</th>
    </thead>
    <tbody>
      <tr>
        <td>${objetoForm.totalAJ}</td>
      </tr>
    </tbody>
  </table>
  <br>

      <div>
        <div>
          <span><b>Nombre Predicador</b></span>
          <br>
          <span>${objetoForm.nombrePredicador}</span>
        </div>
        <div>
          <span><b>Nombre Mensaje</b></span>
          <br>
          <span>${objetoForm.nombreMensaje}</span>
        </div>
      </div>

      <h4 style="color: black;">Observaciones</h4>
      <table class="table table-bordered table-striped">
        <thead>
          <th>Observaciones</th>
        </thead>
        <tbody>
          <tr>
            <td>${objetoForm.observaciones}</td>
          </tr>
        </tbody>
          <thead>
            <th>ID Reporte</th>
          </thead>
        <tbody>
          <tr>
            <td>${objetoForm.id}</td>
          </tr>
        </tbody>
      </table>
      <h4 style="color: black;"></h4>
      <table class="table table-bordered table-striped">
        <thead>
          <th></th>
        </thead>
        <tbody>
          <img class="img-relleno" src="./assets/img/Fondo BLanco Pequeño.png" alt="">
        </tbody>
      </table>
</div>
</div>
  `
  setTimeout(() => {
    formulario.setAttribute("action", "/validar");
    formulario.setAttribute('method', 'POST');
    formulario.submit();
    setTimeout(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Tienes 60 segundos para descargar el reporte',
        showConfirmButton: false,
        timer: 5000
      })
      document.getElementById('mensajeInicial').textContent = 'El informe está listo';
      contenidoGenerado = true
      card2.style.display = 'block';
      resetearFormulario()
      btnFinish.classList.remove('oculto')
    }, 2000);
  }, 1000);


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




