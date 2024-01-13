import { IUserCustomer, IUsers, Users } from "../models/user";
import { ChatRoom, IChatRoom, IParticipant } from "../models/chatRoom";
import { ErrorCode, ErrorResponse } from "../response/errorResponse";
import { FastifyReply } from "fastify";

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
  const chatRooms = await ChatRoom.find({ 'participants': userId });
  await Promise.all(
    chatRooms.map(async (chatRoom: IChatRoom) => {
      const tranform: any = await Promise.all(chatRoom.participants.map(async (userId) => {
        const user = await getUserById(userId as string);
        const transformUser = {
          user_id: userId,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          profile_image: user.profile_image,
          createdAt: user.createdAt
        } as IParticipant;
        return transformUser;
      }));
      const newChatRoom = chatRoom
      newChatRoom.participants = tranform
      return newChatRoom
    })
  )
  return chatRooms;
};

export const transformUserForSign = async (user: IUsers) => {
  const userForSign = {
    id: user._id,
    email: user.email,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    profile_image: user.profile_image,
    role: user.role
  }
  return userForSign;
};

export const insertUser = async (user: any, reply: FastifyReply) => {
  try {
    if (user.role === "customer") {
      const validationResult = await validateCustomerField(user);
      if (validationResult) {
        return reply.status(400).send(validationResult);
      }
      const response = await Users.create(user);
      return response
    }
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorResponse) {
      return reply.status(400).send(error);
    }
  }
};

const validateCustomerField = (request: any) => {
  const requiredFields: Array<keyof IUserCustomer> = [
    'email',
    'username',
    'password',
    'firstname',
    'lastname',
    'profile_image',
    'role',
    'phoneNumber',
    'dateOfBirth'
  ];

  const missingFields = requiredFields.filter(field => !request[field]);
  if (missingFields.length > 0) {
    return ErrorCode.MissingRequiredField(missingFields.join(', '))
  }
}
