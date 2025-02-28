
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";

const Marketing = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Marketing;
