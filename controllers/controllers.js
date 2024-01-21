const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util');
const { error } = require('console');
const e = require('express');



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
                            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 60000),
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



exports.obtenerNombres = (req, res) => {
    const query = `
        SELECT 
            pc.*, 
            p_pastor.nombre_pastor AS nombrePastor, 
            p_pastor.apellido_pastor AS apellidoPastor,
            p_pastora.nombre_pastor AS nombrePastora, 
            p_pastora.apellido_pastor AS apellidoPastora
        FROM pastores_campus pc
        LEFT JOIN pastores p_pastor ON pc.id_pastor = p_pastor.id_pastores
        LEFT JOIN pastores p_pastora ON pc.id_pastora = p_pastora.id_pastores
    `;
    conexion.query('SELECT * FROM pastores', (error, predicadores) => {
        if (error) {
            throw error;
        } else {
            conexion.query('SELECT * FROM campus', (error, campus) => {
                if (error) {
                    throw error;
                } else {
                    conexion.query(query, (error, pastoresCampus) => {
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
                                            conexion.query('SELECT * FROM modalidad', (error, modalidad) => {
                                                if (error) {
                                                    throw error
                                                }else{
                                                    res.render('reportes', { predicadores: predicadores, campus: campus, pastoresCampus: pastoresCampus, ministrosEncargados: ministrosEncargados, lideresVoluntarios: lideresVoluntarios, modalidad:modalidad, user:req.user});
                                                }
                                            })
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


exports.testPage = (req, res) => {
    conexion.query('SELECT SUM(total_acepta_a_jesus) AS total_acepta_a_jesus FROM registro_encuentros', (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            const totalAceptaAJesus = results[0].total_acepta_a_jesus + 7000 || 0;
            res.json({ results: totalAceptaAJesus, user: req.user });
        }
    });
}

exports.dashboardtab = (req, res) => {
    conexion.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('dashboard', {user:req.user})
        }
    })
}



/******************CRU REPORTE ENCUENTROS*********************/
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
    let asistenciaSalaBebes = datos.salaBebe;
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
    let asistenciaYoutube = datos.asistenciaYoutube;
    let totalAsistentesOnline = datos.totalAsistentesOnline;
    let aceptaAJesusPresencial = datos.aceptaPresencial;
    let aceptaAJesusOnline = datos.aceptaOnline;
    let totalAj = datos.totalAJ;
    let nombrePredicador = datos.nombrePredicador;
    let nombreMensaje = datos.nombreMensaje;
    let observaciones = datos.observaciones;


    const insertQuery = "INSERT INTO registro_encuentros (pastores_campus, ministros_encargados, lideres_voluntariado, fecha, hora, modalidad, campus, asistencia_adultos, asistencia_kids, asistencia_tweens, asistencia_voluntarios_servicio, asistencia_voluntarios_tecnica, asistencia_voluntarios_kids, asistencia_voluntarios_tweens, 	asistencia_sala_bebes, asistencia_voluntarios_worship, asistencia_voluntarios_cocina, asistencia_voluntarios_redes_sociales, asistencia_voluntarios_seguridad, asistencia_voluntarios_sala_bebes, stand_info, stand_oracion, stand_recursos, stand_amor_por_la_casa, stand_proyecto_educativo, total_asistencia, asistencia_youtube, total_asistentes_online, acepta_a_jesus_presencial, acepta_a_jesus_online, total_acepta_a_jesus, nombre_predicador, nombre_mensaje, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


    // Pasar los valores a la consulta parametrizada
    const values = [pastoresCampus, ministrosEncargados, lideresVoluntarios, fecha, hora, modalidad, campus, asistenciaAdulto, asistenciaKids, asistenciaTweens, asistenciaSalaBebes, asistenciaServicioVoluntarios, asistenciaTecnicaVoluntarios, asistenciaKidsVoluntarios, asistenciaTweensVoluntarios, asistenciaWorshipVoluntarios, asistenciaCocinaVoluntarios, asistenciaRedesSocialesVoluntarios, asistenciaSeguridadVoluntarios, asistenciaSalaDeBebesVoluntarios, asistenciaInfoStand, asistenciaOracionStand, asistenciaRecursosStand, asistenciaAmorPorLaCasaStand, asistenciaProyectoEducativoStand, totalAsistentes, asistenciaYoutube, totalAsistentesOnline, aceptaAJesusPresencial, aceptaAJesusOnline, totalAj, nombrePredicador, nombreMensaje, observaciones];

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

exports.obtenerEncuentro = (req, res) => {
    const idEncuentro = req.params.id;

    conexion.query('SELECT * FROM registro_encuentros WHERE id = ?', [idEncuentro], (error, results) => {
        if (error) {
            throw error;
        } else {
                res.render('accionesReportes/datos-encuentro', { encuentro: results[0], user:req.user });
        }
    });
}

exports.resumenEncuentros = (req, res) => {
    conexion.query('SELECT * FROM registro_encuentros ORDER BY fecha DESC', (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('accionesReportes/vistasReportes', { results: results, user: req.user });
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

exports.editEncuentro = (req, res) => {
    const id = req.params.id
    const query = `
        SELECT 
            pc.*, 
            p_pastor.nombre_pastor AS nombrePastor, 
            p_pastor.apellido_pastor AS apellidoPastor,
            p_pastora.nombre_pastor AS nombrePastora, 
            p_pastora.apellido_pastor AS apellidoPastora
        FROM pastores_campus pc
        LEFT JOIN pastores p_pastor ON pc.id_pastor = p_pastor.id_pastores
        LEFT JOIN pastores p_pastora ON pc.id_pastora = p_pastora.id_pastores
    `;
    conexion.query('SELECT * FROM registro_encuentros WHERE id = ?', [id], (error, results) => {
        if (error) {
            throw error
        }else{
            conexion.query('SELECT * FROM pastores', (error, predicadores) => {
                if (error) {
                    throw error;
                } else {
                    conexion.query('SELECT * FROM campus', (error, campus) => {
                        if (error) {
                            throw error;
                        } else {
                            conexion.query(query, (error, pastoresCampus) => {
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
                                                    conexion.query('SELECT * FROM modalidad', (error, modalidad) => {
                                                        if (error) {
                                                            throw error
                                                        }else{
                                                            res.render('accionesReportes/editarReporteEncuentro', {results:results[0], predicadores: predicadores, campus: campus, pastoresCampus: pastoresCampus, ministrosEncargados: ministrosEncargados, lideresVoluntarios: lideresVoluntarios, modalidad:modalidad, user:req.user});
                                                        }
                                                    })
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
    })
}

exports.updateEncuentro = (req, res) => {
    const id = req.body.id;
    const nombrePredicador = req.body.nombrePredicador;
    const nombreMensaje = req.body.nombreMensaje;
    const modalidad = req.body.modalidad;
    const campus = req.body.campus;
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const pastoresCampus = req.body.pastoresCampus;
    const ministrosEncargados = req.body.ministrosEncargados;
    const lideresVoluntarios = req.body.lideresVoluntarios;
    const adultos = req.body.adultos;
    const kids = req.body.kids;
    const tweens = req.body.tweens;
    const salaBebe = req.body.salaBebe;
    const servicioVoluntarios = req.body.servicioVoluntarios;
    const tecnicaVoluntarios = req.body.tecnicaVoluntarios;
    const kidsVoluntarios = req.body.kidsVoluntarios;
    const tweensVoluntarios = req.body.tweensVoluntarios;
    const worshipVoluntarios = req.body.worshipVoluntarios;
    const cocinaVoluntarios = req.body.cocinaVoluntarios;
    const redesSocialesVoluntarios = req.body.redesSocialesVoluntarios;
    const seguridadVoluntarios = req.body.seguridadVoluntarios;
    const salaBebesVoluntarios = req.body.salaBebesVoluntarios;
    const infoVoluntarios = req.body.infoVoluntarios;
    const oracionVoluntarios = req.body.oracionVoluntarios;
    const recursosVoluntarios = req.body.recursosVoluntarios;
    const amorPorLaCasaVoluntarios = req.body.amorPorLaCasaVoluntarios;
    const proyectoEducativoVoluntarios = req.body.proyectoEducativoVoluntarios;
    const totalAsistentes = req.body.totalAsistentes;
    const asistenciaYoutube = req.body.asistenciaYoutube;
    const totalAsistentesOnline = req.body.totalAsistentesOnline;
    const aceptaPresencial = req.body.aceptaPresencial;
    const aceptaOnline = req.body.aceptaOnline;
    const totalAJ = req.body.totalAJ;
    const observaciones = req.body.observaciones;

    conexion.query('UPDATE registro_encuentros SET ? WHERE id = ?', [{nombre_predicador:nombrePredicador, nombre_mensaje:nombreMensaje, modalidad:modalidad, campus:campus, fecha:fecha, hora:hora, pastores_Campus:pastoresCampus, ministros_encargados:ministrosEncargados, lideres_voluntariado:lideresVoluntarios, asistencia_adultos:adultos, asistencia_kids:kids, asistencia_tweens:tweens, asistencia_sala_bebes:salaBebe, asistencia_voluntarios_servicio:servicioVoluntarios, asistencia_voluntarios_tecnica:tecnicaVoluntarios, asistencia_voluntarios_kids:kidsVoluntarios, asistencia_voluntarios_tweens: tweensVoluntarios, asistencia_voluntarios_worship:worshipVoluntarios, asistencia_voluntarios_cocina:cocinaVoluntarios, asistencia_voluntarios_redes_sociales:redesSocialesVoluntarios, asistencia_voluntarios_seguridad:seguridadVoluntarios, asistencia_voluntarios_sala_bebes:salaBebesVoluntarios, stand_info:infoVoluntarios, stand_oracion:oracionVoluntarios, stand_recursos:recursosVoluntarios, stand_amor_por_la_casa:amorPorLaCasaVoluntarios, stand_proyecto_educativo:proyectoEducativoVoluntarios, total_asistencia:totalAsistentes, asistencia_youtube:asistenciaYoutube, total_asistentes_online: totalAsistentesOnline, acepta_a_jesus_presencial:aceptaPresencial, acepta_a_jesus_online:aceptaOnline, total_acepta_a_jesus:totalAJ, observaciones:observaciones}, id], (error, results) => {
        if (error) {
            throw error
        }else{
            res.redirect('/vistasReportes')
        }
    })


}


    





/*************CRUD PASTORES**************/
exports.listarPastores = (req, res) => {
    conexion.query('SELECT * FROM pastores', (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('pastores/listarPastores', {results:results})
        }
    })
}

exports.mostrarForm = (req, res) => {
    res.render('pastores/crearPastores')
}

exports.savePastores = (req, res) => {
    const rol = req.body.rol;
    const nombre_pastor = req.body.nombre_pastor;
    const apellido_pastor = req.body.apellido_pastor;
    const estado_civil = req.body.estado_civil;
    const genero = req.body.genero;

    console.log(`${rol} - ${nombre_pastor} - ${apellido_pastor} - ${estado_civil} - ${genero}`);

    conexion.query('INSERT INTO pastores SET ?',{rol:rol, nombre_pastor:nombre_pastor, apellido_pastor:apellido_pastor, estado_civil:estado_civil, genero:genero}, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/pastores/listadoPC')
        }
    })
}

exports.editPastores = (req, res) => {
    const idPastor = req.params.id
    conexion.query('SELECT * FROM pastores WHERE id_pastores = ?',[idPastor], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('pastores/editarPastores', {user:results[0]})
        }
    })
}

exports.updatePastores = (req, res) => {
    const id = req.body.id;
    const rol = req.body.rol;
    const nombre_pastor = req.body.nombre_pastor;
    const apellido_pastor = req.body.apellido_pastor;
    const estado_civil = req.body.estado_civil;
    const genero = req.body.genero;
    conexion.query('UPDATE pastores SET ? WHERE id_pastores = ?', [{ rol:rol, nombre_pastor:nombre_pastor, apellido_pastor:apellido_pastor, estado_civil:estado_civil, genero:genero}, id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/pastores/listadoPC')
        }
    })
}

exports.deletePastor = (req, res) => {
    const id = req.params.id
    conexion.query('DELETE FROM pastores WHERE id_pastores = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/pastores/listadoPC')
        }
    })
}






/*************CRUD PASTORES CAMPUS**************/
exports.mostrarPastores = (req, res) => {
    conexion.query('SELECT * FROM pastores WHERE (rol = "Pastor ministro" OR rol = "Pastor de campus") AND estado_civil = "casado" AND genero = "Masculino"', (error, pastoresCasados) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            conexion.query('SELECT * FROM pastores WHERE (rol = "Pastor ministro" OR rol = "Pastor de campus") AND estado_civil = "casada" AND genero = "Femenino"', (error, pastorasCasadas) => {
                if (error) {
                    console.log(error);
                    throw error
                }else{
                        res.render('pastores_campus/crearPastoresCampus', {pastoresCasados: pastoresCasados, pastorasCasadas:pastorasCasadas});
                }
            })
        }
    });
};

exports.mostrarPastoresCampus = (req, res) => {
    const query = `
        SELECT 
            pc.*, 
            p_pastor.nombre_pastor AS nombrePastor, 
            p_pastor.apellido_pastor AS apellidoPastor,
            p_pastora.nombre_pastor AS nombrePastora, 
            p_pastora.apellido_pastor AS apellidoPastora
        FROM pastores_campus pc
        LEFT JOIN pastores p_pastor ON pc.id_pastor = p_pastor.id_pastores
        LEFT JOIN pastores p_pastora ON pc.id_pastora = p_pastora.id_pastores
    `;

    conexion.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            res.render('pastores_campus/listarPastoresCampus', {results:results});
        }
    });
};

// exports.savePastoresCampus = (req, res) => {
//     const idPastor = req.body.idPastor;
//     const idPastora = req.body.idPastora;

//     console.log(`id pastor: ${idPastor} - is pastora: ${idPastora}`);

//     conexion.query('INSERT INTO pastores_campus (id_pastor, id_pastora) VALUES (?, ?)', [idPastor, idPastora], (error, results) => {
//         if (error) {
//             console.log(error);
//             throw error
//         }else{
//             res.redirect('/pastores_campus/listar')
//         }
//     })
// }

exports.savePastoresCampus = (req, res) => {
    const idPastor = req.body.idPastor;
    const idPastora = req.body.idPastora;

    console.log(`id pastor: ${idPastor} - is pastora: ${idPastora}`);

    // Verificar si ya existe un registro con las mismas claves primarias
    const checkDuplicateQuery = 'SELECT COUNT(*) as count FROM pastores_campus WHERE id_pastor = ? AND id_pastora = ?';
    
    conexion.query(checkDuplicateQuery, [idPastor, idPastora], (checkError, checkResults) => {
        if (checkError) {
            console.log(checkError);
            throw checkError;
        }

        const duplicateCount = checkResults[0].count;

        if (duplicateCount > 0) {
            // Mostrar mensaje de error usando Sweet Alert
            res.send('<script>alert("Error: Registro duplicado"); window.location="/pastores_campus/agregarPC";</script>');
        } else {
            // Si no hay duplicados, realizar la inserción
            const insertQuery = 'INSERT INTO pastores_campus (id_pastor, id_pastora) VALUES (?, ?)';
            conexion.query(insertQuery, [idPastor, idPastora], (insertError, results) => {
                if (insertError) {
                    console.log(insertError);
                    throw insertError;
                } else {
                    res.redirect('/pastores_campus/listar');
                }
            });
        }
    });
}

exports.editPastoresCampus = (req, res) => {
    const idPastorCampus = req.params.id;

    // Consulta para obtener la información del pastor y la pastora asociada al registro
    const queryEdit = `
        SELECT 
            pc.*, 
            p_pastor.id_pastores AS id_pastor,
            p_pastor.nombre_pastor AS nombrePastor, 
            p_pastor.apellido_pastor AS apellidoPastor,
            p_pastora.id_pastores AS id_pastora,
            p_pastora.nombre_pastor AS nombrePastora, 
            p_pastora.apellido_pastor AS apellidoPastora
        FROM pastores_campus pc
        LEFT JOIN pastores p_pastor ON pc.id_pastor = p_pastor.id_pastores
        LEFT JOIN pastores p_pastora ON pc.id_pastora = p_pastora.id_pastores
        WHERE pc.id_pastores_campus = ?`;

    // Consulta para obtener todos los registros de pastores_campus diferentes al que estás editando
    const queryAllPastoresCampus = `
        SELECT 
        pc.*, 
        p_pastor.id_pastores AS id_pastor,
        p_pastor.nombre_pastor AS nombrePastor, 
        p_pastor.apellido_pastor AS apellidoPastor,
        p_pastora.id_pastores AS id_pastora,
        p_pastora.nombre_pastor AS nombrePastora, 
        p_pastora.apellido_pastor AS apellidoPastora
    FROM pastores_campus pc
    LEFT JOIN pastores p_pastor ON pc.id_pastor = p_pastor.id_pastores
    LEFT JOIN pastores p_pastora ON pc.id_pastora = p_pastora.id_pastores`;

    // Ejecutar ambas consultas en paralelo
    conexion.query(queryEdit, [idPastorCampus], (errorEdit, resultsEdit) => {
        if (errorEdit) {
            console.log(errorEdit);
            throw errorEdit;
        } else {
            // Ejecutar la segunda consulta después de obtener el ID del pastor asociado
            conexion.query(queryAllPastoresCampus, [idPastorCampus], (errorAllPastoresCampus, resultsAllPastoresCampus) => {
                if (errorAllPastoresCampus) {
                    console.log(errorAllPastoresCampus);
                    throw errorAllPastoresCampus;
                } else {
                    // Renderizar la vista con los resultados de ambas consultas
                    res.render('pastores_campus/editarPastoresCampus', {
                        user: resultsEdit[0],
                        allPastoresCampus: resultsAllPastoresCampus
                    });
                }
            });
        }
    });
};

exports.updatePastoresEncargados = (req, res) => {
    const id = req.body.id;
    const id_pastor = req.body.idPastor;
    const id_pastora = req.body.idPastora;

    conexion.query('UPDATE pastores_campus SET ? WHERE id_pastores_campus = ?', [{id_pastor: id_pastor, id_pastora: id_pastora}, id], (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            res.redirect('/pastores_campus/listar');
        }
    });
}

exports.deletePastorEncargado = (req, res) => {
    const id = req.params.id
    conexion.query('DELETE FROM pastores_campus WHERE id_pastores_campus = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/pastores_campus/listar')
        }
    })
}




