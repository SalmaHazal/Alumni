import { Box, Typography, useTheme,Divider } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index";
import { FaUserFriends } from "react-icons/fa";
import { IoSchoolSharp } from "react-icons/io5";
import SearchUser from "../widgets/Allfriend";
import SearchPromoFriend from "../widgets/SearchPromoFriend";
import {useState } from "react";
import { useTranslation } from 'react-i18next';

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [showSearchUser, setShowSearchUser] = useState(false);
  const [showSearchPromoFriend, setShowSearchPromoFriend] = useState(false);
  const { t } = useTranslation();

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem", marginLeft:"110px" }}
      >
         { t ("Friend List")}
      </Typography>
      <Divider />
        <Box p="1rem 0" marginTop={"9px"} display="flex" alignItems="center" gap="1rem">
          <FaUserFriends  size={"25px"} color="#3ABEF9" />
          <Box >
            <Typography fontWeight="500"> <button onClick={() => setShowSearchUser(true)}>  { t ("All Friends")}</button> </Typography>
          </Box>
        </Box>
          <Box p="1rem 0" marginTop={"9px"} display="flex" alignItems="center" gap="1rem">
          <IoSchoolSharp size={"25px"} color="#EF5A6F" />
          <Box>
            <Typography fontWeight="500"> <button onClick={() => setShowSearchPromoFriend(true)}> { t ("Promo Friends")} </button> </Typography>
          </Box>
        </Box>
      {showSearchUser && <SearchUser onClose={() => setShowSearchUser(false)} open={() => setShowSearchUser(true)}/>}
      {showSearchPromoFriend && <SearchPromoFriend onClose={() => setShowSearchPromoFriend(false)} open={() => setShowSearchPromoFriend(true)}/>}
    </WidgetWrapper>
  );
};

export default FriendListWidget;
