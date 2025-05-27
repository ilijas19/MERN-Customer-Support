import User from "../model/User.js";
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
  await user.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Profile deleted" });
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
