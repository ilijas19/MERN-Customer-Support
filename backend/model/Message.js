import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "image"],
      default: "message",
      required: true,
    },
    text: {
      type: String,
      required: function () {
        return this.type === "message";
      },
    },
    imageUrl: {
      type: String,
      required: function () {
        return this.type === "image";
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
