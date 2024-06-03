import { NextFunction, Request, Response } from "express";
import { UsuarioModel } from "../../data";
import { getFuncName } from "../../helpers/getFuncName";
import { CustomError } from "../../domain";
import { handleError } from "../handleError/handleError";
import { convertirMongoAJson } from "../../helpers/convertirMongoJson";


// export const validarUsuarioContrasenaLogin = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const usuario = await UsuarioModel.findOne({ 'correo': req.body.correo }, { usuario: 1, contrasena: 1, _id: 1, rol: 1 });
//         if (!usuario) {
//             throw 'El correo o la contraseña son incorrectas';
//         }
//         if (!bcrypt.compareSync(req.body.contrasena, usuario.contrasena)) {
//             throw 'El correo o la contraseña son incorrectas';
//         }
//         req.usuarioLoguado = convertirMongoAJson(usuario)
//         next()
//     } catch (error) {
//         customError = CustomError.unauthorize(error, getFuncName(), JSON.stringify(req.body))
//         return handleError(customError, res)
//     }
// }


export const validarSesionUsuario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuario: any = await UsuarioModel.findOne({ '_id': req.headers.uid });
        if (!usuario) {
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        req.headers.usuarioLogueado = convertirMongoAJson(usuario);
        next()
    } catch (error) {
        const customError = CustomError.unauthorize(error!.toString(), getFuncName(), JSON.stringify(req.body))
        return handleError(customError, res)
    }
}