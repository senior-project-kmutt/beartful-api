import { IUserFreelance, IUsers, Users } from "../models/user";
import { ChatRoom, IChatRoom, IParticipant } from "../models/chatRoom";
import { Artworks, IArtworks } from "../models/artwork";
import { ErrorCode, ErrorResponse } from "../response/errorResponse";
import { FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

export const getUser = async () => {
  const users = await Users.find().lean();
  return users;
};

export const getUserById = async (userId: string) => {
  const user = await Users.find({ _id: userId });
  return user;
};

export const getParticipantsInfo = async (userId: string) => {
  const user = await Users.find({ _id: userId }, {
    _id: 0,
    username: 1,
    firstname: 1,
    lastname: 1,
    profileImage: 1,
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
        const user = await getParticipantsInfo(userId as string);
        const transformUser = {
          user_id: userId,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          profileImage: user.profileImage,
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

export const getArtworkByUserName = async (username: string, page?: string, pageSize?: string, type?: string): Promise<IArtworks[]> => {
  const pages = page ? parseInt(page) : 1;
  const pageSizes = pageSize ? parseInt(pageSize) : 0;
  const user: IUsers = await Users.findOne({ username: username })
  console.log(user._id);
  try {
    let query: { freelanceId: string, type?: string } = { freelanceId: user._id };
    if (type) {
      query = { ...query, type: type }
    }
    const artworksQuery = pageSizes > 0
      ? Artworks.find(query).skip((pages - 1) * pageSizes).limit(pageSizes)
      : Artworks.find(query);

    const artworks = await artworksQuery.exec();
    return artworks;
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw error;
  }
};

export const transformUserForSign = async (user: IUsers) => {
  const userForSign = {
    id: user._id,
    email: user.email,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    profileImage: user.profileImage,
    role: user.role
  }
  return userForSign;
};

export const insertUser = async (user: any, reply: FastifyReply) => {
  try {
    let response;
    if (user.role === "customer") {
      const validationResult = await validateCustomerField(user);
      if (validationResult) {
        return reply.status(400).send(validationResult);
      }
      response = await Users.create(user);
    }

    if (user.role === "freelance") {
      const validationResult = await validateFreelanceField(user);
      if (validationResult) {
        return reply.status(400).send(validationResult);
      }
      response = await Users.create(user);
    }
    return response
  } catch (error) {
    const Error = error as { code?: string; message?: string };
    if (Error.code == "11000") {
      return reply.status(409).send(ErrorCode.DuplicateUsername(user.username));
    }
    if (error instanceof ErrorResponse) {
      return reply.status(400).send(error);
    }
  }
};

export const updateProfile = async (userId: string, updateProfile: any) => {
  try {
      const response = await Users.updateOne({ _id: userId }, { $set: updateProfile });
      return response;
  } catch (error) {
      console.error("Error edit user:", error);
      throw error;
  }
};

const validateCustomerField = (request: any) => {
  const requiredFields: Array<keyof IUsers> = [
    'email',
    'username',
    'password',
    'firstname',
    'lastname',
    'profileImage',
    'role',
    'phoneNumber'
  ];

  const missingFields = requiredFields.filter(field => !request[field]);
  if (missingFields.length > 0) {
    return ErrorCode.MissingRequiredField(missingFields.join(', '))
  }
}

const validateFreelanceField = (request: any) => {
  const requiredFields: Array<keyof IUserFreelance> = [
    'email',
    'username',
    'password',
    'firstname',
    'lastname',
    'profileImage',
    'role',
    'phoneNumber',
    'dateOfBirth',
    'address',
    'education',
    'bankAccount'
  ];

  const missingFields = requiredFields.filter(field => !request[field]);
  if (missingFields.length > 0) {
    return ErrorCode.MissingRequiredField(missingFields.join(', '))
  }
}

export const validateToken = (auth: string) => {
  try {
    const token = auth.split("Bearer ")[1];
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
