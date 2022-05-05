import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
export const UnAuthLoginRoute = () => {
  const [cookies] = useCookies(["user_key"]);
  const location = useLocation();

  //   useEffect(() => {
  //     if (cookies.user_key) {
  //       console.log("aaaaaaaaaaaa", cookies.user_key);
  //     }
  //   }, [cookies]);

  return (
    <>
      {!cookies.user_key ? (
        <Outlet />
      ) : (
        <Navigate to="/home/user" state={{ from: location }} replace />
      )}
    </>
  );
};
