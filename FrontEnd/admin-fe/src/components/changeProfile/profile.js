import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { adminApi } from "../../apis";
import { useCookies } from "react-cookie";
import { password } from "../../validations";
import { saveUser } from "../../redux/reducers/auth";
import { Helmet } from "react-helmet-async";

export const Profile = () => {
  const [cookies, removeCookie] = useCookies(["rm_psw", "user_key"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showOldPass, setShowOldPass] = useState(false);
  const [showPass, setShow] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [user, setUser] = useState({
    oldPassword: "",
    password: "",
  });

  const [confirmPass, setConfirmPass] = useState("");

  const handleChange = async () => {
    console.log(confirmPass);
    console.log(user.password);
    console.log(user);
    if (confirmPass !== user.password) {
      Swal.fire({
        icon: "error",
        title: `Confirm password not match password`,
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }
    await adminApi
      .changePassword(user, cookies.user_key.tokens.access.token)
      .then((res) => {
        console.log("res", res);
        Swal.fire({
          icon: "success",
          title: `Your password is updated`,
          showConfirmButton: false,
          timer: 1000,
        });
        setUser((prev) => ({
          ...prev,
          oldPassword: "",
          password: "",
        }));
        setConfirmPass("");
        setShowOldPass(false);
        setShow(false);
        setShowConfirmPass(false);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: `Wrong password`,
          showConfirmButton: false,
          timer: 1200,
        });
      });
  };

  const handleForgot = async () => {
    await adminApi
      .logout(cookies.user_key.tokens.refresh.token)
      .then((res) => {
        console.log("res", res);
        dispatch(saveUser(""));
        removeCookie("user_key");
        removeCookie("rm_psw");
        // navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className=" flex flex-col mb-10 mt-10">
        <Helmet>
          <title>Change Password</title>
        </Helmet>
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <div className="flex justify-center align-middle mb-2">
              <img
                className="h-20 w-20"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Password.svg/1200px-Password.svg.png"
                alt="admin"
              />
            </div>

            <div className="w-full mb-2">
              <div className="flex items-center">
                <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-lock"></i>
                <input
                  value={user.oldPassword}
                  onChange={(e) => {
                    setUser((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }));
                  }}
                  type={showOldPass ? "text" : "password"}
                  placeholder="Old password"
                  className="-mx-6 w-full border rounded px-8 py-2 text-gray-700 focus:outline-none"
                />
                {!showOldPass ? (
                  <div
                    onClick={() => {
                      setShowOldPass(true);
                    }}
                    className=""
                  >
                    <i className="fa fa-eye"></i>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setShowOldPass(false);
                    }}
                    className=""
                  >
                    <i className="fa fa-eye-slash"></i>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-2 py-3 flex items-center">
              {user.oldPassword.length > 0 && password(user.oldPassword)}
            </div>

            <div className="w-full mb-2">
              <div className="flex items-center">
                <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-lock"></i>
                <input
                  value={user.password}
                  onChange={(e) => {
                    setUser((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="-mx-6 w-full border rounded px-8 py-2 text-gray-700 focus:outline-none"
                />
                {!showPass ? (
                  <div
                    onClick={() => {
                      setShow(true);
                    }}
                    className=""
                  >
                    <i className="fa fa-eye"></i>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setShow(false);
                    }}
                    className=""
                  >
                    <i className="fa fa-eye-slash"></i>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-2 py-3 flex items-center">
              {user.password.length > 0 && password(user.password)}
            </div>

            <div className="w-full mb-2">
              <div className="flex items-center">
                <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-lock"></i>
                <input
                  value={confirmPass}
                  onChange={(e) => {
                    setConfirmPass(e.target.value);
                  }}
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="-mx-6 w-full border rounded px-8 py-2 text-gray-700 focus:outline-none"
                />
                {!showConfirmPass ? (
                  <div
                    onClick={() => {
                      setShowConfirmPass(true);
                    }}
                    className=""
                  >
                    <i className="fa fa-eye"></i>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setShowConfirmPass(false);
                    }}
                    className=""
                  >
                    <i className="fa fa-eye-slash"></i>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-2 py-3 flex items-center text-red-500">
              {confirmPass.length > 0 && confirmPass !== user.password
                ? "Confirm password not match password"
                : null}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleChange();
              }}
              type="submit"
              className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
            >
              Confirm
            </button>
          </div>

          <div className="text-grey-dark mt-6">
            <p
              onClick={(e) => {
                handleForgot();
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
