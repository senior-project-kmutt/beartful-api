import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IUserLogin, IUsers, Users } from "../models/user";
import { ErrorCode } from "../response/errorResponse";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

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
      const { email, username, password, firstname, lastname } = body;
      try {
        const response = await Users.create({
          email,
          username,
          password,
          firstname,
          lastname,
        });
        reply.send(response);
      } catch (error) {
        const Error = error as { code?: string; message?: string };
        if (Error.code == "11000") {
          return reply.status(409).send(ErrorCode.DuplicateUsername(username));
        }
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
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
        return reply.status(409).send(ErrorCode.InvalidUser);
      }
      console.log(password);
      console.log(user.password);
      console.log(password === user.password);
      console.log(await bcrypt.compare(password, user.password));
      if (await bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          SECRET_KEY
        );
        return reply.status(200).send({ token: token });
      }
    }
  );

  const getUser = async () => {
    const users = await Users.find().lean();
    return users;
  };
}
