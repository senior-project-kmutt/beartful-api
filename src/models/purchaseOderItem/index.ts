export interface IPurchaseOrderItem {
    _id?: string
    purchaseOrderId: string
    artworkId: string
    price: number
    quantity: number
    createdAt?: Date
    updatedAt?: Date
}

import mongoose from "mongoose"

const purchaseOrderItemSchema = new mongoose.Schema({
    purchaseOrderId: {
        type: String,
        required: true
    },
    artworkId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const PurchaseOrderItems = mongoose.model('purchase_order_items', purchaseOrderItemSchema)