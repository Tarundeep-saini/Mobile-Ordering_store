import React from "react";

const PurchasedItem = ({ item }) => {
  return (
    <div className="flex flex-col justify-center items-center max-w-[15rem]  min-w-[15rem] border-2 p-4">
      <h2 className="text-lg font-bold mb-2">{item.title}</h2>
      <h3 className="text-lg text-gray-500 mb-2">{item.productType}</h3>
      <h3 className="text-lg font-semibold mb-2">${item.price}</h3>
      <h4 className="text-sm text-gray-500 mb-2">
        Total Purchased: {item.quantity}
      </h4>
      <img
        className="w-full h-32 object-contain "
        src={"http://localhost:3000/" + item.path}
        alt={item.title}
      />
    </div>
  );
};

export default PurchasedItem;

// id: '655b5b0d6f88b866046e824c',
// title: 'Trolley-1',
// price: 400,
// path: 'uploads/1700485901797-zh_trolley-cekmece-1.jpg',
// quantity: 199,
// productType: 'Trolley',
// _id: new ObjectId("65684624d2dbfa5ce2940940")
