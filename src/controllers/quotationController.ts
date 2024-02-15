import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ErrorCode } from "../response/errorResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ICreateQuotation, IQuotation } from '../models/quotation';
import { createQuotation, deleteQuotationById, getQuotationById } from '../services/quotationService';
import { validateToken } from "../services/userService";
const SECRET_KEY =
  "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";


interface IParamsGetById {
  quotationId: string
}

export default async function userController(fastify: FastifyInstance) {

  fastify.post("/", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const auth = request.headers.authorization;
    const body: ICreateQuotation = request.body as ICreateQuotation;
    if (auth) {
      try {
        const token = auth.split("Bearer ")[1];
        const decode = jwt.verify(token, SECRET_KEY) as JwtPayload;
        if (decode.role != "freelance") {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
        const response = await createQuotation(body)
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

  fastify.get("/:quotationId", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const auth = request.headers.authorization;
    const params = request.params as IParamsGetById;
    if (auth) {
      try {
        const token = auth.split("Bearer ")[1];
        jwt.verify(token, SECRET_KEY);

        const response = await getQuotationById(params.quotationId);
        console.log("res", response);
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

  fastify.delete("/:quotationId", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    try {
      const auth = request.headers.authorization;
      const params = request.params as IParamsGetById;
      if (auth) {
        try {
          const decode = validateToken(auth);
          const existingQuotation: IQuotation = await getQuotationById(params.quotationId);
          if (!existingQuotation || existingQuotation.customerId !== decode.id) {
            return reply.status(401).send(ErrorCode.Unauthorized);
          }
          return reply.send(await deleteQuotationById(params.quotationId));
        } catch (error: any) {
          return reply.status(401).send(ErrorCode.Unauthorized);
        }
      } else {
        return reply.status(500).send(ErrorCode.InternalServerError);
      }

    } catch (error) {
      if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
        return reply.status(404).send(ErrorCode.NotFound);
      }
      return reply.status(500).send(ErrorCode.InternalServerError);
    }


  });
}
