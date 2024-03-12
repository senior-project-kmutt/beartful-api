import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IBankAccountTransfer } from "../models/payment";
import { ErrorCode } from "../response/errorResponse";
import { getUserById, validateToken } from "../services/userService";
import { createTransaction } from "../services/purchaseOrderService";
import { updateRecipient } from "../services/recipientService";
import { markasSentandPaidTransfer } from "../services/omiseService";

const omise = require("omise")({
    secretKey: "skey_test_5x1jr0hpfmne5jj68on"
});

export default async function accountController(fastify: FastifyInstance) {
    // POST /api/freelance
    fastify.post("/recipient", async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { email, name, bank_account } = request.body as IBankAccountTransfer;
            const recp = await omise.recipients.create({
                name: name,
                email: email,
                type: 'individual',
                bank_account: {
                    brand: bank_account.brand,
                    number: bank_account.number,
                    name: bank_account.name,
                },
            });
            reply.send(recp)
        } catch (err) {
            console.log(err);
        }
    });
    // GET /api/freelance
    fastify.get("/recipient/:id", async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const recp = await omise.recipients.retrieve('recp_test_5xf7lugyuikhxlwgfjc');
            reply.send(recp)
        } catch (err) {
            reply.send(err)
        }
    });
    // POST /api/freelance
    fastify.post("/transfer", async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const auth = request.headers.authorization;
        const { amount } = request.body as { amount: number };

        if (auth) {
            try {
                const decode = validateToken(auth);
                if (!decode.id) {
                    return reply.status(401).send(ErrorCode.Unauthorized);
                }
                if (decode.role != "freelance") {
                    return reply.status(401).send(ErrorCode.Unauthorized);
                }
                const user = await getUserById(decode.id)
                const transfer = await omise.transfers.create({
                    amount: amount * 100,
                    recipient: user[0].recipientId,
                });
                await markasSentandPaidTransfer(transfer.id)
                if (decode.id) {
                    await createTransaction('transfer', transfer.id, decode.id, amount)
                    await updateRecipient(user[0].recipientId, amount, 'transfer')
                }
                return reply.status(200).send(transfer);
            } catch (error: any) {
                reply.code(400).send({ error: error.message });
            }
        } else {
            return reply.status(500).send(ErrorCode.InternalServerError);
        }
    });

}
