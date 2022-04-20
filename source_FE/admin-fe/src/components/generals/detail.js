import React from "react";

export const Detail = () => {
  return (
    <>
      <div className="cursor-pointer flex relative w-1/2 bg-white border-2 shadow-lg">
        <button
          onClick={() => {
            alert("Closer");
          }}
          className=" focus:outline-none flex justify-center items-center rounded-full w-8 h-8 border-2 border-red-500 text-red-500 absolute right-0"
        >
          <p className=" p-1 font-mono text-lg">x</p>
        </button>

        {/* <div className=" flex">
          <div className=" p-2 col-span-2 flex justify-center items-center">
            <img
              className="w-25 h-25"
              src="https://res.cloudinary.com/kltn-k18-dl/image/upload/v1649478031/myGallary/hackerVn_uowyux.jpg"
              alt="avatar"
            />
          </div>
          <div className=" col-span-3 flex-col space-y-2 p-5  text-base">
            <div className="flex space-x-2 ">
              <label>Group name: </label>
              <p className="">Duc</p>
            </div>

            <div className="flex space-x-2">
              <label>Admin: </label>
              <p className="">BoyLanhLung</p>
            </div>

            <div className="flex space-x-2">
              <label>Group type: </label>
              <p className="">Male</p>
            </div>

            <div className="flex space-x-2">
              <label>Number member: </label>
              <p className="">07/02/2000</p>
            </div>

            <div className="flex space-x-2">
              <label>Date created: </label>
              <p className="">07/02/2000</p>
            </div>
          </div>
        </div> */}

        <div className="flex">
          <div className=" p-2 col-span-2 flex justify-center items-center">
            <img
              className="w-25 h-25"
              src="https://res.cloudinary.com/kltn-k18-dl/image/upload/v1649478031/myGallary/hackerVn_uowyux.jpg"
              alt="avatar"
            />
          </div>
          <div className=" col-span-3 flex-col space-y-2 p-5 ">
            <div className="flex space-x-2">
              <label>Fullname: </label>
              <p className="">Duc</p>
            </div>

            <div className="flex space-x-2">
              <label>Username: </label>
              <p className="">BoyLanhLung</p>
            </div>

            <div className="flex space-x-2">
              <label>Gender: </label>
              <p className="">Male</p>
            </div>

            <div className="flex space-x-2">
              <label>Birth: </label>
              <p className="">07/02/2000</p>
            </div>

            <div className="flex space-x-2">
              <label>Email: </label>
              <p className="">Duclionel@gmail.com</p>
            </div>

            <div className="flex space-x-2">
              <label>Status: </label>
              <p className="">active</p>
            </div>

            <div className="flex space-x-2">
              <label>Ban status: </label>
              <p className="">unban</p>
            </div>

            <div className="flex space-x-2">
              <label>Date created: </label>
              <p className="">2020</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
