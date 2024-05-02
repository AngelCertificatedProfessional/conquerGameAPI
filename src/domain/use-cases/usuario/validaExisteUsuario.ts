// const usuarioModel = require('../../../data/mongo/models/Usuario')
// const usuariosBloqueadosModel = require('../../../data/mongo/models/UsuariosBloqueados');
// const { convertirMongoAJson } = require('../../../helpers/convertirMongoJson')

import { UsuarioModel, UsuariosBloqueadosModel } from "../../../data";

// //Validaremos que el usuario no pueda registrarse repetid
export class ValidaExisteUsuario {
    constructor() {

    }

    static async execute(usuario: string,
        correo: string, usuarioInvitado: boolean, nId?: number) {
        if (!!!nId) {
            const usuarioT = "^" + usuario + "$"
            const correoT = "^" + correo + "$"
            let nCantidadRegistros = await UsuarioModel.countDocuments({
                $or: [
                    { 'usuario': { '$regex': usuarioT, "$options": "i" } },
                    { 'correo': { '$regex': correoT, "$options": "i" } }
                ]
            }
            );
            if (nCantidadRegistros >= 1) {
                return 'El usuario o el correo ya existe';
            }
            if (usuarioInvitado) return '';

            // let usuariosBloqueados = await UsuariosBloqueadosModel.find({});
            // usuariosBloqueados = convertirMongoAJson(usuariosBloqueados)
            // let nValor = usuariosBloqueados.findIndex(obj =>
            //     (obj.usuario).toUpperCase() === usuario.toUpperCase() ||
            //     (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('1', 'I') ||
            //     (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('3', 'E') ||
            //     (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('@', 'A') ||
            //     (obj.usuario).toUpperCase() === usuario.toUpperCase().replace('0', 'O') ||
            //     (obj.usuario).toUpperCase().replace(' ', '') === usuario.toUpperCase() ||
            //     (obj.usuario).toUpperCase().replace(' ', '_') === usuario.toUpperCase() ||
            //     (usuario.toUpperCase().includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            //     (usuario.toUpperCase().replace('1', 'I').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            //     (usuario.toUpperCase().replace('3', 'E').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            //     (usuario.toUpperCase().replace('@', 'A').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            //     (usuario.toUpperCase().replace('0', 'O').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)));
            // if (nValor !== -1) {
            //     throw `El usuario ${usuario} no puede ser creado en nuestro sistema por su nombre, favor de cambiarlo por favor`
            // }
        } else {
            // let nCantidadRegistros = await UsuarioModel.countDocuments({ 'usuario': usuario, '_id': { '$ne': nId } })
            // if (nCantidadRegistros >= 1) {
            //     throw 'El usuario o el correo ya existe'
            // }
        }
    }
}