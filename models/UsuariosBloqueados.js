const mongoose = require('mongoose')

const UsuariosBloqueadosSchema = mongoose.Schema({
    usuario:{
        type:String,
        required: [true,'El nombre es obligatorio'],
        unique: true
    }
})

UsuariosBloqueadosSchema.index({usuario:'text'})

module.exports = mongoose.model('UsuariosBloqueados',UsuariosBloqueadosSchema,'usuariosBloqueados')