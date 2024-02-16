import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getCategory } from "../services/categoryService";
import { ErrorCode } from "../response/errorResponse";

export default async function categoryController(fastify: FastifyInstance) {
    fastify.get(
        "/",
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                const categories = await getCategory();
                return reply.status(200).send(categories);
            } catch (error) {
                return reply.status(500).send(ErrorCode.InternalServerError);
            }
        }
    );

}
