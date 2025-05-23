import Message from "../model/Message.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";
import Chat from "../model/Chat.js";

export const createMessageApi = async (req, res) => {
  const { chatId, type = "message", text, imageUrl } = req.body;
  const senderId = req.user.userId;

  if (!chatId) {
    throw new CustomError.BadRequestError("Chat ID is required");
  }

  const chat = await Chat.findOne({ _id: chatId });
  if (!chat) {
    throw new CustomError.NotFoundError("Chat Not Found");
  }

  const isAuthorized =
    chat.operator.toString() === senderId || chat.user.toString() === senderId;

  if (!isAuthorized) {
    throw new CustomError.ForbiddenError("You're not part of this chat");
  }

  let message;
  if (type === "message") {
    if (!text?.trim()) {
      throw new CustomError.BadRequestError("Text must be provided");
    }
    message = await Message.create({
      chat: chatId,
      sender: senderId,
      type,
      text: text.trim(),
    });
  } else if (type === "image") {
    if (!imageUrl?.trim()) {
      throw new CustomError.BadRequestError("Image URL must be provided");
    }
    message = await Message.create({
      chat: chatId,
      sender: senderId,
      type,
      imageUrl: imageUrl.trim(),
    });
  } else {
    throw new CustomError.BadRequestError("Invalid message type");
  }

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });

  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "Message created", message });
};

export const createMessage = async () => {};
