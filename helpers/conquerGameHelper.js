const Partida = require("../models/ConquerGame");
const { CONQUERGAMEPARTIDA } = require("../types/conquerGameType");

exports.generarPartida = async() => {
    let random = 0;
    let bCumple = false;
    while(!bCumple){
        random = Math.floor(Math.random() * (10000 - 1000) + 1000);
        if(!(await validaPartidaExistente(random)) > 0) {
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