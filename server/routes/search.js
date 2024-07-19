import express from 'express';
import { searchContent } from '../controllers/search.js';
import { searchUser } from '../controllers/search.js';

const router = express.Router();

router.get('/', searchContent);
router.post('/users', searchUser);

export default router;