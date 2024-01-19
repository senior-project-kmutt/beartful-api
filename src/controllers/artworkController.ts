import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createArtwork, deleteArtwork, getArtwork, getArtworkById } from "../services/artworkService";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { IArtworkForm, IArtworks } from "../models/artwork";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

interface GetArtworkId {
  artworkId: string
}

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

  fastify.get(
    "/:artworkId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const req = request.params as GetArtworkId
      const artwork = await getArtworkById(req.artworkId);
      reply.send(artwork);
    }
  );

  fastify.post("/", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const auth = request.headers.authorization;
    const body: IArtworkForm = request.body as IArtworkForm;
    if (auth) {
      try {
        const token = auth.split("Bearer ")[1];
        const decode = jwt.verify(token, SECRET_KEY) as JwtPayload;
        const artwork: IArtworks = {
          freelanceId: decode.id,
          images: body.images,
          name: body.name,
          description: body.description,
          price: body.price,
          type: body.type,
          categoryId: body.categoryId,
          likeCount: 0
        }
        createArtwork(artwork)
      } catch (error) {
        reply.status(401).send(ErrorCode.Unauthorized);
      }
    } else {
      return reply.status(401).send(ErrorCode.Unauthorized);
    }
  });

  fastify.delete(
    "/:artworkId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const req = request.params as GetArtworkId
      reply.send(await deleteArtwork(req.artworkId));
    }
  );
}
