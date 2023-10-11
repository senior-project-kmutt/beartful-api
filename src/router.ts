import { FastifyInstance } from "fastify";
import cors from '@fastify/cors'
import userController from "./controllers/userController";
import indexController from "./controllers/indexController";
import checkoutController from "./controllers/checkoutController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(cors)
  fastify.register(userController, { prefix: "/api/v1/user" });
  fastify.register(indexController, { prefix: "/" });
  fastify.register(checkoutController, { prefix: "/api/checkout" });
}
