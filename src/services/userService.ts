import { IUsers, Users } from "../models/user";
import { ChatRoom, IChatRoom, IParticipant } from "../models/chatRoom";
import { Artworks, IArtworks } from "../models/artwork";

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
    const shuffledArtworks = artworks.sort(() => Math.random() - 0.5);
    return shuffledArtworks;
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
    profile_image: user.profile_image,
    role: user.role
  }
  return userForSign;
};
