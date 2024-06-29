import { Router } from 'express';
import { UsuarioRoutes } from './controllers/usuario/routes';
import { ConquerGameRoutes } from './controllers/conquerGame/routes';
// import { AuthRoutes } from './auth/routes';
// import { CategoryRoutes } from './category/routes';
// import { ProductRoutes } from './products/routes';
// import { FileUploadRoutes } from './file-upload/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // Definir las rutas
        // router.use('/api/todos', /*TodoRoutes.routes */ );
        router.use('/api/usuario', UsuarioRoutes.routes)
        router.use('/api/conquerGame', ConquerGameRoutes.routes)
        // router.use('/api/categories', CategoryRoutes.routes)
        // router.use('/api/products', ProductRoutes.routes)
        // router.use('/api/upload', FileUploadRoutes.routes)
        return router;
    }
}