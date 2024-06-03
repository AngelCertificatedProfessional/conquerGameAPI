import { getFuncName } from "../../../helpers/getFuncName";
import { generarJWT } from "../../../helpers/jwt";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { CustomError } from "../../errors/curstom.error";
export class RevalidarToken {
    constructor() {

    }

    public async execute(headers: any) {
        try {
            const { uid, usuarioLogueado } = headers;
            //generar un nuevo json token y retornarlo en esta peticion
            const token = await generarJWT(uid, usuarioLogueado);
            crearRequest(getFuncName(), JSON.stringify(headers), 200);
            return {
                ok: true,
                token,
                usuario: usuarioLogueado.usuario,
                uid: uid
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(headers))
        }
    }
}