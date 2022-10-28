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
        emun: [1,2,3]
    },
    partidas:{
        type:Array
    },
})

UsuarioSchema.index({usuario:'text'})

module.exports = mongoose.model('Usuario',UsuarioSchema,'usuario')