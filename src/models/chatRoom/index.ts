export interface IChatRoom {
  _id: string;
  chatRoomId: number;
  paticipants: IParticipant[];
}

interface IParticipant {
  userId: string;
  username: string;
  profile_image: string;
  role: string;
}

import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const chatRoomSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: Number,
      required: true,
    },
    participants: {
      type: [participantSchema],
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
