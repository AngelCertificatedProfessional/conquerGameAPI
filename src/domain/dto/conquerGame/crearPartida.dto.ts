import { body } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
import { ACCIONTIPOJUEGO } from "../../../infraestructure/types/conquerGame.type";
export const crearPartida = [
    body('tipoJuego').isIn([ACCIONTIPOJUEGO.INIDIVIDUAL]).withMessage('El tipoJuego es obligatorio'),
    body('cantidadJugadores').isIn([2, 4]).withMessage('La cantidad de Jugadores es obligatorio'),
    validarCampos,
]