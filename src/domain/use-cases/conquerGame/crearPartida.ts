import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel, UsuarioModel } from "../../../data";
import { generaNumeroPartida } from "./generaNumeroPartida";
import { CONQUERGAMEPARTIDA, JUGADORESARREGLO } from "../../../infraestructure/types/conquerGame.type";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
export class CrearPartida {
    constructor() {

    }

    public async execute(body: any, headers: any) {
        try {
            // todo realizar validacion para que un con partida ya existente no pueda ingresar a
            // todo una nueva partida

            const nRandom: number = await generaNumeroPartida.execute()
            //Se arma segmento para el lado de la partida
            const conquerGame = new ConquerGameModel()
            conquerGame.numeroPartida = nRandom;
            conquerGame.usuario_id = headers.uid;
            conquerGame.tipoJuego = body.tipoJuego;
            conquerGame.cantidadJugadores = body.cantidadJugadores;
            conquerGame.estatus = CONQUERGAMEPARTIDA.LOBBY;
            conquerGame.jugadores.push({ ...(headers.usuarioLogueado) });
            await Promise.all([
                conquerGame.save(),
                //Actualizamos al usuario para asignarle el numero de partida que esta jugando
                UsuarioModel.findOneAndUpdate({ _id: headers.uid }, {
                    numeroPartidaActual: nRandom
                })
            ]);

            crearRequest(getFuncName(), JSON.stringify(body), 200);
            return {
                ok: true,
                data: convertirMongoAJson(conquerGame)
            };
        } catch (error) {
            console.log(error)
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(body))
        }
    }
}