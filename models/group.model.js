import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    // Chat Id
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    // Name
    name: {
      type: String,
      default: "Group Name",
      trim: true,
    },

    // Icon
    icon: {
      type: String,
      default: null,
    },

    // Description
    description: {
      type: String,
      default: "",
    },

    // createdBy
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Admins

    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Members
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", GroupSchema);
