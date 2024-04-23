import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const StateContext = createContext();

export const AuthProvider = ({ children }) => {  // Renamed from ContextProvider to AuthProvider

  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("admin");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
      // Update Axios headers with the new token
      axios.defaults.headers.common["Authorization"] = parseData.token;
    }
    //eslint-disable-next-line
  }, []);

  return (
    <StateContext.Provider
      value={{       
        auth,
        setAuth,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useStateContext = () => useContext(StateContext);
