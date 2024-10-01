import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  ShareOutlined,
  ThumbUp as ThumbUpIcon,
  Favorite as LoveIcon,
  EmojiEmotions as HahaIcon,
  SentimentSatisfied as WowIcon,
  SentimentDissatisfied as SadIcon,
  SentimentVeryDissatisfied as AngryIcon,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/index";
import Comment from "./Comment";
import SharePopup from "./SharePopup";
import Reactions from '../../components/Reaction';
import { useTranslation } from 'react-i18next';

const reactionIcons = {
  like: <ThumbUpIcon color="primary" />,
  love: <LoveIcon color="secondary" />,
  haha: <HahaIcon color="warning" />,
  wow: <WowIcon color="info" />,
  sad: <SadIcon color="primary" />,
  angry: <AngryIcon color="error" />,
};

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  posttype,
  location,
  picturePath,
  userPicturePath,
  likes,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUser = useSelector((state) => state.user);
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);

  const { palette } = useTheme();
  const main = palette.neutral.main;

  // Fetch the current reaction for the post on mount
 // Fetch the current reaction for the post on mount
 useEffect(() => {
  const fetchCurrentReaction = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/reaction?userId=${loggedInUserId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.reaction) {
      setSelectedReaction(data.reaction);
    }
  };

  fetchCurrentReaction();
}, [postId, token, loggedInUserId]);




 //

 const patchLike = async (reaction) => {
  const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: loggedInUserId, reaction }),
  });
  const updatedPost = await response.json();
  dispatch(setPost({ post: updatedPost }));
  setLikeCount(updatedPost.likes.length);
};

const patchUnlike = async () => {
  const response = await fetch(`http://localhost:3001/posts/${postId}/unlike`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: loggedInUserId }),
  });
  const updatedPost = await response.json();
  dispatch(setPost({ post: updatedPost }));
  setLikeCount(updatedPost.likes.length);
};


const handleReact = async (reaction) => {
  if (selectedReaction === reaction) {
    // If the same reaction is clicked again, unlike the post
    setSelectedReaction(null);
    setLikeCount(prevCount => prevCount - 1);
    await patchUnlike();
  } else {
    // Otherwise, update the reaction
    setSelectedReaction(reaction);
    await patchLike(reaction);
  }
  setShowReactions(false); // Hide reactions after selection
};

 //


  const handleShareClick = () => {
    setSharePopupOpen(true);
  };

  const handleShareClose = () => {
    setSharePopupOpen(false);
  };
 //
 const getSubtitle = () => {
  const { t } = useTranslation();
  if (posttype === "💼Professionnel Post") {
    return <span style={{color: "#36C2CE"}}>💼 { t ("Professionnel Post")}</span>;
  } else if (posttype === "⚽Sport Post") {
    return <span style={{color: "#65B741"}}>⚽ { t ("Sport Post")}</span>;
  } else {
    return <span style={{color: "#EF5A6F"}}>🤝 { t ("Social Post")}</span>;
  }
};
 //
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={getSubtitle()}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={() => setShowReactions((prev) => !prev)}
              onMouseEnter={() => setShowReactions(true)}
              onMouseDown={()  => setShowReactions(false)}
            >
              {selectedReaction ? (
                reactionIcons[selectedReaction]
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>Comments</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton onClick={handleShareClick}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {showReactions && (
        <Box
          position="absolute"
          mt="0.5rem"
          p="0.5rem"
          bgcolor="background.paper"
          borderRadius="0.75rem"
          boxShadow={3}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <Reactions onReact={handleReact} />
        </Box>
      )}
      {isComments && (
        <Comment postId={postId} user={loggedInUser} userId={loggedInUserId} />
      )}
      <SharePopup
        open={sharePopupOpen}
        handleClose={handleShareClose}
        url={`http://localhost:5173/posts/${postId}`} // Adjust the URL as needed
      />
    </WidgetWrapper>
  );
};

export default PostWidget;
