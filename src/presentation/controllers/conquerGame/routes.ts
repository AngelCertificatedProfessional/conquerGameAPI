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
        router.patch(`/ingresarPartida/:_id`, [validaExistePartida, validaNoSobrePasarCantidadJugadores], controller.ingresarPartida);
        router.patch(`/ingresarSeleccionPersonaje/:_id`, [validaExistePartida, validaFaltaCantidadJugadores], controller.ingresarSeleccionPersonaje);
        return router;
    }
}