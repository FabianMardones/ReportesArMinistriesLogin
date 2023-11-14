const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util');
const { error } = require('console');


const usuariosAutorizados = ['fabianmardones94@gmail.com', 'reportes@armchile.com', 'reportes@armuruguay.com', 'reportes@armmiami.com', '20089565castillocarlos@gmail.com'];


exports.register = async (req, res) => {
    try {
        const user = req.body.user;
        const email = req.body.email;
        const pass = req.body.pass;

        // Verificar si el usuario está autorizado
        if (usuariosAutorizados.includes(email)) {
            // Realizar una consulta para verificar si el correo electrónico ya existe
            conexion.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
                if (error) {
                    console.log(error);
                } else if (results.length > 0) {
                    // El correo electrónico ya existe, mostrar un mensaje de error
                    res.render('register', {
                        alert: true,
                        alertTitle: "Registro fallido",
                        alertMessage: "El correo electrónico ya está registrado",
                        alertIcon: "error",
                        background: "#555555",
                        showConfirmButton: false,
                        timer: 2000,
                        ruta: "/register"
                    });
                } else {
                    // El correo electrónico no existe, puedes proceder con la inserción
                    let passwordHashed = await bcryptjs.hash(pass, 8);
                    conexion.query('INSERT INTO users SET ?', { user: user, email: email, pass: passwordHashed }, async (insertError, insertResults) => {
                        if (insertError) {
                            console.log(insertError);
                        } else {
                            res.render('register', {
                                alert: true,
                                alertTitle: "Registro exitoso",
                                alertMessage: `Gracias ${user} por registrarte`,
                                alertIcon: "success",
                                background: "#555555",
                                showConfirmButton: false,
                                timer: 2000,
                                ruta: "/login"
                            });
                        }
                    });
                }
            });
        } else {
            res.render('register', {
                alert: true,
                alertTitle: "Registro no autorizado",
                alertMessage: "No tienes permiso para registrarte.",
                alertIcon: "error",
                background: "#555555",
                showConfirmButton: false,
                timer: 2000,
                ruta: "noautorizado"
            });
        }
    } catch (error) {
        console.log(error);
    }
}


exports.login = async(req, res) => {
    try {
        const email = req.body.email
        const pass = req.body.pass

            if (!email || !pass) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Advertencia",
                    alertMessage: 'Usuario y/o password incorrectas',
                    alertIcon: 'info',
                    background: "#555555",
                    color: "#fff",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            }else{
                conexion.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
                    if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                        res.render('login', {
                            alert: true,
                            alertTitle: 'error',
                            alertMessage: 'Usuario y/o password incorrecta',
                            alertIcon: "error",
                            background: "#555555",
                            color: "#fff",
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'login'
                        });
                    }else{
                        const id = results[0].id
                        const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        })
                        console.log("Toke:" + token + "para el usuario: "+email);

                        const cookiesOptions = {
                            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true
                        }
                        res.cookie('jwt', token, cookiesOptions)
                        res.render('login', {
                            alert: true,
                            alertTitle: 'Hola! Que bueno verte!',
                            alertMessage: 'Login exitoso',
                            alertIcon: 'success',
                            background: "#555555",
                            color: "#fff",
                            showConfirmButton: false,
                            timer: 2000,
                            ruta: ""
                        })
                    }
                })
            }
    }catch (error) {
      console.log(error);  
    }
}


exports.isAuth = async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error);
            return next()
        }
    }else{
        res.redirect('/login')
    }
}


exports.logout = (req, res)=>{
    res.clearCookie('jwt')
    res.redirect('/login')
}


exports.validar = async(req, res) => {
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
    let totalAj = datos.totalAJ;
    let nombrePredicador = datos.nombrePredicador;
    let nombreMensaje = datos.nombreMensaje;
    let observaciones = datos.observaciones;


    const insertQuery = "INSERT INTO reporte_encuentros (pastores_campus, ministros_encargados, lideres_voluntariado, fecha, hora, modalidad, campus, asistencia_adultos, asistencia_kids, asistencia_tweens, asistencia_voluntarios_servicio, asistencia_voluntarios_tecnica, asistencia_voluntarios_kids, asistencia_voluntarios_tweens, asistencia_voluntarios_worship, asistencia_voluntarios_cocina, asistencia_voluntarios_redes_sociales, asistencia_voluntarios_seguridad, asistencia_voluntarios_sala_bebes, stand_info, stand_oracion, stand_recursos, stand_amor_por_la_casa, stand_proyecto_educativo, total_asistencia,acepta_a_jesus_presencial, acepta_a_jesus_online, acepta_a_jesus_tweens, total_acepta_a_jesus, nombre_predicador, nombre_mensaje, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


    // Pasar los valores a la consulta parametrizada
    const values = [pastoresCampus, ministrosEncargados, lideresVoluntarios, fecha, hora, modalidad, campus, asistenciaAdulto, asistenciaKids, asistenciaTweens, asistenciaServicioVoluntarios, asistenciaTecnicaVoluntarios, asistenciaKidsVoluntarios, asistenciaTweensVoluntarios, asistenciaWorshipVoluntarios, asistenciaCocinaVoluntarios, asistenciaRedesSocialesVoluntarios, asistenciaSeguridadVoluntarios, asistenciaSalaDeBebesVoluntarios, asistenciaInfoStand, asistenciaOracionStand, asistenciaRecursosStand, asistenciaAmorPorLaCasaStand, asistenciaProyectoEducativoStand, totalAsistentes, aceptaAJesusPresencial, aceptaAJesusOnline, aceptaAJesusTweens, totalAj, nombrePredicador, nombreMensaje, observaciones];

    console.log(values);

    conexion.query(insertQuery, values, function(error){
        if(error){
            throw error;
        } else {
            console.log('Datos almacenados correctamente');
        }
    });
};

const fs = require('fs');

exports.obtenerDatos = async (req, res) => {
  const campuses = ['Puente Alto', 'Santiago', 'Montevideo', 'West Perrine', 'Doral'];
  const query = 'SELECT campus, total_acepta_a_jesus, total_asistencia, fecha, hora FROM reporte_encuentros WHERE campus IN (?)';
  conexion.query(query, [campuses], (error, results) => {
    if (error) {
      throw error;
    } else {
      results.forEach((result) => {
        result.fecha = result.fecha.toLocaleDateString('es');
        result[result.campus] = result.total_acepta_a_jesus;
      });

      const dataToWrite = JSON.stringify(results, null, 2);
      fs.writeFileSync('database/encuentros.json', dataToWrite);

      res.render('dashboard', { results: results });
      setTimeout(() => {
        res.json(results);
      }, 2000);
    }
  });
};
