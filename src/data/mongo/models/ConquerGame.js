const mongoose = require('mongoose');
const { CONQUERGAMEPARTIDA, ACCIONTIPOJUEGO, JUGADORESARREGLO } = require('../../../../types/conquerGameType');

const ConquerGameSchema = mongoose.Schema({
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
        type: Number,
        required: false,
        emun: [0, 1, 2, 3, 4, 5, 6] //Representa a los 6 jugadores
    },
    ganador: {
        type: String,
        required: false,
        emun: [
            JUGADORESARREGLO[0],
            JUGADORESARREGLO[1],
            JUGADORESARREGLO[2],
            JUGADORESARREGLO[3],
            JUGADORESARREGLO[4],
            JUGADORESARREGLO[5]
        ] //Representa a los 6 jugadores
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
    }
})

ConquerGameSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})


ConquerGameSchema.index({ creadoEl: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('ConquerGame', ConquerGameSchema, 'conquerGame')