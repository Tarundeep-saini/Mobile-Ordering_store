import React, { useState } from "react";

const CounterWithButtons = () => {
  const [restock, setRestock] = useState(1);

  const handleIncrease = () => {
    setRestock((prevStock) => prevStock + 1);
  };

  const handleDecrease = () => {
    setRestock((prevStock) => prevStock - 1);
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleDecrease}
        className="bg-white border border-gray-300 rounded px-1 w-5 text-gray-600 hover:bg-gray-100"
      >
        -
      </button>
      <input
        type="number"

        className="w-1/12 text-center appearance-text"
       
      />

      <button
        onClick={handleIncrease}
        className="bg-white border border-gray-300 rounded px-1 w-5 text-gray-600 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
};

export default CounterWithButtons;
