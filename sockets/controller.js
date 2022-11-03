// let  socketN;
const socketController = (socket) => {
    console.log('jugador conectado',socket.id)
    // socketN = socket;
    socket.on('disconnect', () => {
        console.log('Cliente desconectado',socket.id)
    })

    socket.on('enviar-mensaje',(payload) => {
        console.log(payload)
        let vResultado = {};
        vResultado.estatus = 6
        vResultado.numeroPartida = payload.numeroPartida;
        io.sockets.emit('partida'+vResultado.numeroPartida,vResultado)
        socket.broadcast.emit('partida'+vResultado.numeroPartida,vResultado)
    })

}

// const enviarMensajeLobby =(vResultado) => {
//     console.log('entre'+'partida'+vResultado.numeroPartida)
//     socketN.emit('partida'+vResultado.numeroPartida,vResultado)
// }

const enviarMensajeLobby =(vResultado) => {
}

module.exports = {
    socketController,
    enviarMensajeLobby
}