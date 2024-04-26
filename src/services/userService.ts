import { IPurchaseOrder, PurchaseOrders } from './../models/purchaseOrder/index';
import { IUserFreelance, IUsers, Users } from "../models/user";
import { ChatRoom, IChatRoom, IParticipant } from "../models/chatRoom";
import { Artworks, IArtworks } from "../models/artwork";
import { ErrorCode, ErrorResponse } from "../response/errorResponse";
import { FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IBankAccountTransfer } from "../models/payment";
import { createRecipient } from "./omiseService";
import { Carts } from "../models/cart";
import { ChatMessages } from "../models/chatMessages";
import { Quotation } from "../models/quotation";
import { PurchaseOrderItems } from "../models/purchaseOderItem";
import { IGetFreelanceReview, IReview, Review } from '../models/review';
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

export const getUser = async () => {
  const users = await Users.find().lean();
  return users;
};

export const getAllUsers = async (page?: string, pageSize?: string, role?: string) => {
  const currentPage = page ? parseInt(page) : 1;
  const size = pageSize ? parseInt(pageSize) : 10;

  try {
    let query = {};
    if (role) {
      query = { role: role }
    }
    const count = await Users.countDocuments(query);
    const totalUsers = await Users.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / size);
    const usersQuery = Users.find(query)
      .skip((currentPage - 1) * size)
      .limit(size);

    const users = await usersQuery.exec();
    const response = {
      users: users,
      count: count,
      totalPages: totalPages,
      currentPage: currentPage
    };
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  const user = await Users.find({ _id: userId });
  return user;
};

export const getUserByUsername = async (username: string) => {
  const user = await Users.find({ username: username });
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
  try {
    let query: { freelanceId: string, type?: string } = { freelanceId: user._id };
    if (type) {
      query = { ...query, type: type }
    }
    const artworksQuery = pageSizes > 0
      ? Artworks.find(query).sort({ createdAt: -1 }).skip((pages - 1) * pageSizes).limit(pageSizes)
      : Artworks.find(query).sort({ createdAt: -1 });

    const artworks = await artworksQuery.exec();
    const transformedArtworks = await Promise.all(
      artworks.map(async (artwork: IArtworks | any) => {
        const freelance = (await getUserById(artwork.freelanceId as unknown as string))[0];
        const transformFreelance = {
          username: freelance.username,
          firstname: freelance.firstname,
          lastname: freelance.lastname,
          profileImage: freelance.profileImage
        };
        return {
          ...artwork.toObject(),
          freelance: transformFreelance
        };
      })
    );
    return transformedArtworks;
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
    let recipientId = null;
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
      const newUser: IUserFreelance = user
      const requestData: IBankAccountTransfer = {
        email: newUser.email,
        type: 'individual',
        name: newUser.username,
        bank_account: {
          brand: newUser.bankAccount.bankName,
          number: newUser.bankAccount.bankAccountNumber,
          name: newUser.bankAccount.bankAccountName,
        },
      };

      try {
        recipientId = await createRecipient(requestData);
      } catch (error) {
        console.error(error);
      }
      if (user.role === "freelance") {
        newUser.recipientId = recipientId;
      }
      response = await Users.create(newUser);
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

export const deleteUser = async (userId: string) => {
  try {
    //find user
    const user = await getUserById(userId);
    if (user && user[0].role === 'customer') {
      //delete cart and purchase and quotation
      await Carts.deleteMany({customerId: userId});
      const purchaseOrders = await PurchaseOrders.find({customerId: userId})
      purchaseOrders.map(async (purchaseOrder: IPurchaseOrder) => {
        await deletePurchaseOrder(purchaseOrder)
      })
      await Quotation.deleteMany({customerId: userId});
    }

    if (user && user[0].role === 'freelance') {
      //delete artwork and purchase and quotation and cart
      await Artworks.deleteMany({freelanceId: userId})
      const purchaseOrders = await PurchaseOrders.find({freelanceId: userId})
      purchaseOrders.map(async (purchaseOrder: IPurchaseOrder) => {
        await deletePurchaseOrder(purchaseOrder)
      })
      await Quotation.deleteMany({freelanceId: userId});
      await Carts.deleteMany({freelanceId: userId});
    }
    
    //delete chat room and chat message
    const chatRooms: IChatRoom[] = await getChatRoomByUserId(userId);
    chatRooms.map(async chatRoom => {
      await deleteChatRoomAndChatMessage(chatRoom._id)
    })

    await Users.deleteOne({_id: userId});
  } catch (error) {
    console.error("Error edit artwork:", error);
    throw error;
  }
};

export const deleteChatRoomAndChatMessage = async (chatRoomId: string) => {
  await ChatMessages.deleteMany({chat_room_id: chatRoomId});
  await ChatRoom.deleteOne({_id: chatRoomId});
} 

export const deletePurchaseOrder = async (purchaseOrder: IPurchaseOrder) => {
  if (purchaseOrder.type === 'hired') {
    await Quotation.deleteOne({_id: purchaseOrder.quotationId})
    await PurchaseOrders.deleteOne({_id: purchaseOrder._id})
  }

  if (purchaseOrder.type === 'readyMade') {
    await PurchaseOrderItems.deleteOne({purchaseOrderId: purchaseOrder._id})
    await PurchaseOrders.deleteOne({_id: purchaseOrder._id})
  }
}

export const getFreelanceReviews = async (freelanceId: string) => {
  const freelanceReviews = await Review.find({ reviewTo: freelanceId }).sort({ createdAt: -1 });
  const transformData: IGetFreelanceReview[] = [];

  for (const review of freelanceReviews) {
    const reviewerInfo = (await getUserById(review.reviewBy))[0];
    const transformReviewer = {
      profileImage: reviewerInfo.profileImage,
      username: reviewerInfo.username
    };
    const transformReviewData = {
      score: review.score,
      comment: review.comment,
      reviewerInfo: transformReviewer,
      createdAt: review.createdAt
    };
    transformData.push(transformReviewData);
  }

  return transformData;
}

export const getFreelanceAverageScore = async (freelanceId: string) => {
  const freelanceReviews: IReview[] = await Review.find({ reviewTo: freelanceId })
  if (freelanceReviews.length === 0) {
    return 0;
  }
  const totalScore: number = freelanceReviews.reduce((acc, review) => acc + review.score, 0);
  // Calculate the average score
  const averageScore: number = totalScore / freelanceReviews.length;
  // Round the average score to 1 decimal place
  const roundedAverageScore: number = parseFloat(averageScore.toFixed(1));
  return roundedAverageScore;

}

export const getFreelanceByKeyword = async (keyword: string) => {
  const users = await Users.find(
    {
      $and: [
        {
          $or: [
            { "username": { "$regex": String(keyword), "$options": "i" } },
            { "firstname": { "$regex": String(keyword), "$options": "i" } },
            { "lastname": { "$regex": String(keyword), "$options": "i" } }
          ]
        },
        { "role": "freelance" }
      ]
    },
    { username: 1, firstname: 1, lastname: 1, profileImage: 1 }
  );
  return users;
}



export const validateToken = (auth: string) => {
  try {
    const token = auth.split("Bearer ")[1];
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
