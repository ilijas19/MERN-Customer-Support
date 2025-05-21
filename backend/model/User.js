import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(e) {
          return validator.isEmail(e);
        },
        message: "Email not valid",
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "operator", "user"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg",
    },
    joinedChat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
    chats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export default mongoose.model("User", userSchema);
