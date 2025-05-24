import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import User from "../model/User.js";
import CustomError from "../errors/error-index.js";
import createTokenUser from "../utils/createTokenUser.js";
import Token from "../model/Token.js";
import { attachCookiesToResponse } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !fullName || !password) {
    throw new CustomError.BadRequestError("All Credentials Must Be Provided");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new CustomError.BadRequestError("Email Already In Use");
  }
  await User.create({ fullName, email, password });
  res.status(StatusCodes.OK).json({ msg: "Account Created Successfully" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All Credentials Must Be Provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  const exsistingToken = await Token.findOne({ user: tokenUser.userId });
  if (exsistingToken) {
    attachCookiesToResponse({
      res,
      user: tokenUser,
      refreshToken: exsistingToken.refreshToken,
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfully", currentUser: tokenUser });
  }
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  await Token.create({ user: tokenUser.userId, refreshToken, ip, userAgent });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "Login Successfully" });
};

export const logoutUser = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  await Token.findOneAndDelete({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

export const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ currentUser: req.user });
};
