export interface IUsers {
    username: string;
    firstname: string;
    lastname: string;
}

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

export const Users = mongoose.model('User', userSchema)