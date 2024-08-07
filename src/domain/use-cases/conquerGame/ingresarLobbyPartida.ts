import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel, UsuarioModel } from "../../../data";
import { convertirMongoAJson } from "../../../helpers/convertirMongoJson";
import { IoSocketService } from "../../../infraestructure/sockets/iosocket.service";
import { ConquerGameInterface, UsuarioInterface } from "../../../infraestructure/interfaces";

export class IngresarLobbyPartida {

    private readonly ioSocketService = IoSocketService.instance

    constructor() {

    }

    public async execute(body: any, headers: any, params: any) {
        try {
            const usuarioLogueado: UsuarioInterface = headers.usuarioLogueado;
            const conquerGame: ConquerGameInterface = headers.conquerGame;
            // Todo Agregar validacion de pertenece a la partida

            //Todo Agregar validacion de que el usuario no este en otra partida
            const [conquerGameMongo] = await Promise.all([
                ConquerGameModel.findOneAndUpdate({ _id: params._id }, {
                    $push: {
                        jugadores: {
                            _id: usuarioLogueado._id,
                            puntuaje: usuarioLogueado.puntuaje,
                            usuario: usuarioLogueado.usuario,
                            nombre: usuarioLogueado.usuario,
                        }
                    }
                }, {
                    new: true
                }),
                //Actualizamos al usuario para asignarle el numero de partida que esta jugando
                UsuarioModel.findOneAndUpdate({ _id: headers.uid }, {
                    numeroPartidaActual: conquerGame.numeroPartida
                })
            ]);
            this.ioSocketService.sendMessage(`conquerGame${conquerGame.numeroPartida}Lobby`,
                convertirMongoAJson(conquerGameMongo!));
            crearRequest(getFuncName(), JSON.stringify(body), 200);
            return {
                ok: true,
                data: convertirMongoAJson(conquerGameMongo!),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(body))
        }
    }
}