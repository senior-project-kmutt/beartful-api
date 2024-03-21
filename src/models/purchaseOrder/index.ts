export interface IPurchaseOrder {
    _id?: string
    freelanceId?: string
    customerId: string
    quotationId?: string
    status: string
    amount: number
    vat?: number
    netAmount?: number
    confirmedDate?: Date
    paymentMethod: string
    estimateTimeFinished?: Date
    note: string
    type: string
    chargeId?: string
    transactionId?: string
    fee?: number
    isReview: boolean;
    createdAt?: Date
    updatedAt?: Date
}

export interface IOrder {
    purchaseOrder: IPurchaseOrder,
    artworkItem?: string
}

export interface ICustomerGetPurchaseOrder {
    freelanceId: string
    freelanceUsername: string
    order: IGetOrder[]
}

export interface IFreelanceGetPurchaseOrder {
    customerId: string
    customerUsername: string
    order: IGetOrder[]
}

export interface IGetOrder {
    purchaseOrder: IPurchaseOrder
    quotation?: IQuotation
    purchaseOrderItem?: IPurchaseOrderItem
}

export interface IPurchaseOrderDetail {
    freelance: IFreelance
    customer: ICustomer
    order: IGetOrder
}

export interface IFreelance {
    firstname: string
    lastname: string
    address: string
}

export interface ICustomer {
    firstname: string
    lastname: string
}

import mongoose from "mongoose"
import { IQuotation } from "../quotation"
import { IPurchaseOrderItem } from "../purchaseOderItem"

const purchaseOrderSchema = new mongoose.Schema({
    freelanceId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    quotationId: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    vat: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: false
    },
    netAmount: {
        type: Number,
        required: true
    },
    confirmedDate: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    estimateTimeFinished: {
        type: Date,
    },
    note: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    isReview: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

export const PurchaseOrders = mongoose.model('Purchase_orders', purchaseOrderSchema)