import mongoose from 'mongoose'

const { CONQUERGAMEPARTIDA, ACCIONTIPOJUEGO, JUGADORESARREGLO } = require('../../../infraestructure/types/conquerGame.type');

const ConquerGameSchema = new mongoose.Schema({
    numeroPartida: {
        type: Number,
        required: [true, 'El numero de la partida es automaticva'],
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    cantidadJugadores: {
        type: Number,
        required: true,
    },
    tipoJuego: {
        type: Number,
        required: true,
        emun: [ACCIONTIPOJUEGO.INIDIVIDUAL, ACCIONTIPOJUEGO.EQUIPO]
    },
    jugadores: {
        type: Array,
        required: true
    },
    estatus: {
        type: Number,
        required: true,
        emun: [
            CONQUERGAMEPARTIDA.LOBBY,
            CONQUERGAMEPARTIDA.AGREGARPIEZASTABLERO,
            CONQUERGAMEPARTIDA.JUEGOINICIADO,
            CONQUERGAMEPARTIDA.FINALIZADO,
            CONQUERGAMEPARTIDA.CANCELADO
        ] //1. Buscando jugadores,2. Agregar piezas Tablero. 3.Juego Iniciado 4. Finalizado 5.cancelado
    },
    posicionPiezasGlobal: {
        type: Object,
        required: false
    },
    turno: {
        type: String,
        required: false,
        emun: JUGADORESARREGLO //Representa a los 6 jugadores
    },
    ganador: {
        type: String,
        required: false,
        emun: JUGADORESARREGLO //Representa a los 6 jugadores
    },
    creadoEl: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaTurno: {
        type: Date,
        required: false
    },
    cantidadTurnosPartida: {
        type: Number,
        required: false
    },
    historialJugadores: {
        type: Array,
        required: false
    },
    reyesVivos: {
        type: Array,
        required: false
    }
})

ConquerGameSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    }
})


ConquerGameSchema.index({ creadoEl: 1 }, { expireAfterSeconds: 604800 });
export const ConquerGameModel = mongoose.model('ConquerGame', ConquerGameSchema, 'conquerGame')