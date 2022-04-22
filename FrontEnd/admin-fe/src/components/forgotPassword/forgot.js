import React from "react";

export const Forgot = () => {
  return (
    <div>
      <div className="bg-grey-lighter min-h-screen flex flex-col ">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <div className="flex justify-center align-middle mb-5">
              <img
                className="h-20 w-20"
                src="https://icon-library.com/images/reset-password-icon/reset-password-icon-16.jpg"
                alt="admin"
              />
            </div>

            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded"
              name="email"
              placeholder="Email"
            />
            <div className="w-full mb-1">
              <p className=" text-red-500">Invalid Username</p>
            </div>

            <div className="w-full mb-1">
              <p className=" text-red-500 font-semibold">
                Check your mail and input your security code to change new
                password
              </p>
            </div>

            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded"
              name="password"
              placeholder="New Password"
            />
            <div className="w-full mb-1">
              <p className=" text-red-500">Invalid Username</p>
            </div>

            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded"
              name="code"
              placeholder="Confirm code"
            />
            <div className="w-full mb-1">
              <p className=" text-red-500">Invalid Username</p>
            </div>

            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
