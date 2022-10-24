const Usuario = require('../models/Usuario')
const Request = require('./requestController')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

exports.createUsuario =  async (req,res) =>{
    try{
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        if((await validaUsuario(req.body.usuario)) > 0) {
            throw 'El usuario ya existe'
        }
        const usuario = new Usuario(req.body)
        //Hasheamos el password
        usuario.contrasena = bcrypt.hashSync(usuario.contrasena,bcrypt.genSaltSync(10));
        usuario.creadoPor =Buffer.from(req.headers.authorization, 'base64').toString('ascii');
        
        const resultado = await usuario.save();

        Request.crearRequest('createUsuario',JSON.stringify(req.body),200);

        return res.json({
            message: 'El usuario fue creado exitosamente',
            data:resultado
        });
    }catch(error){
        Request.crearRequest('createUsuario',JSON.stringify(req.body),500,error);
        res.status(500).json({
            error: 'Algo salio mal',
            data: error
        });
    }
}

// exports.listadoUsuario = async (req,res) => {
//     try{
//         if(!await validaSesionUsuario(req.headers.authorization)){
//             throw "El usuario no tiene derecho a utilizar este metodo"
//         }
//         const resultado = await Usuario.aggregate([
//             {
//                 $project:{
//                     usuario:1
//                 }
//             }
//         ]
//         )
//         Request.crearRequest('listadoUsuario','',200);
//         return res.json({
//             message: 'Envio de usuarios',
//             data:resultado
//         });
//     }catch(error){
//         Request.crearRequest('listadoUsuario','',500,error);
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }

// exports.getUsuariobyId = async (req,res) => {
//     try{
//         if(!await validaSesionUsuario(req.headers.authorization)){
//             throw "El usuario no tiene derecho a utilizar este metodo"
//         }
//         const resultado = await Usuario.findOne({'_id':req.params._id},{_id:1,usuario:1,contrasena:'',nombre:1,apellido:1,tipoUsuario:1,creado:1});
//         Request.crearRequest('getUsuariobyId',JSON.stringify(req.params._id),200);
//         return res.json({
//             message: 'Envio de universidad',
//             data:resultado
//         });
//     }catch(error){
//         Request.crearRequest('getUsuariobyId',JSON.stringify(req.params._id),500,error);
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }

// exports.actualizarUsuario = async (req,res) => {
//     try{
//         if(!await validaSesionUsuario(req.headers.authorization)){
//             throw "El usuario no tiene derecho a utilizar este metodo"
//         }
//         if((await validaUsuario(req.body.usuario,req.body._id)) > 0) {
//             throw 'El usuario ya existe'
//         }
//         const usuario = await Usuario.findOne({'_id':req.body._id});
//         usuario.usuario = req.body.usuario;
//         usuario.nombre = req.body.nombre;
//         usuario.apellido = req.body.apellido;
//         usuario.tipoUsuario = req.body.tipoUsuario;
//         const resultado = await usuario.save();
//         Request.crearRequest('actualizarUsuario',JSON.stringify(req.body),200);
//         return res.json({
//             message: 'Envio de usuario',
//             data:resultado
//         });
//     }catch(error){
//         console.log(error)
//         Request.crearRequest('actualizarUsuario',JSON.stringify(req.body),500,error);
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }


// exports.actualizarContrasena = async (req,res) => {
//     try{
//         if(!await validaSesionUsuario(req.headers.authorization)){
//             throw "El usuario no tiene derecho a utilizar este metodo"
//         }
//         const usuario = await Usuario.findOne({'_id':req.body._id});
//         usuario.contrasena = bcrypt.hashSync(usuario.contrasena,bcrypt.genSaltSync(10));
//         const resultado = await usuario.save();
//         Request.crearRequest('actualizarContrasena',JSON.stringify(req.body),200);
//         return res.json({
//             message: 'Envio de temaCurso',
//             data:resultado
//         });
//     }catch(error){
//         console.log(error)
//         Request.crearRequest('actualizarContrasena',JSON.stringify(req.body),500,error);
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }

// const validaUsuario = async (usuario,nId) => {
//     if(nId === undefined){
//         return (await Usuario.countDocuments({'usuario':usuario}));
//     }else{
//         return (await Usuario.countDocuments({'usuario':usuario,'_id':{'$ne':nId}}));
//     }

// }


// exports.iniciarSecion = async(req,res) => {
//     try{
//         let usuario = await Usuario.findOne({'usuario':req.body.usuario},{usuario:1,contrasena:1,_id:1,tipoUsuario:1});
//         if(!usuario) {
//             throw 'El usuario es incorrecto';
//         }
//         usuario = JSON.parse(JSON.stringify(usuario));
//         usuario.token = Buffer.from(usuario._id.toString()).toString('base64');
//         if(!bcrypt.compareSync(req.body.contrasena, usuario.contrasena)){
//             throw 'El usuario o la contrasena son incorrectas';    
//         }
//         delete usuario["contrasena"];
//         delete usuario["_id"];
//         return res.json({
//             message: 'Envio de iniciar sesion',
//             data:Buffer.from(JSON.stringify(usuario)).toString('base64')
//         });
//     }catch(error){
//         console.log(error)
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }

// const validaSesionUsuario = exports.validaSesionUsuario = async(_id) =>{
//     try{
//         const _idUsuario = Buffer.from(_id, 'base64').toString('ascii');
//         const usuario = await Usuario.findOne({_id:_idUsuario});
//         if(!usuario) {
//             return false;
//         }
//         return true;
//     }catch(error){
//         return false;
//     }
// }