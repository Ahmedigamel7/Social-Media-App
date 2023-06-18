import express from "express";
import { getUser, updateUser } from "../controllers/usersController.js";
import { verfiyToken } from "../helpers/token.js";

const router = express.Router();

router.put("/", updateUser);
router.get("/find/:userId", verfiyToken, getUser);

export default router;
