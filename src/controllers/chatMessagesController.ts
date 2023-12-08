import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ChatMessages, IChatMessages } from "../models/chatMessages";

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
    const body: IChatMessages = request.body as IChatMessages;
    const message = await addNewMessage(body)
    reply.send(message)
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