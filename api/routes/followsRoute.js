import express from "express";
import {
     follow,
     unfollow,
     getFollowers,
} from "../controllers/followsController.js";
import { verfiyToken } from "../helpers/token.js";
import { bodyUsernameValidation, paramUsernameValidation, queryUsernameValidation } from "../validations/users.js";

const router = express.Router();

router.get("/", verfiyToken, queryUsernameValidation, getFollowers);
router.post("/", verfiyToken, bodyUsernameValidation, follow);
router.delete("/:followedUsername", verfiyToken, paramUsernameValidation, unfollow);

export default router;
