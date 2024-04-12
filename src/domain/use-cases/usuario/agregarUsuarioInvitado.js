const { getFuncName } = require('../../../helpers/getFuncName')
const { crearRequest } = require('../request/crearRequest')
const { validaExisteUsuario } = require('./validaExisteUsuario')
const usuarioModel = require('../../../data/mongo/models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../../../helpers/jwt");
exports.agregarUsuarioInvitado = async (req) => {
    try {
        const vResultado = {}
        let bCumple = true;
        while (bCumple) {
            vResultado.random = Math.floor(Math.random() * (10000 - 1000) + 1000);
            let usuarioInvitado = 'invitado' + vResultado.random
            let correoInvitado = 'invitado' + vResultado.random
            if (!(await validaExisteUsuario(usuarioInvitado, null, correoInvitado)) > 0) {
                bCumple = false;
            }
        }
        const usuario = new usuarioModel()
        usuario.correo = 'invitado' + vResultado.random
        usuario.usuario = 'invitado' + vResultado.random
        usuario.contrasena = 'invitado' + vResultado.random
        usuario.nombre = 'invitado' + vResultado.random;
        usuario.apellido = 'invitado' + vResultado.random;
        usuario.aceptoTerminosYCondiciones = true;
        usuario.invitado = true;
        usuario.contrasena = bcrypt.hashSync(usuario.contrasena, bcrypt.genSaltSync(10));
        usuario.rol = 2;
        const resultado = await usuario.save();
        const token = await generarJWT(resultado._id, usuario.usuario);
        resultado.contrasena = 'invitado' + vResultado.random
        resultado.uid = resultado._id
        crearRequest(getFuncName(), JSON.stringify(req.body), 200);
        return {
            token,
            usuario: usuario.usuario
        }
    } catch (error) {
        crearRequest(getFuncName(), JSON.stringify(req.body), 500, error.toString());
        throw {
            error: 'Algo salio mal',
            data: error.toString()
        }
    }
}