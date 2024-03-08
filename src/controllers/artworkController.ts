import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createArtwork, deleteArtwork, getArtwork, getArtworkById, updateArtwork } from "../services/artworkService";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { IArtworkAddForm, IArtworkEditForm, IArtworks } from "../models/artwork";
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
    const body: IArtworkAddForm = request.body as IArtworkAddForm;
    if (auth) {
      try {
        const token = auth.split("Bearer ")[1];
        const decode = jwt.verify(token, SECRET_KEY) as JwtPayload;
        if (decode.role != "freelance") {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
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
        const response = await createArtwork(artwork)
        return reply.status(200).send(response);
      } catch (error: any) {
        if (error.message.startsWith('Validation failed')) {
          return reply.status(400).send(ErrorCode.ValidationFail);
        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
      }
    } else {
      return reply.status(500).send(ErrorCode.InternalServerError);
    }
  });

  fastify.delete(
    "/:artworkId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const req = request.params as GetArtworkId
      try {
        if (auth) {
          const decode = validateToken(auth);

          const existingArtwork = await getArtworkById(req.artworkId);
          if (existingArtwork.freelanceId !== decode.id) {
            return reply.status(401).send(ErrorCode.Unauthorized);
          }

        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
        await deleteArtwork(req.artworkId)
        reply.status(200).send({ message: "delete artwork successfully" })

      } catch (error: any) {
        if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
          return reply.status(404).send(ErrorCode.NotFound);
        }
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    }
  );

  fastify.patch(
    "/:artworkId",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const auth = request.headers.authorization;
      const { artworkId } = request.params as GetArtworkId;
      const body: IArtworkAddForm = request.body as IArtworkAddForm;

      try {
        if (auth) {
          const decode = validateToken(auth);

          const existingArtwork = await getArtworkById(artworkId);
          if (existingArtwork.freelanceId !== decode.id) {
            return reply.status(401).send(ErrorCode.Unauthorized);
          }

          const updatedArtwork: IArtworkEditForm = {
            name: body.name || existingArtwork.name,
            description: body.description || existingArtwork.description,
            price: body.price || existingArtwork.price,
            type: body.type || existingArtwork.type,
            categoryId: body.categoryId || existingArtwork.categoryId,
            updatedAt: new Date() as any
          };

          await updateArtwork(artworkId, updatedArtwork);
          return reply.status(200).send(updatedArtwork);
        } else {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
      } catch (error: any) {
        if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
          return reply.status(404).send(ErrorCode.NotFound);
        }
        return reply.status(500).send(ErrorCode.InternalServerError);
      }
    });
}

const validateToken = (auth: string) => {
  try {
    const token = auth.split("Bearer ")[1];
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};