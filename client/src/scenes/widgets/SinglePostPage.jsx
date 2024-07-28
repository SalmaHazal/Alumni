// SinglePostPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PostWidget from "./PostWidget";

const SinglePostPage = () => {
  const { postId } = useParams();
  const token = useSelector((state) => state.token);
  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return post ? (
    <PostWidget
      postId={post._id}
      postUserId={post.userId}
      name={`${post.firstName} ${post.lastName}`}
      description={post.description}
      location={post.location}
      picturePath={post.picturePath}
      userPicturePath={post.userPicturePath}
      likes={post.likes}
      comments={post.comments}
    />
  ) : (
    <p>Loading...</p>
  );
};

export default SinglePostPage;
