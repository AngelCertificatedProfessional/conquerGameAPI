import { Router } from 'express';
import { ConquerGameController } from './controller';
import { validarJWT } from '../../middlewares/validar-jwt';
import { validarSesionUsuario } from '../../middlewares/validar-usuario';
import {
    crearPartida, indicarJugadorListo,
    ingresarLobbyPartida, ingresarSeleccionPersonaje,
    iniciarPartida,
    moverPosicionPiezasGlobal
} from '../../../domain/dto/conquerGame';

export class ConquerGameRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ConquerGameController();
        // Definir las rutas
        router.use(validarJWT)
        router.use(validarSesionUsuario)
        router.get('/buscarPartidas', controller.buscarPartida)
        router.post('/crearPartida', crearPartida, controller.crearPartida)
        router.patch(`/indicarJugadorListo/:_id`, indicarJugadorListo, controller.indicarJugadorListo);
        router.patch(`/ingresarLobbyPartida/:_id`, ingresarLobbyPartida, controller.ingresarLobbyPartida);
        router.patch(`/ingresarSeleccionPersonaje/:_id`, ingresarSeleccionPersonaje, controller.ingresarSeleccionPersonaje);
        router.patch(`/iniciarPartida/:_id`, iniciarPartida, controller.iniciarPartida);
        router.patch(`/moverPosicionPiezasGlobal/:_id`, moverPosicionPiezasGlobal, controller.moverPosicionPiezasGlobal);
        return router;
    }
}