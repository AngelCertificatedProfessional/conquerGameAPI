const router = require('express').Router();
const { agregarUsuarioInvitado } = require('./UsuarioController')

// router.post('/agregarUsuario',UsuarioController.agregarUsuarioLocal);
router.get('/agregarUsuarioInvitado', agregarUsuarioInvitado);
// router.post('/iniciarSecion',UsuarioController.iniciarSecion);
// router.get('/consultaById/:_id',UsuarioController.getUsuariobyId)
// router.put('/actualizarUsuario',UsuarioController.actualizarUsuario)
// router.patch('/actualizarContrasena',UsuarioController.actualizarContrasena)
// router.get('/buscar10Mejores',UsuarioController.buscar10Mejores);
module.exports = router;