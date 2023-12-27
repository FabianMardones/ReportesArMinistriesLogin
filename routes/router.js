const express = require('express');
const router = express.Router();
const connection = require('../database/db')
const authController = require('../controllers/controllers')


router.get('/vistasReportes', authController.isAuth, (req, res) => {
    connection.query('SELECT * FROM registro_encuentros ORDER BY fecha DESC', (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('vistasReportes', { results: results, user: req.user });
        }
    });
});
router.get('/', authController.isAuth, (req, res) => {
    connection.query('SELECT * FROM pastores_y_predicadores', (error, predicadores) => {
        if (error) {
            throw error;
        } else {
            connection.query('SELECT * FROM campus', (error, campus) => {
                if (error) {
                    throw error;
                } else {
                    connection.query('SELECT * FROM pastores_campus', (error, pastoresCampus) => {
                        if (error) {
                            throw error
                        } else {
                            connection.query('SELECT * FROM ministros_encargados', (error, ministrosEncargados) => {
                                if (error) {
                                    throw error
                                } else {                                   
                                    connection.query('SELECT * FROM lideres_voluntarios', (error, lideresVoluntarios) => {
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
});
router.get('/encuentro/:id', authController.isAuth, (req, res) => {
    const idEncuentro = req.params.id;

    connection.query('SELECT * FROM registro_encuentros WHERE id = ?', [idEncuentro], (error, results) => {
        if (error) {
            throw error;
        } else {
                res.render('datos-encuentro', { encuentro: results[0], user:req.user });
        }
    });
});
router.post('/vistasReportes', authController.isAuth, (req, res) => {
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
  
  
    connection.query(query, (error, results) => {
      if (error) {
        throw error;
      } else {
        // Pasar la variable noResults incluso si no hay resultados
        res.render('vistasReportes', { results: results, user: req.user });
      }
    });
});

  

router.get('/', authController.isAuth, (req, res) => {
    res.render('reportes', {user:req.user})
})
router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/datos-encuentro', authController.isAuth, (req, res) => {
    res.render('datos-encuentro')
})

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/registroEncuentro', authController.registroEncuentro)


module.exports = router;