import { param } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
import { validaExistePartida } from "../../../presentation/middlewares/conquerGame/validaExistePartida";
import { validaNoSobrePasarCantidadJugadores } from "../../../presentation/middlewares/conquerGame/validaNoSobrePasarCantidadJugadores";
export const ingresarLobbyPartida = [
    param('_id').not().isEmpty().withMessage('El id es obligatorio'),
    validaExistePartida,
    validaNoSobrePasarCantidadJugadores,
    validarCampos,
]