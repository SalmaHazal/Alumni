import express from "express";
import { getFeedPosts, getUserPosts, likePost, getPostReaction } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.get("/:postId/reaction", verifyToken, getPostReaction);

export default router;
