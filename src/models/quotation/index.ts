export interface IQuotation {
  _id: string;
  quotationNumber: string;
  customerUsername: string;
  freelanceUsername: string;
  customerName: string;
  freelanceName: string;
  name: string;
  benefits: string;
  numberOfEdit: number;
  startDate: Date;
  endDate: Date;
  day: number;
  quatity: number;
  amount: number;
  note: string;
  confirmQuotation: string;
  status: string
}

import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
    },
    customerUsername: {
      type: String,
      required: true,
    },
    freelanceUsername: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    freelanceName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    numberOfEdit: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    quatity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    confirmQuotation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    collection: "quotations",
    timestamps: true,
    versionKey: false,
  }
);

export const Quotation = mongoose.model("Quotations", quotationSchema);
