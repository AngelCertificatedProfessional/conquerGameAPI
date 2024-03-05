const router = require('express').Router();
const {crearPartida,buscarPartidas} = require('../controllers/conquerGameController')
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarSesionUsuario } = require('../middlewares/validar-usuario');
router.use(validarJWT)
router.use(validarSesionUsuario)

router.post('/crearPartida',crearPartida);
router.get('/buscarPartidas',buscarPartidas);
// router.patch('/buscarPartida',ConquerGameController.buscarPartida);
// router.get('/buscarEstatusPartida/:numeroPartida',ConquerGameController.buscarEstatusPartida);
// router.patch('/mostrarTablero',ConquerGameController.mostrarTablero);
// router.patch('/agregarPiezasTablero',ConquerGameController.agregarPiezasTablero);
// router.patch('/agregarPiezaTablero',ConquerGameController.agregarPiezaTablero);
// router.patch('/desconectarUsuarioPartida',ConquerGameController.desconectarUsuarioPartida);
// router.patch('/salirPartida',ConquerGameController.salirPartida);
// router.patch('/actualizarPiezasPosicionJuego',ConquerGameController.actualizarPiezasPosicionJuego);
module.exports = router;