/*************CRUD CAMPUS**************/
exports.listarCampus = (req, res) => {
    conexion.query('SELECT * FROM campus', (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('campus/listarCampus', {results:results})
        }
    })
}

exports.formCampus = (req, res) => {
    res.render('campus/nuevoCampus')
}

exports.saveCampus = (req, res) => {
    const nombre_campus = req.body.nombre_campus;
    const ciudad_campus = req.body.ciudad_campus;
    const pais_campus = req.body.pais_campus;

    console.log(`${nombre_campus} - ${ciudad_campus} - ${pais_campus}`);

    conexion.query('INSERT INTO campus SET ?', {nombre_campus:nombre_campus, ciudad_campus:ciudad_campus, pais_campus:pais_campus},  (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/campus/listadoCampus')
        }
    })
}

exports.editCampus = (req, res) => {
    const id = req.params.id; // Cambié de req.body.id a req.params.id
    conexion.query('SELECT * FROM campus WHERE id_campus = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            res.render('campus/editarCampus', { campus: results[0] });
        }
    });
};

exports.updateCampus = (req, res) => {
    const id = req.body.id;
    const nombre_campus = req.body.nombre_campus;
    const ciudad_campus = req.body.ciudad_campus;
    const pais_campus = req.body.pais_campus;
    conexion.query('UPDATE campus SET ? WHERE id_campus = ?', [{nombre_campus:nombre_campus, ciudad_campus:ciudad_campus, pais_campus:pais_campus}, id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/campus/listadoCampus')
        }
    })
}

