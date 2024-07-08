


import { Server } from 'http';
import { Server as ServerSocket } from "socket.io";
const socketio = require('socket.io');
// import { WebSocket, WebSocketServer } from 'ws'

interface Options {
    server: Server;
    // path?: string;//
}

export class IoSocketService {
    private static _instance: IoSocketService;
    private io;

    private constructor(options: Options) {
        const { server } = options; //localhost:3000/ws
        this.io = new ServerSocket(server, { /* configuraciones */ })
        this.start();
    }

    static get instance(): IoSocketService {
        if (!IoSocketService._instance) {
            throw 'IoSocketService no esta initializedo'
        }
        return IoSocketService._instance;
    }

    static initSocket(options: Options) {
        IoSocketService._instance = new IoSocketService(options);
    }

    public sendMessage(type: string, payload: Object) {
        this.io.emit(type, payload)
    }

    public start() {
        this.io.on('connection', async (socket) => {
            console.log("conectado")
            socket.on('disconnect', async () => {
                console.log('Cliente desconectado')
                // await usuarioDesconectado(uid)
                // //Cuando nos desconectamos haremos que refresque a todos los usuarios
                // this.io.emit('lista-usuarios', await getUsuarios())
            })
        })
        //     this.wss.on('connection', (ws: WebSocket) => {
        //         console.log('Client connected')

        //         ws.on('close', () => console.log('CLient disconnected'))
        //     })

    }
}