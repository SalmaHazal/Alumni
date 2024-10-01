import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Divider from "./Divider";

const UserDetails = ({ onClose, user }) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold text-center">Profile Details</h2>

        <div className="grid gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <p className="w-full py-1 px-2 focus:outline-primary border-0.5 text-center text-[20px]">{`${user?.firstName} ${user?.lastName}`}</p>
          </div>

          <div>
            <div className="my-1 flex items-center justify-center gap-4">
              <Avatar width={200} height={200} imageUrl={user?.picturePath} />
            </div>
          </div>

          <Divider />
          <div className="flex gap-2 w-fit ml-auto ">
            <button
              onClick={onClose}
              className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <button className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserDetails);
