
import mongoose from "mongoose";


const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Location', LocationSchema);
