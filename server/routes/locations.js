const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

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

module.exports = router;
