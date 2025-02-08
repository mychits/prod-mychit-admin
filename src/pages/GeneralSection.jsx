import React from "react";
import { Outlet } from "react-router-dom";

const GeneralSection = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default GeneralSection;
