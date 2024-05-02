import { Response } from "express";
import { CustomError } from "../../domain";
import { crearRequest } from '../../infraestructure/datasource/request/crearRequest'
export const handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
        crearRequest(error.nombreFuncion, JSON.stringify(error.request),
            error.statusCode, { msg: error.message });
        return res.status(error.statusCode).json({ msg: error.message })
    }
    return res.status(500).json({ msg: error })
}