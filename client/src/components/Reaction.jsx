
import {
  ThumbUp as ThumbUpIcon,
  Favorite as LoveIcon,
  EmojiEmotions as HahaIcon,
  SentimentSatisfied as WowIcon,
  SentimentDissatisfied as SadIcon,
  SentimentVeryDissatisfied as AngryIcon,
} from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
const Reactions = ({ onReact }) => {
  const reactions = [
    { name: 'like', icon: <ThumbUpIcon color="primary" /> },
    { name: 'love', icon: <LoveIcon color="secondary" /> },
    { name: 'haha', icon: <HahaIcon color="warning" /> },
    { name: 'wow', icon: <WowIcon color="info" /> },
    { name: 'sad', icon: <SadIcon color="primary" /> },
    { name: 'angry', icon: <AngryIcon color="error" /> },
  ];

  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      {reactions.map((reaction) => (
        <IconButton key={reaction.name} onClick={() => onReact(reaction.name) && patchLike}>
          {reaction.icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default Reactions;
