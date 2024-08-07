const usuarioModel = require('../data/mongo/models/Usuario.model')
const usuariosBloqueadosModel = require('../data/mongo/models/UsuariosBloqueados.model');
const { convertirMongoAJson } = require("./convertirMongoJson");
//Validaremos que el usuario no pueda registrarse repetidas veces como tambien que no utilize nombres inpropios
exports.validaUsuario = async (usuario, nId, correo) => {
    if (nId === undefined || nId === null) {
        const usuarioT = "^" + usuario + "$"
        const correoT = "^" + correo + "$"
        let nCantidadRegistros = await usuarioModel.countDocuments({ $or: [{ 'usuario': { '$regex': usuarioT, "$options": "i" } }, { 'correo': { '$regex': correoT, "$options": "i" } }] });
        if (nCantidadRegistros >= 1) {
            throw 'El usuario o el correo ya existe'
        }

        let usuariosBloqueados = await usuariosBloqueadosModel.find({});
        usuariosBloqueados = convertirMongoAJson(usuariosBloqueados)
        let nValor = usuariosBloqueados.findIndex(obj =>
            (obj.usuario).toUpperCase() === usuario.toUpperCase() ||
            (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('1', 'I') ||
            (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('3', 'E') ||
            (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('@', 'A') ||
            (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('0', 'O') ||
            (obj.usuario).toUpperCase().replace(' ', '') === usuario.toUpperCase() ||
            (obj.usuario).toUpperCase().replace(' ', '_') === usuario.toUpperCase() ||
            (usuario.toUpperCase().includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('1', 'I').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('3', 'E').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('@', 'A').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('0', 'O').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)));
        if (nValor !== -1) {
            throw `El usuario ${usuario} no puede ser creado en nuestro sistema por su nombre, favor de cambiarlo por favor`
        }
    } else {
        let nCantidadRegistros = await usuarioModel.countDocuments({ 'usuario': usuario, '_id': { '$ne': nId } })
        if (nCantidadRegistros >= 1) {
            throw 'El usuario o el correo ya existe'
        }
    }
}