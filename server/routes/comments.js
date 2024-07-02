import express from "express";
import {
  getComments,
  addComment,
} from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);

export default router;
