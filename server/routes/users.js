import express from "express";
import multer from "multer";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserProfile,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* Multer setup for handling file uploads */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.put("/:id", verifyToken, upload.single("picture"), updateUserProfile);

export default router;