import { NextFunction, Request, Response } from "express";
import { UsuarioModel } from "../../data";
import { getFuncName } from "../../helpers/getFuncName";
import { CustomError } from "../../domain";
import { handleError } from "../handleError/handleError";
import { convertirMongoAJson } from "../../helpers/convertirMongoJson";

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