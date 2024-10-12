import JobPost from "../models/JobPost.js";
import upload from '../middleware/multer.js'; 

export const createJobPost = async (req, res) => {
  upload.single('companyLogo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }

    try {
      const jobPostData = {
        ...req.body,
        companyLogo: req.file ? req.file.path : null,  // Save the logo file path
      };
      
      const jobPost = new JobPost(jobPostData);
      await jobPost.save();
      res.status(201).json(jobPost);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create job post', error });
    }
  });
};


export const getJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find();
    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve job posts', error });
  }
};
