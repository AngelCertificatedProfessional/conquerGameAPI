import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel } from "../../../data";
import { CONQUERGAMEPARTIDA } from "../../../infraestructure/types/conquerGame.type";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { IoSocketService } from "../../../infraestructure/sockets/iosocket.service";

export class IngresarSeleccionPersonaje {

    private readonly ioSocketService = IoSocketService.instance

    constructor() {

    }

    public async execute(body: any, params: any) {
        try {
            const conquerGame: any = await ConquerGameModel.findOneAndUpdate(
                {
                    _id: params._id
                },
                {
                    estatus: CONQUERGAMEPARTIDA.AGREGARPIEZASTABLERO
                },
                {
                    new: true
                })
            this.ioSocketService.sendMessage(`conquerGame${conquerGame.numeroPartida}IngresarSeleccionPersonaje`,
                convertirMongoAJson(conquerGame!));
            crearRequest(getFuncName(), JSON.stringify(body), 200);
            return {
                ok: true
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(body))
        }
    }
}