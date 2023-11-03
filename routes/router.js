const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')



router.get('/', authController.isAuth, (req, res) => {
    res.render('reportes', {user:req.user})
})

router.get('/login', (req, res) => {
    res.render('login', {alert:false})
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/dashboard', [authController.isAuth, authController.obtenerDatos],(req, res) => {
    res.render('dashboard')
})

router.get('/obtenerDatos', [authController.isAuth, authController.obtenerDatos],(req, res) => {
    res.render('dashboard')
})


router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/validar', authController.validar)
router.get('/obtenerDatos', authController.obtenerDatos)


module.exports = router
