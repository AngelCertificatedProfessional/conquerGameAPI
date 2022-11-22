const {Router} = require('express')
const UsuarioController = require('../controllers/UsuarioController')
const router = Router();

router.post('/agregarUsuario',UsuarioController.agregarUsuarioLocal);
router.post('/agregarUsuarioInvitado',UsuarioController.agregarUsuarioInvitado);
router.post('/iniciarSecion',UsuarioController.iniciarSecion);

module.exports = router;