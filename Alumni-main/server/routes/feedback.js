import express from "express";
import { AddFeedback } from "../controllers/feedbacks.js"; // Named import

const router = express.Router();

router.post("/", AddFeedback);


export default router;
