import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ICreditCardPayment } from "../models/payment";
// const omise = require("omise")({
//     publicKey: process.env.OMISE_PUBLIC_KEY,
//     secretKey: process.env.OMISE_SECRET_KEY
//   });

const omise = require("omise")({
  publicKey: "pkey_test_5x1jqlva0xb31kk0ubw",
  secretKey: "skey_test_5x1jr0hpfmne5jj68on"
});

export default async function checkoutController(fastify: FastifyInstance) {
    // POST /api/checkout
    fastify.post("/credit-card", async function (
      request: FastifyRequest,
      reply: FastifyReply
    ) {
        try {
            const { email, name, amount, token } = request.body as ICreditCardPayment;
        
            const customer = await omise.customers.create({
              email,
              description: `${name}, id (123)`,
              card: token
            });
        
            const charge = await omise.charges.create({
              amount: amount,
              currency: "thb",
              customer: customer.id
            });
        
            reply.send({
              authorizeUri: charge.authorize_uri,
              status: charge.status,
              amount: charge.amount / 100
            });
          } catch (err) {
            console.log(err);
          }
    });
  }
  