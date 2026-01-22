import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

// Send Messages
export const sendMessage = async (req, res) => {
  try {
    const { id } = req.user;
    const { chatId } = req.params;
    const { content, messageType = "text" } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const message = await Message.create({
      senderId: id,
      chatId,
      content,
      messageType,
    });

    // Update lastMessage fields
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message });

    // Populate fields
    const fullMessage = await Message.findById(message._id).populate(
      "senderId",
      "name profileImage phone"
    );

    req.io.to(chatId).emit("emit_message", fullMessage);

    return res.status(201).json({
      message: "Message sent sucessfully",
      data: fullMessage,
    });
  } catch (error) {
    console.error("Internal Server Error");
    return res.status(500).json({ error });
  }
};

// Get Messages
export const getMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { id } = req.user;

    const message = await Message.find({
      chatId,
      deletedFor: { $ne: id },
    })
      .populate("senderId", "name phone")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Message Fetched Successfully",
      message,
    });
  } catch (error) {
    // console.error("Internal Server Error");
    console.log(error, "error");
    return res.status(500).json({ error });
  }
};

export const deleteForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { id } = req.user;

    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { deletedFor: id },
    });

    return res.status(200).json({
      message: "Message deleted for you",
    });
  } catch (error) {
    console.error("Internal Server Error");
    return res.status(500).json({ error });
  }
};

export const deleteForEveryOne = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(messageId, {
      content: "This message is deleted for everyone",
      mediaUrl: null,
    });

    return res.status(200).json({
      message: "Message deleted for everyone",
    });
  } catch (error) {
    console.error("Internal Server Error");
    return res.status(500).json({ error });
  }
};
