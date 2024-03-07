import { IUserAward, IUserBankAccount, IUserEducation, IUserExperience, IUserFreelance, IUserSkillAndLanguage } from './../models/user/index';
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IUserLogin, IUsers, Users } from "../models/user";
import { ErrorCode } from "../response/errorResponse";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IChatRoom } from "../models/chatRoom";
import { getArtworkByUserName, getChatRoomByUserId, getUser, insertUser, transformUserForSign, getUserById, updateProfile, getUserByUsername } from "../services/userService";
import { getCustomerCartByUserId, getCustomerCartReviewOrderByUserId } from "../services/cartService";
import { getQuotationByCustomerId } from '../services/quotationService';
import { getCustomerPurchaseOrderByCustomerID, getFreelanceWorkByFreelanceID } from '../services/purchaseOrderService';
import { updateRecipient } from '../services/omiseService';
import { IBankAccountTransfer } from '../models/payment';
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

interface IParamsGetChatRoom {
  userId: string;
}

interface IParamsGetByUsername {
  username: string;
}

interface IUserUpdateBankAccount {
  bankAccount: IUserBankAccount;
}

interface IUserUpdateFreelanceDetails {
  education: IUserEducation;
  experience: IUserExperience;
  skill: IUserSkillAndLanguage,
  language: IUserSkillAndLanguage,
  award: IUserAward
}

interface IUserUpdatePersonal {
  firstname: string;
  lastname: string;
  email: string,
  phoneNumber: string,
  dateOfBirth?: IUserAward,
  address?: string
}

