export interface ITransaction {
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
        freelanceId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        }
    },
    {
        collection: "transactions",
        timestamps: true,
        versionKey: false,
    }
);

export const Transactions = mongoose.model("Transactions", transactionSchema);
