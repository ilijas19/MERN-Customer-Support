import express from "express";
import { authenticateUser } from "../middleware/authentication.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();
router.use(authenticateUser);

router.route("/").post(uploadImage);

export default router;
