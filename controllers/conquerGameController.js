const Request = require('./requestController')
const Usuarios = require('./UsuarioController')
const Usuario = require('../models/Usuario')
exports.crearPartida =  async (req,res) =>{
    try{
        
        
        if(!await Usuarios.validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }

        const vResultado = {}
        vResultado.random = Math.floor(Math.random() * 10000) + 1000;
        
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        usuario.partidas.push(vResultado.random);
        await usuario.save();


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
