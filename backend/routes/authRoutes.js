import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authentication.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.delete("/logout", authenticateUser, logoutUser);
router.get("/me", authenticateUser, getCurrentUser);

export default router;
