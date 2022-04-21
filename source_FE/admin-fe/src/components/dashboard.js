import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useStore, actions } from "../contextApi";
import { useSelector, useDispatch } from "react-redux";
import { Detail } from "../components";
import { openToggle } from "../redux/reducers/toggle";

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatchs = useDispatch();
  const location = useLocation();
  const toggle = useSelector((state) => state.toggle);
  const [state, dispatch] = useStore(useStore);
  const { key, query } = state;
  useEffect(() => {
    console.log("toggle", toggle);
  });

  // useEffect(() => {
  //   console.log("location", location.pathname);
  // }, [location]);

  return (
    <>
      <button
        onClick={() => {
          dispatchs(openToggle(true));
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
              src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/avatar.svg"
              alt="admin_avatar"
            />
          </div>
          <div className=" flex-col justify-center align-middle space-y-7">
            <div className="mt-2 flex justify-center cursor-pointer ">
              Email
            </div>
            <div
              onClick={() => {
                navigate("/home/user");
              }}
              className=" flex justify-center  items-center  cursor-pointer hover:bg-my-blue hover:text-white hover:boder hover:rounded-md h-12"
            >
              <p className=" tex">User Dashboard</p>
            </div>
            <div
              onClick={() => {
                navigate("/home/group");
              }}
              className=" flex justify-center items-center cursor-pointer hover:bg-my-blue hover:text-white hover:boder hover:rounded-md h-12"
            >
              Group Dashboard
            </div>
            <div
              onClick={() => {
                navigate("/home/password");
              }}
              className=" flex justify-center items-center cursor-pointer hover:bg-my-blue hover:text-white hover:boder hover:rounded-md h-12"
            >
              Change Password
            </div>
          </div>
          <div className=" h-1/3  relative w-full">
            <div
              onClick={() => {
                navigate("/", { replace: true });
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
          {location.pathname === "/home/password" ? null : (
            <div className=" w-full mt-2 p-2 flex items-center ">
              <div className="flex justify-start">
                <div className="mb-3 xl:w-96">
                  <div className="input-group relative flex items-stretch w-full mb-4">
                    <input
                      type="search"
                      className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="button-addon2"
                      value={key}
                      onChange={(e) => {
                        dispatch(actions.setSearchIput(e.target.value));
                      }}
                    />
                    <button
                      className="btn inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out  items-center"
                      type="button"
                      id="button-addon2"
                      onClick={(e) => {
                        dispatch(actions.setSearchQuey(query));
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="search"
                        className="w-4"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className=" ml-2 mb-6 flex items-center">
                <input
                  className="h-5 w-5 mr-2"
                  type="checkbox"
                  id="Sort"
                  name="Sort"
                  value="Sort"
                  onChange={(e, d) => console.log(e)}
                />
                <label htmlFor="Sort"> asc</label>
              </div>
            </div>
          )}

          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
