// let  socketN;
const socketController = (socket) => {
    console.log('Jugador conectado',socket.id)
    // socketN = socket;
    socket.on('disconnect', () => {
        console.log('Jugador desconectado',socket.id)
    })
}

module.exports = {
    socketController
}