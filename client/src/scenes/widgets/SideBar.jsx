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
import { useTheme } from "@mui/material/styles";
import { MdOutlineSpatialAudioOff } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [communityConv, setCommunityConv] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const { socket } = useSocketContext();
  const theme = useTheme();
  const { t } = useTranslation();

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

      socket.emit("community side bar");

      const handleCommunityLastMessage = (data) => {
        setCommunityConv(data);
        console.log(data);
      };

      socket.on("community last message", handleCommunityLastMessage);

      return () => {
        socket.off("community last message", handleCommunityLastMessage);
      };
    }
  }, [socket, user]);

  return (
    <div
      className={`${
        theme.palette.mode === "light" ? "bg-white" : "bg-[#2b2b2b]"
      } w-full h-full grid grid-cols-[48px,1fr] `}
    >
      {/* First column */}
      <div
        className={`${
          theme.palette.mode === "light" ? "bg-slate-100" : "bg-[#212121]"
        } w-full max-w-[300px] h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between`}
      >
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer ${
                theme.palette.mode === "light"
                  ? "hover:bg-slate-200"
                  : "hover:bg-[#3b3b3b]"
              }  rounded `
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={20} color="#475569" />
          </NavLink>

          <div
            title="search friend"
            onClick={() => setOpenSearchUser(true)}
            className={`w-12 h-12 flex justify-center items-center cursor-pointer ${
              theme.palette.mode === "light"
                ? "hover:bg-slate-200"
                : "hover:bg-[#3b3b3b]"
            } rounded`}
          >
            <RiUserSearchFill size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={`${user?.firstName} ${user?.lastName}`}
            // onClick={() => setEditUserOpen(true)}
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
        <div className="p-[0.5px]"></div>
        <div className="h-16 flex items-center justify-around px-4 text-[15px]">
          <button
            className={`py-1 px-3 rounded ${
              activeTab === "personal"
                ? "bg-[#4682B4] text-white"
                : "text-[#4682B4]"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            { t ("Personal Messages")}
          </button>
          <button
            className={`py-1 px-3 rounded ${
              activeTab === "community"
                ? "bg-[#4682B4] text-white"
                : "text-[#4682B4]"
            }`}
            onClick={() => setActiveTab("community")}
          >
            { t ("Community Messages")}
          </button>
        </div>
        <div
          className={`${
            theme.palette.mode === "light" ? "bg-slate-200" : "bg-slate-600"
          } p-[0.5px]`}
        ></div>

        <div className="h-[calc(90vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {activeTab === "personal" ? (
            allUser.length === 0 ? (
              <div className="mt-12">
                <div className="flex justify-center items-center my-4 text-slate-500">
                  <FiArrowUpLeft size={50} />
                </div>
                <p className="text-lg text-center text-slate-400">
                  { t ("Explore users to start a conversation with.")}
                </p>
              </div>
            ) : (
              allUser.map((conv, index) => (
                <NavLink
                  to={"/chat/" + conv?.userDetails?._id}
                  key={conv?._id}
                  className={`flex items-center gap-3 py-3 px-2 cursor-pointer rounded no-underline ${
                    theme.palette.mode === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-[#383838]"
                  }`}
                >
                  <div>
                    <Avatar
                      imageUrl={conv?.userDetails?.picturePath}
                      name={`${conv?.userDetails?.firstName} ${conv?.userDetails?.lastName}`}
                      width={40}
                      height={40}
                      userId={conv?.userDetails?._id}
                    />
                  </div>
                  <div>
                    <h6
                      className={`text-ellipsis line-clamp-1 font-semibold text-base ${
                        theme.palette.mode === "light"
                          ? "text-black"
                          : "text-white"
                      } `}
                    >{`${conv?.userDetails?.firstName} ${conv?.userDetails?.lastName}`}</h6>
                    <div className="text-slate-500 text-sm flex items-center gap-1">
                      <div>
                        {conv?.lastMsg?.imageUrl && (
                          <div className="flex items-center gap-1">
                            <span
                              className={`${conv?.lastMsg?.text && "-mt-4"} `}
                            >
                              <FaRegImage />
                            </span>
                            {!conv?.lastMsg?.text && <span>{t ("Image")}</span>}
                          </div>
                        )}
                        {conv?.lastMsg?.videoUrl && (
                          <div className="flex items-center gap-1">
                            <span
                              className={`${conv?.lastMsg?.text && "-mt-4"} `}
                            >
                              <FaVideo />
                            </span>
                            {!conv?.lastMsg?.text && <span>{ t ("Video")}</span>}
                          </div>
                        )}
                        {conv?.lastMsg?.audio && (
                          <div className="flex items-center gap-1">
                            <span
                              className={`${conv?.lastMsg?.text && "-mt-4"} `}
                            >
                              <MdOutlineSpatialAudioOff />
                            </span>
                            {!conv?.lastMsg?.text && <span>{ t ("Audio")}</span>}
                          </div>
                        )}
                        {conv?.lastMsg?.document && (
                          <div className="flex items-center gap-1">
                            <span
                              className={`${conv?.lastMsg?.text && "-mt-4"} `}
                            >
                              <FaFileAlt />
                            </span>
                            {!conv?.lastMsg?.text && <span>{ t ("Document")}</span>}
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
              ))
            )
          ) : (
            <NavLink
              to={"/chat/community"}
              className={`flex items-center gap-3 py-3 px-2 cursor-pointer rounded no-underline ${
                theme.palette.mode === "light"
                  ? "hover:bg-slate-100"
                  : "hover:bg-[#383838]"
              }`}
            >
              <div>
                <Avatar
                  imageUrl={"cloud.png"}
                  name={"Cloud Community"}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h6
                  className={`text-ellipsis line-clamp-1 font-semibold text-base ${
                    theme.palette.mode === "light" ? "text-black" : "text-white"
                  }`}
                >
                  Cloud Community
                </h6>
                <div className="text-slate-500 text-sm flex items-center gap-1">
                  <div className="flex gap-2">
                    <strong>{communityConv?.msgByUserId?.firstName}: </strong>
                    <div className="flex gap-2">
                      {communityConv?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`${communityConv?.text && "-mt-4"} `}
                          >
                            <FaRegImage />
                          </span>
                          {!communityConv?.text && <span>{ t ("Image")}</span>}
                        </div>
                      )}
                      {communityConv?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`${communityConv?.text && "-mt-4"} `}
                          >
                            <FaVideo />
                          </span>
                          {!communityConv?.text && <span>{ t ("Video")}</span>}
                        </div>
                      )}
                      {communityConv?.audio && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`${communityConv?.text && "-mt-4"} `}
                          >
                            <MdOutlineSpatialAudioOff />
                          </span>
                          {!communityConv?.text && <span>{ t ("Audio")}</span>}
                        </div>
                      )}
                      {communityConv?.document && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`${communityConv?.text && "-mt-4"} `}
                          >
                            <FaFileAlt />
                          </span>
                          {!communityConv?.text && <span>{ t ("Document")}</span>}
                        </div>
                      )}
                      <p className="text-ellipsis line-clamp-1">
                        {communityConv?.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* {Boolean(conv?.unseenMsg) && (
                    <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-[#475569] text-white font-semibold rounded-full">
                      {conv?.unseenMsg}
                    </p>
                  )} */}
            </NavLink>
          )}
        </div>
      </div>

      {/* User details */}
      {editUserOpen && (
        <UserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
