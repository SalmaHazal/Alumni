import React, { useEffect, useRef, useState } from "react";

import uploadFile from "../../helpers/uploadFile.js";

import { useParams } from "react-router-dom";
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
import backgroundImage1 from "../../assets/blackbaground.png";
import { useTheme } from "@mui/material/styles";
import { AudioRecorder } from "react-audio-voice-recorder";
import { IoDocumentAttach } from "react-icons/io5";
import { MdVideoCall } from "react-icons/md";
import {
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const MessagePage = () => {
  const params = useParams();
  const user = useSelector((state) => state?.user);
  const theme = useTheme();
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    picturePath: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    document: null,
  });
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);
  const { t } = useTranslation();

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

  const handleFileChange = async (e) => {
    setOpenImageVideoUpload(false);
    setMessage((prev) => {
      return {
        ...prev,
        document: e.target.files[0],
      };
    });
  };

  const handleClearUploadFile = () => {
    setMessage((prev) => {
      return {
        ...prev,
        document: null,
      };
    });
  };

  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.emit("message-page", params.userId);

      socket.emit("seen", params.userId);

      socket.on("message-user", (data) => {
        setDataUser(data);
      });

      socket.on("message", (data) => {
        console.log(data);
        setAllMessage(data);
      });
    }
  }, [socket, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
  
    const messageData = {
      sender: user?._id,
      receiver: params.userId,
      text: message.text,
      imageUrl: message.imageUrl,
      videoUrl: message.videoUrl,
      audio: audio,
      document: null, 
      msgByUserId: user?._id,
    };
  
    if (message.document) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const fileBuffer = new Uint8Array(reader.result);
        messageData.document = {
          data: fileBuffer,
          contentType: message.document.type,
          filename: message.document.name,
        };
  
        if (socket) {
          socket.emit("new message", messageData);
          setMessage({
            text: "",
            imageUrl: "",
            videoUrl: "",
            document: null,
          });
        }
      };
  
      reader.readAsArrayBuffer(message.document);
    } else {
      if (socket) {
        socket.emit("new message", messageData);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          document: null,
        });
      }
    }
  };
  

  const addAudioElement = async (blob) => {
    setAudio(blob);
    // Convert blob to an ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // Convert ArrayBuffer to Uint8Array
    const audioData = new Uint8Array(arrayBuffer);

    // Send the audio message via socket
    if (socket) {
      socket.emit("new message", {
        sender: user?._id,
        receiver: params.userId,
        text: message.text,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        audio: audioData,
        msgByUserId: user?._id,
      });

      setAudio(null);
    }
  };

  const style11 = {
    backgroundImage:
      theme.palette.mode === "dark"
        ? `url(${backgroundImage1})`
        : `url(${backgroundImage})`,
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".pdf")) return <FaFilePdf size={"25px"} />;
    if (fileName.endsWith(".doc") || fileName.endsWith(".docx"))
      return <FaFileWord size={"25px"} />;
    if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))
      return <FaFileExcel size={"25px"} />;
    if (
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png")
    )
      return <FaFileImage size={"25px"} />;
    return <FaFileAlt />;
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <div style={{ ...style11 }} className="bg-no-repeat bg-cover">
      <header
        style={{ backgroundColor: theme.palette.background.alt }}
        className="sticky top-0 h-16 border-t-2 shadow-xl flex justify-between items-center px-4"
      >
        <div className="flex items-center gap-4 mt-1">
          <Link to={"/chat"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.picturePath}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h6 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h6>
            <p className="-my-1">
              {dataUser?.online ? (
                <span className="text-[#648C6C]">{ t ("online")}</span>
              ) : (
                <span className="text-slate-400">{ t ("offline")}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href="http://localhost:9000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdVideoCall
              color={`${theme.palette.mode === "light" ? "black" : "white"}`}
              size={28}
            />
          </a>
          <button className="cursor-pointer hover:text-slate-500">
            <HiDotsVertical size={20} />
          </button>
        </div>
      </header>

      {/* Show all messages */}
      <section
        className={`h-[calc(90vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative ${
          theme.palette.mode === "light" && "bg-slate-200"
        } bg-opacity-50`}
      >
        {/* all messages */}
        <div
          className="flex flex-col gap-2 ml-4 py-2 mx-2"
          ref={currentMessage}
        >
          {allMessage.map((msg, index) => {
            return (
              <div
                className={`px-3 py-1 rounded w-fit max-x-[230px] md:max-w-sm lg:max-w-md shadow ${
                  user._id === msg.msgByUserId
                    ? `ml-auto ${
                        theme.palette.mode === "light"
                          ? "bg-teal-100"
                          : "bg-[#005c4b]"
                      } `
                    : `${
                        theme.palette.mode === "light"
                          ? "bg-white"
                          : "bg-[#363636]"
                      }`
                }`}
              >
                <div className="w-full">
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
                  {msg?.document && (
                    <>
                      <div
                        className={`flex items-center p-2 mb-1 rounded-lg shadow-sm ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center border rounded-lg ${
                            isDarkMode
                              ? "border-gray-700 bg-gray-600"
                              : "border-gray-300 bg-gray-100"
                          } mr-3`}
                        >
                          {getFileIcon(msg.document.split("/").pop())}
                        </div>

                        <div className="flex-1">
                          <span
                            className={`block font-semibold text-sm ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {msg.document.split("/").pop()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex justify-center items-center p-3 rounded-lg shadow-sm ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <button
                          className={`text-xs font-semibold py-1 px-3 rounded-md`}
                        >
                          <a
                            href={`http://localhost:3001${msg.document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-[15px] no-underline hover:underline ${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            { t ("Download")}
                          </a>
                        </button>
                      </div>
                    </>
                  )}
                  {msg?.audio && (
                    <audio controls className="custom-audio-player">
                      <source
                        src={URL.createObjectURL(
                          new Blob([new Uint8Array(msg.audio.data)], {
                            type: "audio/webm",
                          })
                        )}
                        type="audio/webm"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
                <p className="px-2">{msg.text}</p>
                <p className="pt-0 text-xs ml-auto w-fit">
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
            <div
              style={{ backgroundColor: theme.palette.background.alt }}
              className="p-3"
            >
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
            <div
              style={{ backgroundColor: theme.palette.background.alt }}
              className="p-3"
            >
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

        {/* upload document display */}
        {message.document && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:bg-slate-400"
              onClick={handleClearUploadFile}
            >
              <IoClose size={25} />
            </div>

            <div
              style={{ backgroundColor: theme.palette.background.alt }}
              className="w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 p-4 flex flex-col items-center rounded-lg shadow-lg"
            >
              <div
                className={`w-20 h-20 flex items-center justify-center mb-4 border ${
                  !isDarkMode && "border-gray-300 bg-gray-100"
                } rounded-lg`}
              >
                <FaFilePdf size={"25px"} />
              </div>

              <p
                className={`text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {message.document.name}
              </p>
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
      <section
        style={{ backgroundColor: theme.palette.background.alt }}
        className="h-16 flex items-center px-4"
      >
        <div className="relative">
          <button
            className={`flex justify-center items-center w-16 h-16 rounded ${
              theme.palette.mode === "light"
                ? "hover:bg-slate-100"
                : "hover:bg-[#3b3b3b]"
            } `}
            onClick={handleOpenImageVideo}
          >
            <GrAttachment size={23} />
          </button>

          {/* video and image */}

          {openImageVideoUpload && (
            <div
              style={{ backgroundColor: theme.palette.background.alt }}
              className="shadow rounded absolute bottom-14 w-36 p-2"
            >
              <form>
                <label
                  htmlFor="uploadImage"
                  className={`flex items-center  px-3 gap-3 rounded cursor-pointer ${
                    theme.palette.mode === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-[#3b3b3b]"
                  }`}
                >
                  <div className="text-slate-600">
                    <FaRegImage size={20} />
                  </div>
                  <p className="pt-3">{ t ("Image")}</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className={`flex items-center  px-3 gap-3 rounded cursor-pointer ${
                    theme.palette.mode === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-[#3b3b3b]"
                  }`}
                >
                  <div className="text-slate-600">
                    <FaVideo size={20} />
                  </div>
                  <p className="pt-3">{ t ("Video")}</p>
                </label>
                <label
                  htmlFor="uploadDocument"
                  className={`flex items-center  px-3 gap-3 rounded cursor-pointer ${
                    theme.palette.mode === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-[#3b3b3b]"
                  }`}
                >
                  <div className="text-slate-600">
                    <IoDocumentAttach size={20} />
                  </div>
                  <p className="pt-3">{ t ("Document")}</p>
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
                <input
                  type="file"
                  id="uploadDocument"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/* input box */}
        <form
          style={{ backgroundColor: theme.palette.background.alt }}
          className="h-full w-full flex gap-2"
          onSubmit={handleSendMessage}
        >
          <input
            style={{ backgroundColor: theme.palette.background.alt }}
            type="text"
            placeholder="Type a message here..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          {message.text ||
          message.imageUrl ||
          message.videoUrl ||
          message.document ? (
            <button
              className={`p-3 rounded ${
                theme.palette.mode === "light"
                  ? "hover:bg-slate-100"
                  : "hover:bg-[#3b3b3b]"
              }`}
            >
              <IoMdSend size={28} />
            </button>
          ) : (
            <div className="flex items-center p-2 rounded-full">
              <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
              />
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
