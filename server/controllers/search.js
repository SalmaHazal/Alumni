import Post from '../models/Post.js';
import User from '../models/User.js';

export const searchContent = async (req, res) => {
  try {
    const query = req.query.query;
    // Perform search on both posts and users
    const posts = await Post.find({
      $or: [
        { description: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
      ],
    });
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { userName: { $regex: query, $options: 'i' } },
      ],
    });
    res.json({ posts, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
