const express = require('express');
const router = express.Router();
const authController = require('../controllers/controllers')
const conexion = require('../database/db')


router.get('/', authController.isAuth, authController.obtenerNombres)

router.get('/home', authController.isAuth, authController.home)


//Autenticacion, Login y Logout
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

router.get('/register', authController.registerPage)

/*****************CRUD ENCUENTROS*****************/
//listar
router.get('/vistasReportes', authController.isAuth, authController.resumenEncuentros)
router.post('/vistasReportes', authController.isAuth, authController.filtrarEncuentros)
router.get('/encuentro/:id', authController.isAuth, authController.obtenerEncuentro)

//guardar
router.post('/registroEncuentro', authController.isAuth, authController.registroEncuentro)

//editar
router.get('/editarEncuentro/:id', authController.isAuth, authController.editEncuentro)
router.post('/updateEncuentro', authController.isAuth, authController.updateEncuentro)



router.get('/counter', (req, res) => {
    conexion.query('SELECT SUM(total_acepta_a_jesus) AS total_acepta_a_jesus FROM registro_encuentros', (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            const totalAceptaAJesus = results[0].total_acepta_a_jesus || 0;
            res.render('test', { results: totalAceptaAJesus });
        }
    });
})

router.get('/contador',authController.isAuth, authController.contador)


router.get('/dashboard', authController.isAuth, authController.dashboardtab)

/**RUTAS CRUD PASTORES */
//listar
router.get('/pastores/listadoPC', authController.isAuth, authController.listarPastores)
router.get('/pastores/crearPC', authController.isAuth, authController.mostrarForm)

//guardar
router.post('/savePastores', authController.isAuth, authController.savePastores)

//editar
router.get('/editPastor/:id', authController.isAuth, authController.editPastores)
router.post('/updatePastores', authController.isAuth, authController.updatePastores)

//eliminar
router.get('/deletePastor/:id', authController.isAuth, authController.deletePastor)




/**CRUD RUTAS PASTORES_CAMPUS */
//Listar
router.get('/pastores_campus/agregarPC', authController.isAuth, authController.mostrarPastores)
router.get('/pastores_campus/listar', authController.isAuth, authController.mostrarPastoresCampus)

//Guardar
router.post('/savePastoresCampus', authController.isAuth, authController.savePastoresCampus)

//Editar
router.get('/editPastoresEncargados/:id', authController.isAuth, authController.editPastoresCampus)
router.post('/updatePastoresEncargados', authController.isAuth, authController.updatePastoresEncargados)

//Eliminar
router.get('/deletePastoresEncargados/:id', authController.isAuth, authController.deletePastorEncargado)


/**CRUD RUTAS CAMPUS */
//Listar
router.get('/campus/listadoCampus', authController.isAuth, authController.listarCampus)
router.get('/campus/nuevoCampus', authController.isAuth, authController.formCampus)

//Guardar
router.post('/saveCampus', authController.isAuth, authController.saveCampus)

//Editar
router.get('/editCampus/:id', authController.isAuth, authController.editCampus)
router.post('/updateCampus', authController.isAuth, authController.updateCampus)

//Eliminar
router.get('/deleteCampus/:id', authController.isAuth, authController.deleteCampus)




/**CRUD RUTAS MINISTROS */
//Listar
router.get('/ministros/listadoMinistros', authController.isAuth, authController.listarMinistros)
router.get('/ministros/nuevosMinistros', authController.isAuth, authController.nuevoMinistro)

//Guardar
router.post('/saveMinistros', authController.isAuth, authController.saveMinistros)

//Editar
router.get('/editMinistros/:id', authController.isAuth, authController.editMinistros)
router.post('/updateMinistros', authController.isAuth, authController.updateMinistros)

//Eliminar
router.get('/deleteMinistros/:id', authController.isAuth, authController.deleteMinistros)




/**CRUD RUTAS PREDICADORES */
//Listar
router.get('/predicadores/listarPredicadores', authController.isAuth, authController.listarPreddicadores)
//Pendientes: 1.-Crear 2.-Editar 3.-Eliminar 



/**CRUD RUTAS LIDERES VOLUNTARIOS */
//Listar
router.get('/lideres/listadoLideresVoluntarios', authController.isAuth, authController.listarLideres)
router.get('/lideres/nuevoLiderVoluntarios', authController.isAuth, authController.nuevoLider)

//Guardar
router.post('/saveLideresVoluntarios', authController.isAuth, authController.saveLideresVoluntarios)

//Editar
router.get('/editLiderVoluntarios/:id', authController.isAuth, authController.editLiderVoluntarios)
router.post('/updateLideresVoluntarios', authController.isAuth, authController.updateLideresVoluntarios)

//Eliminar
router.get('/deleteLiderVoluntarios/:id', authController.isAuth, authController.deleteLiderVoluntario)




/**CRUD RUTAS MODALIDADES */
//Listar
router.get('/modalidad/modalidad', authController.isAuth, authController.listarModalidad)
router.get('/modalidad/nuevaModalidad', authController.isAuth, authController.nuevaModalidad)

//Guardar
router.post('/saveModalidad', authController.isAuth, authController.saveModalidad)

//Editar
router.get('/editModalidad/:id', authController.isAuth, authController.editModalidad)
router.post('/updateModalidad', authController.isAuth, authController.updateModalidad)

//Eliminar
router.get('/deleteModalidad/:id', authController.isAuth, authController.deleteModalidad)





/**ReporteOracion */
router.get('/reporteOracion', authController.isAuth, authController.obtenerNombresOracion)
router.post('/saveEncuentroOracion', authController.isAuth, authController.saveEncuentroOracion)

router.get('/vistasOracion', authController.isAuth, authController.obtenerEncuentroOracion)
router.get('/encuentroOracion/:id', authController.isAuth, authController.obtenerReporteOracion)

//Editar
router.get('/editarEncuentroOracion/:id', authController.isAuth, authController.editReporteOracion)

//Actualizar
router.post('/updateEncuentroOracion', authController.isAuth, authController.updateEncuentroOracion)

//filtrar
router.post('/filtrarEO', authController.isAuth, authController.filtrarEncuentroOracion)

module.exports = router;
