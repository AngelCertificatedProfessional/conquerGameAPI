import { param } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
import { validaExistePartida } from "../../../presentation/middlewares/conquerGame/validaExistePartida";
import { validaFaltaCantidadJugadores } from "../../../presentation/middlewares/conquerGame/validaFaltaCantidadJugadores";
export const ingresarSeleccionPersonaje = [
    param('_id').not().isEmpty().withMessage('El id es obligatorio'),
    validaExistePartida,
    validaFaltaCantidadJugadores,
    validarCampos,
]