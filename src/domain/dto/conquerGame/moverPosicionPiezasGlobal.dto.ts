import { body, param } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
import { validaExistePartida } from "../../../presentation/middlewares/conquerGame/validaExistePartida";
export const moverPosicionPiezasGlobal = [
    param('_id').not().isEmpty().withMessage('El id es obligatorio'),
    body('posicionPiezasGlobal').not().isEmpty().withMessage('El posicionPiezasGlobal es obligatorio'),
    body('siguienteTurno').not().isEmpty().withMessage('El siguienteTurno es obligatorio'),
    body('reyesVivos').not().isEmpty().withMessage('El reyesVivos es obligatorio'),
    validaExistePartida,
    validarCampos,
]