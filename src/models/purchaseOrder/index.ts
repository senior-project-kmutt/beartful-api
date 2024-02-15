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
}, {
    timestamps: true,
    versionKey: false
})

export const PurchaseOrders = mongoose.model('Purchase_orders', purchaseOrderSchema)