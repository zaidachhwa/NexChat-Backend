import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

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
