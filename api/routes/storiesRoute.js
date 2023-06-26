import express from "express";
import { addStory, deleteStory, getStory } from "../controllers/storiesController.js";
import { verfiyToken } from "../helpers/token.js";
import { usernameValidtion } from "../validations/users.js";
import { storyIdValidation, storyImgValidation } from "../validations/posts.js";
const router = express.Router();

router.get('/', verfiyToken, usernameValidtion, getStory)
router.post('/', verfiyToken, storyImgValidation, addStory)
router.delete('/:storyId', verfiyToken, storyIdValidation, deleteStory)

export default router;