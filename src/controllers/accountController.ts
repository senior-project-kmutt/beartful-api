import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IBankAccountTransfer } from "../models/payment";


const omise = require("omise")({
    secretKey: "skey_test_5x1jr0hpfmne5jj68on"
});

export default async function accountController(fastify: FastifyInstance) {
    // POST /api/freelance/account
    fastify.post("/recipient", async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            // const { email, name, type, bank_account } = request.body as IBankAccountTransfer;
            const recp = await omise.recipients.create({
                name: 'Somchai Prasert',
                email: 'somchai.prasert@example.com',
                type: 'individual',
                bank_account: {
                    brand: 'bbl',
                    number: '1234567890',
                    name: 'SOMCHAI PRASERT',
                },
            });
        } catch (err) {
            console.log(err);
        }
    });
    // GET /api/freelance/account
    fastify.get("/recipient/:id", async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const recp = await omise.recipients.retrieve('recp_test_5xebhs7djlayalflevs');
            console.log(recp);
            reply.send(recp)
        } catch (err) {
            reply.send(err)
        }
    });
}
