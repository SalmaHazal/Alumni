import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  const decode = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id).select("-password");

  return user;
};

export default getUserDetailsFromToken;
