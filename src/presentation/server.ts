import express, { Router } from 'express'
import cors from 'cors'
import compression from 'compression'
// const { AppRoutes } = require('./routes');

interface Options {
    port: number;
    routes: Router;
}

export class Server {
    private app = express();
    private readonly port: number;
    private readonly routes: Router;
    private server: any;

    constructor(options: Options) {
        const { port, routes } = options;
        this.port = port;
        this.routes = routes;
    }

    async start() {
        //Cors
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(compression())
        this.app.use(express.static('public'));
        this.server = require('http').createServer(this.app);

        //*Routes
        this.app.use(this.routes)

        // /*Seccion de sockets*/
        //this.socket = require('../sockets/controller'); 
        //sockets
        //this.sockets();
        this.app.listen(this.port, () => {
            console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        });
    }

    // sockets() {
    //     this.socket.connect(this.server)
    // }

    listen() {
        // se remplazar por server para ejecutar el scoket
        // this.app.listen(this.port, () => {
        //     console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        // });
        // this.server.listen(this.port, () => {
        //     console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        // });
    }

}