import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IBankAccountTransfer } from "../models/payment";


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
            // const { email, name, type, bank_account } = request.body as IBankAccountTransfer;
            const recp = await omise.recipients.create({
                name: 'CHANANYA SINPHICHIT',
                email: 'mottdy@gmail.com',
                type: 'individual',
                bank_account: {
                    brand: 'bbl',
                    number: '1234567890',
                    name: 'CHANANYA SINPHICHIT',
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
            console.log(recp);
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
        try {
            // const { email, name, type, bank_account } = request.body as IBankAccountTransfer;
            const transfer = await omise.transfers.create({
                amount: '140000',
                recipient: 'recp_test_5xf7lugyuikhxlwgfjc',
              });
              reply.send(transfer)
        } catch (err) {
            reply.send(err);
        }
    });
}
