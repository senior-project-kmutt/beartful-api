import fastify from "fastify";
import router from "./router";
import fastifySocketIO from "./config/socket";
// import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

const server = fastify({
  // Logger only for production
  logger: true,
});

// Middleware: Router
server.register(router);
server.get("/api", async () => {
  console.log("hello world");
  return { hello: "world" };
});
server.register(fastifySocketIO);


export default server;
