const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mysql = require('mysql')

let conexion = mysql.createConnection({
    host: "localhost",
    database: "basedatosencuentros",
    user: "root",
    password: ""
})


app.use(express.urlencoded({extended:true}))
app.use(express.json())


const dotenv = require('dotenv')
dotenv.config({path:"./env/.env"})


app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'))

app.use(cookieParser())

app.use('/', require('./routes/router'))


app.set('view engine', 'ejs');


const bcryptjs = require('bcryptjs')


const session = require('express-session')
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

const connection = require('./database/db')
const { name } = require('ejs')




app.post("/validar", function(req, res){
    const datos = req.body;

    console.log(datos);

    let pastoresCampus = datos.pastoresCampus;
    let ministrosEncargados = datos.ministrosEncargados;
    let lideresVoluntarios = datos.lideresVoluntarios;
    let fecha = datos.fecha;
    let hora = datos.hora;
    let modalidad = datos.modalidad;
    let campus = datos.campus;
    let asistenciaAdulto = datos.adultos;
    let asistenciaKids = datos.kids;
    let asistenciaTweens = datos.tweens;
    let asistenciaServicioVoluntarios = datos.servicioVoluntarios;
    let asistenciaTecnicaVoluntarios = datos.tecnicaVoluntarios;
    let asistenciaKidsVoluntarios = datos.kidsVoluntarios;
    let asistenciaTweensVoluntarios = datos.tweensVoluntarios;
    let asistenciaWorshipVoluntarios = datos.worshipVoluntarios;
    let asistenciaCocinaVoluntarios = datos.cocinaVoluntarios;
    let asistenciaRedesSocialesVoluntarios = datos.redesSocialesVoluntarios;
    let asistenciaSeguridadVoluntarios = datos.seguridadVoluntarios;
    let asistenciaSalaDeBebesVoluntarios = datos.salaBebesVoluntarios;
    let asistenciaInfoStand = datos.infoVoluntarios;
    let asistenciaOracionStand = datos.oracionVoluntarios;
    let asistenciaRecursosStand = datos.recursosVoluntarios;
    let asistenciaAmorPorLaCasaStand = datos.amorPorLaCasaVoluntarios;
    let asistenciaProyectoEducativoStand = datos.proyectoEducativoVoluntarios;
    let totalAsistentes = datos.totalAsistentes;
    let aceptaAJesusPresencial = datos.aceptaPresencial;
    let aceptaAJesusOnline = datos.aceptaOnline;
    let aceptaAJesusTweens = datos.aceptaTweens;
    let nombrePredicador = datos.nombrePredicador;
    let nombreMensaje = datos.nombreMensaje;
    let observaciones = datos.observaciones;

    // // let registrar = "INSERT INTO reporte_encuentros (pastores_campus, ministros_encargados, lideres_voluntariado, fecha, hora, modalidad, campus, asistencia_adultos, asistencia_kids, asistencia_tweens, asistencia_voluntarios_servicio, asistencia_voluntarios_tecnica, asistencia_voluntarios_kids, asistencia_voluntarios_tweens, asistencia_voluntarios_worship, asistencia_voluntarios_cocina, asistencia_voluntarios_redes_sociales, asistencia_voluntarios_seguridad, asistencia_voluntarios_sala_bebes, stand_info, stand_oracion, stand_recursos, stand_amor_por_la_casa, stand_proyecto_educativo, total_asistencia, acepta_a_jesus_presencial, acepta_a_jesus_online, acepta_a_jesus_tweens, nombre_predicador, nombre_mensaje, observaciones) VALUES ('"+pastoresCampus +"', '"+ministrosEncargados +"', '"+lideresVoluntarios +"', '"+fecha +"', '"+hora +"', '"+modalidad +"', '"+campus +"', '"+asistenciaAdulto +"', '"+asistenciaKids +"', '"+asistenciaTweens +"', '"+asistenciaServicioVoluntarios +"', '"+asistenciaTecnicaVoluntarios +"', '"+asistenciaKidsVoluntarios +"', '"+asistenciaTweensVoluntarios +"', '"+asistenciaWorshipVoluntarios +"', '"+asistenciaCocinaVoluntarios +"', '"+asistenciaRedesSocialesVoluntarios +"', '"+asistenciaSeguridadVoluntarios +"', '"+asistenciaSalaDeBebesVoluntarios +"', '"+asistenciaInfoStand +"', '"+asistenciaOracionStand +"', '"+asistenciaRecursosStand +"', '"+asistenciaAmorPorLaCasaStand +"', '"+asistenciaProyectoEducativoStand +"', '"+totalAsistentes +"', '"+aceptaAJesusPresencial +"', '"+aceptaAJesusOnline +"', '"+aceptaAJesusTweens +"', '"+nombrePredicador +"', '"+nombreMensaje +"', '"+observaciones +"')"

    const insertQuery = "INSERT INTO reporte_encuentros (pastores_campus, ministros_encargados, lideres_voluntariado, fecha, hora, modalidad, campus, asistencia_adultos, asistencia_kids, asistencia_tweens, asistencia_voluntarios_servicio, asistencia_voluntarios_tecnica, asistencia_voluntarios_kids, asistencia_voluntarios_tweens, asistencia_voluntarios_worship, asistencia_voluntarios_cocina, asistencia_voluntarios_redes_sociales, asistencia_voluntarios_seguridad, asistencia_voluntarios_sala_bebes, stand_info, stand_oracion, stand_recursos, stand_amor_por_la_casa, stand_proyecto_educativo, total_asistencia, acepta_a_jesus_presencial, acepta_a_jesus_online, acepta_a_jesus_tweens, nombre_predicador, nombre_mensaje, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


    // Pasar los valores a la consulta parametrizada
    const values = [pastoresCampus, ministrosEncargados, lideresVoluntarios, fecha, hora, modalidad, campus, asistenciaAdulto, asistenciaKids, asistenciaTweens, asistenciaServicioVoluntarios, asistenciaTecnicaVoluntarios, asistenciaKidsVoluntarios, asistenciaTweensVoluntarios, asistenciaWorshipVoluntarios, asistenciaCocinaVoluntarios, asistenciaRedesSocialesVoluntarios, asistenciaSeguridadVoluntarios, asistenciaSalaDeBebesVoluntarios, asistenciaInfoStand, asistenciaOracionStand, asistenciaRecursosStand, asistenciaAmorPorLaCasaStand, asistenciaProyectoEducativoStand, totalAsistentes, aceptaAJesusPresencial, aceptaAJesusOnline, aceptaAJesusTweens, nombrePredicador, nombreMensaje, observaciones];

    console.log(values);

    conexion.query(insertQuery, values, function(error){
        if(error){
            throw error;
        } else {
            console.log('Datos almacenados correctamente');
        }
    });

    setTimeout(() => {
        res.redirect("/")
    }, 5000);
});



app.listen(3000, function(){
    console.log("Servidor creado http://localhost:3000");
});
