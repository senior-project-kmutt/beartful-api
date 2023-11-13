import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import userController from "./controllers/userController";
import indexController from "./controllers/indexController";
import checkoutController from "./controllers/checkoutController";
import accountController from "./controllers/accountController";
import artworkController from "./controllers/artworkController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(cors);
  fastify.register(userController, { prefix: "/api/user" });
  fastify.register(indexController, { prefix: "/" });
  fastify.register(checkoutController, { prefix: "/api/checkout" });
  fastify.register(accountController, { prefix: "/api/freelance" });
  fastify.register(artworkController, { prefix: "/api/artwork" });
}
