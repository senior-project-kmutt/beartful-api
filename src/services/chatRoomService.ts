import { ChatRoom } from "../models/chatRoom";
import { ChatMessages } from "../models/chatMessages";

export const getAllChatRoom = async () => {
  try {
    const chatRooms = await ChatRoom.find();
    console.log("Chat Rooms:", chatRooms);
    return chatRooms;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};

export const getMessagesByChatRoom = async (chatRoomId: string) => {
  const chatMessgaes = await ChatMessages.find().where("chat_room_id").equals(chatRoomId).sort({ createdAt: 'asc' })
  return chatMessgaes
}

export const getLastMessagesByChatRoom = async (chatRoomId: string) => {
  const chatMessgaes = await ChatMessages.find().where("chat_room_id").equals(chatRoomId).sort({ createdAt: 'desc' })
  return chatMessgaes[0]
}
