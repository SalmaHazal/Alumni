import express from "express";
const router = express.Router();

import User from "../models/User.js";

// Update resume link
router.post("/updateResumeLink", async (req, res) => {
  const link  = req.body.link;
  const userId  = req.body.userId;

  try {
    await User.findByIdAndUpdate(userId, { resumeLink: link });
    res.status(200).send("Resume link updated");
  } catch (error) {
    res.status(500).send("Error updating resume link");
  }
});

// Update portfolio link
router.post("/updatePortfolioLink", async (req, res) => {
    const link  = req.body.link;
    const userId  = req.body.userId;

  try {
    await User.findByIdAndUpdate(userId, { portfolioLink: link });
    res.status(200).send("Portfolio link updated");
  } catch (error) {
    res.status(500).send("Error updating portfolio link");
  }
});

// Update phone number
router.post("/updatePhoneNumber", async (req, res) => {
    const link  = req.body.link;
    const userId  = req.body.userId;

  try {
    await User.findByIdAndUpdate(userId, { phonenumber: link });
    res.status(200).send("Phone number updated");
  } catch (error) {
    res.status(500).send("Error updating phone number");
  }
});

// Update LinkedIn link
router.post("/updateLinkedInLink", async (req, res) => {
    const link  = req.body.link;
    const userId  = req.body.userId;

  try {
    await User.findByIdAndUpdate(userId, { linkedInLink: link });
    res.status(200).send("LinkedIn link updated");
  } catch (error) {
    res.status(500).send("Error updating LinkedIn link");
  }
});

export default router;
