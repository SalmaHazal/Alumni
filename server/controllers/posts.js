import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    // Send notifications to all friends
    const friends = await User.find({ friends: userId });
    for (const friend of friends) {
      const newNotification = new Notification({
        userId: friend._id,
        type: "post",
        text: `${user.firstName} created a new post`,
        link: `/posts/${newPost._id}`,
        senderPhoto: user.picturePath,
        createdAt: new Date(),
        read: false,
      });

      await newNotification.save();
    }

    const post = await Post.find(); // all posts
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    // Send a notification to the post's author if liker is a different user
    if (post.userId.toString() !== userId) {
      const likingUser = await User.findById(userId);

      const newNotification = new Notification({
        userId: post.userId,
        type: "like",
        text: `${likingUser.firstName} liked your post`,
        link: `/posts/${id}`,
        senderPhoto: likingUser.picturePath,
        createdAt: new Date(),
        read: false,
      });

      await newNotification.save();
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
