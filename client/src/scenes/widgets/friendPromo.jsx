import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useTheme } from "@mui/material/styles";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const theme = useTheme();

  const handleSearchUser = async () => {
    const URL = "http://localhost:3001/search/users";
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);

      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occured");
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);


  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-900 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/**input search user */}
        <div style={{ backgroundColor: theme.palette.sidebar.background}} className=" rounded h-14 overflow-hidden flex ">
          <input
            style={{ backgroundColor: theme.palette.sidebar.background}}
            type="text"
            placeholder="Search user by name, email...."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <FaSearch size={25} />
          </div>
        </div>

        {/**display search user */}
        <div style={{ backgroundColor: theme.palette.sidebar.background }} className="mt-2 w-full p-4 rounded h-full max-h-[70vh] overflow-auto text-slate-400 scrollbar">
          {/**no user found */}
          {searchUser.length === 0 && !loading && (
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

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
