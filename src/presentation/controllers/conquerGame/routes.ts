import { Router } from 'express';
import { ConquerGameController } from './controller';
import { validarJWT } from '../../middlewares/validar-jwt';
import { validarSesionUsuario } from '../../middlewares/validar-usuario';
import { validaExistePartida } from '../../middlewares/conquerGame/validaExistePartida';
import { validaNoSobrePasarCantidadJugadores } from '../../middlewares/conquerGame/validaNoSobrePasarCantidadJugadores';
import { validaFaltaCantidadJugadores } from '../../middlewares/conquerGame/validaFaltaCantidadJugadores';

export class ConquerGameRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ConquerGameController();
        // Definir las rutas
        router.use(validarJWT)
        router.use(validarSesionUsuario)
        router.get('/buscarPartidas', controller.buscarPartida)
        router.post('/crearPartida', controller.crearPartida)
        router.patch(`/ingresarLobbyPartida/:_id`, [validaExistePartida, validaNoSobrePasarCantidadJugadores], controller.ingresarLobbyPartida);
        router.patch(`/ingresarSeleccionPersonaje/:_id`, [validaExistePartida, validaFaltaCantidadJugadores], controller.ingresarSeleccionPersonaje);
        router.patch(`/indicarJugadorListo/:_id`, [validaExistePartida], controller.indicarJugadorListo);
        router.patch(`/iniciarPartida/:_id`, [validaExistePartida], controller.iniciarPartida);
        return router;
    }
}