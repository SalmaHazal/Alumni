import mongoose from "mongoose";

const feedbacksSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  improvementarea: {
    type: String,
    required: true,
  },
  improvementdetails: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const GoodFeedbacks = mongoose.model("GoodFeedbacks", feedbacksSchema);
export default GoodFeedbacks;
