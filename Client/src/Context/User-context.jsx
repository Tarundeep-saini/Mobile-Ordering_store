import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const userContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUserName] = useState("");
  const [id, setId] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState(null); // Add an error state
  const navigate = useNavigate();

  const fetchData = async () => {
    navigate("/");
    try {
      await axios.get("/profile").then((response) => {
        if (response.data.error) {
          setError(response.data.error.message);
          return;
        }
        setId(response.data.userId);
        setIsSeller(response.data.isSeller);
        setUserName(response.data.username);
        setIsLogin(true);
      });
    } catch (error) {
      setError("An error occurred while fetching the profile.");
      // You can log the error here if needed.
    }
  };
  useEffect(() => {
    fetchData();
  }, [username]);

  useEffect(() => {
    if (isLogin) {
      if (isSeller) {
        navigate("/myListing");
      } else {
        navigate("/home");
      }
    } else {
      navigate("/");
    }
  }, [isLogin]);

  return (
    <userContext.Provider
      value={{
        username,
        setUserName,
        id,
        setId,
        error,
        isSeller,
        setIsSeller,
        setIsLogin,
        isLogin,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
