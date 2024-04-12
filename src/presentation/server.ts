import express from 'express'
import compression from 'compression'
// const cors = require('cors')
// const { AppRoutes } = require('./routes');

interface Options {
    port: number;
}

export class Server {
    private readonly port: number;
    private server: any;
    private app = express();

    constructor(options: Options) {
        const { port } = options;
        this.port = port;
    }

    async start() {
        this.app.use(express.json());
        this.app.use(compression())
        this.app.use(express.static('public'));
        this.server = require('http').createServer(this.app);
        console.log("entre")
        // /*Seccion de sockets*/
        //this.socket = require('../sockets/controller'); 
        //sockets
        //this.sockets();
    }

    // sockets() {
    //     this.socket.connect(this.server)
    // }

    listen() {
        /* se remplazar por server para ejecutar el scoket
        this.app.listen(this.port, ()=>{
            console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        });
        */
        this.server.listen(this.port, () => {
            console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        });
    }

}