import React from "react";
import { useTheme } from "@mui/material/styles";

const Divider = () => {
  const theme = useTheme();
  return (
    <div
      className={`${
        theme.palette.mode === "light" ? "bg-slate-200" : "bg-slate-600"
      } p-[0.5px]`}
    ></div>
  );
};

export default Divider;
