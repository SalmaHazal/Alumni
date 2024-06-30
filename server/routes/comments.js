import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.delete("/:id", verifyToken, deleteComment);

export default router;
