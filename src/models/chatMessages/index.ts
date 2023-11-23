export interface IChatMessages {
    chat_room_id: string;
    sender: string;
    message: string;
}

interface IParticipant {
    userId: number;
    role: string
}

import mongoose from "mongoose"

const chatMessagesSchema = new mongoose.Schema({
    chat_room_id: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    collection: 'chat_messages',
    timestamps: true,
    versionKey: false
})

export const ChatMessages = mongoose.model('ChatMessages', chatMessagesSchema)