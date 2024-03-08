import { Recipients } from "../models/recipient";

export const updateRecipient = async (recipientId: string, amount: number) => {
    try {
        const recipient = await Recipients.findOne({ recipientId: recipientId });

        if (!recipient) {
            throw new Error('Recipient not found');
        }

        let oldAmount: number = recipient.amount;


        const newAmount = {
            amount: oldAmount += amount
        }

        console.log(recipientId);
        const response = await Recipients.updateOne({ recipientId: recipientId }, { $set: newAmount });
        return response;
    } catch (error) {
        console.error("Error update recipient:", error);
        throw error;
    }
};