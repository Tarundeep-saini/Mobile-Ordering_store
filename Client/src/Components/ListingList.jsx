import React from "react";
import ListingItem from "./ListingItem";

const ListingList = ({ myListing, onDelete }) => {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {myListing.length === 0 && <div> No Products To show </div>}
      {myListing.map((item) => {
        return <ListingItem key={item._id} item={item} onDelete={onDelete} />;
      })}
    </div>
  );
};

export default ListingList;
