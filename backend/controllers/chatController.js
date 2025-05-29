///predicted only for operators
import Chat from "../model/Chat.js";
import Message from "../model/Message.js";
import User from "../model/User.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";

const createChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new CustomError.BadRequestError("User id needs to be provided");
  }
  const user = await User.findOne({ _id: userId, role: "user" });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }

  const isInChat = await Chat.findOne({ user: userId });
  if (isInChat) {
    throw new CustomError.BadRequestError("User is already in chat");
  }
  const chat = await Chat.create({ operator: req.user.userId, user: userId });

  const populatedChat = await Chat.findOne({ _id: chat._id })
    .populate({
      path: "operator",
      select: "fullName profilePicture",
    })
    .populate({
      path: "user",
      select: "fullName profilePicture",
    });

  const operator = await User.findOne({ _id: req.user.userId });
  operator.chats.push(chat._id);
  user.joinedChat = chat._id;
  await operator.save();
  await user.save();
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Chat Created", chat: populatedChat });
};

const deleteChat = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("ChatId needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId, operator: req.user.userId });
  if (!chat) {
    throw new CustomError.NotFoundError("You dont have chat with specified id");
  }
  const user = await User.findOne({ _id: chat.user });
  const operator = await User.findOne({ _id: req.user.userId });

  operator.chats = operator.chats.filter((chat) => chat.toString() !== chatId);
  user.joinedChat = null;

  await Promise.all([
    operator.save(),
    user.save(),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  res.status(StatusCodes.OK).json({ msg: "Chat Deleted" });
};

const getMyChats = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const totalChats = await Chat.countDocuments({ operator: req.user.userId });
  const totalPages = Math.ceil(totalChats / limit);

  const chats = await Chat.find({ operator: req.user.userId })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "user",
      select: "fullName profilePicture",
    })
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "fullName",
      },
    });

  res.status(StatusCodes.OK).json({
    page: Number(page),
    totalChats,
    hasNextPage: page < totalPages,
    chats,
  });
};

const getSingleChat = async (req, res) => {
  //populate
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("ChatId needs to be provided");
  }
  const chat = await Chat.findOne({
    _id: chatId,
    operator: req.user.userId,
  })
    .populate({
      path: "operator",
      select: "fullName profilePicture",
    })
    .populate({
      path: "user",
      select: "fullName profilePicture",
    })
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "fullName",
      },
    });
  if (!chat) {
    throw new CustomError.NotFoundError("Chat not foun`d in your chats");
  }
  res.status(StatusCodes.OK).json(chat);
};

const getChatMessages = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("ChatId needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId, operator: req.user.userId });
  if (!chat) {
    throw new CustomError.NotFoundError("Chat not found in your chats");
  }
  const messages = await Message.find({ chat: chatId }).populate({
    path: "sender",
    select: "username profilePicture",
  });
  res.status(StatusCodes.OK).json({ messages });
};

const closeChat = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("ChatId needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId, operator: req.user.userId });
  if (!chat) {
    throw new CustomError.NotFoundError("You dont have chat with specified id");
  }
  chat.isActive = false;
  await chat.save();
  res.status(StatusCodes.OK).json({ msg: "Chat Closed" });
};

const openChat = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("ChatId needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId, operator: req.user.userId });
  if (!chat) {
    throw new CustomError.NotFoundError("You dont have chat with specified id");
  }
  chat.isActive = true;
  await chat.save();
  res.status(StatusCodes.OK).json({ msg: "Chat Opened" });
};

export {
  createChat,
  deleteChat,
  getMyChats,
  getSingleChat,
  getChatMessages,
  closeChat,
  openChat,
};
