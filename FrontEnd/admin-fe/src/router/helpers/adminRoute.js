import React from "react";
import { Route, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Login } from "../../components";

export const AdminRoute = ({ children, ...rest }) => {
  const [cookies] = useCookies(["auth"]);
  return (
    // <Route
    //   {...rest}
    //   render={() => {
    //     return cookies.auth && cookies.auth.user.role === `user` ? (
    //       children
    //     ) : (
    //       <Login />
    //     );
    //   }}
    // />
    <Outlet />
  );
};
