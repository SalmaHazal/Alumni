import express from 'express';
import { searchContent, searchpromo } from '../controllers/search.js';
import { searchUser } from '../controllers/search.js';

const router = express.Router();

router.get('/', searchContent);
router.post('/users', searchUser);
router.post('/promo', searchpromo);

export default router;