import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Artworks } from "../models/artwork";

export default async function artworkController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { page, pageSize } = request.query as {
        page: string;
        pageSize: string;
      };
      const artworks = await getArtwork(page, pageSize);
      reply.send(artworks);
    }
  );

  const getArtwork = async (page?: string, pageSize?: string) => {
    const pages = page ? parseInt(page) : 1;
    const pageSizes = pageSize ? parseInt(pageSize) : 30;
    const skip = (pages - 1) * pageSizes;

    try {
      const artworks = await Artworks.find().skip(skip).limit(pageSizes).exec();
      return artworks;
    } catch (error) {
      console.error("Error fetching artworks:", error);
      throw error;
    }
  };
}
