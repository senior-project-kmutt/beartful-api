import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Artworks } from "../models/artwork";

export default async function artworkController(fastify: FastifyInstance) {
    // GET /api/v1/artwork
    fastify.get("/", async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const artworks = await getArtwork()
        reply.send(artworks);
    });

    const getArtwork = async () => {
        const artworks = await Artworks.find().lean()
        return artworks
    }
}