import { ChatRoom, IChatRoom, IParticipant } from "../models/chatRoom";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { Users } from "../models/user";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

export default async function chatRoomController(fastify: FastifyInstance) {

  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const chat = await getAllChatRoom();
      reply.send(chat);
    }
  );

  const getAllChatRoom = async () => {
    try {
      const chatRooms = await ChatRoom.find();
      console.log("Chat Rooms:", chatRooms);
      return chatRooms;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  };
}
