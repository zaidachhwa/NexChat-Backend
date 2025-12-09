import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    // Chat ID
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    // Sender ID
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Content
    content: {
      type: String,
      default: "",
    },

    // MediaUrl
    mediaUrl: {
      type: String,
      default: null,
    },

    // Message Type

    messageType: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },

    // Delivered To
    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Read By
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Deleted For
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);
