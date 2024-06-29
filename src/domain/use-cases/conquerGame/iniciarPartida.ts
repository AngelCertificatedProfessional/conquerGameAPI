import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel } from "../../../data";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { IoSocketService } from "../../../infraestructure/sockets/iosocket.service";
import { CONQUERGAMEPARTIDA } from "../../../infraestructure/types/conquerGame.type";

export class IniciarPartida {

    private readonly ioSocketService = IoSocketService.instance

    constructor() {

    }

    public async execute(body: any, params: any) {
        try {
            const conquerGame: any = await ConquerGameModel.findOneAndUpdate(
                {
                    _id: params._id,
                },
                {
                    estatus: CONQUERGAMEPARTIDA.JUEGOINICIADO
                },
                {
                    new: true
                })
            this.ioSocketService.sendMessage(`conquerGame${conquerGame.numeroPartida}IniciarPartida`,
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