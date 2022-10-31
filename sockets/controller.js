let  socketN;
const socketController = (socket) => {
    console.log('jugador conectado',socket.id)
    socketN = socket;
    socket.on('disconnect', () => {
        console.log('Cliente desconectado',socket.id)
    })

    socket.on('enviar-mensaje',(payload) => {
        console.log(payload)
        //socket.broadcast.emit('enviar-mensaje',payload)
    })

}

const enviarMensajeLobby =(numeroPartida) => {
    console.log('partida'+numeroPartida)
    socketN.emit('partida'+numeroPartida,'hola')
    socketN.emit('partida','partida')
    // socketN.broadcast.emit('partida'+numeroPartida,payload)
}

module.exports = {
    socketController,
    enviarMensajeLobby
}