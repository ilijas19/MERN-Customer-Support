import express from "express";
import {
  getAllUsers,
  getSingleUser,
  getOperatorChats,
  getSingleChat,
  createOperatorAccount,
  deleteAccount,
} from "../controllers/adminController.js";
import {
  authenticateUser,
  authorizePermision,
} from "../middleware/authentication.js";

const router = express.Router();
router.route("/user/:id").get(authenticateUser, getSingleUser);
router.use(authenticateUser, authorizePermision("admin"));

router.route("/operator").post(createOperatorAccount);
router.route("/user/:id").delete(deleteAccount);

router.get("/operatorChats/:id", getOperatorChats);
router.get("/users", getAllUsers);
router.get("/chat/:id", getSingleChat);

export default router;
