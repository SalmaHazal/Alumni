import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    articleTitle: String,
    articleContent: String,
    posttype: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: String,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
