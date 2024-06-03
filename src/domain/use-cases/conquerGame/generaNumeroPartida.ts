import { ConquerGameModel } from "../../../data";
import { CONQUERGAMEPARTIDA } from "../../../infraestructure/types/conquerGame.type";

export class generaNumeroPartida {
    constructor() {

    }

    public static async execute(): Promise<number> {
        let random: number = await this.obtenerUltimoNumeroPartida()
        return (++random);
    }

    private static async obtenerUltimoNumeroPartida(): Promise<number> {
        try {
            const partida = await ConquerGameModel.findOne({
                estatus: {
                    $nin: [
                        CONQUERGAMEPARTIDA.FINALIZADO,
                        CONQUERGAMEPARTIDA.CANCELADO
                    ]
                }
            }).sort({ numeroPartida: -1 });
            return partida?.numeroPartida || 1000
        } catch (error) {
            return 1000;
        }
    }

}