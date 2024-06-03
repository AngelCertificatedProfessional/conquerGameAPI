import { NextFunction, Request, Response } from "express";
import { getFuncName } from "../../../helpers/getFuncName";
import { CustomError } from "../../../domain";
import { handleError } from "../../handleError/handleError";
import { ConquerGameInterface } from "../../../infraestructure/interfaces/conquerGame.interface";

export const validaNoSobrePasarCantidadJugadores = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!!!req.headers.conquerGame) {
            return 'No existe la propiedad conquerGame'
        }
        const conquerGame: ConquerGameInterface = req.headers.conquerGame as any;

        if (conquerGame.jugadores.length >= conquerGame.cantidadJugadores) {
            throw 'Esta sala ya cuenta con la capacidad maxima de jugadores'
        }
        next()
    } catch (error) {
        const customError = CustomError.unauthorize(error!.toString(), getFuncName(), JSON.stringify(req.body))
        return handleError(customError, res)
    }
}