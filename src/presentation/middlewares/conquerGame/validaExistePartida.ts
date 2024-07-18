import { NextFunction, Request, Response } from "express";
import { ConquerGameModel } from "../../../data";
import { getFuncName } from "../../../helpers/getFuncName";
import { CustomError } from "../../../domain";
import { handleError } from "../../handleError/handleError";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";

export const validaExistePartida = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conquerGame = await ConquerGameModel.findOne({ '_id': req.params._id });
        if (!conquerGame) {
            throw "La partida no existe"
        }
        req.headers.conquerGame = convertirMongoAJson(conquerGame);
        next()
    } catch (error) {
        const customError = CustomError.unauthorize(error!.toString(), getFuncName(), JSON.stringify(req.body))
        return handleError(customError, res)
    }
}
