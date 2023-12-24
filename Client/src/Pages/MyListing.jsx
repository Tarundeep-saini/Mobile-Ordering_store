import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-context";
import axios from "axios";
import SellItem from "../Components/SellItem";
import Listings from "../Components/Listings";

const MyListing = () => {
  const [myListing, setMyListing] = useState(null);
  const [filteredListing, setFilteredListing] = useState(null);
  const { id } = useContext(userContext);

  const handleFilteredListing = (filter) => {
    if (filter === "All") {
      setFilteredListing(myListing);
      return;
    }
    if (filter === "OOS") {
      const newss = myListing.filter((item) => item.stock === 0);
      setFilteredListing(newss);
      return;
    }
    const newss = myListing.filter((item) => item.productType === filter);
    setFilteredListing(newss);
  };

  const updateMyListing = (newItem) => {
    setMyListing([...myListing, newItem]);
    setFilteredListing([...filteredListing,newItem])
  };
  const handleDelete = async (itemId) => {
    console.log(itemId);
    await axios.delete("/deleteItem/" + itemId);
    setMyListing((prevMyListing) =>
      prevMyListing.filter((item) => item._id !== itemId)
    );
    setFilteredListing((prevMyListing) =>
      prevMyListing.filter((item) => item._id !== itemId)
    );
  };

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        if (id) {
          const response = await axios.get("/mylisting/" + id);
          setMyListing(response.data);
          setFilteredListing(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMyListings();
  }, []);

  return (
    <div className=" flex ">
      <Listings
        handleFilteredListing={handleFilteredListing}
        myListing={filteredListing}
        handleDelete={handleDelete}
      />
      <SellItem updateMyListing={updateMyListing} />
    </div>
  );
};

export default MyListing;
