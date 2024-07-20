import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/chat/" + user?._id}
      onClick={onClose}
      className="flex items-center gap-3 p-2 lg:p-4 border-b border-transparent border-b-slate-200 hover:border hover:border-b-slate-400 rounded cursor-pointer no-underline text-black"
    >
      <div>
        <Avatar
          width={50}
          height={50}
          name={`${user?.firstName} ${user?.lastName}`}
          userId={user?._id}
          imageUrl={user?.picturePath}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1 no-underline text-black">
          {`${user?.firstName} ${user?.lastName}`}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1 no-underline text-black">
          {user?.email}
        </p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
