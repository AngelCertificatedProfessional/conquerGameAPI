const Usuario = require('../models/Usuario')
const Request = require('./requestController')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const UsuariosBloqueados = require('../models/UsuariosBloqueados');

exports.createUsuario =  async (req,res) =>{
    try{
        /*
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        */

        await validaUsuario(req.body.usuario,null,req.body.correo)

        const usuario = new Usuario(req.body)

        const salt = bcrypt.genSaltSync();
        usuario.contrasena = bcrypt.hashSync(usuario.contrasena,salt);
        usuario.rol = 2;
        const resultado = await usuario.save();

        Request.crearRequest('createUsuario',JSON.stringify(req.body),200);

        return res.json({
            message: 'El usuario fue creado exitosamente',
            data:resultado
        });
    }catch(error){
        Request.crearRequest('createUsuario',JSON.stringify(req.body),500,error.toString());
        res.status(500).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

//Validaremos que el usuario no pueda registrarse repetidas veces como tambien que no utilize nombres inpropios
const validaUsuario = async (usuario,nId,correo) => {
    if(nId === undefined || nId === null){
        let nCantidadRegistros = await Usuario.countDocuments({$or:[{'usuario':{'$regex':usuario,"$options" : "i"}},{'correo':{'$regex':correo,"$options" : "i"}}]});
        console.log(nCantidadRegistros)
        if(nCantidadRegistros >= 1){
            throw 'El usuario o el correo ya existe'
        }

        let usuariosBloqueados = await UsuariosBloqueados.find({});

        let nValor = usuariosBloqueados.findIndex(obj => 
            (obj.usuario).toUpperCase()===usuario.toUpperCase() || 
            (obj.usuario).toUpperCase().replace(' ','') === usuario.toUpperCase() ||
            (obj.usuario).toUpperCase().replace(' ','_') === usuario.toUpperCase() || 
            usuario.toUpperCase().includes((obj.usuario).toUpperCase()));

        if(nValor !== -1){
            throw `El usuario ${usuario} no puede ser creado en nuestro sistema por su nombre, favor de cambiarlo por favor` 
        }

        console.log(usuariosBloqueados)
        throw 'error voluntario'
        // nCantidadRegistros = await UsuariosBloqueados.countDocuments({$or:[{'usuario':usuario}]})
        // if(nCantidadRegistros >= 0){
        //     
        // }
    }else{
        let nCantidadRegistros = await Usuario.countDocuments({'usuario':usuario,'_id':{'$ne':nId}})
        if(nCantidadRegistros >= 1){
            throw 'El usuario o el correo ya existe'
        }
    }
}

exports.iniciarSecion = async(req,res) => {
    try{
        
        let usuario = await Usuario.findOne({'correo':req.body.correo},{usuario:1,contrasena:1,_id:1,rol:1});
        if(!usuario) {
            throw 'El usuario es incorrecto';
        }
        usuario = JSON.parse(JSON.stringify(usuario));
        usuario.token = Buffer.from(usuario._id.toString()).toString('base64');
        if(!bcrypt.compareSync(req.body.contrasena, usuario.contrasena)){
            throw 'El usuario o la contrasena son incorrectas';    
        }
        delete usuario["contrasena"];
        delete usuario["_id"];
        return res.json({
            message: 'Envio de iniciar sesion',
            data:Buffer.from(JSON.stringify(usuario)).toString('base64')
        });
    }catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Algo salio mal',
            data: error
        });
    }
}

const validaSesionUsuario = exports.validaSesionUsuario = async(_id) =>{
    try{
        const _idUsuario = Buffer.from(_id, 'base64').toString('ascii');
        const usuario = await Usuario.findOne({_id:_idUsuario});
        if(!usuario) {
            return false;
        }
        return true;
    }catch(error){
        return false;
    }
}