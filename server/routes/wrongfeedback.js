import express from "express";
import { AddWrongFeedback } from "../controllers/feedbacks.js"; // Corrected import

const router = express.Router();

router.post("/", AddWrongFeedback);

export default router;
