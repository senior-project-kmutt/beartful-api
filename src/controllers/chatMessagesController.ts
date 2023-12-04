import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IUsers, Users } from "../models/user";
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

  fastify.get("/:chatRoomId", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const req = request.params as GetMessagesByChatRoomRequest
    const chatRoomId = req.chatRoomId
    const allMessage = await getMessagesByChatRoom(chatRoomId)
    reply.send(allMessage);
  });

  fastify.get("/latest/:chatRoomId", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const req = request.params as GetMessagesByChatRoomRequest
    const chatRoomId = req.chatRoomId
    const latestMessage = await getLastMessagesByChatRoom(chatRoomId)
    reply.send(latestMessage);
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

  const getMessagesByChatRoom = async (chatRoomId: string) => {
    const chatMessgaes = await ChatMessages.find().where("chat_room_id").equals(chatRoomId).sort({createdAt: 'asc'})
    return chatMessgaes
  }

  const getLastMessagesByChatRoom = async (chatRoomId: string) => {
    const chatMessgaes = await ChatMessages.find().where("chat_room_id").equals(chatRoomId).sort({createdAt: 'desc'})
    return chatMessgaes[0]
  }
}