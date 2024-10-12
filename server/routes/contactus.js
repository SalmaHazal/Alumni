import express from "express";
import { Addmessage } from "../controllers/contactus.js";

const router = express.Router();

router.post("/", Addmessage);

export default router;
