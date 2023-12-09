import { Users } from "../models/user";
import { ChatRoom, IChatRoom } from "../models/chatRoom";

export const getUser = async () => {
  const users = await Users.find().lean();
  return users;
};

export const getUserById = async (userId: string) => {
  const user = await Users.find({ _id: userId }, {
    _id: 0,
    username: 1,
    firstname: 1,
    lastname: 1,
    profile_image: 1,
    role: 1,
    createdAt: 1
  });
  return user[0];
};

export const getChatRoomByUserId = async (userId: string): Promise<IChatRoom[]> => {
  const chatRoom = await ChatRoom.find({ 'participants': userId });
  return chatRoom;
};
