import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ChatMessages, IChatMessages } from "../models/chatMessages";
import { ErrorCode } from "../response/errorResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";
interface GetMessagesByChatRoomRequest {
  chatRoomId: string
}

export default async function chatMessagesController(fastify: FastifyInstance) {

  fastify.get("/", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const allMessage = await getAllMessages()
    reply.send(allMessage);
  });

  fastify.post("/", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const auth = request.headers.authorization;
    if (auth) {
      try {
        const token = auth.split("Bearer ")[1];
        jwt.verify(token, SECRET_KEY) as JwtPayload;
      } catch (error) {
        reply.status(401).send(ErrorCode.Unauthorized);
      }
      const body: IChatMessages = request.body as IChatMessages;
      const message = await addNewMessage(body);
      reply.send(message);
    } else {
      return reply.status(401).send(ErrorCode.Unauthorized);
    }
  });

  const addNewMessage = async (data: IChatMessages) => {
    const insertMessage = { ...data }

    const newMessage = new ChatMessages(data)
    return await newMessage.save()
  }

  const getAllMessages = async () => {
    const chatMessgaes = await ChatMessages.find().lean()
    return chatMessgaes
  }
}