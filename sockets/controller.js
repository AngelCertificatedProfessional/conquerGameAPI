// let  socketN;
const socketController = (socket) => {
    console.log('jugador conectado',socket.id)
    // socketN = socket;
    socket.on('disconnect', () => {
        console.log('Cliente desconectado',socket.id)
    })

    // socket.on('enviar-mensaje',(payload) => {
    //     let vResultado = {};
    //     vResultado.estatus = 6
    //     vResultado.numeroPartida = payload.numeroPartida;
    //     socket.emit('partida'+vResultado.numeroPartida,vResultado)
    //     socket.broadcast.emit('partida'+vResultado.numeroPartida,vResultado)
    // })

}

module.exports = {
    socketController
}