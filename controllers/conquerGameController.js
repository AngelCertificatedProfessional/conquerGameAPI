const Request = require('./requestController')
const Usuarios = require('./UsuarioController')
const Usuario = require('../models/Usuario')
const Partida = require('../models/Partida')
const mongoose = require('mongoose')
const socket = require('../sockets/controller').socket;
const { convertirMongoAJson, detectarJugador, getFuncName } = require('../utils/utils')

exports.crearPartida =  async (req,res) =>{
    let nNumeroError = 500;
    let numeroPartida = 0
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        let eliminarPartidaActual = req.body.eliminarUsuarioPartidaActual || false;
        //Se arma segmento para el lado del usuario
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        if(!eliminarPartidaActual && usuario.numeroPartidaActual !== undefined && usuario.numeroPartidaActual !== null){
            if((await validaPartidaExistente(usuario.numeroPartidaActual))){
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
        partida.jugadores.push({...convertirMongoAJson(usuario),turno:detectarJugador(partida.jugadores.length)});  
        usuario.numeroPartidaActual = vResultado.random;
        
        await Promise.all([
            partida.save(),
            usuario.save()
        ]);

        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);
        return res.json({
            message: 'La partida fue generado exitosamente',
            data:vResultado
        });
    }catch(error){
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
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
    let numeroPartidaAc = 0
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        const partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        
        //Se arma segmento para el lado del usuario
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        //si el usuario ya pertenece a esta partida le regresamos la informacion
        if(parseInt(req.body.numeroPartida) === usuario.numeroPartidaActual){
            return res.json({
                message: 'Partida encontrada.',
                data:partida.jugadores
            });
        }

        //Se valida que el usuario no este en otra partida
        let eliminarPartidaActual = req.body.eliminarUsuarioPartidaActual || false;
        if(!eliminarPartidaActual && usuario.numeroPartidaActual !== undefined && usuario.numeroPartidaActual !== null){
            if((await validaPartidaExistente(usuario.numeroPartidaActual))){
                numeroPartidaAc = usuario.numeroPartidaActual
                nNumeroError = 530;
                throw `Ya tienes una partida en curso, ${usuario.numeroPartidaActual}`    
            }
        }

        if(partida.jugadores.length >= partida.cantidadJugadores){
            throw 'Esta sala ya cuenta con la capacidad maxima de jugadores'
        }
        partida.jugadores.push({...convertirMongoAJson(usuario),turno:detectarJugador(partida.jugadores.length)});  
        usuario.numeroPartidaActual = req.body.numeroPartida;
        await Promise.all([
            partida.save(),
            usuario.save()
        ]);

        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);
        return res.json({
            message: 'Partida encontrada.',
            data:partida.jugadores
        });
    }catch(error){
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
        if(nNumeroError === 530){
            let vResultadoE = {}
            vResultadoE.numeroPartida = numeroPartidaAc;
            vResultadoE.existe = true;
            res.json({
                message: 'La partida ya existe',
                data:vResultadoE
            });
        }else{
            res.status(nNumeroError).json({
                error: 'Algo salio mal',
                data: error.toString()
            });
        }
    }
}

exports.buscarEstatusPartida =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        const partida = await Partida.findOne({numeroPartida:req.params.numeroPartida},{ _id:1,jugadores:1,creadoEl:1,numeroPartida:1,usuario_id:1,
            cantidadJugadores:1,tipoJuego:1,juego:1,estatus:1,fechaTurno:1,posicionPiezasGlobal:1,cantidadTurnosPartida:1,turno:1,ganador:1,historialJugadores: {$slice: -10}})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }

        socket.io.emit('partida'+partida.numeroPartida, partida);
        
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);
        return res.json({
            message: 'Partida encontrada.',
            data:partida.numeroPartida
        });
    }catch(error){
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.buscarPartidas =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        const partida = await Partida.find({estatus:1})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);

        return res.json({
            message: 'Partidas.',
            data:partida
        });
    }catch(error){
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}


exports.mostrarTablero =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
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
        socket.io.emit('partida'+partida.numeroPartida, partida);
        
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
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
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.salirPartida = async (req,res) =>{
    let nNumeroError = 500;
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        let partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        //actualizamos al usuario para que la partida actual sea null
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        usuario.numeroPartidaActual = null;
        

        await Promise.all([
            usuario.save(),
            Partida.updateOne(
                { numeroPartida: req.body.numeroPartida},
                {
                    $pull: { 'jugadores': {_id:mongoose.Types.ObjectId(usuario._id) }},
                }
            )
        ]);

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

        socket.io.emit('partida'+partida.numeroPartida, partida);
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);
        return res.json({
            message: 'Partida encontrada.',
            data:"usuario eliminado"
        });
    }catch(error){
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}


exports.agregarPiezasTablero =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        let partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        await Partida.updateOne(
            {
                numeroPartida:req.body.numeroPartida,
                'jugadores._id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')
            }, 
            { 
                $set: { 
                    "jugadores.$.posicionPiezasJugador" : req.body.piezas,
                    "jugadores.$.listo" : true
                }
            }
        );

        partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        partida.posicionPiezasGlobal = {}
        for(let i=0;i<partida.jugadores.length;i++){
            Object.assign(partida.posicionPiezasGlobal,partida.jugadores[i].posicionPiezasJugador)
        }
        //en este segmento se verifica si todos los usuarios seleccionaron la opcion de aceptar o no
        //en caso de que si se inicia la partida caso contrario se notifica a los usuarios que un usuario esta listo
        if(partida.jugadores.filter(x => x.listo === true).length === partida.cantidadJugadores){
            partida.estatus = 3;
            partida.fechaTurno = Date.now();
            await partida.save()
        }else{
            await partida.save()
            const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
            partida = convertirMongoAJson(partida)
            partida.usuarioListo = usuario.usuario;
            partida.notificarUsuarioListo = true;
        }
        socket.io.emit('partida'+partida.numeroPartida, partida);
            
        
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        console.log(error)
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}


