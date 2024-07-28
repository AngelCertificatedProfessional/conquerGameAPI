import { Router } from 'express';
import { UsuarioRoutes } from './controllers/usuario/routes';
import { ConquerGameRoutes } from './controllers/conquerGame/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // Definir las rutas
        router.use('/api/usuario', UsuarioRoutes.routes)
        router.use('/api/conquerGame', ConquerGameRoutes.routes)
        return router;
    }
}