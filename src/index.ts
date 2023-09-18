import app from "./app";
import { config } from "./config/constant"
import mongoose from "mongoose";

const startApp = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, { retryWrites: true, w: 'majority' });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

app.listen(config.port, config.hostname);
startApp()

console.log(`🚀  Fastify server running on port http://localhost:${config.port}`);
