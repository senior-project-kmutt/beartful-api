export interface IArtworks {
    freelanceId: number
    images: Array<string>
    name: string
    description: string
    price: string
    type: string
    categoryId: number
    likeCount: number
    createdAt: Date
    updatedAt: Date
}

import mongoose from "mongoose"

const artworkSchema = new mongoose.Schema({
    freelanceId: {
        type: String,
        required: true
    },
    images: {
        type: Array<string>,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    categoryId: {
        type: Number,
        required: true
    },
    likeCount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

export const Artworks = mongoose.model('Artworks', artworkSchema)