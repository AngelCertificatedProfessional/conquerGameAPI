const express = require('express');
const cors = require('cors')
const { dbConnection } = require('../database/db');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        /*Seccion de sockets*/
        this.server = require('http').createServer(this.app);
        //this.socket = require('../sockets/controller'); 
        /**/
        this.paths = {
            usuarios:'/api/usuario',
            // conquerGame:'/api/conquerGame',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Midlewares
        this.middlewares();
    
        //sockets
        //this.sockets();

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

    sockets(){
        this.socket.connect(this.server)
    }

    routes(){
        this.app.use(this.paths.usuarios,require('../routes/usuarios'))
        // this.app.use(this.paths.conquerGame,require('../routes/conquerGame'))
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