import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getCategory } from "../services/categoryService";

export default async function categoryController(fastify: FastifyInstance) {
    fastify.get(
        "/",
        async function (request: FastifyRequest, reply: FastifyReply) {
            const categories = await getCategory();
            reply.send(categories);
        }
    );
}
