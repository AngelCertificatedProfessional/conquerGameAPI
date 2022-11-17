const Request = require('./requestController')
const Usuarios = require('./UsuarioController')
const Usuario = require('../models/Usuario')
const Partida = require('../models/Partida')
const mongoose = require('mongoose')
const { convertirMongoAJson } = require('../utils/utils')
exports.crearPartida =  async (req,res) =>{
    let nNumeroError = 500;
    let numeroPartida = 0
    try{
        
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        let eliminarPartidaActual = req.body.eliminarUsuarioPartidaActual || false;
        //Se arma segmento para el lado del usuario
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        if(!eliminarPartidaActual && usuario.numeroPartidaActual !== undefined && usuario.numeroPartidaActual !== null){
            if(validaPartidaExistente(usuario.numeroPartidaActual)){
                numeroPartida = usuario.numeroPartidaActual
                nNumeroError = 530;
                throw `Ya tienes una partida en curso, ${usuario.numeroPartidaActual}`    
            }
        }

        const vResultado = {}

        let bCumple = true;
        while(bCumple){
            vResultado.random = Math.floor(Math.random() * (10000 - 1000) + 1000);
            if(!(await validaPartidaExistente(vResultado.random)) > 0) {
                bCumple = false;
            }
        }
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
        usuario.numeroPartidaActual = vResultado.random;
        await usuario.save();
        Request.crearRequest('crearPartida',JSON.stringify(req.body),200);
        return res.json({
            message: 'La partida fue generado exitosamente',
            data:vResultado
        });
    }catch(error){
        Request.crearRequest('crearPartida',JSON.stringify(req.body),nNumeroError,error);
        if(nNumeroError === 530){
            let vResultadoE = {}
            vResultadoE.numeroPartida = numeroPartida;
            vResultadoE.existe = true;
            res.json({
                message: 'La partida ya existe',
                data:vResultadoE
            });
        }else{
            res.status(nNumeroError).json({
                error: 'Algo salio mal',
                data: error.toString(),
            });
        }
        
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

        usuario.numeroPartidaActual = req.params.numeroPartida;
        await usuario.save();

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
        
        if(partida.jugadores.length < partida.cantidadJugadores){
            nNumeroError = 504;
            throw 'No se puede iniciar la partida porque todavia no se a completado la cantidad de jugadores'
        }

        partida.estatus = 2;
        await partida.save()
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

exports.desconectarUsuarioPartida = async (req,res) =>{
    let nNumeroError = 500;
    try{
        console.log('entre')
        // if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
        //     throw "El usuario no tiene derecho a utilizar este metodo"
        // }
        
        // let partida = await Partida.findOne({numeroPartida:req.params.numeroPartida})
        // if(!partida){
        //     nNumeroError = 503;
        //     throw 'No se encontro la partida'
        // }

        // //Se arma segmento para el lado del usuario
        // const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});

        // await Partida.updateOne(
        //     { _id:  req.params.numeroPartida },
        //     {
        //       $pull: { 'jugadores._id': mongoose.Types.ObjectId(usuario._id) },
        //     }
        // );
        // partida = await Partida.findOne({numeroPartida:req.params.numeroPartida})
        // console.log('pase e')
        // enviarMensajeLobby(partida);
        
        // Request.crearRequest('buscarPartida',JSON.stringify(req.body),200);

        return res.json({
            message: 'Partida encontrada.',
            data:"partida.numeroPartida"
        });
    }catch(error){
        Request.crearRequest('buscarPartida',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.salirPartida = async (req,res) =>{
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
        //actualizamos al usuario para que la partida actual sea null
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        usuario.numeroPartidaActual = null;
        await usuario.save();

        await Partida.updateOne(
            { numeroPartida: req.body.numeroPartida},
            {
              $pull: { 'jugadores': {_id:mongoose.Types.ObjectId(usuario._id) }},
            }
        );
        if(partida.jugadores.length === 1 || partida.usuario_id.toString() === usuario._id.toString()){
            //matamos la partida para todos los jugadores en caso de que solo quede un jugador o el creado salga de la partida
            partida.estatus = 5
            await partida.save()
        }
        partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        partida = convertirMongoAJson(partida);
        if(partida.usuario_id.toString() === usuario._id.toString()){
            partida.alfitrion = true;
            partida.nombreUsuario = usuario.usuario;
        }

        req.app.settings.socketIo.emit('partida'+partida.numeroPartida, partida);
        Request.crearRequest('buscarPartida',JSON.stringify(req.body),200);
        return res.json({
            message: 'Partida encontrada.',
            data:"usuario eliminado"
        });
    }catch(error){
        Request.crearRequest('buscarPartida',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}


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

        partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        if(partida.jugadores.filter(x => x.listo === true).length === partida.cantidadJugadores){
            partida.estatus = 3;
            partida.fechaTurno = Date.now();
            await partida.save()
        }else{
            const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
            partida = convertirMongoAJson(partida)
            partida.usuarioListo = usuario.usuario;
            partida.notificarUsuarioListo = true;
        }
        req.app.settings.socketIo.emit('partida'+partida.numeroPartida, partida);
            
        
        Request.crearRequest('agregarPiezasTablero',JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        console.log(error)
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
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }

        //evaluamos si los jugadores todavia poseen sus cuatro reyes
        let arrResultado = Object.keys(req.body.posicionPiezasGlobal).filter(key => key.includes('rey') && req.body.posicionPiezasGlobal[key] !== '')
        
        const vActualizar = {}
        vActualizar.$set = {}
        vActualizar.$set.posicionPiezasGlobal = req.body.posicionPiezasGlobal
        if(req.body.hasOwnProperty('turno')){
            vActualizar.$set.turno = req.body.turno
        }
        if(Object.keys(arrResultado).length == 1){
            vActualizar.$set.estatus = 4
            vActualizar.$set.ganador = arrResultado[0][0]
        }else{
            vActualizar.$set.fechaTurno = Date.now()
        }
        vActualizar.$inc = {}
        vActualizar.$inc.cantidadTurnosPartida = 1
        await Partida.updateOne(
            {
                numeroPartida:req.body.numeroPartida
            }, 
            vActualizar
        );
        partida = convertirMongoAJson(partida)
        //victorio de algun jugador
        if(Object.keys(arrResultado).length == 1){
            partida.estatus = 4;
            partida.ganador = arrResultado[0][0];
            await Usuario.updateMany(
                {
                    numeroPartidaActual:req.body.numeroPartida
                }, 
                { 
                    $set: { 
                        numeroPartidaActual : null
                    },
                }
            );
        }
        
        partida.posicionPiezasGlobal = req.body.posicionPiezasGlobal;
        partida.fechaTurno = Date.now();
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
        const partida = await Partida.findOne({numeroPartida:numeroPartida,estatus:{$nin:[4,5]}});
        if(!partida) {
            return false;
        }
        return true;
    }catch(error){
        return false;
    }
}