exports.deleteCampus = (req, res) => {
    const id = req.params.id
    conexion.query('DELETE FROM campus WHERE id_campus = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/campus/listadoCampus')
        }
    })
}



/***********CRUD MINISTROS**************/
exports.listarMinistros = (req, res) => {
    conexion.query('SELECT * FROM ministros_encargados', (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('ministros/listadoMinistros', {results:results})
        }
    })
}
exports.nuevoMinistro = (req, res) => {
    res.render('ministros/nuevoMinistro')
}

exports.saveMinistros = (req, res) => {
    const nombre_ministro = req.body.nombre_ministro;
    const nombre_ministra = req.body.nombre_ministra;

    console.log(`${nombre_ministro} - ${nombre_ministra}`);

    conexion.query('INSERT INTO ministros_encargados SET ?', {nombre_ministro:nombre_ministro, nombre_ministra:nombre_ministra}, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/ministros/listadoMinistros')
        }
    })
}

exports.editMinistros = (req, res) => {
    const id = req.params.id
    conexion.query('SELECT * FROM ministros_encargados WHERE id_ministros_encargados = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('ministros/editarMinistros', { ministros:results[0] })
        }
    })
}

exports.updateLideresVoluntarios = (req, res) => {
    const id = req.body.id;
    const nombre_lider_1 = req.body.nombre_lider_1;
    const nombre_lider_2 = req.body.nombre_lider_2;
    conexion.query('UPDATE lideres_voluntarios SET ? WHERE id_lideres_voluntarios = ?', [{nombre_lider_1:nombre_lider_1, nombre_lider_2:nombre_lider_2}, id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/lideres/listadoLideresVoluntarios')
        }
    })
}

