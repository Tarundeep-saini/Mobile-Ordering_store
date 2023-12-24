import React, { useContext, useEffect, useState } from "react";
import Icon from "../Components/icon";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../Context/User-context";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [isLogedin, setIsLogedin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id, setUserName, setIsLogin, isLogin, setId } =
    useContext(userContext);

  function reloadPage(params) {
    window.location.reload();
  }

  const handlerror = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let mode = isLogedin ? "/login" : "/signup";
    console.log(mode);

    let userData = {};
    if (mode === "/login") {
      if (!email || !password) {
        let message = "No Data Provided";
        handlerror(message);
        return;
      }
      userData = { email, password };
    } else {
      if (!username || !email || !password) {
        handlerror("Fill The Form Properly");
        return;
      }
      console.log("Send by signup");
      userData = { username, email, password, isSeller };
      console.log(userData);
    }
    try {
      const response = await axios.post(mode, userData);
      if (mode === "/login") {
        console.log("By Login");
        setId(response.data.foundUser._id);
        setUserName(response.data.foundUser.username);
        setIsSeller(response.data.foundUser.isSeller);
        setIsLogin(true);
        reloadPage();
      }
      if (mode === "/signup") {
        console.log("By SignUp");
        setId(response.data.userId);
        setIsSeller(response.data.isSeller);
        setUserName(response.data.username);
        setIsLogin(true);
        reloadPage();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={
        " flex flex-col justify-center items-center bg-[#f1f1f1] h-screen"
      }
    >
      <div
        className={
          "bg-white p-12 w-4/12 rounded-md shadow-lg " +
          (error ? "shadow-red-400 " : "")
        }
      >
        <div className="flex flex-col items-center pb-4 ">
          <Icon login={isLogedin} error={error} />
          <h1 className="mb-2 text-2xl font-extrabold ">
            {!isLogedin ? "Create Account!" : "Welcome Back"}{" "}
          </h1>
          <div className="w-3/4 border-gray-400 border"></div>
        </div>
        <form className=" flex flex-col items-center  " onSubmit={handleSubmit}>
          <div>
            <div className=" text-red-500 text-center h-3 pb-7  ">
              {error ? <p>{error}</p> : null}
            </div>
            {!isLogedin && (
              <h4 className=" text-lg font-extrabold text-[#3d3c45]">
                Username
              </h4>
            )}
            {!isLogedin && (
              <input
                className="h-8 border-b-2 border-gray-300 p-2 text-lg outline outline-0 focus:transition-colors focus:delay-150  focus:border-blue-500"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <h4 className=" text-lg font-extrabold text-[#3d3c45]">E-Mail</h4>
            <input
              className="h-8 border-b-2 border-gray-300 p-2 text-lg outline outline-0 focus:transition-colors focus:delay-150  focus:border-blue-500"
              placeholder="name@mail.com"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h4 className=" text-lg font-extrabold text-[#3d3c45]">Password</h4>
            <input
              className="h-8 border-b-2 border-gray-300 p-2 text-lg outline outline-0 focus:transition-colors focus:delay-150  focus:border-blue-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogedin && (
              <div className="flex gap-2 items-center pt-3 ">
                <input
                  type="checkbox"
                  checked={isSeller}
                  onChange={(e) => {
                    setIsSeller(e.target.checked);
                  }}
                />
                Are you a seller?
              </div>
            )}
          </div>
          <button
            type="submit"
            className={
              " p-2 font-bold rounded-md text-white text-base mt-4 " +
              (error ? " bg-red-500 " : "bg-blue-500")
            }
          >
            {isLogedin ? "Login" : "Signup"}
          </button>
        </form>

        <button
          className="mt-4 w-full text-center"
          onClick={() => setIsLogedin(!isLogedin)}
        >
          {isLogedin
            ? "New Here? Create Account"
            : "Already have a account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
