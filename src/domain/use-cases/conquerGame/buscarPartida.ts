import { CustomError } from "../../errors/curstom.error";
import { getFuncName } from "../../../helpers/getFuncName";
import { crearRequest } from "../../../infraestructure/datasource/request/crearRequest";
import { ConquerGameModel } from "../../../data";
import { ACCIONTIPOJUEGO, CONQUERGAMEPARTIDA } from "../../../infraestructure/types/conquerGame.type";
export class BuscarPartida {
    constructor() {

    }

    public async execute(body: any) {
        try {
            const partida = await ConquerGameModel.aggregate([
                {
                    $match: {
                        estatus: CONQUERGAMEPARTIDA.LOBBY
                    }
                },
                {
                    $lookup: {
                        from: 'usuario',
                        localField: 'usuario_id',
                        foreignField: '_id',
                        pipeline: [
                            {
                                '$project': {
                                    'usuario': 1
                                }
                            }
                        ],
                        as: 'usuarios'
                    }
                },
                {
                    '$unwind': '$usuarios'
                },
                {
                    '$project': {
                        'id': '$_id',
                        'cantidadJugadores': 1,
                        'tipoJuego': 1,
                        'numeroPartida': 1,
                        'tipoJuegoDescripcion': {
                            '$switch':
                            {
                                'branches': [
                                    {
                                        'case': {
                                            '$eq': [
                                                "$tipoJuego", ACCIONTIPOJUEGO.INIDIVIDUAL
                                            ]
                                        },
                                        'then': "INIDIVIDUAL"
                                    },
                                    {
                                        'case': {
                                            '$eq': [
                                                "$tipoJuego", ACCIONTIPOJUEGO.EQUIPO
                                            ]
                                        },
                                        'then': "EQUIPO"
                                    },
                                ],
                                'default': "INIDIVIDUAL"
                            }
                        },
                        'usuarios.usuario': 1,
                    }
                },
            ])
            crearRequest(getFuncName(), JSON.stringify(body), 200);
            return {
                ok: true,
                data: partida
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`, getFuncName(), JSON.stringify(body))
        }
    }
}