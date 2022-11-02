const Request = require('./requestController')
const Usuarios = require('./UsuarioController')
const Usuario = require('../models/Usuario')
const Partida = require('../models/Partida')
const { enviarMensajeLobby } = require('../sockets/controller')
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
        partida.catidadJugadores = true;
        partida.tipoJuego = req.body.tipoJuego;
        partida.catidadJugadores = req.body.catidadJugadores;
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
        console.log(req.params.numeroPartida)
        const partida = await Partida.findOne({numeroPartida:req.params.numeroPartida})
        if(!partida){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        
        //Se arma segmento para el lado del usuario
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        partida.jugadores.push(usuario);
        await partida.save();

        Request.crearRequest('buscarPartida',JSON.stringify(req.body),200);

        enviarMensajeLobby(req.params.numeroPartida)

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
        enviarMensajeLobby(partida);
        
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

exports.agregarPiezasTablero =  async (req,res) =>{
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
        enviarMensajeLobby(partida)
        
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