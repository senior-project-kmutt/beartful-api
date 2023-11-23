import { ChatRoom, IChatRoom, IParticipant } from "../models/chatRoom";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { Users } from "../models/user";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

interface GetMessagesByChatRoomRequest {
  chatRoomId: number;
}

interface IParamsGetChatRoom {
  userId: string;
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
    "/:userId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const params = request.params as IParamsGetChatRoom;
      if (auth) {
        const token = auth.split("Bearer ")[1];
        try {
          jwt.verify(token, SECRET_KEY) as JwtPayload;
        } catch (error) {
          reply.status(401).send(ErrorCode.Unauthorized)
        }
        const chatRooms: IChatRoom[] = await getChatRoomByUserId(params.userId);
        await Promise.all(
          chatRooms.map(async (chatRoom) => {
            const tranform: any = await Promise.all(chatRoom.participants.map(async (userId) => {
              const user = await getUserById(userId as string);
              const transformUser = {
                user_id: userId,
                username: user.username,
                role: user.role,
                profile_image: user.profile_image
              } as IParticipant;
              return transformUser;
            }));
            const newChatRoom = chatRoom
            newChatRoom.participants = tranform
            return newChatRoom
          })
        )
        return reply.status(200).send(chatRooms);
      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    }
  );

  const getAllChatRoom = async () => {
    try {
      const chatRooms = await ChatRoom.find();
      console.log("Chat Rooms:", chatRooms);
      return chatRooms;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  };

  const getChatRoomByUserId = async (userId: string): Promise<IChatRoom[]> => {
    const chatRoom = await ChatRoom.find({ 'participants': userId });
    return chatRoom;
  };

  const getUserById = async (userId: string) => {
    const user = await Users.find({ _id: userId }, {
      _id: 0,
      username: 1,
      profile_image: 1,
      role: 1
    });
    return user[0];
  };
}
