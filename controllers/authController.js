const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const connection = require('../database/db')
const {promisify} = require('util');
const { error } = require('console');


const usuariosAutorizados = ['fabianmardones94@gmail.com', 'flga.danielafredes@gmail.com'];


exports.register = async (req, res) => {
    try {
        const user = req.body.user;
        const email = req.body.email;
        const pass = req.body.pass;

        // Verificar si el usuario está autorizado
        if (usuariosAutorizados.includes(email)) {
            // Realizar una consulta para verificar si el correo electrónico ya existe
            connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
                if (error) {
                    console.log(error);
                } else if (results.length > 0) {
                    // El correo electrónico ya existe, mostrar un mensaje de error
                    res.render('register', {
                        alert: true,
                        alertTitle: "Registro fallido",
                        alertMessage: "El correo electrónico ya está registrado",
                        alertIcon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                        ruta: "/register"
                    });
                } else {
                    // El correo electrónico no existe, puedes proceder con la inserción
                    let passwordHashed = await bcryptjs.hash(pass, 8);
                    connection.query('INSERT INTO users SET ?', { user: user, email: email, pass: passwordHashed }, async (insertError, insertResults) => {
                        if (insertError) {
                            console.log(insertError);
                        } else {
                            res.render('register', {
                                alert: true,
                                alertTitle: "Registro exitoso",
                                alertMessage: `Gracias ${user} por registrarte`,
                                alertIcon: "success",
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
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            }else{
                connection.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
                    if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                        res.render('login', {
                            alert: true,
                            alertTitle: 'error',
                            alertMessage: 'Usuario y/o password incorrecta',
                            alertIcon: "error",
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
                            alertMessage: 'Loggin exitoso',
                            alertIcon: 'success',
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
            connection.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error);
            next()
        }
    }else{
        res.redirect('/login')
    }
} 


exports.logout = (req, res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}

