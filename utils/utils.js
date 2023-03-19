
const arregloJugadores = ["O", "B", "R", "P", "G", "Y"];

exports.convertirMongoAJson = (vResultado) => {
    return JSON.parse(JSON.stringify(vResultado));
}

exports.detectarJugador = (posicion) => {
    return arregloJugadores[posicion]
}