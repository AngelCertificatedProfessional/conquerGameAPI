const jwt = require('jsonwebtoken')

exports.generarJWT = (uid, usuario) => {
    return jwt.sign({ uid, usuario }, process.env.SECRET_JWT_SEED, {
        expiresIn: '2h'
    });
}