const Request = require('../models/request')

exports.crearRequest = async (proceso, req, estatus, error = '') => {
    if (process.env.GENERAREQUEST === 'true') {
        try {
            new Request({
                proceso: proceso[0],
                archivo: proceso[1],
                estatus,
                request: req,
                error
            }).save()
        } catch (error) {
            console.log(error)
        }
    }
}