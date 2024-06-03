import { Request, Response } from "express"
import { BuscarPartida, CrearPartida, IngresarPartida, IngresarSeleccionPersonaje } from "../../../domain/use-cases/conquerGame"
import { handleError } from "../../handleError/handleError"
export class ConquerGameController {
    constructor(
    ) { }

    buscarPartida = async (req: Request, res: Response) => {
        const buscarPartida = new BuscarPartida()
        buscarPartida.execute(req.body)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    crearPartida = async (req: Request, res: Response) => {
        const crearPartida = new CrearPartida()
        crearPartida.execute(req.body, req.headers)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    ingresarPartida = async (req: Request, res: Response) => {
        const ingresarPartida = new IngresarPartida()
        ingresarPartida.execute(req.body, req.headers, req.params)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }

    ingresarSeleccionPersonaje = async (req: Request, res: Response) => {
        const ingresarSeleccionPersonaje = new IngresarSeleccionPersonaje()
        ingresarSeleccionPersonaje.execute(req.body, req.params)
            .then(partida => res.status(201).json(partida))
            .catch(error => handleError(error, res))
    }
}