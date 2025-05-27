import User from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/error-index.js";
import Chat from "../model/Chat.js";

export const getAllUsers = async (req, res) => {
  const { page = 1, role, fullName } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;
  const queryObject = {};
  if (role) {
    queryObject.role = role;
  }
  if (fullName) {
    queryObject.fullName = { $regex: fullName, $options: "i" };
  }

  const users = await User.find(queryObject)
    .select("-password")
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(queryObject);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(StatusCodes.OK).json({
    page: Number(page),
    nbHits: users.length,
    totalUsers,
    hasNextPage: page < totalPages,
    users,
  });
};

export const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError("userId needs to be provided");
  }
  const user = await User.findOne({ _id: userId })
    .select("-password")
    .populate({
      path: "chats",
      populate: {
        path: "user",
        select: "profilePicture fullName",
      },
    });
  if (!user) {
    throw new CustomError.NotFoundError("User Not Found");
  }
  res.status(StatusCodes.OK).json(user);
};

export const getOperatorChats = async (req, res) => {
  const { id: operatorId } = req.params;
  if (!operatorId) {
    throw new CustomError.BadRequestError("OperatorId needs to be provided");
  }
  const operator = await User.findOne({ role: "operator", _id: operatorId });
  if (!operator) {
    throw new CustomError.NotFoundError("Operator Not Found");
  }
  const chats = await Chat.find({ operator: operatorId })
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
      select: "text sender",
      populate: {
        path: "sender",
        select: "fullName profilePicture",
      },
    });
  res.status(StatusCodes.OK).json(chats);
};

export const getSingleChat = async (req, res) => {
  const { id: chatId } = req.params;
  if (!chatId) {
    throw new CustomError.BadRequestError("ChatId needs to be provided");
  }
  const chat = await Chat.findOne({ _id: chatId })
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
        select: "fullName profilePicture",
      },
    });
  if (!chat) {
    throw new CustomError.BadRequestError("Chat Not Found");
  }
  res.status(StatusCodes.OK).json(chat);
};

export const createOperatorAccount = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    throw new CustomError.BadRequestError("All Credentials Must Be Provided");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email already in use");
  }
  await User.create({ fullName, email, password, role: "operator" });
  res.status(StatusCodes.CREATED).json({ msg: "Operator Account Created" });
};

export const deleteAccount = async (req, res) => {
  const { id: userId } = req.params;

  await User.findOneAndDelete({ _id: userId });
  res.status(StatusCodes.OK).json({ msg: "Account Deleted" });
};
