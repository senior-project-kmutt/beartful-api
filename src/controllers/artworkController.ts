import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getArtwork } from "../services/artworkService";

export default async function artworkController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { page, pageSize, type } = request.query as {
        page: string;
        pageSize: string;
        type: string;
      };
      const artworks = await getArtwork(page, pageSize, type);
      reply.send(artworks);
    }
  );
}
