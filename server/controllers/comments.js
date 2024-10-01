import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import moment from "moment";
import Notification from "../models/Notification.js";

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
    const post = await Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: newComment._id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Send a notification to the post's author if the commenter is not the post's author
    if (post.userId.toString() !== req.body.userId) {
      const commentingUser = await User.findById(req.body.userId);

      const newNotification = new Notification({
        userId: post.userId,
        type: "comment",
        text: `${commentingUser.firstName} ${commentingUser.lastName} commented on your post`,
        link: `/posts/${req.body.postId}#comment-${newComment._id}`,
        senderPhoto: commentingUser.picturePath,
        createdAt: new Date(),
        read: false,
      });

      await newNotification.save();
    }

    res.status(200).json("Comment has been created.");
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

