exports.AppRoutes = () => {
    const router = require('express').Router();
    router.use('/api/usuario', require('./usuario/usuarioRoutes'))
    router.use('/api/conquerGame', require('./conquerGame/conquerGameRoutes'))
    return router;
}