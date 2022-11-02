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

const enviarMensajeLobby =(vResultado) => {
    //console.log('entre')
    socketN.emit('partida'+vResultado.numeroPartida,vResultado)
}

module.exports = {
    socketController,
    enviarMensajeLobby
}