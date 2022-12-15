const mongoose = require('mongoose')

const UsuarioSchema = mongoose.Schema({
    usuario:{
        type:String,
        required: [true,'El nombre es obligatorio'],
        unique: true
    },
    contrasena:{
        type:String,
        required: [true,'La contrasena es obligatoria'],
    },
    correo:{
        type:String,
        required: [true,'El correo es obligatorio'],
        unique: true
    },
    nombre:{
        type:String,
        required:true,
    },
    apellido:{
        type:String,
        required:true,
    },
    creado:{
        type:Date,
        default:Date.now
    },
    rol:{
        type:Number,
        required: true,
        emun: [1,2,3] //tipousuario
    },
    numeroPartidaActual:{
        type:Number,
        required: false,
    },
    aceptoTerminosYCondiciones:{
        type:Boolean,
        required: true,
    },
    activa:{
        type:Boolean,
        required: true,
    },
    invitado:{
        type:Boolean,
        default:false
    },
    puntuaje:{
        type:Number,
        default:false
    },
    meme:{
        type:String,
        required: false,
        default:''
    }
})

UsuarioSchema.index({usuario:'text'})
UsuarioSchema.index({creado: 1},{
    expireAfterSeconds: 86400, //1 Dia
    partialFilterExpression: {
        invitado: true
    }
}
);
module.exports = mongoose.model('Usuario',UsuarioSchema,'usuario')