
const arregloJugadores = ["O", "B", "R", "P", "G", "Y"];

exports.convertirMongoAJson = (vResultado) => {
    return JSON.parse(JSON.stringify(vResultado));
}

exports.detectarJugador = (posicion) => {
    return arregloJugadores[posicion]
}

exports.getFuncName = () => {
    return [new Error().stack.split("\n")[2].split(" ")[5],new Error().stack.split("\n")[2].split(" ")[6]];
}