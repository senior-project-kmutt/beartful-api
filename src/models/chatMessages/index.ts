export interface IChatMessages {
    chat_room_id: number;
    sender: IParticipant;
    message: string;
    time: Date;
}

interface IParticipant {
    userId: number;
    role: string
}

import mongoose from "mongoose"

const chatMessagesSchema = new mongoose.Schema({
    chat_room_id: {
        type: Number,
        required: true
    },
    sender: {
        type: Object,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const ChatMessages = mongoose.model('ChatMessages', chatMessagesSchema)