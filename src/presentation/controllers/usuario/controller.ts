import { Request, Response } from "express"
import { CustomError } from "../../../domain"
import { AgregarUsuarioInvitado } from "../../../domain/use-cases/usuario"
import { handleError } from "../../handleError/handleError"
import { RevalidarToken } from "../../../domain/use-cases/usuario/revalidarToken"
export class UsuarioController {
    constructor(
    ) { }

    agregarUsuarioInvitado = async (req: Request, res: Response) => {
        const agregarUsuarioInvitado = new AgregarUsuarioInvitado()
        agregarUsuarioInvitado.execute(req.body)
            .then(category => res.status(201).json(category))
            .catch(error => handleError(error, res))
    }

    revalidarToken = async (req: Request, res: Response) => {
        const revalidarToken = new RevalidarToken()
        revalidarToken.execute(req.headers)
            .then(respuesta => res.json(respuesta))
            .catch(error => handleError(error, res))
    }
}












// const { getFuncName } = require("../../../helpers/getFuncName");
// const { crearRequest } = require("../helpers/request");
// const { validaUsuario } = require("../../../helpers/usuario");
// const usuarioModel = require('../../data/mongo/models/Usuario')
// // const Request = require('./requestController')
// const bcrypt = require('bcryptjs');
// const { generarJWT } = require("../../../helpers/jwt");
// const UsuariosBloqueados = require('../models/UsuariosBloqueados');
// const { convertirMongoAJson } = require('../utils/utils');

// const { agregarUsuarioInvitado } = require("../../../domain/use-cases/usuario/agregarUsuarioInvitado");

// exports.agregarUsuarioLocal =  async (req,res) =>{
//     try{
//         await validaUsuario(req.body.usuario,null,req.body.correo)

//         const usuario = new Usuario(req.body)

//         const salt = bcrypt.genSaltSync();
//         usuario.contrasena = bcrypt.hashSync(usuario.contrasena,salt);
//         usuario.rol = 2;
//         const resultado = await usuario.save();

//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);

//         return res.json({
//             message: 'El usuario fue creado exitosamente',
//             data:resultado
//         });
//     }catch(error){
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error.toString()
//         });
//     }
// }

// exports.agregarUsuarioInvitado = (req,res) =>{
//     agregarUsuarioInvitado(req).then(todos => res.json(todos))
//     .catch(error => res.status(400).json({ error }))
// }

// exports.iniciarSecion = async(req,res) => {
//     try{
//         let usuario = await Usuario.findOne({'correo':req.body.correo},{usuario:1,contrasena:1,_id:1,rol:1,invitado:1});
//         if(!usuario) {
//             throw 'El usuario es incorrecto';
//         }
//         usuario = convertirMongoAJson(usuario);
//         usuario.token = Buffer.from(usuario._id.toString()).toString('base64');
//         if(!bcrypt.compareSync(req.body.contrasena, usuario.contrasena)){
//             throw 'El usuario o la contrasena son incorrectas';    
//         }
//         delete usuario["contrasena"];
//         delete usuario["_id"];
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);
//         return res.json({
//             message: 'Envio de iniciar sesion',
//             data:Buffer.from(JSON.stringify(usuario)).toString('base64')
//         });
//     }catch(error){
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }

// const validaSesionUsuario = exports.validaSesionUsuario = async(_id) =>{
//     try{
//         if(!(await Usuario.findOne({_id:Buffer.from(_id, 'base64').toString('ascii')}))) {
//             throw "El usuario no tiene derecho a utilizar este metodo";
//         }
//     }catch(error){
//         throw error.toString();
//     }
// }

// exports.getUsuariobyId = async (req,res) => {
//     try{
//         await validaSesionUsuario(req.headers.authorization)
//         const resultado = await Usuario.findOne({'_id':Buffer.from(req.params._id, 'base64').toString('ascii') },{});
//         resultado.contrasena = '*xEETR05AAS'
//         Request.crearRequest(getFuncName(),JSON.stringify(req.params._id),200);
//         return res.json({
//             message: 'Envio de usuario',
//             data:resultado
//         });
//     }catch(error){
//         Request.crearRequest(getFuncName(),JSON.stringify(req.params._id),500,error.toString());
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }


// exports.actualizarUsuario = async (req,res) => {
//     try{
//         await validaSesionUsuario(req.headers.authorization)
//         if((await validaUsuario(req.body.usuario,req.body._id)) > 0) {
//             throw 'El usuario ya existe'
//         }
//         const usuario = await Usuario.findOne({'_id':req.body._id});
//         usuario.usuario = req.body.usuario;
//         usuario.correo = req.body.correo;
//         usuario.nombre = req.body.nombre;
//         usuario.apellido = req.body.apellido;
//         await usuario.save();

//         const vResultado = {}
//         vResultado.token = Buffer.from(usuario._id.toString()).toString('base64');
//         vResultado.usuario = usuario.usuario
//         vResultado.rol = usuario.rol  
//         vResultado.invitado = usuario.invitado 

//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);
//         return res.json({
//             message: 'Envio de usuario',
//             data:Buffer.from(JSON.stringify(vResultado)).toString('base64')
//         });
//     }catch(error){
//         console.log(error)
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }

// exports.actualizarContrasena = async (req,res) => {
//     try{
//         await validaSesionUsuario(req.headers.authorization)
//         const usuario = await Usuario.findOne({'_id':req.body._id});
//         usuario.contrasena = req.body.contrasena;
//         const salt = bcrypt.genSaltSync();
//         usuario.contrasena = bcrypt.hashSync(usuario.contrasena,salt);
//         const resultado = await usuario.save();
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);
//         return res.json({
//             message: 'Envio de usuario',
//             data:resultado
//         });
//     }catch(error){
//         console.log(error)
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
//         res.status(500).json({
//             error: 'Algo salio mal',
//             data: error
//         });
//     }
// }

// exports.buscar10Mejores =  async (req,res) =>{
//     let nNumeroError = 500;
//     try{
//         await validaSesionUsuario(req.headers.authorization)
//         const usuarios = await Usuario.find({},{usuario:1,puntuaje:1}).sort({"puntuaje":-1}).limit(10)
//         if(!usuarios){
//             nNumeroError = 503;
//             throw 'No se encontro la partida'
//         }
        
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),200);

//         return res.json({
//             message: 'usuarios.',
//             data:usuarios
//         });
//     }catch(error){
//         Request.crearRequest(getFuncName(),JSON.stringify(req.body),500,error.toString());
//         res.status(nNumeroError).json({
//             error: 'Algo salio mal',
//             data: error.toString()
//         });
//     }
// }
