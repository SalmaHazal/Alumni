import express from "express";
import { Changepassword } from "../controllers/changepassword.js";

const router = express.Router();


router.post('/pass', Changepassword);

export default router;
