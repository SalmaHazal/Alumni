import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useSocketContext } from "../../context/SocketContext";

const MessagePage = () => {
  const params = useParams();
  console.log(params.userId)
  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.emit("message-page", params.userId);
    }
  }, [socket]);
  return <div>MessagePage</div>;
};

export default MessagePage;
