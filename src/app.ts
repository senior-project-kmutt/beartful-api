import fastify from "fastify";
import router from "./router";

const server = fastify({
  // Logger only for production
  logger: true,
});

// Middleware: Router
server.register(router);
server.get("/", async () => {
  console.log("hello world");
  return { hello: "world" };
});


export default server;
