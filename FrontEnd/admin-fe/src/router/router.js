import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Login,
  Error,
  Profile,
  Forgot,
  UserDash,
  Dashboard,
} from "../components/";
import { DashBoard } from "./layouts/DashBoardLayout";
import { useCookies } from "react-cookie";
export const Router = () => {
  const [cookies] = useCookies(["user_key"]);
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route element={<DashBoard />}>
          <Route path="/home" element={<Dashboard />}>
            <Route path="user" element={<UserDash />} />
            <Route path="password" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};
