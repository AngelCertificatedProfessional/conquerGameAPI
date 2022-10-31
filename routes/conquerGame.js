const {Router} = require('express')
const ConquerGameController = require('../controllers/conquerGameController')
const router = Router();

router.post('/crearPartida',ConquerGameController.crearPartida);
router.get('/buscarPartida/:numeroPartida',ConquerGameController.buscarPartida);
module.exports = router;