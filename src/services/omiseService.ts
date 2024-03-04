import axios from "axios";
import { IBankAccountTransfer } from "../models/payment";
import { Recipients } from "../models/recipient";

const omise = require("omise")({
    secretKey: "skey_test_5x1jr0hpfmne5jj68on"
});
export const createRecipient = async (data: IBankAccountTransfer) => {
    try {
        const recp = await omise.recipients.create(data);
        const secretKey = 'skey_test_5x1jr0hpfmne5jj68on'

        const headers = {
            Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        };
        const url = `https://api.omise.co/recipients/${recp.id}/verify`;

        try {
            const response = await axios.patch(url, {}, { headers });
        } catch (error: any) {
            console.error('Error:', error.message);
        }
        const newRecipient = {
            recipientId: recp.id,
            amount: 0
        }
        await Recipients.create(newRecipient);
        return recp.id
    } catch (err) {
        console.log(err);
    }
}
