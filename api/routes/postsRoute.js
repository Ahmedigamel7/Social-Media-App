import express from "express";
import { addPost, getPosts, deletePost } from "../controllers/postsController.js";
import { verfiyToken } from "../helpers/token.js";
import { deletePostsValidations, postPostsValidations } from "../validations/posts.js";

const router = express.Router();

// router.get("/find/:postId", getPost);
router.get("/", verfiyToken, getPosts);
router.post("/add-post", verfiyToken, postPostsValidations, addPost);
router.delete("/delete-post/:postId", verfiyToken, deletePostsValidations, deletePost);

export default router;
