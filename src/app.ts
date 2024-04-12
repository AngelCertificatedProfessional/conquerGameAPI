import { MongoDatabase } from "./data";
import { envs } from './config/envs'
import { Server } from './presentation/server'


// new Server().listen();
(async () => {
    main();
})();
async function main() {

    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL
    })
    const server = new Server({
        port: envs.PORT,
        // routes: AppRoutes.routes,
    });
    server.start();
}