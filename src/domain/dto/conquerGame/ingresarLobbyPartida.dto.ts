import { param } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
export const ingresarLobbyPartida = [
    param('_id').not().isEmpty().withMessage('El id es obligatorio'),
    validarCampos,
]