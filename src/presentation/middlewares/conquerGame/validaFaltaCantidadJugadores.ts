import { NextFunction, Request, Response } from "express";
import { getFuncName } from "../../../helpers/getFuncName";
import { CustomError } from "../../../domain";
import { handleError } from "../../handleError/handleError";
import { ConquerGameInterface } from "../../../infraestructure/interfaces/conquerGame.interface";
import { Console } from "console";

export const validaFaltaCantidadJugadores = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!!!req.headers.conquerGame) {
            return 'No existe la propiedad conquerGame'
        }
        const conquerGame: ConquerGameInterface = req.headers.conquerGame as any;
        if (conquerGame.jugadores.length < conquerGame.cantidadJugadores) {
            throw 'No se puede iniciar la partida porque todavia no se a completado la cantidad de jugadores'
        }
        next()
    } catch (error) {
        const customError = CustomError.unauthorize(error!.toString(), getFuncName(), JSON.stringify(req.body))
        return handleError(customError, res)
    }
}