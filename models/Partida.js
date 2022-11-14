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
    cantidadJugadores:{
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
    posicionPiezasGlobal:{
        type:Object,
        required:false
    },
    turno:{
        type:Number,
        required:false,
        emun: [0,1,2,3,4,5,6] //Representa a los 6 jugadores
    },
    ganador:{
        type:String,
        required:false,
        emun: ['O','B','R','P'] //Representa a los 6 jugadores
    },
    creadoEl:{
        type:Date,
        required:true,
        default:Date.now
    }
})
PartidaSchema.index({creadoEl: 1},{expireAfterSeconds: 604800});
module.exports = mongoose.model('Partida',PartidaSchema,'partida')