import express from "express";
import { authenticateUser } from "../middleware/authentication.js";
import {
  getMyProfile,
  updateProfile,
  deleteProfile,
  updatePassword,
  getMyChat,
  getMyChatMessages,
} from "../controllers/userController.js";

const router = express.Router();
router.use(authenticateUser);

router.get("/myChat", getMyChat);
router.get("/myMessages/:id", getMyChatMessages);

router.route("/").get(getMyProfile).patch(updateProfile).delete(deleteProfile);

router.patch("/updatePassword", updatePassword);

export default router;
