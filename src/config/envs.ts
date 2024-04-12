import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    MONGO_URL: get('DB_CNN_STRING').required().asString(),
    SECRET_JWT_SEED: get('SECRET_JWT_SEED').required().asString(),
    GENERARREQUEST: get('GENERARREQUEST').required().asBool(),
}

