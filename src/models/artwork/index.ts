export interface IArtworks {
    freelanceId: number
    images: Array<string>
    name: string
    description: string
    price: string
    type: string
    categoryId: string[]
    likeCount: number
    createdAt?: Date
    updatedAt?: Date
}

export interface IArtworkAddForm {
    freelanceId: number
    images: Array<string>
    name: string
    description: string
    price: string
    type: string
    categoryId: string[]
}

export interface IArtworkEditForm {
    name: string
    description: string
    price: string
    type: string
    categoryId: string[]
    updatedAt: Date
}

import mongoose, { Date } from "mongoose"

const artworkSchema = new mongoose.Schema({
    freelanceId: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true,
        validate: [
            {
                validator: function (value: any) {
                    return value.length > 0;
                },
                message: "Images array must not be empty"
            },
            {
                validator: function (value: any) {
                    return value.length <= 20;
                },
                message: "Images array must contain at most 20 items"
            }
        ]
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
        type: [String],
        required: true,
        validate: {
            validator: function (value: any) {
                return value.length > 0;
            },
            message: "Category array must not be empty"
        }
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