const {Router} = require('express')
const ConquerGameController = require('../controllers/conquerGameController')
const router = Router();

router.post('/crearPartida',ConquerGameController.crearPartida);
router.patch('/buscarPartida',ConquerGameController.buscarPartida);
router.get('/buscarEstatusPartida/:numeroPartida',ConquerGameController.buscarEstatusPartida);
router.patch('/mostrarTablero',ConquerGameController.mostrarTablero);
router.patch('/agregarPiezasTablero',ConquerGameController.agregarPiezasTablero);
router.patch('/desconectarUsuarioPartida',ConquerGameController.desconectarUsuarioPartida);
router.patch('/salirPartida',ConquerGameController.salirPartida);
router.patch('/actualizarPiezasPosicionJuego',ConquerGameController.actualizarPiezasPosicionJuego);
router.get('/buscarPartidas',ConquerGameController.buscarPartidas);
module.exports = router;