import { Router } from 'express';
import { UsuarioController } from './controller';
import { validarJWT } from '../../middlewares/validar-jwt';
import { validarSesionUsuario } from '../../middlewares/validar-usuario';

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new UsuarioController();
        // Definir las rutas
        router.get('/agregarUsuarioInvitado', controller.agregarUsuarioInvitado)
        router.get('/renew', [validarJWT, validarSesionUsuario], controller.revalidarToken)
        return router;
    }
}