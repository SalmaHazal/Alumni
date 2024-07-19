import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

export default mongoose.model('Location', LocationSchema);
