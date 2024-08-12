import express from "express";
import { createJobPost, getJobPosts} from "../controllers/jobPostController.js";
const router = express.Router();

// Route for creating a new job post
router.post('/job-posts', createJobPost);

// Route for fetching all job posts
router.get('/job-posts', getJobPosts);

export default router;
