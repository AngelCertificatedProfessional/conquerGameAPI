const mongoose = require('mongoose')

const RequestSchema = mongoose.Schema({
    proceso:{
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

module.exports = mongoose.model('Request',RequestSchema,'request')