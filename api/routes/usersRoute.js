import express from "express";
import { getUser, updateUser } from "../controllers/usersController.js";
import { verfiyToken } from "../helpers/token.js";
import { getUserValidation, putUserValidations } from "../validations/users.js";

const router = express.Router();

router.route('/')
    .get(verfiyToken, getUserValidation, getUser)
    .put(verfiyToken, putUserValidations, updateUser);

export default router;
