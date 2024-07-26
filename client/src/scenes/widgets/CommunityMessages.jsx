import React, { useEffect, useRef, useState } from "react";

import uploadFile from "../../helpers/uploadFile.js";

import { useSocketContext } from "../../context/SocketContext";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import backgroundImage from "../../assets/wallpaper.jpeg";
import backgroundImage1 from "../../assets/blackbaground.png"
import { useTheme } from "@mui/material/styles";

const CommunityMessages = () => {
  const user = useSelector((state) => state?.user);
  const theme = useTheme();
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleOpenImageVideo = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url,
      };
    });
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadVideo.url,
      };
    });
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.emit("community");
  
      socket.on("community messages", (data) => {
        console.log(data);
        setAllMessage(data);
      });

      return () => {
        socket.off("community messages");
      };
    }
  }, [socket, user]);
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
  
    setMessage((prev) => ({
      ...prev,
      text: value,
    }));
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
  
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socket) {
        socket.emit("new community message", {
          sender: user,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };
   const style11 = {
    
  backgroundImage: theme.palette.mode === "dark" ? `url(${backgroundImage1})` : `url(${backgroundImage})`
};
  
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage1})` }}
      className="bg-no-repeat bg-cover"
    >
      <header style={{ backgroundColor: theme.palette.background.alt }} className="sticky top-0 h-16  border-t-2 flex justify-between items-center px-4">
        <div className="flex items-center gap-4 mt-1">
          <Link to={"/chat"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={"Cloud.png"}
              name={"Community Messages"}
            />
          </div>
          <div>
            <h6 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              Cloud Community
            </h6>
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-slate-500">
            <HiDotsVertical size={20} />
          </button>
        </div>
      </header>

      {/* Show all messages */}
      <section className="h-[calc(90vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/* all messages */}
        <div
          className="flex flex-col gap-2 ml-4 py-2 mx-2"
          ref={currentMessage}
        >
          {allMessage.map((msg, index) => {
            return (
              <div
                className={`flex gap-3 px-3 py-1 rounded w-fit max-x-[230px] md:max-w-sm lg:max-w-md shadow ${
                  user._id === msg.msgByUserId._id
                    ? "ml-auto bg-teal-100"
                    : "bg-white"
                }`}
              >
                <div>
                  <Avatar
                    width={40}
                    height={40}
                    imageUrl={msg.msgByUserId.picturePath}
                    name={`${msg.msgByUserId.firstName} ${msg.msgByUserId.lastName}`}
                    userId={msg.msgByUserId._id}
                  />
                </div>

                <div>
                  <h6>{`${msg.msgByUserId.firstName} ${msg.msgByUserId.lastName}`}</h6>
                  <div className=" w-full">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        alt="img"
                        className="w-full h-full object-scale-down"
                      />
                    )}

                    {msg?.videoUrl && (
                      <video
                        src={msg?.videoUrl}
                        alt="video"
                        className="w-full h-full object-scale-down"
                        controls
                      />
                    )}
                  </div>
                  <p>{msg.text}</p>
                </div>

                <p className=" mt-auto text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {/* upload image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:bg-slate-400"
              onClick={handleClearUploadImage}
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploaded image"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:bg-slate-400"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/* Send message Field */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            className="flex justify-center items-center w-16 h-16 rounded hover:bg-slate-100"
            onClick={handleOpenImageVideo}
          >
            <GrAttachment size={23} />
          </button>

          {/* video and image */}

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center  px-3 gap-3 rounded hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-slate-600">
                    <FaRegImage size={20} />
                  </div>
                  <p className="pt-3">Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center px-3 gap-3 rounded hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-slate-600">
                    <FaVideo size={20} />
                  </div>
                  <p className="pt-3">Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/* input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message here..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="p-3 rounded hover:bg-slate-100">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default CommunityMessages;
