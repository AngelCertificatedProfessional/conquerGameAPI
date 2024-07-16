import { Request, Response } from "express"
import {
    BuscarPartida, CrearPartida, IndicarJugadorListo,
    IngresarLobbyPartida, IngresarSeleccionPersonaje, IniciarPartida,
    MoverPosicionPiezasGlobal
} from "../../../domain/use-cases/conquerGame"
import { handleError } from "../../handleError/handleError"
export class ConquerGameController {
    constructor(
    ) { }

    buscarPartida = async (req: Request, res: Response) => {
        const buscarPartida = new BuscarPartida()
        buscarPartida.execute()
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    crearPartida = async (req: Request, res: Response) => {
        const crearPartida = new CrearPartida()
        crearPartida.execute(req.body, req.headers)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    ingresarLobbyPartida = async (req: Request, res: Response) => {
        const ingresarLobbyPartida = new IngresarLobbyPartida()
        ingresarLobbyPartida.execute(req.body, req.headers, req.params)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    ingresarSeleccionPersonaje = async (req: Request, res: Response) => {
        const ingresarSeleccionPersonaje = new IngresarSeleccionPersonaje()
        ingresarSeleccionPersonaje.execute(req.body, req.headers, req.params)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    indicarJugadorListo = async (req: Request, res: Response) => {
        const indicarJugadorListo = new IndicarJugadorListo()
        indicarJugadorListo.execute(req.body, req.headers, req.params)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    iniciarPartida = async (req: Request, res: Response) => {
        const iniciarPartida = new IniciarPartida()
        iniciarPartida.execute(req.body, req.headers, req.params)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    moverPosicionPiezasGlobal = async (req: Request, res: Response) => {
        const moverPosicionPiezasGlobal = new MoverPosicionPiezasGlobal()
        moverPosicionPiezasGlobal.execute(req.body, req.params)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }
}