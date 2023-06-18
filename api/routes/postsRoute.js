import express from "express";
import {
     addPost,
     getPosts,
     deletePost,
} from "../controllers/postsController.js";

const router = express.Router();

// router.get("/find/:postId", getPost);
router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
