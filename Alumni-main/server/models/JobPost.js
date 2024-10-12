import mongoose from "mongoose";

const JobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  workType: { type: String, required: true },
  workPlace: { type: String, required: true },
  workPlaceType: { type: String, required: true },
  companyLogo: { type: String },
  rhLinkedIn: { type: String },
});

const JobPost = mongoose.model('JobPost', JobPostSchema);

export default JobPost;
