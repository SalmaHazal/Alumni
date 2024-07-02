import express from 'express';
import { searchContent } from '../controllers/search.js';

const router = express.Router();

// Route to search posts and users
router.get('/', searchContent);

export default router;
