const {Router} = require('express')
const ConquerGameController = require('../controllers/conquerGameController')
const router = Router();

router.post('/crearPartida',ConquerGameController.crearPartida);
router.get('/buscarPartida/:numeroPartida',ConquerGameController.buscarPartida);
router.get('/buscarEstatusPartida/:numeroPartida',ConquerGameController.buscarEstatusPartida);
router.patch('/mostrarTablero',ConquerGameController.mostrarTablero);
router.patch('/agregarPiezasTablero',ConquerGameController.agregarPiezasTablero);
router.patch('/actualizarPiezasPosicionJuego',ConquerGameController.actualizarPiezasPosicionJuego);

module.exports = router;