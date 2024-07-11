import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel } from "../../../data";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { IoSocketService } from "../../../infraestructure/sockets/iosocket.service";
import { CONQUERGAMEPARTIDA } from "../../../infraestructure/types/conquerGame.type";
import { ConquerGameInterface } from "../../../infraestructure/interfaces";

export class MoverPosicionPiezasGlobal {

    private readonly ioSocketService = IoSocketService.instance

    constructor() {

    }

    public async execute(body: any, params: any) {
        const posicionPiezaGlobal = body.posicionPiezasGlobal
        try {
            const conquerGame: ConquerGameInterface = await ConquerGameModel.findOneAndUpdate(
                {
                    _id: params._id,
                },
                {
                    posicionPiezasGlobal: body.posicionPiezasGlobal,
                    turno: body.siguienteTurno,
                    reyesVivos: body.reyesVivos,
                    estatus: body.reyesVivos.length === 1 ? CONQUERGAMEPARTIDA.FINALIZADO : CONQUERGAMEPARTIDA.JUEGOINICIADO,
                    $push: {
                        historialJugadores: posicionPiezaGlobal
                    }
                },
                {
                    new: true,
                    fields: { historialJugadores: 0 }
                }) as ConquerGameInterface;
            //Si existe solo un rey vivo
            if (body.reyesVivos.length === 1) {
                let vGanador = conquerGame.jugadores.find(({ turnoJugador }) => turnoJugador === body.reyesVivos[0])
                let mensajeF: string = (!!vGanador ? vGanador.usuario : '');
                switch (body.reyesVivos[0]) {
                    case "O":
                        mensajeF = `${mensajeF} (Naranja)`
                        break;
                    case "B":
                        mensajeF = `${mensajeF} (Negro)`
                        break;
                    case "R":
                        mensajeF = `${mensajeF} (Rojo)`
                        break;
                    case "P":
                        mensajeF = `${mensajeF} (Purpura)`
                        break;
                }
                this.ioSocketService.sendMessage(`conquerGame${conquerGame.numeroPartida}FinalizarPartida`,
                    { mensaje: `El ganador es el jugador ${mensajeF}` });
            }
            //Si existen varios reyes vivos
            if (body.reyesVivos.length > 1) {
                this.ioSocketService.sendMessage(`conquerGame${conquerGame.numeroPartida}MoverPosicionPiezasGlobal`,
                    convertirMongoAJson(conquerGame!));
            }

            this.ioSocketService.sendMessage(`conquerGame${conquerGame.numeroPartida}MoverPosicionPiezasGlobal`,
                convertirMongoAJson(conquerGame!));
            crearRequest(getFuncName(), JSON.stringify(body), 200);
            return {
                ok: true
            };
        } catch (error) {
            console.log(error)
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(body))
        }
    }
}