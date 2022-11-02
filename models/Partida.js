const mongoose = require('mongoose')

const PartidaSchema = mongoose.Schema({
    numeroPartida:{
        type:Number,
        required: [true,'El numero de la partida es automaticva'],
    },
    usuario_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usuarios'
    },
    catidadJugadores:{
        type:Number,
        required:true,
    },
    tipoJuego:{
        type:Number,
        required:true,
        emun: [1,2]
    },
    juego:{
        type:Number,
        required:true,
        emun: [1]
    },
    jugadores:{
        type:Array,
        required:true
    },
    estatus:{
        type:Number,
        required:true,
        emun: [1,2,3,4] //1. Buscando jugadores,2. Agregar piezas Tablero. 3.Juego Iniciado
    },

})

module.exports = mongoose.model('Partida',PartidaSchema,'partida')