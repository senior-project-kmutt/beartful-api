export interface IChatRoom {
  _id: string;
  chatRoomId: number;
  participants: string[] | IParticipant[];
}

export interface IParticipant {
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  profile_image: string;
  role: string;
  createdAt: string
}

import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: Number,
      required: true,
    },
    participants: {
      type: Array,
      required: true,
    },
  },
  {
    collection: "chat_room",
    timestamps: true,
    versionKey: false,
  }
);

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
