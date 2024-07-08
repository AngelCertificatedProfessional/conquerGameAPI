import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel } from "../../../data";
import { CONQUERGAMEPARTIDA, JUGADORESARREGLO } from "../../../infraestructure/types/conquerGame.type";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { IoSocketService } from "../../../infraestructure/sockets/iosocket.service";
import { ConquerGameInterface } from "../../../infraestructure/interfaces/conquerGame.interface";

export class IngresarSeleccionPersonaje {

    private readonly ioSocketService = IoSocketService.instance

    constructor() {

    }

    public async execute(body: any, headers: any, params: any) {
        try {
            let conquerGame: ConquerGameInterface = headers.conquerGame;
            // Mezclar el arreglo de turnos únicos
            const turnosUnicos = this.shuffleArray([...JUGADORESARREGLO], conquerGame.cantidadJugadores);
            conquerGame.jugadores.forEach((arr, index) => {
                conquerGame.jugadores[index].turnoJugador = turnosUnicos[index];
            })

            conquerGame.jugadores.sort((a, b) => {
                return JUGADORESARREGLO.indexOf(a.turnoJugador) - JUGADORESARREGLO.indexOf(b.turnoJugador);
            });

            const conquerGameMongo: any = await ConquerGameModel.findOneAndUpdate(
                {
                    _id: params._id
                },
                {
                    estatus: CONQUERGAMEPARTIDA.AGREGARPIEZASTABLERO,
                    jugadores: conquerGame.jugadores
                },
                {
                    new: true
                })
            this.ioSocketService.sendMessage(`conquerGame${conquerGameMongo.numeroPartida}IngresarSeleccionPersonaje`,
                convertirMongoAJson(conquerGameMongo!));
            crearRequest(getFuncName(), JSON.stringify(body), 200);
            return {
                ok: true
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(body))
        }
    }

    private shuffleArray = (arreglo: string[], cantidadJugadores: number): string[] => {
        for (let i = cantidadJugadores - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
        }
        return arreglo;
    }

}