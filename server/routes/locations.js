import express from "express";
const router = express.Router();
import Location from '../models/Location.js';

// Get all locations
router.get('/', async (req, res) => {
  const locations = await Location.find();
  res.json(locations);
});

// Add a new location
router.post('/', async (req, res) => {
  const newLocation = new Location(req.body);
  await newLocation.save();
  res.json(newLocation);
});

export default router;
