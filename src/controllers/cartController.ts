import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ICartEdit, ICartItem } from "../models/cart";
import { validateToken } from "../services/userService";
import { deleteCart, getCartById, updateCart } from "../services/cartService";
import { ErrorCode } from "../response/errorResponse";

interface CartId {
    cartId: string;
}

export default async function cartController(fastify: FastifyInstance) {
    fastify.patch("/:cartId", async function (request: FastifyRequest, reply: FastifyReply) {
        const auth = request.headers.authorization;
        const { cartId } = request.params as CartId;
        const body = request.body as ICartEdit;

        try {
            if (auth) {
                const decode = validateToken(auth);
                const existingCart: ICartItem = await getCartById(cartId);

                if (!existingCart || existingCart.customerId !== decode.id) {
                    return reply.status(403).send(ErrorCode.Forbidden);
                }
                const updatedCart: ICartEdit = {
                    quantity: body.quantity || existingCart.quantity,
                    netAmount: body.quantity * existingCart.amount
                };

                await updateCart(cartId, updatedCart);

                return reply.status(200).send(updatedCart);
            } else {
                return reply.status(401).send(ErrorCode.Unauthorized);
            }
        } catch (error) {
            console.error(error);
            return reply.status(500).send(ErrorCode.InternalServerError);
        }
    });

    fastify.delete(
        "/:cartId",
        async function (request: FastifyRequest, reply: FastifyReply) {
            const auth = request.headers.authorization;
            const { cartId } = request.params as CartId;
            try {
                if (auth) {
                    const decode = validateToken(auth);
                    const existingCart: ICartItem = await getCartById(cartId);
                    if (!existingCart || existingCart.customerId !== decode.id) {
                        return reply.status(403).send(ErrorCode.Forbidden);
                    }
                    return reply.send(await deleteCart(cartId));
                } else {
                    return reply.status(401).send(ErrorCode.Unauthorized);
                }
            } catch (error) {
                console.error(error);
                return reply.status(500).send(ErrorCode.InternalServerError);
            }
        }
    );
}
