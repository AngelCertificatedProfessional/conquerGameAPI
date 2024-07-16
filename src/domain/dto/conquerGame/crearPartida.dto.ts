import { param } from "express-validator";
import { validarCampos } from "../../../presentation/middlewares/validar-campos";
export const atendidoDTO = [
    param('_id').not().isEmpty().withMessage('El id es obligatorio'),
    validarCampos,
]