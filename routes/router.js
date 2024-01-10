const express = require('express');
const router = express.Router();
const authController = require('../controllers/controllers')
const conexion = require('../database/db')


router.get('/vista', (req,res) => {
    conexion.query('SELECT SUM(total_acepta_a_jesus) AS total_acepta_a_jesus FROM registro_encuentros', (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            const totalAceptaAJesus = results[0].total_acepta_a_jesus || 0;
            res.render('contador', { results: totalAceptaAJesus });
        }
    });
})


router.get('/encuentro/:id', authController.isAuth, authController.obtenerEncuentro)
router.get('/', authController.isAuth, authController.obtenerNombres)
router.post('/register', authController.register)
router.get('/vistasReportes', authController.isAuth, authController.resumenEncuentros)
router.post('/vistasReportes', authController.isAuth, authController.filtrarEncuentros)
router.get('/logout', authController.logout)
router.post('/registroEncuentro', authController.isAuth, authController.registroEncuentro)
router.post('/login', authController.login)


module.exports = router;
