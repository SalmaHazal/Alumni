import Post from "../models/Post.js";
import User from "../models/User.js";

export const searchContent = async (req, res) => {
  try {
    const query = req.query.query;
    // Perform search on both posts and users
    const posts = await Post.find({
      $or: [
        { description: { $regex: query, $options: "i" } },
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    });
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { occupation: { $regex: query, $options: "i" } },
      ],
    });
    res.json({ posts, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchUser = async (request, response) => {
  try {
    const { search } = request.body;

    const query = new RegExp(search, "i", "g");

    const user = await User.find({
      $or: [{ firstName: query }, { lastName: query }, { email: query }],
    }).select("-password");

    return response.json({
      message: "all user",
      data: user,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export const searchpromo = async (request, response) => {
  try {
    const { search } = request.body;

    const query = new RegExp(search, "i", "g");

    const user = await User.find({
      $or: [{ promotion: query }],
    }).select("-password");

    return response.json({
      message: "all user",
      data: user,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
