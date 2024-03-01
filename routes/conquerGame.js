const router = require('express').Router();
const {crearPartida} = require('../controllers/conquerGameController')
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarSesionUsuario } = require('../middlewares/validar-usuario');
router.use(validarJWT)
router.use(validarSesionUsuario)

router.post('/crearPartida',crearPartida);
// router.patch('/buscarPartida',ConquerGameController.buscarPartida);
// router.get('/buscarEstatusPartida/:numeroPartida',ConquerGameController.buscarEstatusPartida);
// router.patch('/mostrarTablero',ConquerGameController.mostrarTablero);
// router.patch('/agregarPiezasTablero',ConquerGameController.agregarPiezasTablero);
// router.patch('/agregarPiezaTablero',ConquerGameController.agregarPiezaTablero);
// router.patch('/desconectarUsuarioPartida',ConquerGameController.desconectarUsuarioPartida);
// router.patch('/salirPartida',ConquerGameController.salirPartida);
// router.patch('/actualizarPiezasPosicionJuego',ConquerGameController.actualizarPiezasPosicionJuego);
// router.get('/buscarPartidas',ConquerGameController.buscarPartidas);
module.exports = router;