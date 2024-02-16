import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { IOrder, IPurchaseOrder } from "../models/purchaseOrder";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorCode } from "../response/errorResponse";
import { createOrder, createPurchaseOrderItem, getPurchaseOrderById, updatePurchaseOrderStatus } from "../services/purchaseOrderService";
import { getArtworkById } from "../services/artworkService";
import { validateToken } from "../services/userService";
import { IPurchaseOrderItem } from "../models/purchaseOderItem";
import { updateQuotationStatus } from "../services/quotationService";
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
                if (decode.role != "customer") {
                    return reply.status(401).send(ErrorCode.Unauthorized);
                }

                if (body.purchaseOrder.type === "readyMade" && body.artworkItem) {
                    try {
                        const existingArtwork = await getArtworkById(body.artworkItem);
                        if (!existingArtwork) {
                            return reply.status(404).send(ErrorCode.NotFound);
                        }
                        const purchaseOrderItem: IPurchaseOrderItem = {
                            purchaseOrderId: "",
                            artworkId: body.artworkItem,
                            name: existingArtwork.name,
                            description: existingArtwork.description,
                            price: existingArtwork.price,
                            quantity: 1
                        };

                        const purchaseOrder: IPurchaseOrder = {
                            freelanceId: body.purchaseOrder.freelanceId,
                            customerId: body.purchaseOrder.customerId,
                            quotationId: body.purchaseOrder.quotationId,
                            status: body.purchaseOrder.status,
                            amount: body.purchaseOrder.amount,
                            vat: 0,
                            netAmount: body.purchaseOrder.netAmount,
                            confirmedDate: new Date(),
                            paymentMethod: body.purchaseOrder.paymentMethod,
                            note: body.purchaseOrder.note,
                            type: body.purchaseOrder.type,
                        };
                        const response = await createOrder(purchaseOrder);
                        purchaseOrderItem.purchaseOrderId = response._id;
                        await createPurchaseOrderItem(purchaseOrderItem);
                        return reply.status(200).send(response);
                    } catch (error: any) {
                        if (error instanceof Error && error.message.includes("Cast to ObjectId failed")) {
                            return reply.status(404).send(ErrorCode.NotFound);
                        }
                        return reply.status(500).send(ErrorCode.InternalServerError);
                    }
                } else {
                    const purchaseOrder: IPurchaseOrder = {
                        freelanceId: body.purchaseOrder.freelanceId,
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
                    if (body.purchaseOrder.quotationId) {
                        const response = await createOrder(purchaseOrder);
                        updateQuotationStatus(body.purchaseOrder.quotationId, 'ordered')
                        return reply.status(200).send(response);
                    }
                }
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

    fastify.patch(
        "/:purchaseOrderId",
        async function (request: FastifyRequest, reply: FastifyReply) {
            const auth = request.headers.authorization;
            const { purchaseOrderId } = request.params as { purchaseOrderId: string };
            const body = request.body as { status: string };

            try {
                if (auth) {
                    const existingPurchaseOrder = await getPurchaseOrderById(purchaseOrderId);
                    if (!existingPurchaseOrder) {
                        return reply.status(404).send(ErrorCode.NotFound);
                    }
                    const response = await updatePurchaseOrderStatus(purchaseOrderId, { status: body.status });
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