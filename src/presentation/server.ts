import express, { Router } from 'express'
import cors from 'cors'
import compression from 'compression'

interface Options {
    port: number;
}

export class Server {
    public readonly app = express();
    private readonly port: number;

    constructor(options: Options) {
        const { port } = options;
        this.port = port;
        this.configure()
    }

    private configure() {
        //Cors
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(compression())
        this.app.use(express.static('public'));
    }

    async start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
        });
    }

    public setRoutes(router: Router) {
        this.app.use(router);
    }
}