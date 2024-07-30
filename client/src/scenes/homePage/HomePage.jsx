import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Box className="fixed-navbar">
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        flexDirection={isNonMobileScreens ? "row" : "column"}
        justifyContent="center"
        alignItems={isNonMobileScreens ? "flex-start" : "center"}
        gap="0.5rem"
        marginTop="85px"
      >
        {isNonMobileScreens && (
          <Box className="fixed left-20" minWidth="200px" width="23%">
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
        )}
        <Box
          minWidth="500px"
          width={isNonMobileScreens ? "42%" : "100%"}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box className="fixed right-20" minWidth="200px" width="23%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
