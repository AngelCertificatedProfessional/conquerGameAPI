import mongoose, { Schema } from 'mongoose'

const requestSchema = new mongoose.Schema({
    proceso: {
        type: String,
        required: true,
    },
    archivo: {
        type: String,
        required: true,
    },
    request: {
        type: String,
    },
    estatus: {
        type: Number,
        required: true
    },
    error: {
        type: Object,
        required: false
    },
    creado: {
        type: Date,
        default: Date.now
    }
})

requestSchema.index({ creado: 1 }, {
    expireAfterSeconds: 259200
})

requestSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    }
})

export const RequestModel = mongoose.model('Request', requestSchema, 'request')