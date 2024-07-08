interface jugador {
    invitado: Boolean;
    turnoJugador: string;
    usuario: string
}

interface posicionPiezasGlobal {
    nombre: string;
    icono: string;
    posicion: string;
    direccion: string;
}

export interface ConquerGameInterface {
    jugadores: jugador[];
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