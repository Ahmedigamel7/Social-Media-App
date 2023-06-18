import express from "express";
import {
     follow,
     deletefollow,
     getFollower,
} from "../controllers/followsController.js";

const router = express.Router();

router.get("/", getFollower);
router.post("/", follow);
router.delete("/", deletefollow);

export default router;
