import mongoose from 'mongoose'


const UsuariosBloqueadosSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    ignorarInclude: {
        type: Boolean,
        required: false
    }
})

UsuariosBloqueadosSchema.index({ usuario: 'text' })

export const UsuariosBloqueadosModel = mongoose.model('UsuariosBloqueados', UsuariosBloqueadosSchema, 'usuariosBloqueados')