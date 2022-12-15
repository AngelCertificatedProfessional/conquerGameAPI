const {Router} = require('express')
const UsuarioController = require('../controllers/UsuarioController')
const router = Router();

router.post('/agregarUsuario',UsuarioController.agregarUsuarioLocal);
router.post('/agregarUsuarioInvitado',UsuarioController.agregarUsuarioInvitado);
router.post('/iniciarSecion',UsuarioController.iniciarSecion);
router.get('/consultaById/:_id',UsuarioController.getUsuariobyId)
router.put('/actualizarUsuario',UsuarioController.actualizarUsuario)
router.patch('/actualizarContrasena',UsuarioController.actualizarContrasena)
router.get('/buscar10Mejores',UsuarioController.buscar10Mejores);
router.patch('/actualizarMemes',UsuarioController.actualizarMemes)
module.exports = router;