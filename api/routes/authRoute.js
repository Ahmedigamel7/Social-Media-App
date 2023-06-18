import express from "express";
import { login, register, logout } from "../controllers/authController.js";
import { loginValidation, registerValidation } from "../validations/auth.js";
import { verfiyToken } from "../helpers/token.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", verfiyToken, logout);

export default router;
