const {Router} = require('express')
const ConquerGameController = require('../controllers/conquerGameController')
const router = Router();

router.post('/crearPartida',ConquerGameController.crearPartida);

module.exports = router;