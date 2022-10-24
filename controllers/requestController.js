const Request = require('../models/Request')
require('dotenv').config({path:'.env'});

exports.crearRequest = async(proceso,req,estatus,error = '') =>{
    if(process.env.GENERARREQUEST === 'true'){
        try{
            let body = {
                proceso:proceso,
                estatus:estatus,
                request:req,
                error:error
            }
            const request = new Request(body)
            await request.save();
        }catch(error){
            console.log(error)
        }
    }
}