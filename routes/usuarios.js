const express = require('express');
const router = express.Router()
const UsuarioController = require('../controllers/UsuarioController')

module.exports = function(){
    router.post('/agregarUsuario',UsuarioController.createUsuario)
    router.post('/iniciarSecion',UsuarioController.iniciarSecion)
    // router.get('/listado',UsuarioController.listadoUsuario)
    // router.get('/consultaById/:_id',UsuarioController.getUsuariobyId)
    // router.put('/actualizarUsuario',UsuarioController.actualizarUsuario)
    // router.patch('/actualizarContrasena',UsuarioController.actualizarContrasena)
    return router;
}