exports.updateMinistros = (req, res) => {
    const id = req.body.id;
    const nombre_ministro = req.body.nombre_ministro;
    const nombre_ministra = req.body.nombre_ministra;
    conexion.query('UPDATE ministros_encargados SET ? WHERE id_ministros_encargados = ?', [{nombre_ministro:nombre_ministro, nombre_ministra:nombre_ministra}, id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/ministros/listadoMinistros')
        }
    })
}

exports.deleteMinistros = (req, res) => {
    const id = req.params.id
    conexion.query('DELETE FROM ministros_encargados WHERE id_ministros_encargados = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/ministros/listadoMinistros')
        }
    })
}



/***************CRUD PREDICADORES************/
exports.listarPreddicadores = (req, res) => {
    conexion.query('SELECT * FROM pastores', (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('predicadores/listarPredicadores', {results:results})
        }
    })
}
//Pendientes: 1.-Crear 2.-Editar 3.-Eliminar 


/***************CRUD LIDERES VOLUNTARIOS************/
exports.listarLideres = (req, res) => {
    conexion.query('SELECT * FROM lideres_voluntarios', (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('lideres/listarLideresVoluntarios', {results:results})
        }
    })
}

exports.nuevoLider = (req, res) => {
    res.render('lideres/nuevoLiderVoluntarios')
}

