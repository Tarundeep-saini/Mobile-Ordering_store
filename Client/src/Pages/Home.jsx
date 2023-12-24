import React, { useEffect, useState } from "react";
import Items from "../Components/Items";
import axios from "axios";
import { set } from "mongoose";

const Home = () => {
  const [allProducts, setAllProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [apple, setApple] = useState([]);
  const [onePlus, setOnePlus] = useState([]);
  const [samsung, setSamsung] = useState([]);
  const [other, setOther] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [filters, setFilters] = useState({
    storage: "ALL",
    ram: "ALL",
  });

  const handleFilters = () => {
    let filtered = allProducts;

    if (filters.ram !== "ALL") {
      filtered = filtered.filter((item) => item.ram === parseInt(filters.ram));
    }

    if (filters.storage !== "ALL") {
      filtered = filtered.filter(
        (item) => item.storage === parseInt(filters.storage)
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/getProducts");
        setAllProducts(response.data.products);
        setFilteredProducts(response.data.products);
        setIsError(response.data.isError);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (filteredProducts) {
      const Samsung = filteredProducts.filter(
        (product) => product.productType === "Samsung"
      );
      const OnePlus = filteredProducts.filter(
        (product) => product.productType === "OnePlus"
      );
      const Apple = filteredProducts.filter(
        (product) => product.productType === "Apple"
      );
      const Other = filteredProducts.filter(
        (product) => product.productType === "Other"
      );

      setSamsung(Samsung);
      setApple(Apple);
      setOnePlus(OnePlus);
      setOther(Other);
    }
  }, [filteredProducts]);

  return (
    <div className=" h-full bg-white ">
      <div className="bg-gradient-to-r from-purple-200 via-indigo-300 to-blue-200 ">
        <p className="animate-slide text-center py-4  font-medium text-xl   ">
          Your Marketplace, Your Treasures. Buy and Sell with Ease.
        </p>
      </div>
      <div className=" bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 flex gap-8 items-center justify-center py-3  px-5">
        <h2 className="text-xl text-gray-700 font-semibold ">Filters : </h2>
        <div className="flex gap-2">
          <h2>RAM:</h2>
          <select
            onChange={(e) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                ram: e.target.value,
              }));
            }}
            value={filters.ram}
          >
            <option value="ALL">ALL</option>
            <option value={4}>4Gb</option>
            <option value={6}>6Gb</option>
            <option value={8}>8Gb</option>
            <option value={12}>12Gb</option>
          </select>
        </div>
        <div className="flex gap-2">
          <h2>Storage:</h2>
          <select
            onChange={(e) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                storage: e.target.value,
              }));
            }}
            value={filters.storage}
          >
            <option value="ALL">ALL</option>
            <option value={128}>128Gb</option>
            <option value={256}>256Gb</option>
          </select>
        </div>
        <button
          className=" font-bold text-slate-800 hover:text-white border-2 border-gray-700 py-1 px-2 bg-white hover:bg-slate-700 "
          onClick={handleFilters}
        >
          Set Filters
        </button>
      </div>
      {isLoading && <h2>Loading . . .</h2>}
      {!isLoading &&
        !isError &&
        (filteredProducts.length > 0 ? (
          <div className="flex flex-col gap-2 pt-5 ">
            {samsung.length > 0 &&
              samsung.every((item) => item.deleted) === false && (
                <Items items={samsung} type={"Samsung"} />
              )}
            {apple.length > 0 &&
              apple.every((item) => item.deleted) === false && (
                <Items items={apple} type={"Apple"} />
              )}
            {onePlus.length > 0 &&
              onePlus.every((item) => item.deleted) === false && (
                <Items items={onePlus} type={"OnePlus"} />
              )}
            {other.length > 0 &&
              other.every((item) => item.deleted) === false && (
                <Items items={other} type={"Other"} />
              )}
          </div>
        ) : (
          <div>
            <h2 className="text-center">There Are No Devices For Sale</h2>
          </div>
        ))}
      {isError && (
        <h1 className="text-2xl text-center tracking-widest mt-[30vh] text-red-500 ">
          Error Occured while Fetching the Users
        </h1>
      )}
    </div>
  );
};

export default Home;
