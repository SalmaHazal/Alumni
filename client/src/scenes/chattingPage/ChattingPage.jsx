import React, { useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setOnlineUser, setSocketConnection } from "../../state/index.js";
import SideBar from "../widgets/SideBar";
import { FiUsers } from "react-icons/fi";
import { AiOutlineSelect } from "react-icons/ai";
import io from "socket.io-client";

const ChattingPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const persistRootString = localStorage.getItem("persist:root");

  const persistRootObject = JSON.parse(persistRootString);
  const token = JSON.parse(persistRootObject.token);

  // socket connection
  useEffect(() => {
    const socketConnection = io("http://localhost:3001", {
      auth: {
        token: token,
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    // dispatch(setSocketConnection(socketConnection));
    console.log(socketConnection)
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/chat";
  return (
    <>
      <Navbar />
      <div className="grid lg:grid-cols-[300px,1fr] h-[90%]">
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
          <SideBar />
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`}>
          <Outlet />
        </section>

        <div
          className={`justify-center items-center flex-col gap-2 hidden ${
            !basePath ? "hidden" : "lg:flex"
          }`}
        >
          <div>
            <FiUsers size={90} color="#718096" />
          </div>
          <p className="text-lg mt-2 text-slate-500">
            Select user to send message
          </p>
        </div>
      </div>
    </>
  );
};

export default ChattingPage;
