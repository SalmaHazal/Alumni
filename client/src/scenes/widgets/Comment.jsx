import React, { useState, useEffect } from "react";
import moment from "moment";
import { makeRequest } from "../../axios";
import {
  Box,
  Avatar,
  InputBase,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material"; // Assuming you're using Material-UI components
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comment = ({ postId, user, userId }) => {
  const [desc, setDesc] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await makeRequest.get(`/comments?postId=${postId}`);
        setComments(response.data);
      } catch (error) {
        setError("Error fetching comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = { desc, userId, postId };
      await makeRequest.post("/comments", newComment);
      toast.success("Comment added successfully");
      // Fetch the comments again to include the new one
      const response = await makeRequest.get(`/comments?postId=${postId}`);
      setComments(response.data);
      setDesc(""); // Clear input field
    } catch (error) {
      console.error("Error adding comment", error);
      setError("Error adding comment");
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="20px"
        margin="20px 0"
      >
        <Avatar
          src={`http://localhost:3001/assets/${user.picturePath}`}
          alt=""
          sx={{ width: 40, height: 40 }}
        />
        <InputBase
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          sx={{
            flex: 5,
            padding: "10px",
            border: `1px solid #ccc`,
            backgroundColor: "transparent",
            color: "#333",
          }}
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ padding: "10px", borderRadius: "3px" }}
        >
          Send
        </Button>
      </Box>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        comments.map((comment) => (
          <Box
            key={comment._id}
            display="flex"
            justifyContent="space-between"
            gap="20px"
            margin="30px 0"
          >
            <Avatar
              src={`http://localhost:3001/assets/${comment.user.picturePath}`}
              alt=""
              sx={{ width: 40, height: 40 }}
            />
            <Box
              flex={5}
              display="flex"
              flexDirection="column"
              gap="3px"
              alignItems="flex-start"
            >
              <Typography variant="body1" fontWeight="500">
                {`${comment.user.firstName} ${comment.user.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {comment.text}
              </Typography>
            </Box>
            <Typography
              className="date"
              flex={1}
              alignSelf="center"
              color="gray"
              fontSize="12px"
            >
              {moment(comment.createdAt).fromNow()}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default Comment;
