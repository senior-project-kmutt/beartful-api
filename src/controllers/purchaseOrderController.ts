import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { IOrder, IPurchaseOrder } from "../models/purchaseOrder";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { IPurchaseOrderItem } from "../models/purchaseOderItem";
import { createOrder, createPurchaseOrderItem } from "../services/purchaseOrderService";
import { getArtworkById } from "../services/artworkService";
const SECRET_KEY =
    "1aaf3ffe4cf3112d2d198d738780317402cf3b67fd340975ec8fcf8fdfec007b";

export default async function purchaseOrderController(fastify: FastifyInstance) {
    fastify.post("/", async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const auth = request.headers.authorization;
        const body = request.body as IOrder;
        try {
            if (auth) {
                const token = auth.split("Bearer ")[1];
                const decode = jwt.verify(token, SECRET_KEY) as JwtPayload;
                if (decode.role != "freelance") {
                    return reply.status(401).send(ErrorCode.Unauthorized);
                }

                const purchaseOrder: IPurchaseOrder = {
                    freelanceId: decode.id,
                    customerId: body.purchaseOrder.customerId,
                    quotationId: body.purchaseOrder.quotationId,
                    status: body.purchaseOrder.status,
                    amount: body.purchaseOrder.amount,
                    vat: 0,
                    netAmount: body.purchaseOrder.amount,
                    confirmedDate: new Date(),
                    paymentMethod: body.purchaseOrder.paymentMethod,
                    note: body.purchaseOrder.note,
                    type: body.purchaseOrder.type,
                };
                const response = await createOrder(purchaseOrder);

                if (response && body.purchaseOrder.type === "readyMade") {
                    body.artworkItem.forEach(async item => {
                        const existingArtwork = await getArtworkById(item);
                        const purchaseOrderItem: IPurchaseOrderItem = {
                            purchaseOrderId: response._id,
                            artworkId: item,
                            price: existingArtwork.price,
                            quantity: 1
                        }
                        await createPurchaseOrderItem(purchaseOrderItem);
                    })
                }

                return reply.status(200).send(response);

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
