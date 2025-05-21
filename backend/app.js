//packages
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
//db
import connectDb from "./db/connectDb.js";
//middleware
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
//routes
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);

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
