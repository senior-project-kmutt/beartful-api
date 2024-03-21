import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ErrorCode } from "../response/errorResponse";
import { IReview } from '../models/review';
import { createNewReview } from "../services/reviewService";
import { validateToken } from "../services/userService";

export default async function userController(fastify: FastifyInstance) {

  fastify.post(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const body: IReview = request.body as IReview;

      try {
        if (auth) {
          const decode = validateToken(auth);
          if (!decode.id) {
            return reply.status(401).send(ErrorCode.Unauthorized);
          }
          const response = await createNewReview(body)
          return reply.status(200).send(response);
        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
      } catch (error: any) {
        if (error.message.startsWith('Validation failed')) {
          return reply.status(400).send(ErrorCode.ValidationFail);
        }
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    });

}
