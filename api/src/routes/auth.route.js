import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import Roles from "../utils/Roles.js";
const router = express.Router();

router.post("/", login);
router.post("/logout", verifyToken(Object.values(Roles)), logout);

export default router;
