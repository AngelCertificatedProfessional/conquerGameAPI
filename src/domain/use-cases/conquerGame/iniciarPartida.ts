import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel } from "../../../data";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { IoSocketService } from "../../../infraestructure/sockets/iosocket.service";
import { CONQUERGAMEPARTIDA, JUGADORESARREGLO } from "../../../infraestructure/types/conquerGame.type";
import { ConquerGameInterface } from "../../../infraestructure/interfaces/conquerGame.interface";

export class IniciarPartida {

    private readonly ioSocketService = IoSocketService.instance

    constructor() {

    }

    public async execute(headers: any, params: any) {
        try {
            let conquerGame: ConquerGameInterface = headers.conquerGame;
            const conquerGameMongo: any = await ConquerGameModel.findOneAndUpdate(
                {
                    _id: params._id,
                },
                {
                    estatus: CONQUERGAMEPARTIDA.JUEGOINICIADO,
                    turno: JUGADORESARREGLO[0], //primer turno de jugador 
                    reyesVivos: conquerGame.cantidadJugadores === 2 ?
                        JUGADORESARREGLO.slice(0, 2) :
                        JUGADORESARREGLO.slice(0, 4)
                },
                {
                    new: true
                })
            this.ioSocketService.sendMessage(`conquerGame${conquerGameMongo.numeroPartida}IniciarPartida`,
                convertirMongoAJson(conquerGameMongo!));
            crearRequest(getFuncName(), '', 200);
            return {
                ok: true
            };
        } catch (error) {
            console.log(error)
            throw CustomError.internalServer(`${error}`, getFuncName(), '')
        }
    }
}