export interface IChatRoom {
    chat_room_id: number;
    paticipants: IParticipant;
}

interface IParticipant {
    userId: number;
    username: string;
    role: string;
}

import mongoose from "mongoose"

const chatRoomSchema = new mongoose.Schema({
    chat_room_id: {
        type: Number,
        required: true
    },
    participants: {
        type: Array,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const ChatRoom = mongoose.model('chat_room', chatRoomSchema)