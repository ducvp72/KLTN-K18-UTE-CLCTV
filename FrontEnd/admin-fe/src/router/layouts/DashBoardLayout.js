import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Login } from "../../components/";
export const DashBoard = ({ role }) => {
  const location = useLocation();

  return (
    <div>
      {role ? (
        <Outlet />
      ) : (
        <Navigate to="/" state={{ from: location }} replace />
      )}
    </div>
  );
};
