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
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import locationRoutes from "./routes/locations.js";
import commentRoutes from "./routes/comments.js";
import searchRoutes from "./routes/search.js";
import updateLinks from "./routes/updateLinks.js";
import notificationRoutes from "./routes/notification.js";
import jobPostRoutes from "./routes/jobPostRoutes.js";
import feedbackRoutes from "./routes/feedback.js";
import wrongfeedbackRoutes from "./routes/wrongfeedback.js";
import { register } from "./controllers/auth.js";
import contactusRoutes from "./routes/contactus.js";
import { createPost } from "./controllers/posts.js";
import { updateUserProfile } from "./controllers/users.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import { app, server } from "./socket/index.js";
import bcrypt from 'bcrypt';


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
//


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Enable credentials
  })
);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/documents", express.static(path.join(__dirname, "public/documents")));

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.send({ Status: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset_password/${user._id}/${token}`;

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Password Link",
      html: `
          <p>Dear ${user.firstName},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,</p>
          <p>Alumni's World Team</p>
        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  });
});
//Change password 
app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  console.log("Request received for reset password", id, token); 

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err); 
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => {
              console.log("Password updated successfully"); 
              res.send({ Status: "Success" });
            })
            .catch((err) => {
              console.error("Error updating password:", err); 
              res.send({ Status: err });
            });
        })
        .catch((err) => {
          console.error("Error hashing password:", err);
          res.send({ Status: err });
        });
    }
  });
});

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

//
app.post('/changepassword/pass', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the password" });
  }
});
//


/*ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); // we we add new picture to our project
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.put("/users/:id", verifyToken, upload.single("picture"), updateUserProfile);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api/feedbacks", upload.single('file'), feedbackRoutes);
app.use("/api/wrongfeedbacks", upload.single('file'), wrongfeedbackRoutes);
app.use("/api/contactus", contactusRoutes);
app.use("/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/locations", locationRoutes);
app.use("/search", searchRoutes);
app.use("/api", updateLinks);
app.use("/notifications", notificationRoutes);
app.use("/api", jobPostRoutes);



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
server.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port " + PORT);

  /* add data at once */
  // User.insertMany(users);
  // Post.insertMany(posts);
});
