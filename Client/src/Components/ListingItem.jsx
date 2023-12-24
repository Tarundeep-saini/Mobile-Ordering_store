import axios from "axios";
import React, { useEffect, useState } from "react";

function ListingItem({ item, onDelete }) {
  const [stock, setStock] = useState(item.stock);
  const [restock, setRestock] = useState(1);
  const [outOfStock, setOutOfStock] = useState(false);

  useEffect(() => {
    if (stock > 0) {
      setOutOfStock(false);
    } else {
      setOutOfStock(true);
    }
  }, [stock]);

  const handleRestock = async () => {
    const data = {
      itemId: item._id,
      restockBy: restock,
    };
    try {
      await axios
        .patch("/restock", data)
        .then((res) => {
          if (res.status === 200) {
            setStock(restock);
          }
        })
        .catch(() => {});
    } catch (err) {
      console.log("Error");
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 rounded-3xl p-5 border-2 drop-shadow-xl bg-white w-2/5 ">
      <div className="flex flex-col items-center justify-evenly h-full border-r-2 pr-2 ">
        <img
          src={"http://localhost:3000/" + item.path}
          alt="IMAGE NOT FOUND"
          className="rounded-xl max-w-[12rem] border-2 p-2 h-auto"
        />
        <h2 className=" text-lg font-bold ">{item.title}</h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 h-full ">
        <h1 className="text-red-500 border-b-2 h-7 min-h-7 border-black">
          {outOfStock && "Item Is Out Of Stock"}
        </h1>

        <h4 className="text-gray-800 text-lg">Price: ${item.price}</h4>
        <h6 className="text-gray-800">Type: {item.productType}</h6>
        <h6 className="text-gray-800">In-Stock : {stock}</h6>
        <h4>
          New Stock For{" "}
          <span className="border-b-2 border-gray-800 ">{item.title}</span> Is
        </h4>
        <input
          type="number"
          className="w-1/4 p-1 text-center rounded-md outline outline-2 outline-slate-300  focus:outline-slate-800 "
          value={restock}
          onChange={(e) => {
            if (e.target.value >= 0) {
              setRestock(e.target.value);
            }
          }}
        />
        <div className="flex gap-2 ">
          <button
            onClick={() => handleRestock()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-3 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            Re-Stock
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-3 rounded focus:outline-none focus:ring focus:border-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;
