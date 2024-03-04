export interface IRecipient {
    _id: string;
    recipientId: string;
    amount: string
}

import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema(
    {
        recipientId: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
    },
    {
        collection: "recipients",
        versionKey: false,
    }
);

export const Recipients = mongoose.model("Recipients", recipientSchema);
