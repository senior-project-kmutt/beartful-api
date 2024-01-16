export interface IUsers {
    _id: string;
    email: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    profileImage: string;
    role: string;
    phoneNumber: string;   
}

export interface IUserLogin {
    username: string;
    password: string;
}

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Users = mongoose.model('Users', userSchema)