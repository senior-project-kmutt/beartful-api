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

  const getArtwork = async (page?: string, pageSize?: string, type?:string) => {
    const pages = page ? parseInt(page) : 1;
    const pageSizes = pageSize ? parseInt(pageSize) : 30;
    const skip = (pages - 1) * pageSizes;

    try {
      const artworks = await Artworks.find({ type: type}).skip(skip).limit(pageSizes).exec();
      const shuffledArtworks = artworks.sort(() => Math.random() - 0.5);
      return shuffledArtworks;
    } catch (error) {
      console.error("Error fetching artworks:", error);
      throw error;
    }
  };
}
