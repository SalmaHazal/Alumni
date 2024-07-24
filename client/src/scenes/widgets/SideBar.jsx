import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import UserDetails from "./UserDetails";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { RiUserSearchFill } from "react-icons/ri";
import { useSocketContext } from "../../context/SocketContext";
import { useTheme } from "@mui/material/styles"; // Import MUI's useTheme hook

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);

  const { socket } = useSocketContext();
  const theme = useTheme(); // Use the theme

  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user._id);

      socket.on("conversation", (data) => {
        const conversationUserData = data.map((conversationUser, index) => {
          if (conversationUser.sender?._id === conversationUser.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socket, user]);

  return (
    <div
      className="w-full h-full grid grid-cols-[48px,1fr] rounded"
      style={{ backgroundColor: theme.palette.sidebar.background }}
    >
      {/* First column */}
      <div style={{ backgroundColor: theme.palette.background.alt , width:"60px"}} className=" rounded-tr-lg rounded-br-lg py-11 text-slate-600 flex flex-col justify-between">
        <div style={{marginLeft:"10px"}}>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={20} color="#475569" />
          </NavLink>

          <div
            title="search friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          >
            <RiUserSearchFill size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={`${user?.firstName} ${user?.lastName}`}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={`${user?.firstName} ${user?.lastName}`}
              imageUrl={user?.picturePath}
              userId={user?._id}
            />
          </button>
        </div>
      </div>

      {/* Second column */}
      <div className="w-full">
      
        <div className="bg-slate-200 p-[0.5px] px-6"></div>
        <div className="h-16 flex items-center">
          <h2  className="text-xl font-bold p-4 text-slate-500" style={{marginLeft:"50px"}}>Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px] px-6"></div>

        <div className=" h-[calc(90vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/chat/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 hover:bg-slate-100 cursor-pointer rounded no-underline"
              >
                <div >
                  <Avatar
                    imageUrl={conv?.userDetails?.picturePath}
                    name={`${conv?.userDetails?.firstName} ${conv?.userDetails?.lastName}`}
                    width={40}
                    height={40}
                    userId={conv?.userDetails?._id}
                  />
                </div>
                <div>
                  <h6 className="text-ellipsis line-clamp-1 font-semibold text-base text-black">
                    {`${conv?.userDetails?.firstName} ${conv?.userDetails?.lastName}`}
                  </h6>
                  <div className="text-slate-500 text-sm flex items-center gap-1">
                    <div>
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span className="mb-3">
                            <FaRegImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span className="mb-3">
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>

                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-[#475569] text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/*user details*/}
      {editUserOpen && (
        <UserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/**search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
