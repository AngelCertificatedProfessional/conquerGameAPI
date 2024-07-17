import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain";
import { getFuncName } from "../../helpers/getFuncName";
import { handleError } from "../handleError/handleError";
import { validationResult } from "express-validator";

export const validarCampos = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const customError = CustomError.internalServer(JSON.stringify(errors.mapped()), getFuncName(), JSON.stringify(req.body))
        return handleError(customError, res)
    }
    next();
}