exports.saveLideresVoluntarios = (req, res) => {
    const nombre_lider_1 = req.body.nombre_lider_1;
    const nombre_lider_2 = req.body.nombre_lider_2;
    conexion.query('INSERT INTO lideres_voluntarios SET ?', {nombre_lider_1:nombre_lider_1, nombre_lider_2:nombre_lider_2}, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/lideres/listadoLideresVoluntarios')
        }
    })
}

exports.editLiderVoluntarios = (req, res) => {
    const id = req.params.id
    conexion.query('SELECT * FROM lideres_voluntarios WHERE id_lideres_voluntarios = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('lideres/editarLideresVoluntarios', {lideres:results[0]})
        }
    })
}

exports.deleteLiderVoluntario = (req, res) => {
    const id = req.params.id
    conexion.query('DELETE FROM lideres_Voluntarios WHERE id_lideres_voluntarios = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/lideres/listadoLideresVoluntarios')
        }
    })
}


/***************CRUD MODALIDAD************/
exports.listarModalidad = (req, res) => {
    conexion.query('SELECT * FROM modalidad', (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.render('modalidad/listarModalidad', {results:results})
        }
    })
}

exports.nuevaModalidad = (req, res) => {
    res.render('modalidad/nuevaModalidad')
}

exports.saveModalidad = (req, res) => {
    const modalidad = req.body.modalidad;

    console.log(`Nueva modalidad: ${modalidad}`);

    conexion.query('INSERT INTO modalidad SET ?', {modalidad:modalidad}, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/modalidad/modalidad')
        }
    })
}

