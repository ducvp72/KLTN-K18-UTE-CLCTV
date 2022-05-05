import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { emailValidate } from "../../validations";
import Swal from "sweetalert2";
import { adminApi } from "../../apis";
export const Forgot = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleReset = async () => {
    if (email.length < 1) {
      Swal.fire({
        icon: "error",
        title: `Invalid Email`,
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }
    await adminApi
      .resetPassword({ email })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: `Please check your  ${email} email to get  system secrect password`,
          showConfirmButton: false,
          timer: 2000,
        });
        setEmail("");
        setTimeout(() => {
          Swal.fire({
            icon: "info",
            title: `Login new secret password was sent to your mail`,
            showConfirmButton: false,
            timer: 2000,
          });
        }, 1500);
        navigate("/home/user", { state: "Duc", replace: true });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: `Invalid Email`,
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(error);
      });
  };
  return (
    <div>
      <Helmet>
        <title>Forgot password</title>
      </Helmet>
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
              value={email}
              type="text"
              className="block border border-grey-light w-full p-3 rounded"
              name="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="w-full mb-1">
              <p className=" text-red-500">
                {email.length > 1 && emailValidate(email)}
              </p>
            </div>

            <button
              onClick={() => {
                handleReset();
              }}
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
