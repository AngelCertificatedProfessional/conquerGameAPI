const express = require('express');
const cors = require('cors')
const app = express()
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usuarios:'/api/usuarios',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Midlewares
        this.middlewares();
        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        
        //Cors
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        this.app.use(express.static('public'));    

    }

    routes(){
        this.app.use(this.paths.usuarios,require('../routes/usuarios'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        });
    }

}

module.exports = Server;