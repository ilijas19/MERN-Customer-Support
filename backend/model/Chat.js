import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    operator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
