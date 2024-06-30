import { useState } from "react";
import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const Comment = ({ postId, user }) => {
  const [desc, setDesc] = useState("");

  // getting comments
  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <Box className="comments">
      <Box
        className="write"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="20px"
        margin="20px 0"
      >
        <Avatar
          src={"/upload/" + user.picturePath}
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
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
          }}
        />
        <Button
          onClick={handleClick}
          variant="contained"
          color="primary"
          sx={{ padding: "10px", borderRadius: "3px" }}
        >
          Send
        </Button>
      </Box>
      {error ? (
        <Typography color="error">Something went wrong</Typography>
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        data.map((comment) => (
          <Box
            key={comment.id}
            className="comment"
            display="flex"
            justifyContent="space-between"
            gap="20px"
            margin="30px 0"
          >
            <Avatar
              src={"/upload/" + comment.profilePic}
              alt=""
              sx={{ width: 40, height: 40 }}
            />
            <Box
              className="info"
              flex={5}
              display="flex"
              flexDirection="column"
              gap="3px"
              alignItems="flex-start"
            >
              <Typography variant="body1" fontWeight="500">
                {comment.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {comment.desc}
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
