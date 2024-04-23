import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("adminauth");
    
    if (data) {
      try {
        const parseData = JSON.parse(data);
        
        if (parseData.token) {
          setAuth({
            user: parseData.user,
            token: parseData.token,
          });
          
          axios.defaults.headers.common["Authorization"] = parseData.token;
        } else {
          console.error("Token is missing in local storage.");
        }
      } catch (error) {
        console.error("Error parsing authentication data:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
