import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Artworks } from "../models/artwork";

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

  const getArtwork = async (page?: string, pageSize?: string, type?: string) => {
    const pages = page ? parseInt(page) : 1;
    const pageSizes = pageSize ? parseInt(pageSize) : 0;

    try {
      let query = {};
      if (type) {
        query = { type: type }
      }
      const artworksQuery = pageSizes > 0
        ? Artworks.find(query).skip((pages - 1) * pageSizes).limit(pageSizes)
        : Artworks.find(query);

      const artworks = await artworksQuery.exec();
      const shuffledArtworks = artworks.sort(() => Math.random() - 0.5);
      return shuffledArtworks;
    } catch (error) {
      console.error("Error fetching artworks:", error);
      throw error;
    }
  };
}
