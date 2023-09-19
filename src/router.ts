import { FastifyInstance } from "fastify";
import userController from "./controller/userController";
import indexController from "./controller/indexController";
import cors from '@fastify/cors'

export default async function router(fastify: FastifyInstance) {
  fastify.register(cors)
  fastify.register(userController, { prefix: "/api/v1/user" });
  fastify.register(indexController, { prefix: "/" });
}
