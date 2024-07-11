import { UsuarioInterface } from "./usuario.interface";

interface posicionPiezasGlobal {
    nombre: string;
    icono: string;
    posicion: string;
    direccion: string;
}

export interface ConquerGameInterface {
    jugadores: UsuarioInterface[];
    numeroPartida: number;
    tipoJuego: number;
    cantidadJugadores: number;
    estatus: number;
    posicionPiezasGlobal: posicionPiezasGlobal[];
    turno: String;
    reyesVivos: string[];
    // id: string;
    // createAt: Date;
    // handleAtDesk?: string;//Escritorio
    // handleAt?: Date;
    // done: boolean;
}