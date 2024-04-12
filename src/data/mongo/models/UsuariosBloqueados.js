const mongoose = require('mongoose')

const UsuariosBloqueadosSchema = mongoose.Schema({
    usuario:{
        type:String,
        required: [true,'El nombre es obligatorio'],
        unique: true
    },
    ignorarInclude:{
        type:Boolean,
        required: false
    }
})

UsuariosBloqueadosSchema.index({usuario:'text'})

module.exports = mongoose.model('UsuariosBloqueados',UsuariosBloqueadosSchema,'usuariosBloqueados')