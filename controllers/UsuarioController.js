const Usuario = require('../models/Usuario')
const Request = require('./requestController')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

exports.createUsuario =  async (req,res) =>{
    try{
        /*
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        */

        if((await validaUsuario(req.body.usuario,null,req.body.correo)) > 0) {
            throw 'El usuario o el correo ya existe'
        }
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

const validaUsuario = async (usuario,nId,correo) => {
    if(nId === undefined || nId === null){
        return (await Usuario.countDocuments({$or:[{'usuario':usuario},{'correo':correo}]}));
    }else{
        return (await Usuario.countDocuments({'usuario':usuario,'_id':{'$ne':nId}}));
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