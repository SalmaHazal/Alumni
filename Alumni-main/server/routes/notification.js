import express from "express";
import { getNotifications, markAsRead } from "../controllers/notification.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.put("/read/:notificationId", markAsRead);

export default router;
