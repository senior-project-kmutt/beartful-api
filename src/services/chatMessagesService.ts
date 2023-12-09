import { ChatMessages, IChatMessages } from "../models/chatMessages";

export const addNewMessage = async (data: IChatMessages) => {
  const newMessage = new ChatMessages(data)
  return await newMessage.save()
}

export const getAllMessages = async () => {
  const chatMessgaes = await ChatMessages.find().lean()
  return chatMessgaes
}