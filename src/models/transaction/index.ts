export interface ITransaction {
    transaction: globalThis.Date;
    _id: string;
    type: string;
    omiseTransactionId: string;
    amount: number;
    freelanceId: string;
    from?: string;
    createdAt: Date;
    updatedAt: Date;
}

import mongoose, { Date } from "mongoose";

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
        },
        from: {
            type: String,
            required: false,
        }
    },
    {
        collection: "transactions",
        timestamps: true,
        versionKey: false,
    }
);

export const Transactions = mongoose.model("Transactions", transactionSchema);
