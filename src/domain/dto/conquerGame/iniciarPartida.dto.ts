import { param } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
import { validaExistePartida } from "../../../presentation/middlewares/conquerGame/validaExistePartida";
export const iniciarPartida = [
    param('_id').not().isEmpty().withMessage('El id es obligatorio'),
    validaExistePartida,
    validarCampos,
]