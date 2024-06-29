import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel } from "../../../data";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { IoSocketService } from "../../../infraestructure/sockets/iosocket.service";

export class IndicarJugadorListo {

    private readonly ioSocketService = IoSocketService.instance

    constructor() {

    }

    public async execute(body: any, headers: any, params: any) {
        try {
            const conquerGame: any = await ConquerGameModel.findOneAndUpdate(
                {
                    _id: params._id,
                    "jugadores._id": headers.uid
                },
                {
                    "jugadores.$.listo": true
                },
                {
                    new: true
                })
            this.ioSocketService.sendMessage(`conquerGame${conquerGame.numeroPartida}IndicarJugadorListo`,
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