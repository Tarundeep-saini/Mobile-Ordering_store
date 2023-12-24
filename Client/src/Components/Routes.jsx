import React, { useContext } from "react";
import Auth from "../Pages/Auth";
import { userContext } from "../Context/User-context";
import Home from "../Pages/Home";
import { BrowserRouter, Route } from "react-router-dom";

const Routes = () => {
  const { username } = useContext(userContext);
  if (!username) {
    return <Auth />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} exact />
        <Route path="/" element={<Home/>} exact />
      </Routes>
    </>
  );
};

export default Routes;
