const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util');


exports.register = async (req, res) => {
    try {
        const user = req.body.user;
        const email = req.body.email;
        const pass = req.body.pass;

        // Realizar una consulta para obtener la lista de correos electrónicos autorizados
        conexion.query('SELECT email FROM emails_autorizados', async (autorizadosError, autorizadosResults) => {
            if (autorizadosError) {
                console.log(autorizadosError);
            } else {
                // Obtener un array de correos electrónicos autorizados
                const correosAutorizados = autorizadosResults.map((row) => row.email);

                // Verificar si el correo electrónico está autorizado
                if (correosAutorizados.includes(email)) {
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
                                background: "#F3EEE8",
                                color: "#000",
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
                                        background: "#F3EEE8",
                                        color: "#000",
                                        showConfirmButton: false,
                                        timer: 2000,
                                        ruta: "/register"
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
                        background: "#F3EEE8",
                        color: "#000",
                        showConfirmButton: false,
                        timer: 2000,
                        ruta: "noautorizado"
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}


exports.login = async(req, res) => {
    try {
        const email = req.body.email
        const pass = req.body.pass

            if (!email || !pass) {
                res.render('register', {
                    alert: true,
                    alertTitle: "Advertencia",
                    alertMessage: 'Usuario y/o password incorrectas',
                    alertIcon: 'info',
                    background: "#F3EEE8",
                    color: "#000",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'register'
                });
            }else{
                conexion.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
                    if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                        res.render('register', {
                            alert: true,
                            alertTitle: 'error',
                            alertMessage: 'Usuario y/o password incorrecta',
                            alertIcon: "error",
                            background: "#F3EEE8",
                            color: "#000",
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'register'
                        });
                    }else{
                        const id = results[0].id
                        const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        })
                        console.log("Token:" + token + "para el usuario: "+email);

                        const cookiesOptions = {
                            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000),
                            httpOnly: true
                        }
                        res.cookie('jwt', token, cookiesOptions)
                        res.render('register', {
                            alert: true,
                            alertTitle: 'Hola! Que bueno verte!',
                            alertMessage: 'Login exitoso',
                            alertIcon: 'success',
                            background: "#F3EEE8",
                            color: "#000",
                            showConfirmButton: false,
                            timer: 2000,
                            ruta: "/"
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
                if (!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error);
            return next()
        }
    }else{
        res.redirect('/register')
    }
}


exports.logout = (req, res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}


exports.registroEncuentro = async(req, res) => {
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


    const insertQuery = "INSERT INTO registro_encuentros (pastores_campus, ministros_encargados, lideres_voluntariado, fecha, hora, modalidad, campus, asistencia_adultos, asistencia_kids, asistencia_tweens, asistencia_voluntarios_servicio, asistencia_voluntarios_tecnica, asistencia_voluntarios_kids, asistencia_voluntarios_tweens, asistencia_voluntarios_worship, asistencia_voluntarios_cocina, asistencia_voluntarios_redes_sociales, asistencia_voluntarios_seguridad, asistencia_voluntarios_sala_bebes, stand_info, stand_oracion, stand_recursos, stand_amor_por_la_casa, stand_proyecto_educativo, total_asistencia,acepta_a_jesus_presencial, acepta_a_jesus_online, acepta_a_jesus_tweens, total_acepta_a_jesus, nombre_predicador, nombre_mensaje, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


    // Pasar los valores a la consulta parametrizada
    const values = [pastoresCampus, ministrosEncargados, lideresVoluntarios, fecha, hora, modalidad, campus, asistenciaAdulto, asistenciaKids, asistenciaTweens, asistenciaServicioVoluntarios, asistenciaTecnicaVoluntarios, asistenciaKidsVoluntarios, asistenciaTweensVoluntarios, asistenciaWorshipVoluntarios, asistenciaCocinaVoluntarios, asistenciaRedesSocialesVoluntarios, asistenciaSeguridadVoluntarios, asistenciaSalaDeBebesVoluntarios, asistenciaInfoStand, asistenciaOracionStand, asistenciaRecursosStand, asistenciaAmorPorLaCasaStand, asistenciaProyectoEducativoStand, totalAsistentes, aceptaAJesusPresencial, aceptaAJesusOnline, aceptaAJesusTweens, totalAj, nombrePredicador, nombreMensaje, observaciones];

    console.log(values);

    conexion.query(insertQuery, values, function(error){
        if(error){
            throw error;
        } else {
            console.log('Datos almacenados correctamente');
            res.redirect('/vistasReportes')
        }
    });
};



exports.obtenerNombres = (req, res) => {
    conexion.query('SELECT * FROM pastores_y_predicadores', (error, predicadores) => {
        if (error) {
            throw error;
        } else {
            conexion.query('SELECT * FROM campus', (error, campus) => {
                if (error) {
                    throw error;
                } else {
                    conexion.query('SELECT * FROM pastores_campus', (error, pastoresCampus) => {
                        if (error) {
                            throw error
                        } else {
                            conexion.query('SELECT * FROM ministros_encargados', (error, ministrosEncargados) => {
                                if (error) {
                                    throw error
                                } else {                                   
                                    conexion.query('SELECT * FROM lideres_voluntarios', (error, lideresVoluntarios) => {
                                        if (error) {
                                            throw error
                                        } else {
                                            res.render('reportes', { predicadores: predicadores, campus: campus, pastoresCampus: pastoresCampus, ministrosEncargados: ministrosEncargados, lideresVoluntarios: lideresVoluntarios, user:req.user});
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }
    });
}


exports.obtenerEncuentro = (req, res) => {
    const idEncuentro = req.params.id;

    conexion.query('SELECT * FROM registro_encuentros WHERE id = ?', [idEncuentro], (error, results) => {
        if (error) {
            throw error;
        } else {
                res.render('datos-encuentro', { encuentro: results[0], user:req.user });
        }
    });
}


exports.resumenEncuentros = (req, res) => {
    conexion.query('SELECT * FROM registro_encuentros ORDER BY fecha DESC', (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('vistasReportes', { results: results, user: req.user });
        }
    });
}


exports.filtrarEncuentros = (req, res) => {
    const filtroCampus = req.body.filtroCampus;
    const filtroFecha = req.body.filtroFecha;
  
    let query = 'SELECT * FROM registro_encuentros';
  
    // Agregar condiciones al WHERE según los filtros seleccionados
    if (filtroCampus || filtroFecha) {
      query += ' WHERE';
    }
  
    if (filtroCampus) {
      query += ` campus = '${filtroCampus}'`;
    }
  
    if (filtroCampus && filtroFecha) {
      query += ' AND';
    }
  
    if (filtroFecha) {
      query += ` fecha = '${filtroFecha}'`;
    }
  
  
    conexion.query(query, (error, results) => {
      if (error) {
        throw error;
      } else {
        // Pasar la variable noResults incluso si no hay resultados
        res.render('vistasReportes', { results: results, user: req.user });
      }
    });
}


