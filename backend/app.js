//packages
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import path from "path";
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
//socket
import socketSetup from "./socket/socketSetup.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(
  cors({
    origin: ["frontend-origin.ur", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/user", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/:path(*)", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: ["frontend-origin.ur", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socketSetup(io, socket);
});

const port = process.env.PORT || 4999;
const init = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    await connectDb();
  } catch (error) {
    console.error(error);
  }
};
init();