export default async function userController(fastify: FastifyInstance) {
  // GET /api/v1/user
  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const users = await getUser();
      reply.send(users);
    }
  );

  // POST /api/v1/user
  fastify.post(
    "/register",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const body: IUsers = request.body as IUsers;

      try {
        if (!body.role) {
          return reply.status(400).send(ErrorCode.MissingRequiredField("role"))
        }
        const user = await insertUser(body, reply)
        const userForSign = await transformUserForSign(user as unknown as IUsers);
        const token = jwt.sign(userForSign, SECRET_KEY);
        return reply.status(200).send({ token: token, user: userForSign });
      } catch (error) {
        const Error = error as { code?: string; message?: string };
        if (Error.code == "11000") {
          return reply.status(409).send(ErrorCode.DuplicateUsername(body.username));
        }
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    }
  );

  fastify.get(
    "/:userId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const params = request.params as IParamsGetChatRoom;
      if (auth) {
        const token = auth.split("Bearer ")[1];
        const test = jwt.decode(token) as JwtPayload;
        if (test.id != params.userId) {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
        try {
          jwt.verify(token, SECRET_KEY) as JwtPayload;
          const user = await getUserById(params.userId);
          return reply.status(200).send(user[0]);
        } catch (error) {
          reply.status(401).send(ErrorCode.Unauthorized)
        }

      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    }
  );

  fastify.get(
    "/freelance/:username",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const params = request.params as IParamsGetByUsername;
        const user = await getUserByUsername(params.username)
        return reply.status(200).send(user[0]);
      } catch (error) {
        if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
          return reply.status(404).send(ErrorCode.NotFound);
        }
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    }
  );

  fastify.get(
    "/freelanceInfo/:userId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const params = request.params as { userId: string };
      try {
        const user = await getUserById(params.userId);
        return reply.status(200).send(user[0]);
      } catch (error) {
        reply.status(500).send(ErrorCode.InternalServerError)
      }
    }
  );

  fastify.get(
    "/:userId/chatRooms",
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
        return reply.status(200).send(chatRooms);
      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    }
  );

  fastify.get(
    "/:userId/artworks",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const params = request.params as IParamsGetChatRoom;
      const { page, pageSize, type } = request.query as {
        page: string;
        pageSize: string;
        type: string;
      };
      const artworks = await getArtworkByUserName(params.userId, page, pageSize, type)
      return artworks
    }
  );

  fastify.get(
    "/:userId/carts",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const params = request.params as IParamsGetChatRoom;
      const { type } = request.query as {
        type: string;
      };
      const carts = await getCustomerCartByUserId(params.userId, type)
      return carts
    }
  );

  fastify.get(
    "/:userId/carts/reviewOrder",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const params = request.params as IParamsGetChatRoom;
      const { type } = request.query as {
        type: string;
      };
      const carts = await getCustomerCartReviewOrderByUserId(params.userId, type)
      return carts
    }
  );

  // POST /api/v1/user
  fastify.post(
    "/login",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const body: IUserLogin = request.body as IUserLogin;
      const { username, password } = body;
      const user: IUsers = await Users.findOne({ username }).lean();
      if (!user) {
        return reply.status(401).send(ErrorCode.InvalidUser);
      }

      const userForSign = await transformUserForSign(user);
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        const token = jwt.sign(
          userForSign,
          SECRET_KEY
        );
        return reply.status(200).send({ token: token, user: userForSign });
      } else {
        return reply.status(401).send(ErrorCode.InvalidUser);
      }
    }
  );

  fastify.patch(
    "/:userId/updateBankAccount",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const params = request.params as IParamsGetChatRoom;
      const body: IUserUpdateBankAccount = request.body as IUserUpdateBankAccount;

      if (auth) {
        const token = auth.split("Bearer ")[1];
        const userDecode = jwt.decode(token) as JwtPayload;
        if (userDecode.id != params.userId) {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
        try {
          jwt.verify(token, SECRET_KEY) as JwtPayload;
          const response = await updateProfile(params.userId, body);
          const user: IUserFreelance[] = await getUserById(params.userId)
          const recipientInfo: IBankAccountTransfer = {
            email: user[0].email,
            bank_account: {
              brand: body.bankAccount.bankName,
              number: body.bankAccount.bankAccountNumber,
              name: body.bankAccount.bankAccountName,
            }
          }
          await updateRecipient(user[0].recipientId, recipientInfo)
          return reply.status(200).send(response[0]);
        } catch (error) {
          reply.status(401).send(ErrorCode.Unauthorized)
        }

      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    });

  fastify.patch(
    "/:userId/updateFreelanceDetails",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const params = request.params as IParamsGetChatRoom;
      const body: IUserUpdateFreelanceDetails = request.body as IUserUpdateFreelanceDetails;

      if (auth) {
        const token = auth.split("Bearer ")[1];
        const userDecode = jwt.decode(token) as JwtPayload;
        if (userDecode.id != params.userId) {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
        try {
          jwt.verify(token, SECRET_KEY) as JwtPayload;
          const response = await updateProfile(params.userId, body);
          return reply.status(200).send(response[0]);
        } catch (error) {
          reply.status(401).send(ErrorCode.Unauthorized)
        }

      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    }
  );

  fastify.patch(
    "/:userId/personal",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const params = request.params as IParamsGetChatRoom;
      const body: IUserUpdatePersonal = request.body as IUserUpdatePersonal;

      if (auth) {
        const token = auth.split("Bearer ")[1];
        const userDecode = jwt.decode(token) as JwtPayload;
        if (userDecode.id != params.userId) {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
        try {
          jwt.verify(token, SECRET_KEY) as JwtPayload;
          const response = await updateProfile(params.userId, body);
          return reply.status(200).send(response[0]);
        } catch (error) {
          reply.status(401).send(ErrorCode.Unauthorized)
        }

      } else {
        return reply.status(401).send(ErrorCode.Unauthorized);
      }
    }
  );

  fastify.get(
    "/:userId/quotations",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const auth = request.headers.authorization;
        const params = request.params as IParamsGetChatRoom;

        if (auth) {
          const token = auth.split("Bearer ")[1];
          const userDecode = jwt.decode(token) as JwtPayload;
          if (userDecode.id != params.userId) {
            return reply.status(401).send(ErrorCode.Unauthorized);
          }
          try {
            jwt.verify(token, SECRET_KEY) as JwtPayload;
            const response = await getQuotationByCustomerId(params.userId)
            return reply.status(200).send(response);
          } catch (error) {

            reply.status(401).send(ErrorCode.Unauthorized)
          }

        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }

      } catch (error) {
        if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
          return reply.status(404).send(ErrorCode.NotFound);
        }

      }
    }
  );

  fastify.get(
    "/customer/:userId/orders",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const { userId } = request.params as { userId: string };
      const { status } = request.query as { status: string };
      try {
        if (auth) {
          const orders = await getCustomerPurchaseOrderByCustomerID(userId, status);
          return reply.status(200).send(orders);
        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }

      } catch {
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    }
  );

  fastify.get(
    "/freelance/:userId/orders",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const { userId } = request.params as { userId: string };
      const { status } = request.query as { status: string };
      try {
        if (auth) {
          const orders = await getFreelanceWorkByFreelanceID(userId, status);
          return reply.status(200).send(orders);
        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }

      } catch {
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    }
  );
}
