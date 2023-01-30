const Request = require('../models/Request')
require('dotenv').config({path:'.env'});

exports.crearRequest = async(proceso,req,estatus,error = '') =>{
    if(process.env.GENERARREQUEST === 'true'){
        try{
            const body = {
                proceso:proceso,
                estatus:estatus,
                request:req,
                error:error
            }
            new Request(body).save()
        }catch(error){
            console.log(error)
        }
    }
}