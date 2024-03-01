const Partida = require("../models/Partida");
const { CONQUERGAMEPARTIDA } = require("../types/partidaType");

exports.generarPartida = async() => {
    let random = 0;
    let bCumple = false;
    while(!bCumple){
        random = Math.floor(Math.random() * (10000 - 1000) + 1000);
        if(!(await validaPartidaExistente(vResultado.random)) > 0) {
            return random
        }
    }
    return random;
}

const validaPartidaExistente = async(numeroPartida) =>{
    try{
        const partida = await Partida.findOne({
            numeroPartida,
            estatus:{
                $nin:[
                    CONQUERGAMEPARTIDA.FINALIZADO,
                    CONQUERGAMEPARTIDA.CANCELADO
                ]
            }
        });
        if(!partida) {
            return false;
        }
        return true;
    }catch(error){
        return false;
    }
}