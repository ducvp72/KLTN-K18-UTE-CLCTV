import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { password, username } from "../../validations";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { adminApi } from "../../apis";
import { useSelector, useDispatch } from "react-redux";
import { saveUser } from "../../redux/reducers/auth";
import { Helmet } from "react-helmet-async";

export const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userData);

  const [cookies, setCookie, removeCookie] = useCookies(["rm_psw", "user_key"]);
  const [showPass, setShow] = useState(false);
  const [remem, setRember] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // useEffect(() => {
  //   console.log("iserRemem", remem);
  // }, [remem]);

  useEffect(() => {
    // console.log(showPass);
    if (cookies.rm_psw) {
      setShow(false);
      setUser((prev) => ({
        ...prev,
        email: cookies.rm_psw.email,
        password: cookies.rm_psw.password,
      }));
    }
  }, []);

  useEffect(() => {
    // console.log("Ok", cookies.user_key);
    setRember(cookies.rm_psw ? true : true);
    return () => {
      setRember("");
    };
  }, []);

  useEffect(() => {
    if (userInfo.data !== "") console.log("UserInfo", userInfo);
  }, [userInfo]);

  // useEffect(() => {
  //   if (user.password.length >= 1) setShow(true);
  // }, [user]);

  const handeSubmit = async (userObj) => {
    if (remem && (user.email.length > 0, user.password.length > 0))
      setCookie("rm_psw", userObj);
    else {
      removeCookie("rm_psw");
    }
    await adminApi
      .login(user)
      .then((res) => {
        console.log(res);
        setCookie("user_key", res.data);
        dispatch(saveUser(res.data));
        Swal.fire({
          icon: "success",
          title: `Welcome ${res.data.admin.fullname}`,
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/home/user", { state: "Duc", replace: true });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Wrong username or password",
        });
      });
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="h-screen flex items-center justify-center">
        <form className="w-1/2 md:w-1/3 bg-white rounded-lg">
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
                  value={user.email}
                  onChange={(e) => {
                    setUser((prev) => ({ ...prev, email: e.target.value }));
                  }}
                  type="text"
                  placeholder="Username"
                  className="-mx-6  w-full border rounded px-8  py-2 text-gray-700 focus:outline-none"
                />
              </div>
            </div>
            <div className="w-full h-2 py-3 flex items-center">
              {user.email.length > 0 && username(user.email)}
            </div>
            <div className="w-full mb-2">
              <div className="flex items-center">
                <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-lock"></i>
                <input
                  value={user.password}
                  onChange={(e) => {
                    setUser((prev) => ({ ...prev, password: e.target.value }));
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
            <div className="">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                value={remem}
                defaultChecked={cookies.rm_psw ? true : false}
                onChange={(e) => {
                  setRember(e.target.checked);
                }}
                className=" mt-2 w-4 h-4"
              />
              <label htmlFor="remember"> Remember</label>
            </div>

            <p
              onClick={() => {
                navigate("/forgot");
              }}
              href="#"
              className="text-sm text-gray-500 float-right mb-4 underline cursor-pointer"
            >
              Forgot Password?
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                handeSubmit(user);
              }}
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
