const express = require('express');
const cors = require('cors')
const app = express()
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        /*Seccion de sockets*/
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server); 
        /**/
        this.paths = {
            usuarios:'/api/usuarios',
            conquerGame:'/api/conquerGame',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Midlewares
        this.middlewares();
        //Rutas de mi aplicacion
        this.routes();
    
        //sockets
        this.sockets();

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
        this.app.use(this.paths.conquerGame,require('../routes/conquerGame'))
    }

    sockets(){
        this.io.on('connection',socketController)
    }

    listen(){
        /* se remplazar por server para ejecutar el scoket
        this.app.listen(this.port, ()=>{
            console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        });
        */
        this.server.listen(this.port, ()=>{
            console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        });
    }

}

module.exports = Server;