exports.agregarPiezaTablero =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        let partida = await Partida.findOne({numeroPartida:req.body.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        const partidaT = convertirMongoAJson(partida);
        if(!partidaT.hasOwnProperty('posicionPiezasGlobal')){
            partidaT.posicionPiezasGlobal = {}
            partida.posicionPiezasGlobal = {}
        }
        partidaT.posicionPiezasGlobal[req.body.piezasId] = req.body.posicion;
        partida.posicionPiezasGlobal = partidaT.posicionPiezasGlobal
        await partida.save()

        socket.io.emit('partida'+partida.numeroPartida, partida);
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.actualizarPiezasPosicionJuego =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        await Usuarios.validaSesionUsuario(req.headers.authorization)
        let partida = await Partida.findOne({numeroPartida:req.body.numeroPartida},{ _id:1,jugadores:1,creadoEl:1,numeroPartida:1,usuario_id:1,
            cantidadJugadores:1,tipoJuego:1,juego:1,estatus:1,fechaTurno:1,posicionPiezasGlobal:1,cantidadTurnosPartida:1,turno:1,ganador:1,historialJugadores: {$slice: -10}})
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
        vActualizar.$push = {}
        vActualizar.$push.historialJugadores= req.body.accionUsuario ;
        await Usuario.updateOne(
            {
                _id:Buffer.from(req.headers.authorization, 'base64').toString('ascii')
            }, 
            {
                $inc:{
                    "puntuaje":req.body.puntuaje
                }
            }
        );
        //Condicion para detectar que un jugador o un grupo de jugadores gano el juego
        //Si se detecta que solo hay un jugador
        if(Object.keys(arrResultado).length === 1 || 
            //Si el tipo de partida es en equipo
            (partida.tipoJuego === 2 && 
            //Se evalua la cntidad de jugadores y si quedan es de dos jugadores
            ((partida.cantidadJugadores === 4 && Object.keys(arrResultado).length === 2 &&
            //Si la partida se detecta que los ultimos dos valores son orange y black o red y purple entonces se decide el ganador 
            ((arrResultado[0][0] === "O" && arrResultado[1][0] ==="B") ||
            (arrResultado[0][0] === "R" && arrResultado[1][0] ==="P"))) ||
            //segmento de evaluacion de 6 jugadores 
            (partida.cantidadJugadores === 6 && ((Object.keys(arrResultado).length === 3 &&
            //Si el tipo de partida es en equipo
            //Si la partida se detecta que los ultimos dos valores son orange y black o red y purple entonces se decide el ganador 
            ((arrResultado[0][0] === "O" && arrResultado[1][0] ==="B" && arrResultado[2][0] ==="R") || 
            (arrResultado[0][0] === "P" && arrResultado[1][0] ==="G" && arrResultado[2][0] ==="Y"))) || 
            (Object.keys(arrResultado).length === 2 && 
            ((arrResultado[0][0] === "O" && arrResultado[1][0] === "B") || (arrResultado[0][0] === "O" && arrResultado[1][0] ==="R") || (arrResultado[0][0] === "B" && arrResultado[1][0] === "R") ||
            (arrResultado[0][0] === "P" && arrResultado[1][0] === "G") || (arrResultado[0][0] === "P" && arrResultado[1][0] ==="Y") || (arrResultado[0][0] === "G" && arrResultado[1][0] === "Y")))))))) {
                vActualizar.$set.estatus = 4
                if ( Object.keys(arrResultado).length === 1){
                    vActualizar.$set.ganador = arrResultado[0][0];
                }else if(Object.keys(arrResultado).length === 2){
                    vActualizar.$set.ganador = arrResultado[0][0] +" " +arrResultado[1][0];    
                }else{
                    vActualizar.$set.ganador = arrResultado[0][0] +" " +arrResultado[1][0] + " "+arrResultado[2][0];    
                }
                const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
                vActualizar.$push = {}
                vActualizar.$push.historialJugadores = "Victoria del jugador "+usuario.usuario;
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
        partida = await Partida.findOne({numeroPartida:req.body.numeroPartida},{ _id:1,jugadores:1,creadoEl:1,numeroPartida:1,usuario_id:1,
            cantidadJugadores:1,tipoJuego:1,juego:1,estatus:1,fechaTurno:1,posicionPiezasGlobal:1,cantidadTurnosPartida:1,turno:1,ganador:1,historialJugadores: {$slice: -10}})
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
        partida.jugadorPiezaEliminada = req.body.jugadorPiezaEliminada
        partida.jugadorEliminoPieza = req.body.jugadorEliminoPieza
        socket.io.emit('partida'+partida.numeroPartida, partida);    
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);

        return res.json({
            message: 'Agregar configurtacion partida.',
            data:partida.numeroPartida
        });
    }catch(error){
        console.log(error)
        Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
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
