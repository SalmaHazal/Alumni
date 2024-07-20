import express from "express";
const router = express.Router();
import Location from '../models/Location.js';
import User from "../models/User.js";

//
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '_id location firstName lastName picturePath promotion email');
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Add a new location
router.post('/', async (req, res) => {
  const newLocation = new Location(req.body);
  await newLocation.save();
  res.json(newLocation);
});

export default router;
