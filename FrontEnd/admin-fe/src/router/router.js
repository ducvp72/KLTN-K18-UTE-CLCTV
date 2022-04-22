import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Login,
  Error,
  Profile,
  Forgot,
  GroupDash,
  UserDash,
  Dashboard,
} from "../components/";
import { DashBoard } from "./layouts/DashBoardLayout";
export const Router = () => {
  const check = true;
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route element={<DashBoard role={check} />}>
          <Route path="/home" element={<Dashboard />}>
            <Route path="user" element={<UserDash />} />
            <Route path="group" element={<GroupDash />} />
            <Route path="password" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};
