const jwt = require('jsonwebtoken')
exports.validarJWT = (req, res, next) => {

    // x-token headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            oks: false,
            msg: 'No hay token en la aplicacion'
        })
    }

    try {
        const { uid, usuario } = jwt.verify(token, process.env.SECRET_JWT_SEED)
        req.uid = uid;
        req.usuario = usuario;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
    next()
}