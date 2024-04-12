const mongoose = require('mongoose')

const RequestSchema = mongoose.Schema({
    proceso:{
        type:String,
        required:true,
    },
    archivo:{
        type:String,
        required:true,
    },
    request:{
        type:String,
    },
    estatus:{
        type:Number,
        required:true
    },
    creado:{
        type:Date,
        default:Date.now
    }
})

RequestSchema.index({creado:'date'})
RequestSchema.index({creado: 1},{
    expireAfterSeconds: 259200
})

module.exports = mongoose.model('Request',RequestSchema,'request')