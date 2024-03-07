import axios from "axios";
import { IBankAccountTransfer } from "../models/payment";
import { Recipients } from "../models/recipient";

const omise = require("omise")({
    secretKey: "skey_test_5x1jr0hpfmne5jj68on"
});
export const createRecipient = async (data: IBankAccountTransfer) => {
    try {
        const recp = await omise.recipients.create(data);
        verifyRecipient(recp.id)
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

export const verifyRecipient = async (recipientId: string) => {
    const secretKey = "skey_test_5x1jr0hpfmne5jj68on"
    const headers = {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    };
    const url = `https://api.omise.co/recipients/${recipientId}/verify`;

    try {
        const response = await axios.patch(url, {}, { headers });
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

export const updateRecipient = async (recipientId:string, data: IBankAccountTransfer) => {
    console.log(data);
    console.log(recipientId);
    try {
        const recp = await omise.recipients.update(recipientId,data);
        verifyRecipient(recipientId)
        console.log(recp);
        // const recipientInfo: IBankAccountTransfer = {
        //       email: user.email,
        //       bank_account: {
        //         brand: user.bankAccount.bankName,
        //         number: user.bankAccount.bankAccountNumber,
        //         name: user.bankAccount.bankAccountName,
        //       }
        //     }
        // console.log(data);
        // await omise.recipients.update(recipientId,data);

    } catch (error) {
        console.error('Error updating recipient:', error);
    }
}
