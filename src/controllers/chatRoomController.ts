import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { createChatRoom, getAllChatRoom, getChatRoomById, getLastMessagesByChatRoom, getMessagesByChatRoom } from "../services/chatRoomService";
import { validateToken } from "../services/userService";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

interface GetMessagesByChatRoomRequest {
  chatRoomId: string
}

export interface CreateChatRoomRequest {
  paticipants: string[]
}

export default async function chatRoomController(fastify: FastifyInstance) {

  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const chat = await getAllChatRoom();
      reply.send(chat);
    }
  );

  fastify.get(
    "/:chatRoomId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
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
          const chatRoom = await getChatRoomById(chatRoomId);
          if (!chatRoom) {
            reply.status(404).send(ErrorCode.NotFound);
            return;
          }
          reply.send(chatRoom);
        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }

      } catch (error) {
        if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
          return reply.status(404).send(ErrorCode.NotFound);
        }
      }
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

  fastify.post("/", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const auth = request.headers.authorization;
    const body: CreateChatRoomRequest = request.body as CreateChatRoomRequest;
    try {
      if (auth) {
        const decode = validateToken(auth);
        if (!decode.id) {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
        const chatRoom = await createChatRoom(body.paticipants);
        return reply.status(200).send(chatRoom);
      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
        return reply.status(404).send(ErrorCode.NotFound);
      }
      return reply.status(500).send(ErrorCode.InternalServerError);
    }
  });
}
