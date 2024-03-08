import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IBankAccountTransfer } from "../models/payment";
import { ErrorCode } from "../response/errorResponse";
import { getUserById, validateToken } from "../services/userService";

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
        const { amount } = request.body as { amount: string };

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
                    amount: amount,
                    recipient: user.recipient,
                });
                return reply.status(200).send(transfer);
            } catch (error: any) {
                return reply.status(401).send(ErrorCode.Unauthorized);
            }
        } else {
            return reply.status(500).send(ErrorCode.InternalServerError);
        }
    });

     // POST /api/freelance
    //  fastify.post("/transfer", async function (
    //     request: FastifyRequest,
    //     reply: FastifyReply
    // ) {
    //     try {
    //         // const { email, name, type, bank_account } = request.body as IBankAccountTransfer;
    //         const transfer = await omise.transfers.create({
    //             amount: '140000',
    //             recipient: 'recp_test_5xf7lugyuikhxlwgfjc',
    //         });
    //         reply.send(transfer)
    //     } catch (err) {
    //         reply.send(err);
    //     }
    // });
}
