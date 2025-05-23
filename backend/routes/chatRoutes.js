import express from "express";
import {
  createChat,
  deleteChat,
  getMyChats,
  getSingleChat,
  getChatMessages,
  closeChat,
  openChat,
} from "../controllers/chatController.js";
import { createMessageApi } from "../controllers/messageController.js";

import {
  authenticateUser,
  authorizePermision,
} from "../middleware/authentication.js";
const router = express.Router();

router.use(authenticateUser, authorizePermision("operator"));

router.post("/message", createMessageApi);

router.route("/").post(createChat).get(getMyChats);
router.post("/close/:id", closeChat);
router.post("/open/:id", openChat);
router.get("/messages/:id", getChatMessages);

router.route("/:id").delete(deleteChat).get(getSingleChat);

export default router;
