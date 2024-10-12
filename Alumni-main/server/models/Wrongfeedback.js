import mongoose from "mongoose";

const wrongfeedbacksSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  wrongarea: {  // Corrected from 'wrongtarea' to 'wrongarea'
    type: String,
    required: true,
  },
  wrongdetails: {
    type: String,
    required: true,
  },
  file: {
    type: String,  // Store the file path or filename here
    required: false,
  }
}, {
  timestamps: true,
});

const WrongFeedbacks = mongoose.model('WrongFeedbacks', wrongfeedbacksSchema);
export default WrongFeedbacks;
