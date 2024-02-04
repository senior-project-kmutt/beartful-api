export interface ICartItem {
    _id: string
    type: string
    description: string
    amount: number
    quantity: number
    netAmount: number
    freelanceId: string
    customerId: string
    artworkName: string
    createdAt?: Date
    updatedAt?: Date
}

export interface ICarts {
    freelanceId: string
    freelanceUsername: string
    cartItem: ICartItem[]
}

export interface ICartEdit {
    quantity: number
    netAmount: number
}

import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    amount: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        // required: true
    },
    netAmount: {
        type: String,
        required: true
    },
    freelanceId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    artworkName: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

export const Carts = mongoose.model('Carts', cartSchema)