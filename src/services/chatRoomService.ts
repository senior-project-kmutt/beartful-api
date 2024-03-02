import { ChatRoom } from "../models/chatRoom";
import { ChatMessages } from "../models/chatMessages";
import { IUsers, Users } from "../models/user";

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

export const getChatRoomById = async (chatRoomId: string) => {
  try {
    const chatRooms = await ChatRoom.findOne({ _id: chatRoomId });
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

export const createChatRoom = async (participants: string[]) => {
  const newPaticipants = await transformPaticipants(participants);
  const existingChatRoom = await ChatRoom.findOne({
    participants: newPaticipants
  })
  if (existingChatRoom) {
    return existingChatRoom

  } else {
    const newChatRoom = new ChatRoom({
      participants: newPaticipants
    });
    await newChatRoom.validate();
    const response = await newChatRoom.save();
    return response
  }
}

const transformPaticipants = async (participants: string[]) => {
  const transformPaticipants: string[] = []
  const participantPromises = participants.map(async participant => {
    const user: IUsers = await Users.findOne({ username: participant });
    const userId = String(user._id);
    transformPaticipants.push(userId);
  })
  await Promise.all(participantPromises);
  return transformPaticipants
}
