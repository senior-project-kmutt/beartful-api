export interface ICategory {
    _id: string;
    name: string;
}

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        collection: "categories",
        timestamps: true,
        versionKey: false,
    }
);

export const Category = mongoose.model("Categories", categorySchema);
