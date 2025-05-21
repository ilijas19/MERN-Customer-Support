import User from "../model/User.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/error-index.js";

export const getAllUsers = async (req, res) => {};

export const getSingleUser = async (req, res) => {};

export const getAllOperators = async (req, res) => {};

export const getSingleOperator = async (req, res) => {};

export const getOperatorChats = async (req, res) => {};

export const getSingleChat = async (req, res) => {};

export const createOperatorAccount = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !!email || !password) {
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
