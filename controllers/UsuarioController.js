const Usuario = require('../models/Usuario')
const Request = require('./requestController')
const bcrypt = require('bcryptjs');
const UsuariosBloqueados = require('../models/UsuariosBloqueados');
const { convertirMongoAJson } = require('../utils/utils');

exports.agregarUsuarioLocal =  async (req,res) =>{
    try{
        await validaUsuario(req.body.usuario,null,req.body.correo)

        const usuario = new Usuario(req.body)

        const salt = bcrypt.genSaltSync();
        usuario.contrasena = bcrypt.hashSync(usuario.contrasena,salt);
        usuario.rol = 2;
        const resultado = await usuario.save();

        Request.crearRequest('agregarUsuarioLocal',JSON.stringify(req.body),200);

        return res.json({
            message: 'El usuario fue creado exitosamente',
            data:resultado
        });
    }catch(error){
        Request.crearRequest('agregarUsuarioLocal',JSON.stringify(req.body),500,error.toString());
        res.status(500).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.agregarUsuarioInvitado =  async (req,res) =>{
    try{

        const vResultado = {}

        let bCumple = true;
        while(bCumple){
            vResultado.random = Math.floor(Math.random() * (10000 - 1000) + 1000);
            let usuarioInvitado = 'invitado'+vResultado.random
            let correoInvitado = 'invitado'+vResultado.random
            if(!(await validaUsuario(usuarioInvitado,null,correoInvitado)) > 0) {
                bCumple = false;
            }
        }
        const usuario = new Usuario()
        usuario.correo = 'invitado'+vResultado.random
        usuario.usuario = 'invitado'+vResultado.random
        usuario.contrasena = 'invitado'+vResultado.random
        usuario.nombre = 'invitado'+vResultado.random;
        usuario.apellido = 'invitado'+vResultado.random;
        usuario.aceptoTerminosYCondiciones = true;
        usuario.invitado = true;
        const salt = bcrypt.genSaltSync();
        usuario.contrasena = bcrypt.hashSync(usuario.contrasena,salt);
        usuario.rol = 2;
        const resultado = await usuario.save();
        resultado.contrasena = 'invitado'+vResultado.random
        Request.crearRequest('generarUsuarioInvitado',JSON.stringify(req.body),200);

        return res.json({
            message: 'El usuario fue creado exitosamente',
            data:resultado
        });
    }catch(error){
        Request.crearRequest('generarUsuarioInvitado',JSON.stringify(req.body),500,error.toString());
        res.status(500).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

//Validaremos que el usuario no pueda registrarse repetidas veces como tambien que no utilize nombres inpropios
const validaUsuario = async (usuario,nId,correo) => {
    if(nId === undefined || nId === null){
        const usuarioT = "^"+usuario+"$"
        const correoT = "^"+correo+"$"
        let nCantidadRegistros = await Usuario.countDocuments({$or:[{'usuario':{'$regex':usuarioT,"$options" : "i"}},{'correo':{'$regex':correoT,"$options" : "i"}}]});
        if(nCantidadRegistros >= 1){
            throw 'El usuario o el correo ya existe'
        }

        let usuariosBloqueados = await UsuariosBloqueados.find({});
        usuariosBloqueados = convertirMongoAJson(usuariosBloqueados)
        let nValor = usuariosBloqueados.findIndex(obj => 
            (obj.usuario).toUpperCase()===usuario.toUpperCase() || 
            (obj.usuario).toUpperCase()===usuario.toUpperCase().replace('1','I') || 
            (obj.usuario).toUpperCase()===usuario.toUpperCase().replace('3','E') || 
            (obj.usuario).toUpperCase()===usuario.toUpperCase().replace('@','A') || 
            (obj.usuario).toUpperCase()===usuario.toUpperCase().replace('0','O') || 
            (obj.usuario).toUpperCase().replace(' ','') === usuario.toUpperCase() ||
            (obj.usuario).toUpperCase().replace(' ','_') === usuario.toUpperCase() || 
            (usuario.toUpperCase().includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('1','I').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('3','E').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('@','A').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)) ||
            (usuario.toUpperCase().replace('0','O').includes((obj.usuario).toUpperCase()) && (obj.ignorarInclude === undefined || !obj.ignorarInclude)));
        if(nValor !== -1){
            throw `El usuario ${usuario} no puede ser creado en nuestro sistema por su nombre, favor de cambiarlo por favor` 
        }
    }else{
        let nCantidadRegistros = await Usuario.countDocuments({'usuario':usuario,'_id':{'$ne':nId}})
        if(nCantidadRegistros >= 1){
            throw 'El usuario o el correo ya existe'
        }
    }
}

exports.iniciarSecion = async(req,res) => {
    try{
        
        let usuario = await Usuario.findOne({'correo':req.body.correo},{usuario:1,contrasena:1,_id:1,rol:1,invitado:1,meme:1});
        if(!usuario) {
            throw 'El usuario es incorrecto';
        }
        usuario = convertirMongoAJson(usuario);
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

exports.getUsuariobyId = async (req,res) => {
    try{
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        const resultado = await Usuario.findOne({'_id':Buffer.from(req.params._id, 'base64').toString('ascii') },{});
        resultado.contrasena = '*xEETR05AAS'
        Request.crearRequest('getUsuariobyId',JSON.stringify(req.params._id),200);
        return res.json({
            message: 'Envio de usuario',
            data:resultado
        });
    }catch(error){
        Request.crearRequest('getUsuariobyId',JSON.stringify(req.params._id),500,error);
        res.status(500).json({
            error: 'Algo salio mal',
            data: error
        });
    }
}


exports.actualizarUsuario = async (req,res) => {
    try{
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        if((await validaUsuario(req.body.usuario,req.body._id)) > 0) {
            throw 'El usuario ya existe'
        }
        const usuario = await Usuario.findOne({'_id':req.body._id});
        usuario.usuario = req.body.usuario;
        usuario.correo = req.body.correo;
        usuario.nombre = req.body.nombre;
        usuario.apellido = req.body.apellido;
        await usuario.save();

        const vResultado = {}
        vResultado.token = Buffer.from(usuario._id.toString()).toString('base64');
        vResultado.usuario = usuario.usuario
        vResultado.rol = usuario.rol  
        vResultado.invitado = usuario.invitado 
        vResultado.meme = usuario.meme 

        Request.crearRequest('actualizarUsuario',JSON.stringify(req.body),200);
        return res.json({
            message: 'Envio de usuario',
            data:Buffer.from(JSON.stringify(vResultado)).toString('base64')
        });
    }catch(error){
        console.log(error)
        Request.crearRequest('actualizarUsuario',JSON.stringify(req.body),500,error);
        res.status(500).json({
            error: 'Algo salio mal',
            data: error
        });
    }
}

exports.actualizarContrasena = async (req,res) => {
    try{
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        const usuario = await Usuario.findOne({'_id':req.body._id});
        usuario.contrasena = req.body.contrasena;
        const salt = bcrypt.genSaltSync();
        usuario.contrasena = bcrypt.hashSync(usuario.contrasena,salt);
        const resultado = await usuario.save();
        Request.crearRequest('actualizarContrasena',JSON.stringify(req.body),200);
        return res.json({
            message: 'Envio de usuario',
            data:resultado
        });
    }catch(error){
        console.log(error)
        Request.crearRequest('actualizarContrasena',JSON.stringify(req.body),500,error);
        res.status(500).json({
            error: 'Algo salio mal',
            data: error
        });
    }
}

exports.buscar10Mejores =  async (req,res) =>{
    let nNumeroError = 500;
    try{
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        
        const usuarios = await Usuario.find({},{usuario:1,puntuaje:1}).sort({"puntuaje":-1}).limit(10)
        if(!usuarios){
            nNumeroError = 503;
            throw 'No se encontro la partida'
        }
        
        Request.crearRequest('buscar10Mejores',JSON.stringify(req.body),200);

        return res.json({
            message: 'usuarios.',
            data:usuarios
        });
    }catch(error){
        Request.crearRequest('buscar10Mejores',JSON.stringify(req.body),nNumeroError,error);
        res.status(nNumeroError).json({
            error: 'Algo salio mal',
            data: error.toString()
        });
    }
}

exports.actualizarMemes =  async (req,res) =>{
    try{
        if(!await validaSesionUsuario(req.headers.authorization)){
            throw "El usuario no tiene derecho a utilizar este metodo"
        }
        const usuario = await Usuario.findOne({'_id':Buffer.from(req.headers.authorization, 'base64').toString('ascii')});
        usuario.meme = req.body.meme;
        await usuario.save();
        Request.crearRequest('actualizarMemes',JSON.stringify(req.body),200);
        return res.json({
            message: 'Envio de usuario',
            data:true
        });
    }catch(error){
        console.log(error)
        Request.crearRequest('actualizarMemes',JSON.stringify(req.body),500,error);
        res.status(500).json({
            error: 'Algo salio mal',
            data: error
        });
    }
}