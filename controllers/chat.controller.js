import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

export const createChat = async (req, res) => {
  try {
    const { id } = req.user;
    const { otherUserPhone } = req.body;

    if (!otherUserPhone) {
      return res.status(400).json({
        message: "This is a required field",
      });
    }

    // Check Other User

    const otherUser = await User.findOne({ phone: otherUserPhone });

    if (!otherUser) {
      return res
        .status(404)
        .json({ message: "User not found with this Phone Number" });
    }

    // Prevent self-chat
    if (otherUser._id.toString() === id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot create a chat with yourself" });
    }

    const existingChat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [otherUser._id, id] },
    });

    if (existingChat) {
      return res.status(400).json({
        message: "Chat Already exists",
        chat: existingChat,
      });
    }

    const chat = await Chat.create({
      isGroup: false,
      participants: [otherUser._id, id],
    });

    const fullChatDetails = await Chat.findById(chat._id).populate(
      "participants",
      "name about profileImage phone"
    );

    return res.status(201).json({
      message: "Chat created successfully",
      chat: fullChatDetails,
    });
  } catch (error) {
    console.error("Internal Server Error");
    return res.status(500).json({ error });
  }
};
