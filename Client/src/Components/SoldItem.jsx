import React from "react";

const SoldItem = ({ item }) => {
  if (item.sold > 0) {
    return (
      <div className="flex min-w-[27rem] p-2 border-2 border-gray-500 rounded-xl bg-white shadow-xl drop-shadow-xl ">
        <div className="flex flex-col items-center border-r-2 pr-4">
          <img
            className="max-w-[12rem] h-auto rounded-md border-2 border-gray-400 "
            src={"http://localhost:3000/" + item.path}
            alt=""
          />
          <h1 className="mt-2 text-center border-b-2 border-gray-400 text-lg font-semibold text-gray-800">
            {item.title}
          </h1>
        </div>

        <div className="flex flex-col gap-2 pl-4">
          <div className="border-b pb-2 text-gray-700">
            Type: {item.productType}
          </div>
          <div className="border-b pb-2 text-gray-700">
            Units Sold: {item.sold}
          </div>
          <div className="border-b pb-2 text-green-600">
            Price: ${item.price}
          </div>
          <div className="text-blue-600">
            Total Revenue: ${item.sold * item.price}
          </div>
        </div>
      </div>
    );
  }
};

export default SoldItem;
