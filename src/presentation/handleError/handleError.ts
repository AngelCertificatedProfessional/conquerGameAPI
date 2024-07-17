import { Response } from "express";
import { CustomError } from "../../domain";
import { crearRequest } from '../../infraestructure/datasource/request/crearRequest'
import { validaTextoJSON } from "../../helpers/validaTextoJSON";
export const handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
        crearRequest(error.nombreFuncion, JSON.stringify(error.request),
            error.statusCode, { msg: error.message });
        if (validaTextoJSON(error.message)) {
            return res.status(error.statusCode).json({ msg: JSON.parse(error.message) })
        } else {
            return res.status(error.statusCode).json({ msg: error.message })
        }
    }
    return res.status(500).json({ msg: error })
}