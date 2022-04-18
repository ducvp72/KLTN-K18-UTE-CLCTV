import React from "react";
import { useNavigate } from "react-router-dom";
export const Profile = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className=" flex flex-col mb-10 mt-10">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <div className="flex justify-center align-middle mb-2">
              <img
                className="h-20 w-20"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Password.svg/1200px-Password.svg.png"
                alt="admin"
              />
            </div>

            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded"
              name="password"
              placeholder="Old password"
            />
            <div className="w-full mb-1">
              <p className=" text-red-500">Invalid Username</p>
            </div>
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded"
              name="password"
              placeholder="Password"
            />
            <div className="w-full mb-1">
              <p className=" text-red-500">Invalid Username</p>
            </div>
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded"
              name="confirm_password"
              placeholder="Confirm Password"
            />
            <div className="w-full mb-1">
              <p className=" text-red-500">Invalid Username</p>
            </div>
            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
            >
              Confirm
            </button>
          </div>

          <div className="text-grey-dark mt-6">
            <p
              onClick={() => {
                navigate("/", { replace: true });
              }}
              className="no-underline border-b border-blue text-blue cursor-pointer"
            >
              Forgot Password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
