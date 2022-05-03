import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
export const DashBoard = () => {
  const [cookies] = useCookies(["user_key"]);
  const location = useLocation();
  // console.log("aaaaa", cookies.user_key);
  return (
    <div>
      {cookies.user_key ? (
        <Outlet />
      ) : (
        <Navigate to="/" state={{ from: location }} replace />
      )}
    </div>
  );
};
