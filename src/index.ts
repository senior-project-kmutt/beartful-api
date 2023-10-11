import app from "./app";
import { config } from "./config/constant"
import mongoose, { ConnectOptions } from "mongoose";

const startApp = async () => {
    try {
        const options: ConnectOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(config.mongodb.uri, options);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

app.listen(config.port, config.hostname);
startApp()

console.log(`🚀  Fastify server running on port http://localhost:${config.port}`);
