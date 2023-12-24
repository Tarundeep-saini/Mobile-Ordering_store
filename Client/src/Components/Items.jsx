import React, { useState } from "react";
import Item from "./Item";

const Items = ({ items, type }) => {
  const [PurchaseSuccess, setPurchaseSuccess] = useState("");

  const handlePurchase = (text = "Thank You For The Purchase") => {
    setPurchaseSuccess(text);
    setTimeout(() => {
      setPurchaseSuccess("");
    }, 4000);
  };

  return (
    <div className="animate-slide-2 bg-white  pl-5 w-full  ">
      <div className=" flex gap-40 w-auto">
        <h1 className="text-3xl tracking-widest border-b-2 border-black w-36 text-gray-800">
          {type}
        </h1>
        <div className="min-h-[2rem] flex justify-center align-middle items-center  w-auto ">
          {PurchaseSuccess && (
            <h4
              className={`border-2 px-16 text-green-600 border-green-400 fadeIn`}
            >
              {PurchaseSuccess}
            </h4>
          )}
        </div>
      </div>
      <div className=" w-full overflow-x-auto bg-scroll-gray-200">
        <div className="flex flex-nowrap p-5 gap-6">
          {items.map((item) => {
            if (!item.deleted) {
              return (
                <Item
                  handlePurchase={handlePurchase}
                  key={item._id}
                  item={item}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Items;
