import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSocketContext } from "../../context/SocketContext";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const { onlineUsers } = useSocketContext();

  let avatarName = "";

  if (name) {
    const splitName = name?.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    "#bcd5f5",
    "#a7f3d0",
    "#eaceca",
    "#bbf7d0",
    "#fef08a",
    "#b5beff",
    "#a5f3fc",
    "#bae6fd",
    "#b5beff",
  ];

  const randomNumber = Math.floor(Math.random() * 9);

  const isOnline = onlineUsers.includes(userId);
  return (
    <div
      style={{
        color: "#1e293b",
        width: width + "px",
        height: height + "px",
        borderRadius: "50%",

        position: "relative"
      }}
    >
      {imageUrl ? (
        <img
          src={`http://localhost:3001/assets/${imageUrl}`}
          width={width}
          height={height}
          alt={name}
          className="rounded-full"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      ) : name ? (
        <div
          style={{
            width: width + "px",
            height: height + "px",
            backgroundColor: bgColor[randomNumber],
          }}
          className={
            "overflow-hidden rounded-full flex justify-center items-center text-lg"
          } 
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {
        isOnline && (
          <div className="bg-green-500 p-1 absolute bottom-1 -right-1 z-10 rounded-full"></div>
        )
      }
    </div>
  );
};

export default Avatar;
