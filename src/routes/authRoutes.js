import express from "express";
import { login, register, anonymousLogin } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/anonymous-login", anonymousLogin);
export default router;
