import React from "react";
import Navbar from "../navbar/Navbar";
import { Outlet, useLocation} from "react-router-dom";
import SideBar from "../widgets/SideBar";
import { FiUsers } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ChattingPage = () => {
  const location = useLocation();
  const persistRootString = localStorage.getItem("persist:root");

  const persistRootObject = JSON.parse(persistRootString);
  const token = JSON.parse(persistRootObject.token);

  const basePath = location.pathname === "/chat";
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className="grid lg:grid-cols-[400px,1fr] h-[90%]">
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
            { t ("Select user to send message")}
          </p>
        </div>
      </div>
    </>
  );
};

export default ChattingPage;
