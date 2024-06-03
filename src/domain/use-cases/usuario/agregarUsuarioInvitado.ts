const bcrypt = require('bcryptjs');
import { UsuarioModel } from "../../../data";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { getFuncName } from "../../../helpers/getFuncName";
import { generarJWT } from "../../../helpers/jwt";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { CustomError } from "../../errors/curstom.error";
import { ValidaExisteUsuario } from "./validaExisteUsuario";
export class AgregarUsuarioInvitado {
    constructor() {

    }

    public async execute(body: any) {
        try {
            const bvody = body;
            const vResultado = {
                random: 0
            }
            let bCumple = false;
            while (!bCumple) {
                vResultado.random = Math.floor(Math.random() * (10000 - 1000) + 1000);
                let usuarioInvitado = 'invitado' + vResultado.random
                let correoInvitado = 'invitado' + vResultado.random
                bCumple = (await ValidaExisteUsuario.execute(usuarioInvitado,
                    correoInvitado, true) === '');
            }
            const usuario = new UsuarioModel()
            usuario.correo = 'invitado' + vResultado.random
            usuario.usuario = 'invitado' + vResultado.random
            usuario.contrasena = 'invitado' + vResultado.random
            usuario.nombre = 'invitado' + vResultado.random;
            usuario.apellido = 'invitado' + vResultado.random;
            usuario.aceptoTerminosYCondiciones = true;
            usuario.invitado = true;
            usuario.contrasena = bcrypt.hashSync(usuario.contrasena, bcrypt.genSaltSync(10));
            usuario.rol = 2;
            const resultado = convertirMongoAJson((await usuario.save()))
            const token = await generarJWT(resultado._id, usuario.usuario);
            // resultado.contrasena = 'invitado' + vResultado.random
            // resultado.uid = resultado._id
            crearRequest(getFuncName(), JSON.stringify(body), 200);
            return {
                token,
                usuario: usuario.usuario,
                uid: resultado._id
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(body))
        }
    }
}