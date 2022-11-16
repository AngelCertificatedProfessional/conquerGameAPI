const { desconectarJugador } = require("../controllers/conquerGameController")

// let  socketN;
const socketController = (socket) => {
    console.log('jugador conectado',socket.id)
    // socketN = socket;
    socket.on('disconnect', () => {
        console.log('Cliente desconectado',socket.id)
    })

    socket.on('juego-desconectado',(payload) => {
        desconectarJugador(payload)
    })
}

module.exports = {
    socketController
}