import express from "express";
import { getLikes } from "../controllers/likesController.js";
import { addLike, deleteLike } from "../controllers/likesController.js";

const router = express.Router();

router.get("/", getLikes);
router.post("/", addLike);
router.delete("/", deleteLike);

export default router;
