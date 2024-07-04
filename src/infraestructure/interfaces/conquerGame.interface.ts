interface jugador {
    invitado: Boolean,
    turno: string
}
export interface ConquerGameInterface {
    numeroPartida: number;
    cantidadJugadores: number;
    jugadores: jugador[];
    // id: string;
    // createAt: Date;
    // handleAtDesk?: string;//Escritorio
    // handleAt?: Date;
    // done: boolean;
}