exports.editModalidad = (req, res) => {
    const id = req.params.id;
    conexion.query('SELECT * FROM modalidad WHERE id_modalidad = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            console.log(results); // Agrega esta línea para imprimir los resultados
            res.render('modalidad/editarModalidad', { results: results[0] });
        }
    });
};

exports.updateModalidad = (req, res) => {
    const id = req.body.id;
    const modalidad = req.body.modalidad;
    conexion.query('UPDATE modalidad SET ? WHERE id_modalidad = ?', [{modalidad:modalidad}, id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/modalidad/modalidad')
        }
    })
}

exports.deleteModalidad = (req, res) => {
    const id = req.params.id;
    conexion.query('DELETE FROM modalidad WHERE id_modalidad = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/modalidad/modalidad')
        }
    })
}




/***************CRUD REPORTE ORACION***************/
exports.obtenerNombresOracion = (req, res) => {
    conexion.query('SELECT * FROM modalidad', (error, modalidad) => {
        if (error) {
            throw error
        }else{
            conexion.query('SELECT * FROM campus', (error, campus) => {
                if (error){
                    throw error
                }else{
                    conexion.query('SELECT * FROM lideres_voluntarios', (error, lideresVoluntarios) => {
                        if (error) {
                            throw error
                        }else{
                            conexion.query('SELECT * FROM ministros_encargados', (error, ministrosEncargados) => {
                                if (error) {
                                    throw error
                                }else{
                                    res.render('reporteOracion', {modalidad:modalidad, campus:campus, lideresVoluntarios:lideresVoluntarios, ministrosEncargados:ministrosEncargados, user:req.user})
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.obtenerEncuentroOracion = (req, res) => {
    conexion.query('SELECT * FROM registro_oracion ORDER BY fecha DESC', (error, results) => {
        if (error){
            throw error
        }else{
            res.render('accionesReportesOracion/vistasOracion', {results:results, user:req.user})
        }
    })
}

exports.obtenerReporteOracion = (req, res) => {
    const id = req.params.id
    conexion.query('SELECT * FROM registro_oracion WHERE id = ?', [id], (error, results) => {
        if (error) {
            throw error
        }else{
            res.render('accionesReportesOracion/datos-oracion', {encuentro:results[0], user:req.user})
        }
    })
}

exports.saveEncuentroOracion = (req, res) => {
    const modalidad = req.body.modalidad;
    const campus = req.body.campus;
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const ministrosEncargados = req.body.ministrosEncargados;
    const lideresVoluntarios = req.body.lideresVoluntarios;
    const adultos = req.body.adultos;
    const servicioVoluntarios = req.body.servicioVoluntarios;
    const tecnicaVoluntarios = req.body.tecnicaVoluntarios;
    const worshipVoluntarios = req.body.worshipVoluntarios;
    const cocinaVoluntarios = req.body.cocinaVoluntarios;
    const redesSocialesVoluntarios = req.body.redesSocialesVoluntarios;
    const seguridadVoluntarios = req.body.seguridadVoluntarios;
    const totalAsistentes = req.body.totalAsistentes;
    const asistenciaOnline = req.body.asistenciaOnline;
    const totalAsistentesOnline = req.body.totalAsistentesOnline;

    conexion.query('INSERT INTO registro_oracion SET ?', {modalidad:modalidad, campus:campus, fecha:fecha, hora:hora, ministros_encargados:ministrosEncargados, lideres_voluntarios:lideresVoluntarios, adultos:adultos, servicio_voluntarios:servicioVoluntarios, tecnica_voluntarios:tecnicaVoluntarios, worship_voluntarios:worshipVoluntarios, cocina_voluntarios:cocinaVoluntarios, redes_sociales_Voluntarios:redesSocialesVoluntarios, seguridad_voluntarios:seguridadVoluntarios, total_asistentes:totalAsistentes, asistencia_online:asistenciaOnline, total_asistentes_online:totalAsistentesOnline}, (error, results) =>{
        if (error) {
            console.log(error);
            throw error
        }else{
            res.redirect('/vistasOracion')
        }
    })
}

exports.editReporteOracion = (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT 
            pc.*, 
            p_pastor.nombre_pastor AS nombrePastor, 
            p_pastor.apellido_pastor AS apellidoPastor,
            p_pastora.nombre_pastor AS nombrePastora, 
            p_pastora.apellido_pastor AS apellidoPastora
        FROM pastores_campus pc
        LEFT JOIN pastores p_pastor ON pc.id_pastor = p_pastor.id_pastores
        LEFT JOIN pastores p_pastora ON pc.id_pastora = p_pastora.id_pastores
    `;
    conexion.query('SELECT * FROM registro_oracion WHERE id = ?', [id], (error, results) => {
        if (error) {
            throw error
        }else{
            conexion.query('SELECT * FROM pastores', (error, predicadores) => {
                if (error) {
                    throw error;
                } else {
                    conexion.query('SELECT * FROM campus', (error, campus) => {
                        if (error) {
                            throw error;
                        } else {
                            conexion.query(query, (error, pastoresCampus) => {
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
                                                    conexion.query('SELECT * FROM modalidad', (error, modalidad) => {
                                                        if (error) {
                                                            throw error
                                                        }else{
                                                            res.render('accionesReportesOracion/editarReporteOracion', {results:results[0], predicadores: predicadores, campus: campus, pastoresCampus: pastoresCampus, ministrosEncargados: ministrosEncargados, lideresVoluntarios: lideresVoluntarios, modalidad:modalidad, user:req.user});
                                                        }
                                                    })
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
    })
}

exports.updateEncuentroOracion = (req, res) => {
    const id = req.body.id
    const modalidad = req.body.modalidad;
    const campus = req.body.campus;
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const ministrosEncargados = req.body.ministrosEncargados;
    const lideresVoluntarios = req.body.lideresVoluntarios;
    const adultos = req.body.adultos;
    const servicioVoluntarios = req.body.servicioVoluntarios;
    const tecnicaVoluntarios = req.body.tecnicaVoluntarios;
    const worshipVoluntarios = req.body.worshipVoluntarios;
    const cocinaVoluntarios = req.body.cocinaVoluntarios;
    const redesSocialesVoluntarios = req.body.redesSocialesVoluntarios;
    const seguridadVoluntarios = req.body.seguridadVoluntarios;
    const totalAsistentes = req.body.totalAsistentes;
    const asistenciaOnline = req.body.asistenciaOnline;
    const totalAsistentesOnline = req.body.totalAsistentesOnline;

    conexion.query('UPDATE registro_oracion SET ? WHERE id = ?', [{modalidad:modalidad, campus:campus, fecha:fecha, hora:hora, ministros_encargados:ministrosEncargados, lideres_voluntarios:lideresVoluntarios, adultos:adultos, servicio_voluntarios:servicioVoluntarios, tecnica_voluntarios:tecnicaVoluntarios, worship_voluntarios:worshipVoluntarios, cocina_voluntarios:cocinaVoluntarios, redes_sociales_Voluntarios:redesSocialesVoluntarios, seguridad_voluntarios:seguridadVoluntarios, total_asistentes:totalAsistentes, asistencia_online:asistenciaOnline, total_asistentes_online:totalAsistentesOnline}, id], (error, results) => {
        if (error) {
            throw error
        }else{
            res.redirect('/vistasOracion')
        }
    })
}

exports.filtrarEncuentroOracion = (req, res) => {
    const filtroCampus = req.body.filtroCampus;
    const filtroFecha = req.body.filtroFecha;
  
    let query = 'SELECT * FROM registro_oracion';
  
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
        res.render('accionesReportesOracion/vistasOracion', { results: results, user: req.user });
      }
    });
}
