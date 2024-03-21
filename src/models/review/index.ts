export interface IReview {
  purchaseOrderId: string;
  score: number;
  comment?: string;
  reviewBy: string;
  reviewTo: string;
}

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    purchaseOrderId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    reviewBy: {
      type: String,
      required: true,
    },
    reviewTo: {
      type: String,
      required: true,
    },
  },
  {
    collection: "reviews",
    timestamps: true,
    versionKey: false,
  }
);

export const Review = mongoose.model("Reviews", reviewSchema);
