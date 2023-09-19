import { FastifyInstance } from "fastify";
import userController from "./controllers/userController";
import indexController from "./controllers/indexController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(userController, { prefix: "/api/v1/user" });
  fastify.register(indexController, { prefix: "/" });
}
