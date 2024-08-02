import React, { createContext, useState, useContext, useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import { useSelector } from "react-redux";

const UnseenMessagesContext = createContext();

export const useUnseenMessages = () => useContext(UnseenMessagesContext);

export const UnseenMessagesProvider = ({ children }) => {
  const { socket } = useSocketContext();
  const [unseenConversationsCount, setUnseenConversationsCount] = useState(0);
  const user = useSelector((state) => state?.user);
  const userId = user?._id;

  useEffect(() => {
    if (socket) {
      socket.emit("fetch-conversations-unseen-count", userId);

      socket.on("update-unseen-conversations-count", (count) => {
        setUnseenConversationsCount(count);
      });

      return () => {
        socket.off("update-unseen-conversations-count");
      };
    }
  }, [socket, userId]);

  return (
    <UnseenMessagesContext.Provider value={{ unseenConversationsCount }}>
      {children}
    </UnseenMessagesContext.Provider>
  );
};
