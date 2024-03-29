import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ICreditCardPayment } from "../models/payment";
import axios from "axios";

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
        amount: amount * 100,
        currency: "thb",
        customer: customer.id
      });

      reply.status(200).send({
        charge
      });
    } catch (err: any) {
      console.log(err);
      reply.code(400).send({ error: err.message });
    }
  });
  // POST /api/checkout
  fastify.post("/prompt-pay", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { email, name, amount, token } = request.body as ICreditCardPayment;

      const charge = await omise.charges.create({
        amount: amount * 100,
        currency: "THB",
        source: token
      })

      const secretKey = 'skey_test_5x1jr0hpfmne5jj68on'

      const headers = {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
      };
      const url = `https://api.omise.co/charges/${charge.id}/mark_as_paid`;

      try {
        const response = await axios.post(url, {}, { headers });
        console.log('Response:', response.data);
      } catch (error: any) {
        console.error('Error:', error.message);
      }

      reply.status(200).send(charge);
    } catch (err: any) {
      console.log(err);
      reply.code(400).send({ error: err.message });
    }
  });
  // POST /api/checkout
  fastify.post("/internet-banking", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // const { email, name, amount, token } = request.body as ICreditCardPayment;
      const sources = await omise.sources.create({
        amount: 300000,
        currency: 'THB',
        type: 'internet_banking_bay'
      });
      const charge = await omise.charges.create({
        amount: 300000,
        currency: "THB",
        source: sources.id,
        return_uri: "https://www.google.com/"
      })
      reply.send(charge);
    } catch (err) {
      console.log(err);
    }
  });
}
