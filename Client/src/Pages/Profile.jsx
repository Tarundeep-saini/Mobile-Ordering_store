import React, { useContext } from "react";
import { userContext } from "../Context/User-context";
import SellItem from "../Components/SellItem";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const {
    username,
    setUserName,
    isSeller,
    setIsSeller,
    id,
    setIsLogin,
    setId,
  } = useContext(userContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setId(null);
    setUserName(null);
    setIsSeller(false);
    setIsLogin(false);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <div className=" bg-gray-100 flex flex-col items-center justify-center min-h-fit">
      <div className=" flex flex-col items-center  w-3/6  bg-white shadow-md rounded px-8 pt-6 pb-8 my-10 ">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">User Profile</h1>
        <p className="text-gray-600 mb-4">
          Username:{" "}
          <span className=" border-b-2 border-gray-600 "> {username}</span>
        </p>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {isSeller && <SellItem profile={true} />}
    </div>
  );
};

export default Profile;
