const express = require('express');
const router = express.Router();
const authController = require('../controllers/controllers')



router.get('/encuentro/:id', authController.isAuth, authController.obtenerEncuentro)
router.get('/', authController.isAuth, authController.obtenerNombres)
router.post('/register', authController.register)
router.get('/vistasReportes', authController.isAuth, authController.resumenEncuentros)
router.post('/vistasReportes', authController.isAuth, authController.filtrarEncuentros)
router.get('/logout', authController.logout)
router.post('/registroEncuentro', authController.registroEncuentro)
router.post('/login', authController.login)
router.get('/contador', authController.isAuth, authController.totalAceptaAJesus)


module.exports = router;
