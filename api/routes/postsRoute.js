import express from "express";
import { verfiyToken } from "../helpers/token.js";
import { addPost, getPosts, deletePost } from "../controllers/postsController.js";
import { paramValidation, postPostValidations, bodyPostIdValidation, postCommentValidatoins } from "../validations/posts.js";
import { getLikes, addLike, deleteLike } from "../controllers/likesController.js";
import { getComments, addComment, deleteComment } from "../controllers/commentsController.js";

const router = express.Router();

router.get("/", verfiyToken, getPosts);
router.post("/", verfiyToken, postPostValidations, addPost);
router.delete("/:postId", verfiyToken, paramValidation, deletePost);

router.route("/:postId/likes")
    .get(verfiyToken, paramValidation, getLikes)
    .delete(verfiyToken, paramValidation, deleteLike);
router.post('/likes', verfiyToken, bodyPostIdValidation, addLike)

router.route("/:postId/comments")
    .get(verfiyToken, paramValidation, getComments)
    .delete(verfiyToken, paramValidation, deleteComment);

router.post('/comments', verfiyToken, postCommentValidatoins, addComment)

export default router;
