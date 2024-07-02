import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import moment from "moment";

export const getComments = async (req, res) => {
  try {
    const postId = req.query.postId;

    // Fetch comments for the given post ID and populate user information
    const comments = await Comment.find({ postId })
      .populate("user", "firstName lastName picturePath")
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addComment = async (req, res) => {
  try {
    const newComment = new Comment({
      text: req.body.desc,
      user: req.body.userId,
      postId: req.body.postId,
      createdAt: moment(Date.now()).toDate(),
    });
    await newComment.save();

    // Find the post and update it
    await Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: newComment._id },
    });
    res.status(200).json("Comment has been created.");
  } catch (err) {
    res.status(500).json({ message: err });
  }
};