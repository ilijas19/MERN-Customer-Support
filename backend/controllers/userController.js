import User from "../model/User.js";
import Chat from "../model/Chat.js";
import Message from "../model/Message.js";
import CustomError from "../errors/error-index.js";
import { StatusCodes } from "http-status-codes";

export const getMyProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  res.status(StatusCodes.OK).json(user);
};

export const updateProfile = async (req, res) => {
  const { fullName, email, profilePicture } = req.body;
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new CustomError.BadRequestError("Email already in use");
    }
  }
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.profilePicture = profilePicture || user.profilePicture;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Profile Updated" });
};

export const deleteProfile = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new CustomError.BadRequestError("Password must be provided");
  }

  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Wrong Password");
  }

  // Delete related chats and messages based on role
  if (user.role === "operator") {
    const operatorChats = await Chat.find({ operator: user._id });
    const chatIds = operatorChats.map((chat) => chat._id);

    await Message.deleteMany({ chat: { $in: chatIds } });
    await Chat.deleteMany({ operator: user._id });
  }

  if (user.role === "user" && user.joinedChat) {
    const chat = await Chat.findOne({ user: user._id });
    if (chat) {
      await Message.deleteMany({ chat: chat._id });
      await chat.deleteOne();
    }
  }

  await user.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Profile and related data deleted" });
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, reNewPassword } = req.body;
  if (!oldPassword || !newPassword || !reNewPassword) {
    throw new CustomError.BadRequestError("Passwords needs to be provided");
  }
  if (newPassword !== reNewPassword) {
    throw new CustomError.BadRequestError("New Passwords do not match");
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Wrong Password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};

export const getMyChat = async (req, res) => {
  const user = await User.findOne({
    _id: req.user.userId,
    role: "user",
  });
  if (!user) {
    throw new CustomError.BadRequestError("User Not Found");
  }
  if (!user.joinedChat) {
    throw new CustomError.BadRequestError("You Have No Active Conversation");
  }

  const chat = await Chat.findOne({ _id: user.joinedChat })
    .populate({
      path: "operator",
      select: "fullName profilePicture",
    })
    .populate({
      path: "user",
      select: "fullName profilePicture",
    });

  if (!chat) {
    throw new CustomError.BadRequestError("Chat Not Found");
  }
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const chatMessages = await Message.find({ chat: chat._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "sender",
      select: "fullName profilePicture",
    })
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({ chat: chat._id });
  const totalPages = Math.ceil(totalMessages / limit);
  const hasNextPage = page < totalPages;

  res.status(StatusCodes.OK).json({
    page: +page,
    hasNextPage,
    nbHits: chatMessages.length,
    chat,
    chatMessages,
  });
};

export const getMyChatMessages = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("Chat id needs to be provided");
  }
  const user = await User.findOne({
    _id: req.user.userId,
    role: "user",
  });
  if (!user) {
    throw new CustomError.BadRequestError("User Not Found");
  }
  if (!user.joinedChat) {
    throw new CustomError.BadRequestError("You Have No Active Conversation");
  }

  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const chatMessages = await Message.find({ chat: chatId })
    .sort({ createdAt: -1 })
    .populate({
      path: "sender",
      select: "fullName profilePicture",
    })
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({ chat: chatId });
  const totalPages = Math.ceil(totalMessages / limit);
  const hasNextPage = page < totalPages;

  res.status(StatusCodes.OK).json({
    page: +page,
    hasNextPage,
    nbHits: chatMessages.length,
    messages: chatMessages,
  });
};
