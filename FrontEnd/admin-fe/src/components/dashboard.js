import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Detail } from "../components";
import { openToggle } from "../redux/reducers/toggle";
import { useCookies } from "react-cookie";
import { saveUser } from "../redux/reducers/auth";
import { adminApi } from "../apis";
import { Helmet } from "react-helmet-async";

export const Dashboard = () => {
  const [cookies] = useCookies(["rm_psw", "user_key"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggle = useSelector((state) => state.toggle);
  const userInfo = useSelector((state) => state.userData);

  useEffect(() => {
    console.log("toggle", toggle);
  });

  // useEffect(() => {
  //   console.log("location", location.pathname);
  // }, [location]);

  const handleLogout = async () => {
    await adminApi
      .logout(cookies.user_key.tokens.refresh.token)
      .then((res) => {
        console.log("res", res);
        dispatch(saveUser(""));
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <button
        onClick={() => {
          dispatch(openToggle(true));
        }}
      >
        open
      </button>
      {toggle.show && (
        <div className=" flex justify-center items-center absolute w-full h-full backdrop-opacity-10  backdrop-invert bg-white/30 z-40">
          <Detail />
        </div>
      )}
      <div className="grid grid-cols-6 gap-2 w-full h-full p-5">
        <div
          className=" border rounded-md w-full px-2"
          style={{ height: "600px" }}
        >
          <div className=" flex justify-center align-middle mt-2">
            <img
              className=" h-20 w-20"
              src={`${userInfo.data.admin?.avatar}`}
              alt="admin_avatar"
            />
          </div>
          <div className=" flex-col justify-center align-middle space-y-7">
            <div className="mt-2 flex justify-center cursor-pointer font-bold ">
              {userInfo?.data?.admin?.fullname ?? "Unknown"}
            </div>
            <div
              onClick={() => {
                navigate("/home/user");
              }}
              className=" border border-my-blue rounded flex justify-center  items-center  cursor-pointer hover:bg-my-blue hover:text-white hover:boder hover:rounded-md h-12"
            >
              <p className=" tex">User Dashboard</p>
            </div>
            <div
              onClick={() => {
                navigate("/home/password");
              }}
              className="border border-my-blue rounded flex justify-center items-center cursor-pointer hover:bg-my-blue hover:text-white hover:boder hover:rounded-md h-12"
            >
              Change Password
            </div>
          </div>
          <div className=" h-1/3  relative w-full">
            <div
              onClick={() => {
                handleLogout();
              }}
              className=" absolute bottom-0 w-full h-10   align-bottom flex justify-center items-center cursor-pointer rounded-full bg-red-500 text-white hover:bg-red-400"
            >
              Log out
            </div>
          </div>
        </div>

        <div className=" block col-span-5 border rounded-md">
          <div className=" flex items-center bg-my-blue">
            <p className=" w-full h-full p-2 font-normal text-white">
              Name of route
            </p>
          </div>

          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
