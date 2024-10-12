import express from "express";
import Service from "../models/Service.js";
import User from "../models/User.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, price, provider } = req.body;
    const user = await User.findById(provider);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newService = new Service({
      title,
      description,
      price,
      provider: user._id,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).populate("provider", "firstName lastName email _id");
    res.json(services || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

export default router;
