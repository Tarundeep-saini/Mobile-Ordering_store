import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-context";
import axios from "axios";
import ListingList from "./ListingList";

const Listings = ({ handleFilteredListing, myListing, handleDelete }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  return (
    <div className="w-9/12 p-5 bg-gradient-to-r from-cyan-50 to-blue-50">
      <div className=" font-bolder text-3xl  text-center mb-4 tracking-widest text-indigo-700">
        Listed Items
      </div>
      <div className="flex items-center justify-evenly border-b-2 mb-5 pb-1 ">
        <h2 className=" text-lg font-extrabold ">Filter By : </h2>
        <button
          className={`p-3 min-w-[4rem]  rounded-xl ${
            selectedFilter === "All" ? " bg-blue-400" : "bg-white"
          } `}
          onClick={() => {
            handleFilteredListing("All");
            setSelectedFilter("All");
          }}
        >
          All
        </button>
        <button
          className={`p-3 min-w-[4rem] rounded-xl ${
            selectedFilter === "Out Of Stock" ? " bg-blue-400" : "bg-white"
          } `}
          onClick={() => {
            handleFilteredListing("OOS");
            setSelectedFilter("Out Of Stock");
          }}
        >
          Out Of stock
        </button>
        <button
          className={`p-3 min-w-[4rem]  rounded-xl ${
            selectedFilter === "Samsung" ? " bg-blue-400" : "bg-white"
          } `}
          onClick={() => {
            handleFilteredListing("Samsung");
            setSelectedFilter("Samsung");
          }}
        >
          Samsung
        </button>
        <button
          className={`p-3 min-w-[4rem] bg- rounded-xl ${
            selectedFilter === "OnePlus" ? " bg-blue-400" : "bg-white"
          } `}
          onClick={() => {
            handleFilteredListing("OnePlus");
            setSelectedFilter("OnePlus");
          }}
        >
          OnePlus
        </button>
        <button
          className={`p-3 min-w-[4rem] bg- rounded-xl ${
            selectedFilter === "Apple" ? " bg-blue-400" : "bg-white"
          } `}
          onClick={() => {
            handleFilteredListing("Apple");
            setSelectedFilter("Apple");
          }}
        >
          Apple
        </button>
      </div>

      {myListing && (
        <ListingList myListing={myListing} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Listings;
