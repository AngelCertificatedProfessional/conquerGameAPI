const mongoose = require('mongoose')

const PartidaSchema = mongoose.Schema({
    numeroPartida:{
        type:Number,
        required: [true,'El numero de la partida es automaticva'],
    },
    activa:{
        type:Boolean,
        required: [true,'La patida debe o no estar activa'],
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
    }
})

module.exports = mongoose.model('Partida',PartidaSchema,'partida')