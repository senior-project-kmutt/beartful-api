import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IUsers, Users } from "../models/user";

export default async function userController(fastify: FastifyInstance) {
  // GET /api/v1/user
  fastify.get("/", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const users = await getUser()
    reply.send(users);
  });


  // POST /api/v1/user
  fastify.post("/", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const body: IUsers = request.body as IUsers;
    const user = await createNewUser(body)
    reply.send(user)
  });

  const createNewUser = async (doc: IUsers) => {
    const insertDoc = { ...doc }
    insertDoc.username = doc.username;
    insertDoc.firstname = doc.firstname;
    insertDoc.lastname = doc.lastname;

    const newUser = new Users(insertDoc)
    return await newUser.save()
  }

  const getUser = async () => {
    const users = await Users.find().lean()
    return users
  }
}