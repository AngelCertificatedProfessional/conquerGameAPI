import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { envs } from '../../config/envs';
import { CustomError } from '../../domain';
import { getFuncName } from '../../helpers/getFuncName';
import { handleError } from '../handleError/handleError';
export const validarJWT = (req: Request, res: Response, next: NextFunction) => {
    // x-token headers
    const token = req.header('x-token');
    if (!token) {
        const customError = CustomError.unauthorize('No hay token en la aplicacion',
            getFuncName(), JSON.stringify(req.body))
        return handleError(customError, res)
    }

    try {
        const { uid }: any = jwt.verify(token, envs.SECRET_JWT_SEED);
        req.headers.uid = uid;
    } catch (error: any) {
        let customError;
        //En caso de ser solo un mensaje
        if (typeof error !== 'object')
            customError = CustomError.unauthorize(error!.toString(),
                getFuncName(), JSON.stringify(req.body))
        switch (error!.name) {
            case "TokenExpiredError":
                customError = CustomError.unauthorize("Lo sentimos, la sesión ha expirado",
                    getFuncName(), JSON.stringify(req.body))
                break;
            case "JsonWebTokenError":
                customError = CustomError.unauthorize("Se invalida",
                    getFuncName(), JSON.stringify(req.body))
                break;
        }
        return handleError(customError, res)
    }
    next()
}