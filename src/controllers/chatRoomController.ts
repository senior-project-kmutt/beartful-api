import { ChatRoom } from "../models/chatRoom";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IUsers, Users } from "../models/user";
import { ChatMessages, IChatMessages } from "../models/chatMessages";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

interface GetMessagesByChatRoomRequest {
  chatRoomId: number;
}

export default async function chatRoomController(fastify: FastifyInstance) {
  fastify.get(
    "/token",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      if (auth) {
        const token = auth.split("Bearer ")[1];
        const user = jwt.verify(token, SECRET_KEY) as JwtPayload;
        const chatRoom = await getChatRoomByUserId(user.id);
        return reply.status(200).send(chatRoom);
      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    }
  );

  fastify.get(
    "/chat",
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

  const getChatRoomByUserId = async (userId: string) => {
    // return user
    const chatRoom = await ChatRoom.find();
    return chatRoom;
  };
}
