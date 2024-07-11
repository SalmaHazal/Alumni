import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import locationRoutes from "./routes/locations.js";
import commentRoutes from "./routes/comments.js";
import searchRoutes from "./routes/search.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { updateUserProfile } from "./controllers/users.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontendURL);
  next();
});
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true  // Enable credentials
}));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/*ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);  // we we add new picture to our project
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.put("/users/:id", verifyToken, upload.single("picture"), updateUserProfile);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/locations", locationRoutes);
app.use("/search", searchRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connection successfull");
  } catch (error) {
    console.log("server connection is failed");
  }
};

// Listening to the requests
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port " + PORT);

  /* add data at once */
  // User.insertMany(users);
  // Post.insertMany(posts);
});
