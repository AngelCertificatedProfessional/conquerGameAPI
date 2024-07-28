import { UsuarioModel } from "../../../data";

//Validaremos que el usuario no pueda registrarse repetid
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
        } else {
        }
    }
}