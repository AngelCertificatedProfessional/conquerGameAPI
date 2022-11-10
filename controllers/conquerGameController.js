const Request = require('./requestController')
const Usuarios = require('./UsuarioController')
const Usuario = require('../models/Usuario')
const Partida = require('../models/Partida')
const mongoose = require('mongoose')
exports.crearPartida =  async (req,res) =>{
    try{
        
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }

        const vResultado = {}

        let bCumple = true;
        while(bCumple){
            vResultado.random = Math.floor(Math.random() * (10000 - 1000) + 1000);
            if(!(await validaPartidaExistente(vResultado.random)) > 0) {
                bCumple = false;
            }
        }
        //Se arma segmento para el lado del usuario
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});

        //Se arma segmento para el lado de la partida
        const partida = new Partida()
        partida.numeroPartida = vResultado.random;
        partida.usuario_id = usuario._id;
        partida.cantidadJugadores = true;
        partida.tipoJuego = req.body.tipoJuego;
        partida.cantidadJugadores = req.body.cantidadJugadores;
        partida.juego = 1;
        partida.estatus = 1;
        partida.jugadores.push(usuario);
        await partida.save();
        
        Request.crearRequest('crearPartida',JSON.stringify(req.body),200);
        return res.json({
            message: 'La partida fue generado exitosamente',
            data:vResultado
        });
    }catch(error){
        Request.crearRequest('crearPartida',JSON.stringify(req.body),500,error);
        res.status(500).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.buscarPartida =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        const partida = await Partida.findOne({numeroPartida:req.params.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        
        if(partida.jugadores.length >= partida.cantidadJugadores ){
            throw 'Esta sala ya cuenta con la capacidad maxima de jugadores'
        }

        //Se arma segmento para el lado del usuario
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        partida.jugadores.push(usuario);
        await partida.save();

        Request.crearRequest('buscarPartida',JSON.stringify(req.body),200);

        return res.json({
            message: 'Partida encontrada.',
            data:partida.jugadores
        });
    }catch(error){
        Request.crearRequest('buscarPartida',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.buscarEstatusPartida =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        
        const partida = await Partida.findOne({numeroPartida:req.params.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }

        req.app.settings.socketIo.emit('partida'+partida.numeroPartida, partida);
        
        Request.crearRequest('buscarPartida',JSON.stringify(req.body),200);

        return res.json({
            message: 'Partida encontrada.',
            data:partida.numeroPartida
        });
    }catch(error){
        Request.crearRequest('buscarPartida',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.mostrarTablero =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        
        const partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        
        partida.estatus = 2;
        partida.save()
        req.app.settings.socketIo.emit('partida'+partida.numeroPartida, partida);
        
        Request.crearRequest('mostrarTablero',JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        Request.crearRequest('mostrarTablero',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

// exports.desconectarUsuarioPartida = async (req,res) =>{
//     let nNumeroError = 500;
//     try{
//         if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
//             throw "El usuario no tiene derecho a utilizar este metodo"
//         }
        
//         let partida = await Partida.findOne({numeroPartida:req.params.numeroPartida})
//         if(!partida){
//             nNumeroError = 503;
//             throw 'No se encontro la partida'
//         }

//         //Se arma segmento para el lado del usuario
//         const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});

//         await Partida.updateOne(
//             { _id:  req.params.numeroPartida },
//             {
//               $pull: { 'jugadores._id': mongoose.Types.ObjectId(usuario._id) },
//             }
//         );
//         partida = await Partida.findOne({numeroPartida:req.params.numeroPartida})
//         console.log('pase e')
//         enviarMensajeLobby(partida);
        
//         Request.crearRequest('buscarPartida',JSON.stringify(req.body),200);

//         return res.json({
//             message: 'Partida encontrada.',
//             data:partida.numeroPartida
//         });
//     }catch(error){
//         Request.crearRequest('buscarPartida',JSON.stringify(req.body),nNumeroError,error);
//         res.status(nNumeroError).json({
//             error: 'Algo salio mal',
//             data: error.toString()
//         });
//     }
// }

exports.agregarPiezasTablero =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        
        let partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        await Partida.updateOne(
            {
                numeroPartida:req.body.numeroPartida,
                'jugadores._id':new mongoose.Types.ObjectId(Buffer.from(req.headers.authorization, 'base64').toString('ascii'))
            }, 
            { 
                $set: { 
                    "jugadores.$.posicionPiezasJugador" : req.body.piezas,
                    "jugadores.$.listo" : true
                }
            }
        );

        if(partida.jugadores.filter(x => x.listo === true).length +1 === partida.cantidadJugadores){
            partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
            partida.estatus = 3;
            partida.save()
            req.app.settings.socketIo.emit('partida'+partida.numeroPartida, partida);
        }
            
        
        Request.crearRequest('agregarPiezasTablero',JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        Request.crearRequest('agregarPiezasTablero',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}


exports.actualizarPiezasPosicionJuego =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        
        let partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        console.log('entre')
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        console.log(req.body.posicionPiezasGlobal)
        await Partida.updateOne(
            {
                numeroPartida:req.body.numeroPartida
            }, 
            { 
                $set: { 
                    posicionPiezasGlobal : req.body.posicionPiezasGlobal,
                    turno: req.body.turno
                }
            }
        );
        partida.posicionPiezasGlobal = req.body.posicionPiezasGlobal;
        partida.turno = req.body.turno;
        req.app.settings.socketIo.emit('partida'+partida.numeroPartida, partida);    
        
        Request.crearRequest('actualizarPiezasPosicionJuego',JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        Request.crearRequest('actualizarPiezasPosicionJuego',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

const validaPartidaExistente = async(numeroPartida) =>{
    try{
        const partida = await Partida.findOne({numeroPartida:numeroPartida,estatus:{$ne:3}});
        if(!partida) {
            return false;
        }
        return true;
    }catch(error){
        return false;
    }
}