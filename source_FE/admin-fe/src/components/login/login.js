import React, { useState, useEffect } from "react";

export const Login = () => {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <form className="w-full md:w-1/3 bg-white rounded-lg">
          <div className="flex font-bold justify-center mt-6">
            <img
              className="h-20 w-20"
              src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/avatar.svg"
              alt="admin"
            />
          </div>
          <h2 className="text-3xl text-center text-gray-700 mb-4">
            WELCOME ADMIN
          </h2>
          <div className="px-12 pb-10">
            <div className="w-full mb-2">
              <div className="flex items-center">
                <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  className="-mx-6  w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                />
              </div>
            </div>
            <div className="w-full mb-1">
              <p className=" text-red-500">Invalid Username</p>
            </div>
            <div className="w-full mb-2">
              <div className="flex items-center">
                <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  className="-mx-6 w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                />
              </div>
            </div>
            <div className="w-full mb-1 ">
              <p className=" text-red-500">Wrong password</p>
            </div>
            <a
              href="https://github.com/ducvp72"
              className="text-sm text-gray-500 float-right mb-4"
            >
              Forgot Password?
            </a>
            <button
              type="submit"
              className="w-full py-2 rounded-full bg-green-600 text-gray-100  focus:outline-none"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
