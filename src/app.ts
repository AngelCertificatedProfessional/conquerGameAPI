import { envs } from './config/envs'
import { MongoDatabase } from "./data";
import { AppRoutes } from "./presentation/routes";
import { Server } from './presentation/server'

(async () => {
    main();
})();

async function main() {
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL
    })
    const server = new Server({
        port: envs.PORT,
    });
    server.setRoutes(AppRoutes.routes);
}