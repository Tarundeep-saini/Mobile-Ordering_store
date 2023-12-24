import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-context";

const SellItem = ({ updateMyListing, profile }) => {
  const [productType, setProductType] = useState("Apple");
  const [price, setPrice] = useState(0);
  const [ram, setRAM] = useState(0);
  const [storage, setStorage] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState({});
  const [previewURL, setPreviewURL] = useState(null);
  const { id } = useContext(userContext);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!file) {
      console.log("NO FILE");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (e) => {
      setPreviewURL(e.target.result);
    };
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file || price === 0 || quantity === 0 || !productType) {
      console.log("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("ram", ram);
    formData.append("storage", storage);
    formData.append("stock", quantity);
    formData.append("userId", id);
    formData.append("productType", productType);
    try {
      console.log("Sendask");
      axios.post("/newListing", formData).then((res) => {
        console.log("Sendin");
        const newItem = res.data.newProduct;
        if (!profile) {
          updateMyListing(newItem);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={
        " flex flex-col items-center bg-blue-50 py-5 gap-3 border-l-2 " +
        (profile ? "w-screen h-4/6 " : "w-3/12 min-h-screen ")
      }
    >
      <h2 className="  text-xl font-bold text-gray-600 tracking-wider ">
        Sell With Us
      </h2>
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <p>What Would You Like To Sell?</p>
        <select
          value={productType}
          onChange={(e) => {
            setProductType(e.target.value);
          }}
          className="p-2 border rounded-lg"
        >
          <option value="Apple" className="bg-white">
            Apple
          </option>
          <option value="Samsung" className="bg-white">
            Samsung
          </option>
          <option value="OnePlus" className="bg-white">
            OnePlus
          </option>
          <option value="Other" className="bg-white">
            Other
          </option>
        </select>

        <p>Set the Price:</p>
        <input
          type="Number"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          className="p-2 w-2/4 border rounded-lg outline-0"
        />
        <p>Set the RAM (GB):</p>
        <input
          type="Number"
          value={ram}
          onChange={(e) => {
            setRAM(e.target.value);
          }}
          className="p-2 w-2/4 border rounded-lg outline-0"
        />
        <p>Set the Storage (GB):</p>
        <input
          type="Number"
          value={storage}
          onChange={(e) => {
            setStorage(e.target.value);
          }}
          className="p-2 w-2/4 border rounded-lg outline-0"
        />
        <p>How many Would you like to sell?</p>
        <input
          type="Number"
          value={quantity}
          onChange={(e) => {
            if (e.target.value >= 0) {
              setQuantity(e.target.value);
            }
          }}
          className="p-2 w-1/4 border rounded-lg outline-0"
        />

        <p>Title:</p>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="p-2 border rounded-lg outline-0"
        />
        <p>Images:</p>
        <input
          type="file"
          // accept="image/*"
          onChange={handleImageChange}
          className="p-2 border rounded-lg"
        />

        {previewURL && (
          <img src={previewURL} alt="Selected" className="max-h-48 mt-2" />
        )}

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg mt-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SellItem;
