import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import { UserContextProvider, userContext } from "./Context/User-context";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import NavBar from "./Components/NavBar";
import MyListing from "./Pages/MyListing";
import Profile from "./Pages/Profile";
import MyCart from "./Pages/MyCart";
import MySales from "./Pages/MySales";
import Purchased from "./Components/Purchased";
function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  return (
    <Router>
      <UserContextProvider>
        <AppContents />
      </UserContextProvider>
    </Router>
  );
}

function AppContents() {
  const { username, id, isSeller } = useContext(userContext);

  return (
    <>
      {username && <NavBar />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mylisting" element={<MyListing />} />
        <Route path="/myPurchases" element={<Purchased />} />
        <Route path="/mycart" element={<MyCart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mysales" element={<MySales />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
