import { body, param } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
import { validaExistePartida } from "../../../presentation/middlewares/conquerGame/validaExistePartida";
export const indicarJugadorListo = [
    body('piezasJugador').not().isEmpty().withMessage('Las piezas jugador es obligatorio'),
    param('_id').not().isEmpty().withMessage('El id es obligatorio'),
    validaExistePartida,
    validarCampos,
]