const { crearRequest } = require("../helpers/request");
const { getFuncName } = require('../helpers/getFuncName');
const Usuario = require("../models/Usuario");
const { convertirMongoAJson } = require("../helpers/convertirMongoJson");
const bcrypt = require('bcryptjs')

exports.validarUsuarioContrasenaLogin = async (req = request, res = response, next) => {
    try {
        const usuario = await Usuario.findOne({ 'correo': req.body.correo }, { usuario: 1, contrasena: 1, _id: 1, rol: 1 });
        if (!usuario) {
            throw 'El correo o la contrasena son incorrectas';
        }
        if (!bcrypt.compareSync(req.body.contrasena, usuario.contrasena)) {
            throw 'El usuario o la contrasena son incorrectas';
        }
        req.usuarioLoguado = convertirMongoAJson(usuario)
        next()
    } catch (error) {
        crearRequest(getFuncName(), JSON.stringify(req.body), 401, error.toString());
        return res.status(401).json({
            error: 'Algo salio mal',
            ok: false,
            msg: error.toString()
        });
    }
}


exports.validarSesionUsuario = async (req = request, res = response, next) => {
    try {
        const usuario = await Usuario.findOne({ '_id': req.uid }, { _id: 1 });
        if (!usuario) {
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        req.usuarioLogueado = usuario.usuarioLogueado
        next()
    } catch (error) {
        crearRequest(getFuncName(), JSON.stringify(req.body), 500, error.toString());
        return res.status(401).json({
            error: 'Algo salio mal',
            ok: false,
            msg: error.toString()
        });
    }
}