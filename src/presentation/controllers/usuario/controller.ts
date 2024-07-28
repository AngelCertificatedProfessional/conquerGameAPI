import { Request, Response } from "express"
import { CustomError } from "../../../domain"
import { AgregarUsuarioInvitado } from "../../../domain/use-cases/usuario"
import { handleError } from "../../handleError/handleError"
import { RevalidarToken } from "../../../domain/use-cases/usuario/revalidarToken"
export class UsuarioController {
    constructor(
    ) { }

    agregarUsuarioInvitado = async (req: Request, res: Response) => {
        const agregarUsuarioInvitado = new AgregarUsuarioInvitado()
        agregarUsuarioInvitado.execute(req.body)
            .then(category => res.status(201).json(category))
            .catch(error => handleError(error, res))
    }

    revalidarToken = async (req: Request, res: Response) => {
        const revalidarToken = new RevalidarToken()
        revalidarToken.execute(req.headers)
            .then(respuesta => res.json(respuesta))
            .catch(error => handleError(error, res))
    }
}