import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openToggle } from "../../redux/reducers/toggle";
import moment from "moment";
export const Detail = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.toggle.user);

  return (
    <>
      <div className="cursor-pointer flex relative w-1/2 bg-white border-2 shadow-lg">
        <button
          onClick={() => {
            dispatch(
              openToggle({
                show: false,
                user: "",
              })
            );
          }}
          className=" focus:outline-none flex justify-center items-center rounded-full w-8 h-8 border-2 border-red-500 text-red-500 absolute right-0"
        >
          <p className=" p-1 font-mono text-lg">x</p>
        </button>

        <div className="flex">
          <div className=" p-2 col-span-2 flex justify-center items-center">
            <img className="w-22 h-22" src={user.avatar} alt="avatar" />
          </div>

          <div className=" col-span-3 flex-col space-y-2 p-5 ">
            <div className="flex space-x-2 text-xl">
              <label className="">Id: </label>
              <p className=" font-bold">{user.id || "NaN"}</p>
            </div>
            <div className="flex space-x-2 text-2xl">
              <label className="">Fullname: </label>
              <p className=" font-bold">{user.fullname || "NaN"}</p>
            </div>

            <div className="flex space-x-2 text-2xl">
              <label className="">Username: </label>
              {user.username ? (
                <p className=" font-bold">{user.username}</p>
              ) : (
                <p className="  font-bold">NaN</p>
              )}
            </div>

            <div className="flex space-x-2 text-2xl">
              <label className=" ">Gender: </label>
              <p className="  font-bold">{user.gender || "NaN"}</p>
            </div>

            <div className="flex space-x-2 text-2xl">
              <label className=" ">Birth: </label>
              <p className="  font-bold italic">{user.birth || "NaN"}</p>
            </div>

            <div className="flex space-x-2 text-2xl">
              <label className="">Email: </label>
              <p className=" font-bold underline">{user.email || "NaN"}</p>
            </div>

            <div className="flex space-x-2 text-2xl items-center ">
              <label className=" ">isActivated: </label>
              <div
                className={` font-bold ${
                  user.isActivated.toString() === "true"
                    ? `text-green-600`
                    : `text-red-500`
                }`}
              >
                {user.isActivated.toString() === "false" ? (
                  <p className=" w-5 h-5 rounded-full bg-green-500"></p>
                ) : (
                  <p className=" w-5 h-5 rounded-full bg-red-500"></p>
                )}
              </div>
            </div>

            <div className="flex space-x-2 text-2xl">
              <label className="">Ban status: </label>
              <div
                className={` font-bold ${
                  user.isBanned.toString() === "false"
                    ? `text-green-600`
                    : `text-red-500`
                }`}
              >
                <div className=" font-bold">
                  <p className=" font-bold ">
                    {user.isBanned.toString() || "NaN"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 text-2xl">
              <label className="">Created: </label>
              <p className=" font-bold">
                {moment(user.createdAt).format("DD/MM/YYYY") || "NaN"} (
                {moment(user.createdAt).fromNow(true) || "NaN"})
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
