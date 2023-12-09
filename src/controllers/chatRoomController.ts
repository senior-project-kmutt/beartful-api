import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { getAllChatRoom, getLastMessagesByChatRoom, getMessagesByChatRoom } from "../services/chatRoomService";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

interface GetMessagesByChatRoomRequest {
  chatRoomId: string
}

export default async function chatRoomController(fastify: FastifyInstance) {

  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const chat = await getAllChatRoom();
      reply.send(chat);
    }
  );

  fastify.get("/:chatRoomId/messages", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const auth = request.headers.authorization;
    if (auth) {
      try {
        const token = auth.split("Bearer ")[1];
        jwt.verify(token, SECRET_KEY) as JwtPayload;
      } catch (error) {
        reply.status(401).send(ErrorCode.Unauthorized)
      }
      const req = request.params as GetMessagesByChatRoomRequest
      const chatRoomId = req.chatRoomId
      const allMessage = await getMessagesByChatRoom(chatRoomId)
      reply.send(allMessage);
    } else {
      return reply.status(401).send(ErrorCode.Unauthorized);
    }
  });

  fastify.get("/:chatRoomId/latestMessage", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const auth = request.headers.authorization;
    if (auth) {
      try {
        const token = auth.split("Bearer ")[1];
        jwt.verify(token, SECRET_KEY) as JwtPayload;
      } catch (error) {
        reply.status(401).send(ErrorCode.Unauthorized)
      }
      const req = request.params as GetMessagesByChatRoomRequest
      const chatRoomId = req.chatRoomId
      const latestMessage = await getLastMessagesByChatRoom(chatRoomId)
      reply.send(latestMessage);

    } else {
      return reply.status(401).send(ErrorCode.Unauthorized);
    }
  });
}
