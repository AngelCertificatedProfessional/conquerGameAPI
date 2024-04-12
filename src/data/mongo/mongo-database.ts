import mongoose from "mongoose";

interface Options {
    mongoUrl: string;
}

export class MongoDatabase {
    static async connect(options: Options) {
        const { mongoUrl } = options;

        try {
            await mongoose.connect(mongoUrl)
            return true
        } catch (error) {
            console.log('Mongo connectior error')
            throw error;
        }

    }

    static async disconnect() {
        await mongoose.disconnect();
    }

}