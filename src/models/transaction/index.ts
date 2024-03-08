export interface ICategory {
    _id: string;
    type: string;
    omiseTransactionId: string
}

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },
        omiseTransactionId: {
            type: String,
            required: true,
        },
    },
    {
        collection: "transactions",
        versionKey: false,
    }
);

export const Transactions = mongoose.model("Transactions", transactionSchema);
