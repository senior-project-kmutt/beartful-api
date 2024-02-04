import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import userController from "./controllers/userController";
// import indexController from "./controllers/indexController";
import checkoutController from "./controllers/checkoutController";
import accountController from "./controllers/accountController";
import artworkController from "./controllers/artworkController";
import chatMessagesController from "./controllers/chatMessagesController";
import chatRoomController from "./controllers/chatRoomController";
import categoryController from "./controllers/categoryController";
import cartController from "./controllers/cartController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(cors);
  fastify.register(userController, { prefix: "/api/user" });
  // fastify.register(indexController, { prefix: "/" });
  fastify.register(checkoutController, { prefix: "/api/checkout" });
  fastify.register(accountController, { prefix: "/api/freelance" });
  fastify.register(artworkController, { prefix: "/api/artwork" });
  fastify.register(chatMessagesController, { prefix: "/api/message" });
  fastify.register(chatRoomController, { prefix: "/api/chatRoom" });
  fastify.register(categoryController, { prefix: "/api/categories" });
  fastify.register(cartController, { prefix: "/api/carts" });
}
