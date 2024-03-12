import axios from "axios";
import { IBankAccountTransfer } from "../models/payment";
import { Recipients } from "../models/recipient";

const omise = require("omise")({
    secretKey: "skey_test_5x1jr0hpfmne5jj68on"
});
export const createRecipient = async (data: IBankAccountTransfer) => {
    try {
        const recp = await omise.recipients.create(data);
        const newRecipient = {
            recipientId: recp.id,
            amount: 0
        }
        await Recipients.create(newRecipient);
        if (recp.verified == false) {
            await verifyRecipient(recp.id)
        }

        return recp.id
    } catch (err) {
        console.log(err);
    }
}

export const verifyRecipient = async (recipientId: string) => {
    const secretKey = "skey_test_5x1jr0hpfmne5jj68on"
    const headers = {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    };
    const url = `https://api.omise.co/recipients/${recipientId}/verify`;

    try {
        await axios.patch(url, {}, { headers });
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

export const markasSentandPaidTransfer = async (transferId: string) => {
    const secretKey = "skey_test_5x1jr0hpfmne5jj68on"
    const headers = {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    };
    const url = `https://api.omise.co/transfers/${transferId}/mark_as_sent`;

    try {
        const res = await axios.post(url, {}, { headers });
        if(res.status==200){
            const paidUrl = `https://api.omise.co/transfers/${transferId}/mark_as_paid`;
            await axios.post(paidUrl, {}, { headers });
        }
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

export const updateRecipient = async (recipientId: string, data: IBankAccountTransfer) => {
    try {
        const recp = await omise.recipients.update(recipientId, data);
        verifyRecipient(recipientId)
    } catch (error) {
        console.error('Error updating recipient:', error);
    }
}
