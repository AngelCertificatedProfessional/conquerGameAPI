import jwt from 'jsonwebtoken'
import { envs } from '../config/envs';
export const generarJWT = (uid: String, usuario: String) => {
    return jwt.sign({ uid, usuario }, envs.SECRET_JWT_SEED, {
        expiresIn: '24h'
    });
}