import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, posttype, articleContent, articleTitle } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      posttype,
      articleContent,
      articleTitle,
      userPicturePath: user.picturePath,
      picturePath,
      likes: new Map(),
      comments: [],
    });
    await newPost.save();

    // Send notifications to all friends
    const friends = await User.find({ friends: userId });
    for (const friend of friends) {
      const newNotification = new Notification({
        userId: friend._id,
        type: "post",
        text: `${user.firstName} ${user.lastName} created a new post`,
        link: `/posts/${newPost._id}`,
        senderPhoto: user.picturePath,
        createdAt: new Date(),
        read: false,
      });

      await newNotification.save();
    }

    const post = await Post.find().sort({ createdAt: -1 }); // all posts
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
const validReactions = ["like", "love", "haha", "wow", "sad", "angry"];
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // Get post ID from URL parameters
    const { userId, reaction } = req.body; // Get userId and reaction from request body

    // Validate the reaction
    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const post = await Post.findById(id); // Find the post by ID
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Set or update the user's reaction
    post.likes.set(userId, reaction);

    // Save the updated post
    const updatedPost = await post.save();

    // Send a notification to the post's author if liker is a different user
    if (post.userId.toString() !== userId) {
      const likingUser = await User.findById(userId);

      const newNotification = new Notification({
        userId: post.userId,
        type: "like",
        text: `${likingUser.firstName} ${likingUser.lastName} reacted on your post`,
        link: `/posts/${id}`,
        senderPhoto: likingUser.picturePath,
        createdAt: new Date(),
        read: false,
      });

      await newNotification.save();
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { id } = req.params; // Get post ID from URL parameters
    const { userId } = req.body; // Get userId from request body

    const post = await Post.findById(id); // Find the post by ID
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove the user's reaction
    post.likes.delete(userId);

    // Save the updated post
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPostReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userReaction = post.likes.get(userId);
    if (!userReaction) {
      return res.status(200).json({ reaction: null });
    }

    res.status(200).json({ reaction: userReaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
