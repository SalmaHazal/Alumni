import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loading from "../Loading";
//import UserSearchCard from "./SearchPromoCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useTheme } from "@mui/material/styles";
import Friend from "../../../components/Friend";
import { setFriends } from "../../../state/index";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";


const Changelang = ({ onClose, userId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [searchPromo, setSearchPromo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
 console
  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (Array.isArray(data)) {
      dispatch(setFriends({ friends: data }));
    } else {

      dispatch(setFriends({ friends: [] })); // Set to an empty array if not an array
    }
  };

  useEffect(() => {
    if (userId) {
      getFriends();
    } else {
      console.error("userId is not defined");
    }
  }, [userId, token, dispatch]);

  const handleSearchPromo = async () => {
    const URL = "http://localhost:3001/search/promo";
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchPromo(response.data.data);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (search) {
      handleSearchPromo();
    }
  }, [search]);


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div
        style={{ border: "2px solid #3ABEF9" }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-lg relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={onClose}
          style={{marginTop:"-10px"}}
        >
          <IoClose size={24} />
        </button>

        <div
          style={{ backgroundColor: theme.palette.background.default }}
          className="p-4 max-h-96 overflow-auto custom-scrollbar"
        >
          {!loading && searchPromo.length === 0 && search && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No user found!
            </p>
          )}

          {loading && (
            <div className="flex justify-center items-center h-full">
              <Loading />
            </div>
          )}

          {!loading && Array.isArray(friends) && friends.length > 0 ? (
            friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No friends found!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Changelang;
