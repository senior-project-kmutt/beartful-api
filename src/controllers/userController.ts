import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IUsers, Users } from "../models/user";
import { ErrorCode } from "../response/errorResponse";

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
    "/",
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
          return reply.send(ErrorCode.DuplicateUsername(username));
        }
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    }
  );

  const getUser = async () => {
    const users = await Users.find().lean();
    return users;
  };
}
