import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Login,
  Error,
  Profile,
  Forgot,
  UserDash,
  Dashboard,
} from "../components/";
import { DashBoardRoute } from "./layouts/DashBoardLayout";
import { UnAuthLoginRoute } from "./layouts/unAuthLogin";

export const Router = () => {
  return (
    <div className="">
      <Routes>
        <Route element={<UnAuthLoginRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route element={<DashBoardRoute />}>
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
