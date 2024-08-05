import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useTheme } from "@mui/material/styles";

const SearchPromoFriend = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const theme = useTheme();

  const handleSearchUser = async () => {
    const URL = "http://localhost:3001/search/promo";
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (search) {
      handleSearchUser();
    }
  }, [search]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div style={{ border: "2px solid #EF5A6F" }} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-lg relative">
        {/** Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        {/** Input search user */}
        <div
          style={{ backgroundColor: theme.palette.background.paper }}
          className="flex items-center border-b border-gray-300 dark:border-gray-700 p-2"
        >
          <input
            style={{ backgroundColor: theme.palette.background.paper }}
            type="text"
            placeholder="Search Friend by Promo..."
            className=" py-1   w-full p-2 rounded-lg border  outline-none  "
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="ml-3 text-gray-500 mr-12">
            <FaSearch size={20} color="#EF5A6F" />
          </div>
        </div>

        {/** Display search user */}
        <div
          style={{ backgroundColor: theme.palette.background.default }}
          className="p-4 max-h-96 overflow-auto custom-scrollbar"
        >{searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">no user found!</p>
          )}

          {loading && (
            <p>
              <Loading />
            </p>
          )}

          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SearchPromoFriend;