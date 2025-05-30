//packages
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
//db
import connectDb from "./db/connectDb.js";
//middleware
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
//routes
import authRouter from "./routes/authRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/user", userRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4999;
const init = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    await connectDb();
  } catch (error) {
    console.error(error);
  }
};
init();
